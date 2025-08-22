import type { 
  DataProvider, 
  Task, 
  SyncResult, 
  ConflictResolution,
  GoogleDriveConfig 
} from '../types';
import { ConflictResolutionStrategy } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GoogleAPI = any;

declare global {
  interface Window {
    gapi: GoogleAPI;
  }
}

export class GoogleDriveProvider implements DataProvider {
  name = 'google-drive';
  type = 'cloud' as const;
  isConnected = false;
  lastSync?: Date;

  private config: GoogleDriveConfig = {
    clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID || '',
    apiKey: process.env.REACT_APP_GOOGLE_DRIVE_API_KEY || '',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    scopes: ['https://www.googleapis.com/auth/drive.file'],
    fileName: 'todays-backlog-tasks.json',
  };

  private isInitialized = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private authInstance: any = null;

  async connect(): Promise<void> {
    try {
      if (!this.config.clientId || !this.config.apiKey) {
        throw new Error('Google Drive API credentials not configured. Please set REACT_APP_GOOGLE_DRIVE_CLIENT_ID and REACT_APP_GOOGLE_DRIVE_API_KEY environment variables.');
      }

      await this.loadGoogleAPI();
      await this.initializeGAPI();
      await this.signIn();
      
      this.isConnected = true;
    } catch (error) {
      console.error('Failed to connect to Google Drive:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.authInstance && this.isConnected) {
      await this.authInstance.signOut();
      this.isConnected = false;
    }
  }

  async fetch(): Promise<Task[]> {
    if (!this.isConnected) {
      throw new Error('Not connected to Google Drive');
    }

    try {
      const fileId = await this.findOrCreateFile();
      if (!fileId) {
        return []; // File doesn't exist yet
      }

      const response = await window.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
      });

      if (!response.body) {
        return [];
      }

      const tasks = JSON.parse(response.body);
      return this.deserializeTasks(tasks);
    } catch (error) {
      console.error('Failed to fetch tasks from Google Drive:', error);
      throw new Error(`Failed to fetch tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async save(tasks: Task[]): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Not connected to Google Drive');
    }

    try {
      const fileId = await this.findOrCreateFile();
      const serializedTasks = this.serializeTasks(tasks);
      const blob = new Blob([JSON.stringify(serializedTasks, null, 2)], {
        type: 'application/json'
      });

      const metadata = {
        name: this.config.fileName,
        mimeType: 'application/json'
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
      form.append('file', blob);

      const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
        },
        body: form
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.lastSync = new Date();
    } catch (error) {
      console.error('Failed to save tasks to Google Drive:', error);
      throw new Error(`Failed to save tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sync(): Promise<SyncResult> {
    if (!this.isConnected) {
      throw new Error('Not connected to Google Drive');
    }

    try {
      // Get local tasks
      const localTasks = this.getLocalTasks();
      
      // Get remote tasks
      const remoteTasks = await this.fetch();

      // Resolve conflicts
      const { resolvedTasks, conflicts } = this.resolveConflicts(localTasks, remoteTasks);

      // Save resolved tasks both locally and remotely
      this.saveLocalTasks(resolvedTasks);
      await this.save(resolvedTasks);

      this.lastSync = new Date();

      return {
        success: true,
        message: `Synchronized ${resolvedTasks.length} tasks with Google Drive`,
        conflictCount: conflicts.length,
        resolvedConflicts: conflicts,
        lastSyncTime: this.lastSync,
        syncedTaskCount: resolvedTasks.length
      };
    } catch (error) {
      console.error('Sync failed:', error);
      return {
        success: false,
        message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        conflictCount: 0,
        resolvedConflicts: [],
        lastSyncTime: new Date(),
        syncedTaskCount: 0
      };
    }
  }

  private async loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  private async initializeGAPI(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    return new Promise((resolve, reject) => {
      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            apiKey: this.config.apiKey,
            clientId: this.config.clientId,
            discoveryDocs: this.config.discoveryDocs,
            scope: this.config.scopes.join(' ')
          });

          this.authInstance = window.gapi.auth2.getAuthInstance();
          this.isInitialized = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private async signIn(): Promise<void> {
    if (!this.authInstance) {
      throw new Error('Google Auth not initialized');
    }

    if (this.authInstance.isSignedIn.get()) {
      return;
    }

    try {
      await this.authInstance.signIn();
    } catch (error) {
      throw new Error(`Failed to sign in to Google Drive: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async findOrCreateFile(): Promise<string> {
    try {
      // Search for existing file
      const searchResponse = await window.gapi.client.drive.files.list({
        q: `name='${this.config.fileName}' and trashed=false`,
        fields: 'files(id, name)'
      });

      const files = searchResponse.result.files;
      if (files && files.length > 0) {
        return files[0].id;
      }

      // Create new file if not found
      const createResponse = await window.gapi.client.drive.files.create({
        resource: {
          name: this.config.fileName,
          mimeType: 'application/json'
        },
        media: {
          mimeType: 'application/json',
          body: JSON.stringify([])
        }
      });

      return createResponse.result.id;
    } catch (error) {
      console.error('Failed to find or create file:', error);
      throw error;
    }
  }

  private serializeTasks(tasks: Task[]): object[] {
    return tasks.map(task => ({
      ...task,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      completedAt: task.completedAt?.toISOString(),
      dueDate: task.dueDate?.toISOString(),
    }));
  }

  private deserializeTasks(data: object[]): Task[] {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
      dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
    }));
  }

  private getLocalTasks(): Task[] {
    try {
      const data = localStorage.getItem('todays-backlog-tasks');
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return this.deserializeTasks(parsed);
    } catch {
      return [];
    }
  }

  private saveLocalTasks(tasks: Task[]): void {
    try {
      const serialized = this.serializeTasks(tasks);
      localStorage.setItem('todays-backlog-tasks', JSON.stringify(serialized));
    } catch (error) {
      console.error('Failed to save tasks locally:', error);
    }
  }

  private resolveConflicts(localTasks: Task[], remoteTasks: Task[]): {
    resolvedTasks: Task[];
    conflicts: ConflictResolution[];
  } {
    const localTaskMap = new Map(localTasks.map(task => [task.id, task]));
    const remoteTaskMap = new Map(remoteTasks.map(task => [task.id, task]));
    const resolvedTasks: Task[] = [];
    const conflicts: ConflictResolution[] = [];

    // Get all unique task IDs
    const allTaskIds = new Set([...localTaskMap.keys(), ...remoteTaskMap.keys()]);

    for (const taskId of allTaskIds) {
      const localTask = localTaskMap.get(taskId);
      const remoteTask = remoteTaskMap.get(taskId);

      if (localTask && remoteTask) {
        // Conflict: task exists in both
        if (localTask.updatedAt.getTime() !== remoteTask.updatedAt.getTime()) {
          const resolved = this.resolveConflict(localTask, remoteTask);
          resolvedTasks.push(resolved.resolvedVersion);
          conflicts.push(resolved);
        } else {
          // No conflict, tasks are the same
          resolvedTasks.push(localTask);
        }
      } else if (localTask) {
        // Only in local
        resolvedTasks.push(localTask);
      } else if (remoteTask) {
        // Only in remote
        resolvedTasks.push(remoteTask);
      }
    }

    return { resolvedTasks, conflicts };
  }

  private resolveConflict(localTask: Task, remoteTask: Task, strategy: typeof ConflictResolutionStrategy[keyof typeof ConflictResolutionStrategy] = ConflictResolutionStrategy.NEWEST_WINS): ConflictResolution {
    let resolvedVersion: Task;

    switch (strategy) {
      case ConflictResolutionStrategy.LOCAL_WINS:
        resolvedVersion = localTask;
        break;
      case ConflictResolutionStrategy.REMOTE_WINS:
        resolvedVersion = remoteTask;
        break;
      case ConflictResolutionStrategy.NEWEST_WINS:
        resolvedVersion = localTask.updatedAt > remoteTask.updatedAt ? localTask : remoteTask;
        break;
      case ConflictResolutionStrategy.MANUAL_RESOLVE:
        // For manual resolution, return the conflict without a resolved version
        // This will be handled by the UI
        resolvedVersion = localTask; // Temporary, will be overridden by manual resolution
        break;
      case ConflictResolutionStrategy.MERGE:
        // Simple merge: use newer timestamp for each field
        resolvedVersion = {
          ...localTask,
          title: localTask.updatedAt > remoteTask.updatedAt ? localTask.title : remoteTask.title,
          description: localTask.updatedAt > remoteTask.updatedAt ? localTask.description : remoteTask.description,
          status: localTask.updatedAt > remoteTask.updatedAt ? localTask.status : remoteTask.status,
          priority: localTask.updatedAt > remoteTask.updatedAt ? localTask.priority : remoteTask.priority,
          tags: localTask.updatedAt > remoteTask.updatedAt ? localTask.tags : remoteTask.tags,
          dueDate: localTask.updatedAt > remoteTask.updatedAt ? localTask.dueDate : remoteTask.dueDate,
          updatedAt: localTask.updatedAt > remoteTask.updatedAt ? localTask.updatedAt : remoteTask.updatedAt
        };
        break;
      default:
        resolvedVersion = localTask.updatedAt > remoteTask.updatedAt ? localTask : remoteTask;
    }

    return {
      taskId: localTask.id,
      localVersion: localTask,
      remoteVersion: remoteTask,
      strategy,
      resolvedVersion,
      resolvedAt: new Date()
    };
  }

  // Public method to check if user is signed in
  isSignedIn(): boolean {
    return this.authInstance?.isSignedIn?.get() || false;
  }

  // Public method to get user info
  getUserInfo(): { name: string; email: string } | null {
    if (!this.isSignedIn()) return null;
    
    const user = this.authInstance.currentUser.get();
    const profile = user.getBasicProfile();
    
    return {
      name: profile.getName(),
      email: profile.getEmail()
    };
  }
}