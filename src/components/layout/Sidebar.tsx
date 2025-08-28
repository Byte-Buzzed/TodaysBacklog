import { Calendar, Archive, CheckCircle2, Tag, BarChart3, Filter } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { useApp } from '../../contexts';
import { SyncStatusIndicator } from '../ui/SyncStatusIndicator';
import type { TaskStatus, TaskPriority } from '../../types';

const statusConfig = {
  today: { icon: Calendar, label: '오늘 할 일', color: 'text-blue-600 bg-blue-50' },
  backlog: { icon: Archive, label: '백로그', color: 'text-gray-600 bg-gray-50' },
  completed: { icon: CheckCircle2, label: '완료됨', color: 'text-green-600 bg-green-50' },
};

const priorityConfig = {
  urgent: { label: '긴급', color: 'bg-red-500' },
  high: { label: '높음', color: 'bg-orange-500' },
  medium: { label: '보통', color: 'bg-yellow-500' },
  low: { label: '낮음', color: 'bg-gray-500' },
};

export function Sidebar() {
  const { 
    sidebarOpen, 
    tasks, 
    filter, 
    setFilter, 
    clearFilter,
    getTaskStats 
  } = useApp();

  const stats = getTaskStats();
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(tasks.flatMap(task => task.tags || []))
  ).sort();

  const handleStatusFilter = (status: TaskStatus) => {
    const currentStatus = filter.status || [];
    const newStatus = currentStatus.includes(status)
      ? currentStatus.filter(s => s !== status)
      : [...currentStatus, status];
    
    setFilter({ status: newStatus.length > 0 ? newStatus : undefined });
  };

  const handlePriorityFilter = (priority: TaskPriority) => {
    const currentPriority = filter.priority || [];
    const newPriority = currentPriority.includes(priority)
      ? currentPriority.filter(p => p !== priority)
      : [...currentPriority, priority];
    
    setFilter({ priority: newPriority.length > 0 ? newPriority : undefined });
  };

  const handleTagFilter = (tag: string) => {
    const currentTags = filter.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    setFilter({ tags: newTags.length > 0 ? newTags : undefined });
  };

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Status Navigation */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">작업 상태</h3>
          <nav className="space-y-1">
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon;
              const count = status === 'today' ? stats.today : 
                           status === 'backlog' ? stats.backlog : 
                           stats.completed;
              const isActive = filter.status?.includes(status as TaskStatus);
              
              return (
                <SidebarDropZone key={status} status={status as TaskStatus}>
                  <button
                    onClick={() => handleStatusFilter(status as TaskStatus)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive 
                        ? config.color 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={18} />
                      <span className="text-sm font-medium">{config.label}</span>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {count}
                    </span>
                  </button>
                </SidebarDropZone>
              );
            })}
          </nav>
        </div>

        {/* Priority Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">우선순위</h3>
            <Filter size={14} className="text-gray-400" />
          </div>
          <div className="space-y-1">
            {Object.entries(priorityConfig).map(([priority, config]) => {
              const count = tasks.filter(task => task.priority === priority).length;
              const isActive = filter.priority?.includes(priority as TaskPriority);
              
              return (
                <button
                  key={priority}
                  onClick={() => handlePriorityFilter(priority as TaskPriority)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${config.color}`} />
                    <span className="text-sm">{config.label}</span>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">태그</h3>
              <Tag size={14} className="text-gray-400" />
            </div>
            <div className="space-y-1">
              {allTags.map((tag) => {
                const count = tasks.filter(task => task.tags?.includes(tag)).length;
                const isActive = filter.tags?.includes(tag);
                
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm">#{tag}</span>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {(filter.status?.length || filter.priority?.length || filter.tags?.length || filter.searchQuery) && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={clearFilter}
              className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>

      {/* Sync Status */}
      <div className="px-4 py-2 border-t border-gray-200">
        <SyncStatusIndicator showDetails={true} className="w-full" />
      </div>

      {/* Statistics */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <BarChart3 size={18} className="text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">통계</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-600">{stats.today}</div>
            <div className="text-gray-600">오늘</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-600">{stats.backlog}</div>
            <div className="text-gray-600">백로그</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg col-span-2">
            <div className="font-semibold text-green-600">{stats.completed}</div>
            <div className="text-gray-600">완료됨</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Droppable area for sidebar status sections
function SidebarDropZone({ 
  children, 
  status 
}: { 
  children: React.ReactNode;
  status: TaskStatus;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `sidebar-${status}`,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`relative transition-all duration-200 ${
        isOver ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg' : ''
      }`}
    >
      {children}
      {isOver && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-75 rounded-lg pointer-events-none flex items-center justify-center">
          <span className="text-blue-600 text-xs font-medium">
            {status === 'today' ? '오늘로 이동' : 
             status === 'backlog' ? '백로그로 이동' : 
             '완료로 이동'}
          </span>
        </div>
      )}
    </div>
  );
}