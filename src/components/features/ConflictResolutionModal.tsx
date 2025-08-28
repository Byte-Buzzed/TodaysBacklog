import { useState } from 'react';
import { X, AlertTriangle, Clock, User, Calendar } from 'lucide-react';
import type { Task, ConflictResolution } from '../../types';
import { ConflictResolutionStrategy } from '../../types';

interface ConflictResolutionModalProps {
  conflicts: ConflictResolution[];
  isOpen: boolean;
  onClose: () => void;
  onResolve: (resolutions: ConflictResolution[]) => void;
}

export function ConflictResolutionModal({
  conflicts,
  isOpen,
  onClose,
  onResolve
}: ConflictResolutionModalProps) {
  const [resolutions, setResolutions] = useState<Map<string, ConflictResolutionStrategy>>(
    new Map(conflicts.map(conflict => [conflict.taskId, ConflictResolutionStrategy.NEWEST_WINS]))
  );

  if (!isOpen || conflicts.length === 0) return null;

  const handleStrategyChange = (taskId: string, strategy: ConflictResolutionStrategy) => {
    setResolutions(prev => new Map(prev.set(taskId, strategy)));
  };

  const handleResolve = () => {
    const resolvedConflicts = conflicts.map(conflict => {
      const strategy = resolutions.get(conflict.taskId) || ConflictResolutionStrategy.NEWEST_WINS;
      let resolvedVersion: Task;

      switch (strategy) {
        case ConflictResolutionStrategy.LOCAL_WINS:
          resolvedVersion = conflict.localVersion;
          break;
        case ConflictResolutionStrategy.REMOTE_WINS:
          resolvedVersion = conflict.remoteVersion;
          break;
        case ConflictResolutionStrategy.NEWEST_WINS:
          resolvedVersion = conflict.localVersion.updatedAt > conflict.remoteVersion.updatedAt
            ? conflict.localVersion
            : conflict.remoteVersion;
          break;
        case ConflictResolutionStrategy.MERGE:
          // For simplicity, use newest wins for merge strategy
          resolvedVersion = conflict.localVersion.updatedAt > conflict.remoteVersion.updatedAt
            ? conflict.localVersion
            : conflict.remoteVersion;
          break;
        default:
          resolvedVersion = conflict.localVersion;
      }

      return {
        ...conflict,
        strategy,
        resolvedVersion,
        resolvedAt: new Date()
      };
    });

    onResolve(resolvedConflicts);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTaskDiff = (local: Task, remote: Task) => {
    const diffs: string[] = [];
    
    if (local.title !== remote.title) {
      diffs.push('제목');
    }
    if (local.description !== remote.description) {
      diffs.push('설명');
    }
    if (local.status !== remote.status) {
      diffs.push('상태');
    }
    if (local.priority !== remote.priority) {
      diffs.push('우선순위');
    }
    if (JSON.stringify(local.tags) !== JSON.stringify(remote.tags)) {
      diffs.push('태그');
    }
    if (local.dueDate?.getTime() !== remote.dueDate?.getTime()) {
      diffs.push('마감일');
    }

    return diffs;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-orange-500" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">충돌 해결</h2>
              <p className="text-sm text-gray-600">
                {conflicts.length}개의 작업에서 충돌이 발생했습니다. 각 충돌에 대해 해결 방법을 선택하세요.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {conflicts.map((conflict, index) => {
            const currentStrategy = resolutions.get(conflict.taskId) || ConflictResolutionStrategy.NEWEST_WINS;
            const diffs = getTaskDiff(conflict.localVersion, conflict.remoteVersion);
            
            return (
              <div key={conflict.taskId} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-1">
                    작업 #{index + 1}: {conflict.localVersion.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    변경된 항목: {diffs.join(', ')}
                  </p>
                </div>

                {/* Comparison */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Local Version */}
                  <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <User size={16} className="text-blue-600" />
                      <span className="font-medium text-blue-900">로컬 버전</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div><strong>제목:</strong> {conflict.localVersion.title}</div>
                      <div><strong>상태:</strong> {conflict.localVersion.status}</div>
                      <div><strong>우선순위:</strong> {conflict.localVersion.priority}</div>
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{formatDate(conflict.localVersion.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Remote Version */}
                  <div className="border border-green-200 rounded-lg p-3 bg-green-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar size={16} className="text-green-600" />
                      <span className="font-medium text-green-900">원격 버전</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div><strong>제목:</strong> {conflict.remoteVersion.title}</div>
                      <div><strong>상태:</strong> {conflict.remoteVersion.status}</div>
                      <div><strong>우선순위:</strong> {conflict.remoteVersion.priority}</div>
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{formatDate(conflict.remoteVersion.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resolution Strategy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    해결 방법 선택:
                  </label>
                  <div className="space-y-2">
                    {[
                      { 
                        value: ConflictResolutionStrategy.LOCAL_WINS, 
                        label: '로컬 버전 사용', 
                        description: '현재 기기의 버전을 유지합니다' 
                      },
                      { 
                        value: ConflictResolutionStrategy.REMOTE_WINS, 
                        label: '원격 버전 사용', 
                        description: 'Google Drive의 버전을 사용합니다' 
                      },
                      { 
                        value: ConflictResolutionStrategy.NEWEST_WINS, 
                        label: '최신 버전 사용 (권장)', 
                        description: '더 최근에 수정된 버전을 자동으로 선택합니다' 
                      }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`strategy-${conflict.taskId}`}
                          value={option.value}
                          checked={currentStrategy === option.value}
                          onChange={() => handleStrategyChange(conflict.taskId, option.value)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-sm">{option.label}</div>
                          <div className="text-xs text-gray-600">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleResolve}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            충돌 해결 ({conflicts.length}개)
          </button>
        </div>
      </div>
    </div>
  );
}