import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Task, UserSettings, FilterOptions, SortOptions, ViewMode, Theme, SyncResult } from '../types';
import { useTask } from '../hooks/useTask';
import { storage } from '../utils/storage';

interface AppState {
  view: ViewMode;
  theme: Theme;
  settings: UserSettings;
  sidebarOpen: boolean;
  selectedTask: Task | null;
  modalOpen: boolean;
  settingsModalOpen: boolean;
}

type AppAction = 
  | { type: 'SET_VIEW'; payload: ViewMode }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'SELECT_TASK'; payload: Task | null }
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'OPEN_SETTINGS_MODAL' }
  | { type: 'CLOSE_SETTINGS_MODAL' };

interface AppContextType extends AppState {
  // Task operations (from useTask hook)
  tasks: Task[];
  filteredTasks: Task[];
  filter: FilterOptions;
  sort: SortOptions;
  loading: boolean;
  error: string | null;
  
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskStatus: (id: string, status: Task['status']) => Promise<boolean>;
  setFilter: (filter: Partial<FilterOptions>) => void;
  clearFilter: () => void;
  setSort: (sort: SortOptions) => void;
  getTasksByStatus: (status: Task['status']) => Task[];
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
  
  // App actions
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | null>(null);

const initialState: AppState = {
  view: 'list',
  theme: 'light',
  settings: {
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
  },
  sidebarOpen: true,
  selectedTask: null,
  modalOpen: false,
  settingsModalOpen: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    
    case 'SET_THEME':
      return { 
        ...state, 
        theme: action.payload,
        settings: { ...state.settings, theme: action.payload }
      };
    
    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.payload };
      // Save settings to localStorage
      storage.saveSettings(newSettings);
      return { ...state, settings: newSettings };
    }
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    
    case 'SELECT_TASK':
      return { ...state, selectedTask: action.payload };
    
    case 'OPEN_MODAL':
      return { ...state, modalOpen: true };
    
    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false, selectedTask: null };
    
    case 'OPEN_SETTINGS_MODAL':
      return { ...state, settingsModalOpen: true };
    
    case 'CLOSE_SETTINGS_MODAL':
      return { ...state, settingsModalOpen: false };
    
    default:
      return state;
  }
}

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const taskHook = useTask();

  // Load settings on mount
  useEffect(() => {
    try {
      const settings = storage.getSettings();
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      dispatch({ type: 'SET_THEME', payload: settings.theme });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // Auto backup if enabled
  useEffect(() => {
    if (state.settings.autoBackup) {
      const interval = setInterval(() => {
        storage.createBackup();
      }, 24 * 60 * 60 * 1000); // Daily backup

      return () => clearInterval(interval);
    }
  }, [state.settings.autoBackup]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch({ type: 'SET_SIDEBAR', payload: false });
      } else {
        dispatch({ type: 'SET_SIDEBAR', payload: true });
      }
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const contextValue: AppContextType = {
    ...state,
    ...taskHook,
    dispatch,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}