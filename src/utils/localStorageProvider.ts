import type { DataProvider, Task, SyncResult } from '../types';

export class LocalStorageProvider implements DataProvider {
  name = 'localStorage';
  type = 'local' as const;
  isConnected = true; // Always connected
  lastSync?: Date;

  private storageKey = 'todays-backlog-tasks';

  async connect(): Promise<void> {
    // Always connected, nothing to do
    this.isConnected = true;
  }

  async disconnect(): Promise<void> {
    // Can't disconnect from localStorage
    this.isConnected = true;
  }

  async fetch(): Promise<Task[]> {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return this.deserializeTasks(parsed);
    } catch (error) {
      console.error('Failed to fetch tasks from localStorage:', error);
      return [];
    }
  }

  async save(tasks: Task[]): Promise<void> {
    try {
      const serialized = this.serializeTasks(tasks);
      localStorage.setItem(this.storageKey, JSON.stringify(serialized));
      this.lastSync = new Date();
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
      throw new Error(`Failed to save tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sync(): Promise<SyncResult> {
    // For localStorage, sync is just a save operation
    const tasks = await this.fetch();
    await this.save(tasks);
    
    this.lastSync = new Date();

    return {
      success: true,
      message: `Local storage synchronized with ${tasks.length} tasks`,
      conflictCount: 0,
      resolvedConflicts: [],
      lastSyncTime: this.lastSync,
      syncedTaskCount: tasks.length
    };
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

  // Utility methods for backup and restore
  exportData(): string {
    const data = localStorage.getItem(this.storageKey);
    return data || '[]';
  }

  async importData(jsonData: string): Promise<{ success: boolean; message: string }> {
    try {
      const parsed = JSON.parse(jsonData);
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid data format');
      }

      const tasks = this.deserializeTasks(parsed);
      await this.save(tasks);

      return {
        success: true,
        message: `Successfully imported ${tasks.length} tasks`
      };
    } catch (error) {
      return {
        success: false,
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  clearData(): void {
    localStorage.removeItem(this.storageKey);
  }
}