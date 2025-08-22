import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../../types';
import { TaskItem } from './TaskItem';
import { useApp } from '../../contexts';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const { updateTask } = useApp();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localTasks, setLocalTasks] = useState(tasks);

  // Update local tasks when props change
  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group tasks by status for better organization
  const groupedTasks = localTasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const statusOrder: TaskStatus[] = ['today', 'backlog', 'completed'];
  const statusLabels = {
    today: '오늘 할 일',
    backlog: '백로그',
    completed: '완료된 작업',
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
    const activeTask = localTasks.find(task => task.id === activeId);
    if (!activeTask) return;

    // Check if we're dropping over a droppable area (status column)
    if (overId.startsWith('droppable-')) {
      const newStatus = overId.replace('droppable-', '') as TaskStatus;
      if (activeTask.status !== newStatus) {
        // Update task status
        updateTask(activeId, { status: newStatus });
        setLocalTasks(prev => 
          prev.map(task => 
            task.id === activeId 
              ? { ...task, status: newStatus }
              : task
          )
        );
      }
      return;
    }

    // Check if we're dropping over a sidebar status zone
    if (overId.startsWith('sidebar-')) {
      const newStatus = overId.replace('sidebar-', '') as TaskStatus;
      if (activeTask.status !== newStatus) {
        // Update task status
        updateTask(activeId, { status: newStatus });
        setLocalTasks(prev => 
          prev.map(task => 
            task.id === activeId 
              ? { ...task, status: newStatus }
              : task
          )
        );
      }
      return;
    }

    // Handle reordering within the same status
    const activeIndex = localTasks.findIndex(task => task.id === activeId);
    const overIndex = localTasks.findIndex(task => task.id === overId);

    if (activeIndex !== overIndex) {
      const newTasks = arrayMove(localTasks, activeIndex, overIndex);
      setLocalTasks(newTasks);
    }
  }

  const activeTask = activeId ? localTasks.find(task => task.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-8">
        {statusOrder.map((status) => {
          const statusTasks = groupedTasks[status] || [];

          return (
            <div key={status}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {statusLabels[status]}
                </h2>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {statusTasks.length}개
                </span>
              </div>
              
              <DroppableArea status={status}>
                <SortableContext 
                  items={statusTasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 min-h-[100px]">
                    {statusTasks.map((task) => (
                      <TaskItem 
                        key={task.id} 
                        task={task}
                        isDragging={activeId === task.id}
                      />
                    ))}
                    {statusTasks.length === 0 && (
                      <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm">
                        여기에 작업을 드래그하세요
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DroppableArea>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="opacity-90">
            <TaskItem task={activeTask} isDragging={true} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

// Helper component for droppable areas
function DroppableArea({ 
  children, 
  status 
}: { 
  children: React.ReactNode; 
  status: TaskStatus;
}) {
  const { setNodeRef } = useDroppable({
    id: `droppable-${status}`,
  });

  return (
    <div ref={setNodeRef} className="w-full">
      {children}
    </div>
  );
}