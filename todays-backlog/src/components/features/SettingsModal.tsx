import { useState, useEffect } from 'react';
import { X, Palette, Keyboard, Database, Bell, Download, Upload, Trash2, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { useApp } from '../../contexts';
import type { UserSettings } from '../../types';

export function SettingsModal() {
  const { 
    settingsModalOpen, 
    settings, 
    dispatch, 
    exportTasks, 
    importTasks,
    syncTasks,
    connectGoogleDrive,
    disconnectGoogleDrive,
    isGoogleDriveConnected,
    getGoogleDriveUserInfo,
    getSyncStatus
  } = useApp();
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleClose = () => {
    dispatch({ type: 'CLOSE_SETTINGS_MODAL' });
  };

  const handleSave = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: formData });
    handleClose();
  };

  const handleExport = () => {
    try {
      const data = exportTasks();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `todays-backlog-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('데이터 내보내기에 실패했습니다.');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const result = await importTasks(text);
          alert(result.message);
        } catch (error) {
          console.error('Import failed:', error);
          alert('데이터 가져오기에 실패했습니다.');
        }
      }
    };
    input.click();
  };

  const handleClearAllData = () => {
    if (window.confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleGoogleDriveConnect = async () => {
    try {
      setConnecting(true);
      await connectGoogleDrive();
      alert('Google Drive 연결이 완료되었습니다.');
    } catch (error) {
      console.error('Google Drive connection failed:', error);
      alert('Google Drive 연결에 실패했습니다. 설정을 확인해주세요.');
    } finally {
      setConnecting(false);
    }
  };

  const handleGoogleDriveDisconnect = async () => {
    try {
      await disconnectGoogleDrive();
      alert('Google Drive 연결이 해제되었습니다.');
    } catch (error) {
      console.error('Google Drive disconnection failed:', error);
      alert('Google Drive 연결 해제에 실패했습니다.');
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const result = await syncTasks();
      if (result.success) {
        alert(`동기화 완료: ${result.syncedTaskCount}개 작업이 동기화되었습니다.`);
      } else {
        alert(`동기화 실패: ${result.message}`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      alert('동기화에 실패했습니다.');
    } finally {
      setSyncing(false);
    }
  };

  const googleDriveConnected = isGoogleDriveConnected();
  const userInfo = getGoogleDriveUserInfo();
  const syncStatus = getSyncStatus();

  if (!settingsModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">설정</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* 외관 설정 */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Palette size={20} className="text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">외관</h3>
            </div>
            
            <div className="space-y-4 ml-7">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  테마
                </label>
                <div className="flex space-x-4">
                  {(['light', 'dark', 'auto'] as const).map((theme) => (
                    <label key={theme} className="flex items-center">
                      <input
                        type="radio"
                        name="theme"
                        value={theme}
                        checked={formData.theme === theme}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          theme: e.target.value as 'light' | 'dark' | 'auto' 
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm">
                        {theme === 'light' ? '라이트' : theme === 'dark' ? '다크' : '자동'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  컴팩트 모드
                </label>
                <input
                  type="checkbox"
                  checked={formData.compactMode}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    compactMode: e.target.checked 
                  }))}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  완료된 작업 표시
                </label>
                <input
                  type="checkbox"
                  checked={formData.showCompleted}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    showCompleted: e.target.checked 
                  }))}
                  className="rounded"
                />
              </div>
            </div>
          </section>

          {/* 키보드 단축키 */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Keyboard size={20} className="text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">키보드 단축키</h3>
            </div>
            
            <div className="space-y-3 ml-7 text-sm">
              <div className="flex justify-between">
                <span>새 작업</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + N</kbd>
              </div>
              <div className="flex justify-between">
                <span>검색</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + K</kbd>
              </div>
              <div className="flex justify-between">
                <span>사이드바 토글</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + B</kbd>
              </div>
              <div className="flex justify-between">
                <span>모달 닫기</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">ESC</kbd>
              </div>
            </div>
          </section>

          {/* 클라우드 동기화 */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Cloud size={20} className="text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">클라우드 동기화</h3>
            </div>
            
            <div className="space-y-4 ml-7">
              {/* Google Drive 연결 상태 */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Cloud size={16} className={googleDriveConnected ? 'text-green-600' : 'text-gray-400'} />
                    <span className="font-medium">Google Drive</span>
                    {googleDriveConnected && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        연결됨
                      </span>
                    )}
                  </div>
                  {googleDriveConnected ? (
                    <button
                      onClick={handleGoogleDriveDisconnect}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <CloudOff size={14} />
                      <span>연결 해제</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleGoogleDriveConnect}
                      disabled={connecting}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm disabled:opacity-50"
                    >
                      <Cloud size={14} />
                      <span>{connecting ? '연결 중...' : '연결'}</span>
                    </button>
                  )}
                </div>

                {googleDriveConnected && userInfo && (
                  <div className="text-sm text-gray-600 mb-3">
                    <p>연결된 계정: {userInfo.name} ({userInfo.email})</p>
                    {syncStatus.lastSync && (
                      <p>마지막 동기화: {syncStatus.lastSync.toLocaleString('ko-KR')}</p>
                    )}
                  </div>
                )}

                {googleDriveConnected && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSync}
                      disabled={syncing}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm disabled:opacity-50"
                    >
                      <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                      <span>{syncing ? '동기화 중...' : '지금 동기화'}</span>
                    </button>
                  </div>
                )}

                {!googleDriveConnected && (
                  <div className="text-sm text-gray-600">
                    <p>Google Drive와 연결하여 모든 기기에서 작업을 동기화하세요.</p>
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠️ Google Drive API 키가 설정되어 있지 않으면 연결할 수 없습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 데이터 관리 */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Database size={20} className="text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">데이터 관리</h3>
            </div>
            
            <div className="space-y-4 ml-7">
              <div className="flex space-x-3">
                <button
                  onClick={handleImport}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload size={16} />
                  <span>데이터 가져오기</span>
                </button>
                
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download size={16} />
                  <span>데이터 내보내기</span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  자동 백업 (매일)
                </label>
                <input
                  type="checkbox"
                  checked={formData.autoBackup}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    autoBackup: e.target.checked 
                  }))}
                  className="rounded"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleClearAllData}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  <span>모든 데이터 삭제</span>
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  주의: 이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 알림 설정 */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Bell size={20} className="text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">알림</h3>
            </div>
            
            <div className="space-y-4 ml-7">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  데스크톱 알림
                </label>
                <input
                  type="checkbox"
                  checked={formData.notifications.desktop}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    notifications: { 
                      ...prev.notifications, 
                      desktop: e.target.checked 
                    }
                  }))}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  효과음
                </label>
                <input
                  type="checkbox"
                  checked={formData.notifications.sound}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    notifications: { 
                      ...prev.notifications, 
                      sound: e.target.checked 
                    }
                  }))}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  마감일 알림
                </label>
                <input
                  type="checkbox"
                  checked={formData.notifications.dueDateReminders}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    notifications: { 
                      ...prev.notifications, 
                      dueDateReminders: e.target.checked 
                    }
                  }))}
                  className="rounded"
                />
              </div>

              {formData.notifications.dueDateReminders && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    알림 시점 (분 전)
                  </label>
                  <select
                    value={formData.notifications.reminderMinutes}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      notifications: { 
                        ...prev.notifications, 
                        reminderMinutes: parseInt(e.target.value) 
                      }
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5분</option>
                    <option value={15}>15분</option>
                    <option value={30}>30분</option>
                    <option value={60}>1시간</option>
                  </select>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}