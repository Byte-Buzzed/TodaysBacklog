import { useState } from 'react';
import { Search, Menu, Settings, Sun, Moon, Download, Upload, List, Calendar, Cloud, RefreshCw } from 'lucide-react';
import { useApp } from '../../contexts';

export function Header() {
  const { 
    dispatch, 
    theme, 
    view, 
    setFilter, 
    exportTasks, 
    importTasks,
    isGoogleDriveConnected,
    getGoogleDriveUserInfo,
    getSyncStatus,
    syncTasks
  } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [syncing, setSyncing] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilter({ searchQuery: query });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', payload: newTheme });
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

  const handleQuickSync = async () => {
    if (!isGoogleDriveConnected()) return;
    
    try {
      setSyncing(true);
      await syncTasks();
    } catch (error) {
      console.error('Quick sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const googleDriveConnected = isGoogleDriveConnected();
  const syncStatus = getSyncStatus();
  const userInfo = getGoogleDriveUserInfo();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TB</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
            Today's Backlog
          </h1>
        </div>
      </div>

      {/* Center section - Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="작업 검색..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-2">
        {/* View Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'list' })}
            className={`p-1.5 rounded-md transition-colors ${
              view === 'list' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="목록 보기"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'calendar' })}
            className={`p-1.5 rounded-md transition-colors ${
              view === 'calendar' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="캘린더 보기"
          >
            <Calendar size={16} />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1" />

        {/* Google Drive Sync Status */}
        {googleDriveConnected && (
          <button
            onClick={handleQuickSync}
            disabled={syncing}
            className={`p-2 rounded-lg transition-colors ${
              syncing 
                ? 'bg-blue-50 text-blue-600' 
                : 'hover:bg-gray-100'
            }`}
            title={`Google Drive (${userInfo?.email}) - 마지막 동기화: ${syncStatus.lastSync?.toLocaleTimeString('ko-KR') || '없음'}`}
          >
            {syncing ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Cloud size={18} className="text-green-600" />
            )}
          </button>
        )}

        <button
          onClick={handleImport}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="데이터 가져오기"
        >
          <Upload size={18} />
        </button>
        
        <button
          onClick={handleExport}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="데이터 내보내기"
        >
          <Download size={18} />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="테마 변경"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button
          onClick={() => dispatch({ type: 'OPEN_SETTINGS_MODAL' })}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="설정"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}