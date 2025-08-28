import type { Task, UserSettings } from '../types';

const STORAGE_KEYS = {
  TASKS: 'todays-backlog-tasks',
  SETTINGS: 'todays-backlog-settings',
  BACKUP: 'todays-backlog-backup',
} as const;

export const storage = {
  getTasks: (): Task[] => {
    try {
      const tasksJson = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!tasksJson) return [];
      
      const tasks = JSON.parse(tasksJson) as Task[];
      return tasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
      return [];
    }
  },

  saveTasks: (tasks: Task[]): void => {
    try {
      const tasksJson = JSON.stringify(tasks);
      localStorage.setItem(STORAGE_KEYS.TASKS, tasksJson);
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  },

  getSettings: (): UserSettings => {
    try {
      const settingsJson = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!settingsJson) {
        return getDefaultSettings();
      }
      return JSON.parse(settingsJson);
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
      return getDefaultSettings();
    }
  },

  saveSettings: (settings: UserSettings): void => {
    try {
      const settingsJson = JSON.stringify(settings);
      localStorage.setItem(STORAGE_KEYS.SETTINGS, settingsJson);
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  },

  exportData: (): string => {
    const tasks = storage.getTasks();
    const settings = storage.getSettings();
    const exportData = {
      tasks,
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(exportData, null, 2);
  },

  importData: (jsonData: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.tasks || !Array.isArray(data.tasks)) {
        return { success: false, message: 'Invalid data format: missing or invalid tasks array' };
      }

      // Validate task structure
      const validTasks = data.tasks.map((task: Task) => ({
        ...task,
        createdAt: new Date(task.createdAt || Date.now()),
        updatedAt: new Date(task.updatedAt || Date.now()),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));

      storage.saveTasks(validTasks);

      if (data.settings) {
        storage.saveSettings({ ...getDefaultSettings(), ...data.settings });
      }

      return { success: true, message: `Successfully imported ${validTasks.length} tasks` };
    } catch (error) {
      return { success: false, message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  },

  clearAllData: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.BACKUP);
    } catch (error) {
      console.error('Failed to clear data from localStorage:', error);
    }
  },

  createBackup: (): void => {
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        data: storage.getTasks(),
      };
      localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backup));
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  },
};

function getDefaultSettings(): UserSettings {
  return {
    theme: 'light',
    compactMode: false,
    showCompleted: true,
    autoBackup: true,
    notifications: {
      desktop: false,
      sound: false,
      dueDateReminders: true,
      reminderMinutes: 15,
    },
  };
}