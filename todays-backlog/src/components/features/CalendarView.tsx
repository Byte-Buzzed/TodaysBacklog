import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { useApp } from '../../contexts';
import type { Task } from '../../types';

export function CalendarView() {
  const { tasks, dispatch, updateTask } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Get the first day of the current month
  const monthStart = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }, [currentDate]);

  // Get the calendar grid (including padding days from previous/next month)
  const calendarDays = useMemo(() => {
    const days = [];
    const startDate = new Date(monthStart);
    const dayOfWeek = startDate.getDay();
    
    // Add padding days from previous month
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    // Generate 42 days (6 weeks * 7 days)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    
    return days;
  }, [monthStart]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    
    tasks.forEach(task => {
      // Group by creation date, due date, or completion date
      const dates = [];
      
      if (task.createdAt) {
        dates.push(new Date(task.createdAt).toDateString());
      }
      
      if (task.dueDate) {
        dates.push(new Date(task.dueDate).toDateString());
      }
      
      if (task.completedAt) {
        dates.push(new Date(task.completedAt).toDateString());
      }
      
      dates.forEach(dateStr => {
        if (!grouped[dateStr]) {
          grouped[dateStr] = [];
        }
        grouped[dateStr].push(task);
      });
    });
    
    return grouped;
  }, [tasks]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleDateClick = () => {
    // Open new task modal with pre-filled due date
    dispatch({ type: 'SELECT_TASK', payload: null });
    dispatch({ type: 'OPEN_MODAL' });
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getTasksForDate = (date: Date) => {
    return tasksByDate[date.toDateString()] || [];
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'today': return 'bg-blue-100 text-blue-800';
      case 'backlog': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;

    // Check if we're dropping over a calendar date
    if (overId.startsWith('calendar-date-')) {
      const dateStr = overId.replace('calendar-date-', '');
      const targetDate = new Date(dateStr);
      
      // Update task due date
      updateTask(activeId, { dueDate: targetDate });
    }
  }

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full bg-white">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">
            {formatMonth(currentDate)}
          </h2>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              오늘
            </button>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <div 
                key={day} 
                className={`p-2 sm:p-3 text-center text-xs sm:text-sm font-medium ${
                  index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7" style={{ minHeight: 'calc(100vh - 180px)' }}>
            {calendarDays.map((date, index) => {
              const dayTasks = getTasksForDate(date);
              const isOtherMonth = !isCurrentMonth(date);
              const isTodayDate = isToday(date);
              
              return (
                <CalendarDateCell
                  key={index}
                  date={date}
                  tasks={dayTasks}
                  isOtherMonth={isOtherMonth}
                  isToday={isTodayDate}
                  onDateClick={handleDateClick}
                  onTaskClick={(task) => {
                    dispatch({ type: 'SELECT_TASK', payload: task });
                    dispatch({ type: 'OPEN_MODAL' });
                  }}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                />
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="opacity-90 p-1">
              <div className={`text-xs px-2 py-1 rounded ${getStatusColor(activeTask.status)}`}>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(activeTask.priority)}`} />
                  <span className="truncate">{activeTask.title}</span>
                </div>
              </div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

// Calendar date cell component with droppable functionality
function CalendarDateCell({
  date,
  tasks,
  isOtherMonth,
  isToday,
  onDateClick,
  onTaskClick,
  getPriorityColor,
  getStatusColor,
}: {
  date: Date;
  tasks: Task[];
  isOtherMonth: boolean;
  isToday: boolean;
  onDateClick: () => void;
  onTaskClick: (task: Task) => void;
  getPriorityColor: (priority: Task['priority']) => string;
  getStatusColor: (status: Task['status']) => string;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `calendar-date-${date.toISOString().split('T')[0]}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative group border-r border-b border-gray-200 p-1 sm:p-2 min-h-[80px] sm:min-h-[120px] cursor-pointer transition-colors ${
        isOtherMonth ? 'bg-gray-50 text-gray-400' : ''
      } ${isOver ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
      onClick={onDateClick}
    >
      {/* Date Number */}
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <span className={`text-xs sm:text-sm font-medium ${
          isToday 
            ? 'bg-blue-600 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs' 
            : ''
        }`}>
          {date.getDate()}
        </span>
        
        {tasks.length > 0 && (
          <span className="text-xs text-gray-500 hidden sm:inline">
            {tasks.length}
          </span>
        )}
      </div>

      {/* Tasks */}
      <div className="space-y-0.5 sm:space-y-1">
        {tasks.slice(0, window.innerWidth < 640 ? 2 : 3).map((task) => (
          <DraggableCalendarTask
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
          />
        ))}
        
        {tasks.length > (window.innerWidth < 640 ? 2 : 3) && (
          <div className="text-xs text-gray-500 px-1 sm:px-2">
            +{tasks.length - (window.innerWidth < 640 ? 2 : 3)} 더보기
          </div>
        )}
      </div>

      {/* Add Task Button */}
      {!isOtherMonth && (
        <button
          className="absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDateClick();
          }}
        >
          <Plus size={10} className="sm:w-3 sm:h-3" />
        </button>
      )}

      {/* Drop zone indicator */}
      {isOver && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-50 rounded pointer-events-none flex items-center justify-center">
          <span className="text-blue-600 text-xs font-medium">여기에 놓기</span>
        </div>
      )}
    </div>
  );
}

// Draggable task component for calendar
function DraggableCalendarTask({
  task,
  onClick,
  getPriorityColor,
  getStatusColor,
}: {
  task: Task;
  onClick: () => void;
  getPriorityColor: (priority: Task['priority']) => string;
  getStatusColor: (status: Task['status']) => string;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded truncate cursor-pointer ${getStatusColor(task.status)}`}
      title={task.title}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="flex items-center space-x-1">
        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getPriorityColor(task.priority)}`} />
        <span className="truncate text-xs">{task.title}</span>
      </div>
    </div>
  );
}