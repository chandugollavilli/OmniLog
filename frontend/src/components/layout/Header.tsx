import React from 'react';
import { Menu, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { NotificationCenter } from './NotificationCenter';

export const Header: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold text-white">FortiGate Enterprise Log Analyzer</h2>
          <p className="text-xs text-slate-400">Realtime Threat Intelligence & Log Collector</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Live Notifications */}
        <NotificationCenter />

        {/* User Badge & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="hidden md:block text-right">
            <p className="text-xs font-semibold text-slate-200">{user?.username || 'Admin'}</p>
            <p className="text-[10px] text-brand-400 font-mono font-medium">{user?.role || 'ADMINISTRATOR'}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
