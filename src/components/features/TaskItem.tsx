import { 
  Clock, 
  Calendar, 
  Tag, 
  Edit, 
  Trash2, 
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  GripVertical
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskStatus } from '../../types';
import { useApp } from '../../contexts';
import { dateUtils } from '../../utils/date';

interface TaskItemProps {
  task: Task;
  isDragging?: boolean;
}

const priorityColors = {
  urgent: 'border-l-red-500 bg-red-50',
  high: 'border-l-orange-500 bg-orange-50',
  medium: 'border-l-yellow-500 bg-yellow-50',
  low: 'border-l-gray-500 bg-gray-50',
};

const priorityLabels = {
  urgent: '긴급',
  high: '높음',
  medium: '보통',
  low: '낮음',
};

export function TaskItem({ task, isDragging = false }: TaskItemProps) {
  const { toggleTaskStatus, deleteTask, dispatch } = useApp();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id: task.id });

  const handleToggleComplete = () => {
    const newStatus: TaskStatus = task.status === 'completed' ? 'today' : 'completed';
    toggleTaskStatus(task.id, newStatus);
  };

  const handleEdit = () => {
    dispatch({ type: 'SELECT_TASK', payload: task });
    dispatch({ type: 'OPEN_MODAL' });
  };

  const handleDelete = () => {
    if (window.confirm('이 작업을 삭제하시겠습니까?')) {
      deleteTask(task.id);
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    toggleTaskStatus(task.id, newStatus);
  };

  const isCompleted = task.status === 'completed';
  const isOverdue = task.dueDate && dateUtils.isOverdue(task.dueDate) && !isCompleted;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`
        bg-white border-l-4 rounded-lg shadow-sm p-4 transition-all hover:shadow-md
        ${priorityColors[task.priority]}
        ${isCompleted ? 'opacity-75' : ''}
        ${sortableIsDragging || isDragging ? 'opacity-50 shadow-lg' : ''}
        ${sortableIsDragging ? 'rotate-2' : ''}
      `}
    >
      <div className="flex items-start space-x-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 mt-1 p-1 rounded hover:bg-gray-100 transition-colors cursor-grab active:cursor-grabbing"
          title="드래그하여 이동"
        >
          <GripVertical size={16} className="text-gray-400" />
        </button>

        {/* Completion Toggle */}
        <button
          onClick={handleToggleComplete}
          className="flex-shrink-0 mt-1 p-1 rounded-full hover:bg-white/50 transition-colors"
        >
          {isCompleted ? (
            <CheckCircle2 size={20} className="text-green-600" />
          ) : (
            <Circle size={20} className="text-gray-400 hover:text-green-600" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 
                className={`text-base font-medium ${
                  isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`mt-1 text-sm ${
                  isCompleted ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 ml-4">
              {/* Status Change Buttons */}
              {!isCompleted && (
                <div className="flex space-x-1">
                  {task.status !== 'today' && (
                    <button
                      onClick={() => handleStatusChange('today')}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="오늘로 이동"
                    >
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              )}
              
              <button
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title="수정"
              >
                <Edit size={14} />
              </button>
              
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="삭제"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Task Meta Information */}
          <div className="flex items-center flex-wrap gap-3 mt-3 text-sm text-gray-500">
            {/* Priority */}
            <div className="flex items-center space-x-1">
              <span className="font-medium">
                {priorityLabels[task.priority]}
              </span>
            </div>

            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center space-x-1 ${
                isOverdue ? 'text-red-600' : ''
              }`}>
                <Calendar size={14} />
                <span className="flex items-center space-x-1">
                  {dateUtils.formatDate(task.dueDate)}
                  {isOverdue && <AlertTriangle size={14} />}
                </span>
              </div>
            )}

            {/* Estimated Time */}
            {task.estimatedTime && (
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{task.estimatedTime}분</span>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag size={14} />
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Last Updated */}
            <div className="text-xs">
              {isCompleted && task.completedAt 
                ? `${dateUtils.formatRelativeTime(task.completedAt)}에 완료`
                : `${dateUtils.formatRelativeTime(task.updatedAt)}에 수정`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}