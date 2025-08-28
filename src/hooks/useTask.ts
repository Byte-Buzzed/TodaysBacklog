import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskStatus, FilterOptions, SortOptions, SyncResult } from '../types';
import { dataManager } from '../utils/dataManager';
import { validators } from '../utils/validators';

interface UseTaskReturn {
  tasks: Task[];
  filteredTasks: Task[];
  filter: FilterOptions;
  sort: SortOptions;
  loading: boolean;
  error: string | null;
  
  // Task operations
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskStatus: (id: string, status: TaskStatus) => Promise<boolean>;
  
  // Filter operations
  setFilter: (filter: Partial<FilterOptions>) => void;
  clearFilter: () => void;
  
  // Sort operations
  setSort: (sort: SortOptions) => void;
  
  // Utility operations
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTaskStats: () => { total: number; today: number; backlog: number; completed: number };
  exportTasks: () => string;
  importTasks: (jsonData: string) => Promise<{ success: boolean; message: string }>;
  
  // Data provider operations
  syncTasks: () => Promise<SyncResult>;
  connectGoogleDrive: () => Promise<void>;
  disconnectGoogleDrive: () => Promise<void>;
  isGoogleDriveConnected: () => boolean;
  getGoogleDriveUserInfo: () => { name: string; email: string } | null;
  switchDataProvider: (provider: string) => void;
  getSyncStatus: () => {
    isConnected: boolean;
    lastSync?: Date;
    currentProvider: string;
    autoSyncEnabled: boolean;
  };
}

export function useTask(): UseTaskReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilterState] = useState<FilterOptions>({});
  const [sort, setSortState] = useState<SortOptions>({
    field: 'updatedAt',
    direction: 'desc',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from current data provider on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const loadedTasks = await dataManager.getTasks();
        setTasks(loadedTasks);
        setError(null);
      } catch (err) {
        setError('Failed to load tasks');
        console.error('Failed to load tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to current data provider whenever tasks change
  useEffect(() => {
    const saveTasks = async () => {
      if (!loading && tasks.length >= 0) {
        try {
          await dataManager.saveTasks(tasks);
        } catch (err) {
          setError('Failed to save tasks');
          console.error('Failed to save tasks:', err);
        }
      }
    };

    saveTasks();
  }, [tasks, loading]);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const validation = validators.validateTask(taskData);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return false;
      }

      const newTask: Task = {
        ...taskData,
        id: uuidv4(),
        title: validators.sanitizeTitle(taskData.title),
        description: taskData.description ? validators.sanitizeDescription(taskData.description) : undefined,
        tags: taskData.tags?.map(tag => validators.sanitizeTag(tag)),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTasks(prev => [...prev, newTask]);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to add task');
      console.error('Failed to add task:', err);
      return false;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>): Promise<boolean> => {
    try {
      const validation = validators.validateTask(updates);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return false;
      }

      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date(),
          };
          
          // Set completedAt when status changes to completed
          if (updates.status === 'completed' && task.status !== 'completed') {
            updatedTask.completedAt = new Date();
          }
          
          // Clear completedAt when status changes away from completed
          if (updates.status && updates.status !== 'completed') {
            updatedTask.completedAt = undefined;
          }
          
          return updatedTask;
        }
        return task;
      }));
      
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to update task');
      console.error('Failed to update task:', err);
      return false;
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      setTasks(prev => prev.filter(task => task.id !== id));
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to delete task');
      console.error('Failed to delete task:', err);
      return false;
    }
  }, []);

  const toggleTaskStatus = useCallback(async (id: string, status: TaskStatus): Promise<boolean> => {
    return updateTask(id, { status });
  }, [updateTask]);

  const setFilter = useCallback((newFilter: Partial<FilterOptions>) => {
    setFilterState(prev => ({ ...prev, ...newFilter }));
  }, []);

  const clearFilter = useCallback(() => {
    setFilterState({});
  }, []);

  const setSort = useCallback((newSort: SortOptions) => {
    setSortState(newSort);
  }, []);

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filter.status && filter.status.length > 0 && !filter.status.includes(task.status)) {
      return false;
    }

    // Priority filter
    if (filter.priority && filter.priority.length > 0 && !filter.priority.includes(task.priority)) {
      return false;
    }

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      const taskTags = task.tags || [];
      const hasMatchingTag = filter.tags.some(filterTag => taskTags.includes(filterTag));
      if (!hasMatchingTag) return false;
    }

    // Search query filter
    if (filter.searchQuery && filter.searchQuery.trim()) {
      const query = filter.searchQuery.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(query);
      const descriptionMatch = task.description?.toLowerCase().includes(query);
      const tagMatch = task.tags?.some(tag => tag.toLowerCase().includes(query));
      
      if (!titleMatch && !descriptionMatch && !tagMatch) return false;
    }

    // Date range filter
    if (filter.dateRange) {
      const taskDate = task.createdAt;
      if (taskDate < filter.dateRange.start || taskDate > filter.dateRange.end) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    let aValue: string | number, bValue: string | number;

    switch (sort.field) {
      case 'priority': {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      }
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'dueDate':
        aValue = a.dueDate?.getTime() || Number.MAX_SAFE_INTEGER;
        bValue = b.dueDate?.getTime() || Number.MAX_SAFE_INTEGER;
        break;
      default:
        aValue = a[sort.field]?.getTime() || 0;
        bValue = b[sort.field]?.getTime() || 0;
    }

    if (sort.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getTasksByStatus = useCallback((status: TaskStatus): Task[] => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const getTaskStats = useCallback(() => {
    return {
      total: tasks.length,
      today: tasks.filter(task => task.status === 'today').length,
      backlog: tasks.filter(task => task.status === 'backlog').length,
      completed: tasks.filter(task => task.status === 'completed').length,
    };
  }, [tasks]);

  const exportTasks = useCallback(() => {
    try {
      const serializedTasks = tasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        completedAt: task.completedAt?.toISOString(),
        dueDate: task.dueDate?.toISOString(),
      }));
      return JSON.stringify(serializedTasks, null, 2);
    } catch (error) {
      console.error('Export failed:', error);
      return '[]';
    }
  }, [tasks]);

  const importTasks = useCallback(async (jsonData: string): Promise<{ success: boolean; message: string }> => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid data format');
      }

      const importedTasks: Task[] = parsed.map(item => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
        dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
      }));

      setTasks(importedTasks);
      setError(null);
      
      return {
        success: true,
        message: `Successfully imported ${importedTasks.length} tasks`
      };
    } catch (error) {
      const message = `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setError(message);
      return { success: false, message };
    }
  }, []);

  // New data provider operations
  const syncTasks = useCallback(async (): Promise<SyncResult> => {
    try {
      const result = await dataManager.syncCurrentProvider();
      if (result.success) {
        // Reload tasks after sync
        const syncedTasks = await dataManager.getTasks();
        setTasks(syncedTasks);
        setError(null);
      } else {
        setError(result.message);
      }
      return result;
    } catch (error) {
      const message = `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setError(message);
      return {
        success: false,
        message,
        conflictCount: 0,
        resolvedConflicts: [],
        lastSyncTime: new Date(),
        syncedTaskCount: 0
      };
    }
  }, []);

  const connectGoogleDrive = useCallback(async (): Promise<void> => {
    try {
      await dataManager.connectGoogleDrive();
      setError(null);
    } catch (error) {
      const message = `Failed to connect to Google Drive: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setError(message);
      throw error;
    }
  }, []);

  const disconnectGoogleDrive = useCallback(async (): Promise<void> => {
    try {
      await dataManager.disconnectGoogleDrive();
      setError(null);
    } catch (error) {
      const message = `Failed to disconnect from Google Drive: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setError(message);
      throw error;
    }
  }, []);

  const isGoogleDriveConnected = useCallback((): boolean => {
    return dataManager.isGoogleDriveConnected();
  }, []);

  const getGoogleDriveUserInfo = useCallback((): { name: string; email: string } | null => {
    return dataManager.getGoogleDriveUserInfo();
  }, []);

  const switchDataProvider = useCallback((provider: string): void => {
    try {
      dataManager.switchProvider(provider);
      // Reload tasks from new provider
      dataManager.getTasks().then(newTasks => {
        setTasks(newTasks);
        setError(null);
      }).catch(err => {
        setError(`Failed to load tasks from ${provider}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      });
    } catch (error) {
      setError(`Failed to switch to ${provider}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  const getSyncStatus = useCallback(() => {
    return dataManager.getSyncStatus();
  }, []);

  return {
    tasks,
    filteredTasks,
    filter,
    sort,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setFilter,
    clearFilter,
    setSort,
    getTasksByStatus,
    getTaskStats,
    exportTasks,
    importTasks,
    syncTasks,
    connectGoogleDrive,
    disconnectGoogleDrive,
    isGoogleDriveConnected,
    getGoogleDriveUserInfo,
    switchDataProvider,
    getSyncStatus,
  };
}