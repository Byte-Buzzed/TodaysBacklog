import { Plus } from 'lucide-react';
import { useApp } from '../../contexts';
import { TaskList } from '../features/TaskList';
import { CalendarView } from '../features/CalendarView';
import { EmptyState } from '../common/EmptyState';

export function MainContent() {
  const { 
    filteredTasks, 
    loading, 
    error, 
    dispatch,
    filter,
    view 
  } = useApp();

  const handleNewTask = () => {
    dispatch({ type: 'SELECT_TASK', payload: null });
    dispatch({ type: 'OPEN_MODAL' });
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-4">로딩 중...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            새로고침
          </button>
        </div>
      </main>
    );
  }

  const hasActiveFilters = filter.status?.length || filter.priority?.length || 
                           filter.tags?.length || filter.searchQuery;

  // Render calendar view
  if (view === 'calendar') {
    return (
      <main className="flex-1 flex flex-col bg-gray-50">
        <CalendarView />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-gray-50">
      {/* Quick Add Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <button
          onClick={handleNewTask}
          className="w-full max-w-2xl mx-auto flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
        >
          <Plus size={20} />
          <span>새 작업 추가하기 (Ctrl+N)</span>
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-auto">
        {filteredTasks.length === 0 ? (
          <EmptyState 
            title={hasActiveFilters ? "필터 조건에 맞는 작업이 없습니다" : "아직 작업이 없습니다"}
            description={hasActiveFilters ? "다른 필터 조건을 시도해보세요" : "새 작업을 추가해서 시작해보세요"}
            actionLabel={hasActiveFilters ? undefined : "첫 작업 추가하기"}
            onAction={hasActiveFilters ? undefined : handleNewTask}
          />
        ) : (
          <div className="max-w-4xl mx-auto p-4">
            <TaskList tasks={filteredTasks} />
          </div>
        )}
      </div>
    </main>
  );
}