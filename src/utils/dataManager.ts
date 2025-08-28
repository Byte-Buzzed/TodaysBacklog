import type { 
  DataProvider, 
  Task, 
  SyncResult, 
  DataSourceConfig 
} from '../types';
import { LocalStorageProvider } from './localStorageProvider';
import { GoogleDriveProvider } from './googleDriveProvider';

export class DataManager {
  private providers = new Map<string, DataProvider>();
  private currentProvider: DataProvider;
  private autoSyncInterval?: NodeJS.Timeout;
  private eventListeners = new Map<string, ((data?: unknown) => void)[]>();

  constructor() {
    // Initialize with localStorage as default
    const localProvider = new LocalStorageProvider();
    this.providers.set('localStorage', localProvider);
    this.currentProvider = localProvider;
  }

  // Provider management
  addProvider(name: string, provider: DataProvider): void {
    this.providers.set(name, provider);
    this.emit('providerAdded', { name, provider });
  }

  removeProvider(name: string): void {
    const provider = this.providers.get(name);
    if (provider) {
      provider.disconnect();
      this.providers.delete(name);
      this.emit('providerRemoved', { name });
    }
  }

  switchProvider(name: string): void {
    const provider = this.providers.get(name);
    if (provider && provider.isConnected) {
      this.currentProvider = provider;
      this.emit('providerSwitched', { name, provider });
    } else {
      throw new Error(`Provider ${name} is not available or not connected`);
    }
  }

  getCurrentProvider(): DataProvider {
    return this.currentProvider;
  }

  getProviders(): Map<string, DataProvider> {
    return this.providers;
  }

  getProviderConfigs(): DataSourceConfig[] {
    return Array.from(this.providers.entries()).map(([name, provider]) => ({
      id: name,
      name: provider.name,
      type: provider.type,
      isConnected: provider.isConnected,
      lastSync: provider.lastSync,
      autoSync: false, // This should be managed per provider
      syncInterval: 5, // Default 5 minutes
      isDefault: provider === this.currentProvider
    }));
  }

  // Data operations
  async getTasks(): Promise<Task[]> {
    try {
      return await this.currentProvider.fetch();
    } catch (error) {
      console.error('Failed to get tasks:', error);
      throw error;
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await this.currentProvider.save(tasks);
      this.emit('tasksSaved', { tasks, provider: this.currentProvider.name });
    } catch (error) {
      console.error('Failed to save tasks:', error);
      throw error;
    }
  }

  async syncAllProviders(): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    
    for (const [name, provider] of this.providers) {
      if (provider.isConnected) {
        try {
          const result = await provider.sync();
          results.push(result);
          this.emit('syncCompleted', { provider: name, result });
        } catch (error) {
          const errorResult: SyncResult = {
            success: false,
            message: `Sync failed for ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            conflictCount: 0,
            resolvedConflicts: [],
            lastSyncTime: new Date(),
            syncedTaskCount: 0
          };
          results.push(errorResult);
          this.emit('syncFailed', { provider: name, error });
        }
      }
    }

    return results;
  }

  async syncCurrentProvider(): Promise<SyncResult> {
    try {
      const result = await this.currentProvider.sync();
      this.emit('syncCompleted', { 
        provider: this.currentProvider.name, 
        result 
      });
      return result;
    } catch (error) {
      const errorResult: SyncResult = {
        success: false,
        message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        conflictCount: 0,
        resolvedConflicts: [],
        lastSyncTime: new Date(),
        syncedTaskCount: 0
      };
      this.emit('syncFailed', { 
        provider: this.currentProvider.name, 
        error 
      });
      return errorResult;
    }
  }

  // Auto-sync management
  enableAutoSync(intervalMinutes: number = 5): void {
    this.disableAutoSync(); // Clear existing interval

    this.autoSyncInterval = setInterval(async () => {
      try {
        await this.syncCurrentProvider();
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    }, intervalMinutes * 60 * 1000);

    this.emit('autoSyncEnabled', { intervalMinutes });
  }

  disableAutoSync(): void {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = undefined;
      this.emit('autoSyncDisabled');
    }
  }

  // Google Drive specific methods
  async connectGoogleDrive(): Promise<void> {
    let googleProvider = this.providers.get('googleDrive') as GoogleDriveProvider;
    
    if (!googleProvider) {
      googleProvider = new GoogleDriveProvider();
      this.addProvider('googleDrive', googleProvider);
    }

    await googleProvider.connect();
    this.emit('googleDriveConnected', { provider: googleProvider });
  }

  async disconnectGoogleDrive(): Promise<void> {
    const googleProvider = this.providers.get('googleDrive');
    if (googleProvider) {
      await googleProvider.disconnect();
      this.emit('googleDriveDisconnected');
    }
  }

  isGoogleDriveConnected(): boolean {
    const googleProvider = this.providers.get('googleDrive') as GoogleDriveProvider;
    return googleProvider?.isSignedIn() || false;
  }

  getGoogleDriveUserInfo(): { name: string; email: string } | null {
    const googleProvider = this.providers.get('googleDrive') as GoogleDriveProvider;
    return googleProvider?.getUserInfo() || null;
  }

  // Event system
  on(event: string, callback: (data?: unknown) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: (data?: unknown) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: unknown): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Migration helpers
  async migrateToGoogleDrive(): Promise<SyncResult> {
    try {
      // Get tasks from local storage
      const localProvider = this.providers.get('localStorage');
      if (!localProvider) {
        throw new Error('Local storage provider not found');
      }

      const tasks = await localProvider.fetch();
      
      // Connect to Google Drive if not connected
      if (!this.isGoogleDriveConnected()) {
        await this.connectGoogleDrive();
      }

      // Switch to Google Drive and save tasks
      this.switchProvider('googleDrive');
      await this.saveTasks(tasks);

      return {
        success: true,
        message: `Successfully migrated ${tasks.length} tasks to Google Drive`,
        conflictCount: 0,
        resolvedConflicts: [],
        lastSyncTime: new Date(),
        syncedTaskCount: tasks.length
      };
    } catch (error) {
      return {
        success: false,
        message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        conflictCount: 0,
        resolvedConflicts: [],
        lastSyncTime: new Date(),
        syncedTaskCount: 0
      };
    }
  }

  // Get sync status for UI
  getSyncStatus(): {
    isConnected: boolean;
    lastSync?: Date;
    currentProvider: string;
    autoSyncEnabled: boolean;
  } {
    return {
      isConnected: this.currentProvider.isConnected,
      lastSync: this.currentProvider.lastSync,
      currentProvider: this.currentProvider.name,
      autoSyncEnabled: !!this.autoSyncInterval
    };
  }
}

// Singleton instance
export const dataManager = new DataManager();