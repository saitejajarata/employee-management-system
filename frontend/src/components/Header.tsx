import React from 'react';
import { Search, Sun, Moon, LogOut, User, Bell } from 'lucide-react';
import type { AuthUser } from '../types';

interface HeaderProps {
  user: AuthUser | null;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  darkMode,
  setDarkMode,
  searchTerm,
  setSearchTerm,
  onLogout,
  onOpenAuth
}) => {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Quick search employees, position, code..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
        />
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900"></span>
        </button>

        {user ? (
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-semibold shadow-md shadow-indigo-500/20">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">{user.username}</div>
                <div className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{user.role}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
