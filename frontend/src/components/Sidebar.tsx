import React from 'react';
import { LayoutDashboard, Users, Building2, CalendarCheck, Award, FileSpreadsheet, ShieldCheck, Sparkles } from 'lucide-react';

export type NavTab = 'dashboard' | 'employees' | 'departments' | 'attendance' | 'performance' | 'reports';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  employeeCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, employeeCount }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employee Directory', icon: Users, count: employeeCount },
    { id: 'departments', label: 'Department Growth', icon: Building2 },
    { id: 'attendance', label: 'Attendance Patterns', icon: CalendarCheck },
    { id: 'performance', label: 'Performance Metrics', icon: Award },
    { id: 'reports', label: 'PDF & Excel Reports', icon: FileSpreadsheet }
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between sticky top-0 h-screen transition-colors z-40">
      <div>
        {/* Brand Logo Header */}
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-700 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent">
              EmpPulse
            </span>
            <span className="block text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Enterprise HR
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Main Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer Card */}
      <div className="p-4">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ASP.NET 8 + React System</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Connected to Web API backend on port 5000 with EF Core database.
          </p>
        </div>
      </div>
    </aside>
  );
};
