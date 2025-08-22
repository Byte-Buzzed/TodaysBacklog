import { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useApp } from '../../contexts';

interface SyncStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export function SyncStatusIndicator({ className = '', showDetails = false }: SyncStatusIndicatorProps) {
  const {
    isGoogleDriveConnected,
    getGoogleDriveUserInfo,
    getSyncStatus,
    syncTasks,
    error
  } = useApp();

  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const googleDriveConnected = isGoogleDriveConnected();
  const syncStatus = getSyncStatus();
  const userInfo = getGoogleDriveUserInfo();

  // Auto-hide sync error after 5 seconds
  useEffect(() => {
    if (syncError) {
      const timer = setTimeout(() => {
        setSyncError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [syncError]);

  const handleSync = async () => {
    if (!googleDriveConnected) return;
    
    try {
      setSyncing(true);
      setSyncError(null);
      const result = await syncTasks();
      
      if (!result.success) {
        setSyncError(result.message);
      }
    } catch (err) {
      console.error('Sync failed:', err);
      setSyncError('동기화에 실패했습니다.');
    } finally {
      setSyncing(false);
    }
  };

  const getSyncStatusText = () => {
    if (syncing) return '동기화 중...';
    if (!googleDriveConnected) return 'Google Drive 연결 안됨';
    if (syncStatus.lastSync) {
      const timeDiff = Date.now() - syncStatus.lastSync.getTime();
      const minutes = Math.floor(timeDiff / (1000 * 60));
      if (minutes < 1) return '방금 동기화됨';
      if (minutes < 60) return `${minutes}분 전 동기화`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}시간 전 동기화`;
      return `${Math.floor(hours / 24)}일 전 동기화`;
    }
    return '동기화 필요';
  };

  const getStatusIcon = () => {
    if (syncing) {
      return <RefreshCw size={16} className="animate-spin text-blue-600" />;
    }
    if (syncError || error) {
      return <AlertCircle size={16} className="text-red-600" />;
    }
    if (!googleDriveConnected) {
      return <CloudOff size={16} className="text-gray-400" />;
    }
    if (syncStatus.lastSync) {
      return <CheckCircle size={16} className="text-green-600" />;
    }
    return <Cloud size={16} className="text-blue-600" />;
  };

  const getStatusColor = () => {
    if (syncing) return 'bg-blue-50 border-blue-200';
    if (syncError || error) return 'bg-red-50 border-red-200';
    if (!googleDriveConnected) return 'bg-gray-50 border-gray-200';
    if (syncStatus.lastSync) return 'bg-green-50 border-green-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  if (!showDetails) {
    return (
      <button
        onClick={handleSync}
        disabled={syncing || !googleDriveConnected}
        className={`p-2 rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-50 ${className}`}
        title={getSyncStatusText()}
      >
        {getStatusIcon()}
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${getStatusColor()}`}
        onClick={() => setShowPopup(!showPopup)}
      >
        {getStatusIcon()}
        <span className="text-sm font-medium">{getSyncStatusText()}</span>
      </div>

      {/* Detailed popup */}
      {showPopup && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">동기화 상태</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Google Drive</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  googleDriveConnected 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {googleDriveConnected ? '연결됨' : '연결 안됨'}
                </span>
              </div>

              {googleDriveConnected && userInfo && (
                <div className="text-sm text-gray-600">
                  <p>계정: {userInfo.email}</p>
                </div>
              )}

              {syncStatus.lastSync && (
                <div className="text-sm text-gray-600">
                  마지막 동기화: {syncStatus.lastSync.toLocaleString('ko-KR')}
                </div>
              )}

              {(syncError || error) && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {syncError || error}
                </div>
              )}

              {googleDriveConnected && (
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
                  <span>{syncing ? '동기화 중...' : '지금 동기화'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}