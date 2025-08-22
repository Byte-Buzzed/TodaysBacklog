import { useEffect, useState } from 'react';
import { AppProvider, useApp } from './contexts';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MainContent } from './components/layout/MainContent';
import { TaskModal } from './components/features/TaskModal';
import { SettingsModal } from './components/features/SettingsModal';
import { ConflictResolutionModal } from './components/features/ConflictResolutionModal';
import type { ConflictResolution } from './types';

function AppContent() {
  const { dispatch, theme } = useApp();
  const [conflicts, setConflicts] = useState<ConflictResolution[]>([]);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: New task
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        dispatch({ type: 'SELECT_TASK', payload: null });
        dispatch({ type: 'OPEN_MODAL' });
      }

      // Ctrl/Cmd + B: Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_SIDEBAR' });
      }

      // Escape: Close modal
      if (e.key === 'Escape') {
        dispatch({ type: 'CLOSE_MODAL' });
        dispatch({ type: 'CLOSE_SETTINGS_MODAL' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleConflictResolve = (resolvedConflicts: ConflictResolution[]) => {
    // Here you would typically save the resolved conflicts
    console.log('Conflicts resolved:', resolvedConflicts);
    setConflicts([]);
    setConflictModalOpen(false);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
      <TaskModal />
      <SettingsModal />
      <ConflictResolutionModal
        conflicts={conflicts}
        isOpen={conflictModalOpen}
        onClose={() => setConflictModalOpen(false)}
        onResolve={handleConflictResolve}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
