export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'today' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  dueDate?: Date;
  recurring?: RecurringPattern;
}

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate?: Date;
}

export interface FilterOptions {
  status?: Task['status'][];
  priority?: Task['priority'][];
  tags?: string[];
  searchQuery?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SortOptions {
  field: 'createdAt' | 'updatedAt' | 'priority' | 'dueDate' | 'title';
  direction: 'asc' | 'desc';
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  compactMode: boolean;
  showCompleted: boolean;
  autoBackup: boolean;
  notifications: {
    desktop: boolean;
    sound: boolean;
    dueDateReminders: boolean;
    reminderMinutes: number;
  };
}

export interface AppState {
  tasks: Task[];
  filter: FilterOptions;
  sort: SortOptions;
  view: 'list' | 'board' | 'calendar';
  theme: 'light' | 'dark' | 'auto';
  settings: UserSettings;
}

export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];
export type ViewMode = AppState['view'];
export type Theme = AppState['theme'];

// Data Provider Types
export interface DataProvider {
  name: string;
  type: 'local' | 'cloud' | 'database' | 'api';
  isConnected: boolean;
  lastSync?: Date;
  
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  fetch(): Promise<Task[]>;
  save(tasks: Task[]): Promise<void>;
  sync(): Promise<SyncResult>;
}

export interface SyncResult {
  success: boolean;
  message: string;
  conflictCount: number;
  resolvedConflicts: ConflictResolution[];
  lastSyncTime: Date;
  syncedTaskCount: number;
}

export const ConflictResolutionStrategy = {
  LOCAL_WINS: 'local_wins',
  REMOTE_WINS: 'remote_wins',
  NEWEST_WINS: 'newest_wins',
  MANUAL_RESOLVE: 'manual',
  MERGE: 'merge'
} as const;

export type ConflictResolutionStrategy = typeof ConflictResolutionStrategy[keyof typeof ConflictResolutionStrategy];

export interface ConflictResolution {
  taskId: string;
  localVersion: Task;
  remoteVersion: Task;
  strategy: ConflictResolutionStrategy;
  resolvedVersion: Task;
  resolvedAt: Date;
}

export interface DataSourceConfig {
  id: string;
  name: string;
  type: DataProvider['type'];
  isConnected: boolean;
  lastSync?: Date;
  autoSync: boolean;
  syncInterval: number; // minutes
  isDefault: boolean;
}

export interface GoogleDriveConfig {
  clientId: string;
  apiKey: string;
  discoveryDocs: string[];
  scopes: string[];
  fileName: string;
}