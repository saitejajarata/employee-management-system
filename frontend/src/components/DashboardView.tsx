import React from 'react';
import { Users, Building2, DollarSign, Award, TrendingUp, UserPlus, Download, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Employee, Department, OverviewReport } from '../types';

interface DashboardViewProps {
  employees: Employee[];
  departments: Department[];
  reportData: OverviewReport | null;
  onNavigate: (tab: any) => void;
  onExportPDF: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  departments,
  reportData,
  onNavigate,
  onExportPDF
}) => {
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
  const avgPerformance = employees.length > 0
    ? (employees.reduce((sum, e) => sum + e.performanceScore, 0) / employees.length).toFixed(1)
    : '4.5';

  const hiringTrendData = reportData?.hiringTrend || [
    { period: 'Jan', hiredCount: 3 },
    { period: 'Feb', hiredCount: 5 },
    { period: 'Mar', hiredCount: 4 },
    { period: 'Apr', hiredCount: 8 },
    { period: 'May', hiredCount: 6 },
    { period: 'Jun', hiredCount: 10 }
  ];

  const topPerformers = [...employees]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">Executive HR Overview</h1>
          <p className="text-sm text-indigo-200 mt-1 max-w-xl">
            Real-time workforce intelligence, hiring analytics, department distribution, and automated PDF report generation.
          </p>
        </div>
        <div className="relative z-10 flex items-center space-x-3">
          <button
            onClick={() => onNavigate('employees')}
            className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-semibold text-xs flex items-center space-x-2 shadow-lg hover:bg-indigo-50 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Manage Employees</span>
          </button>
          <button
            onClick={onExportPDF}
            className="px-4 py-2.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white border border-indigo-500/30 font-semibold text-xs flex items-center space-x-2 shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Directory PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Headcount</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{employees.length}</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{activeCount} Active Members</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Departments</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{departments.length}</div>
            <div className="text-xs text-slate-500 mt-1">Cross-functional units</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Monthly Payroll</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              ${(totalPayroll / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-500 mt-1">Annual: ${totalPayroll.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg Performance</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{avgPerformance} / 5.0</div>
            <div className="text-xs text-amber-500 font-medium mt-1">Exceeds Expectations</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Hiring Velocity & Trend Analysis</span>
              </h3>
              <p className="text-xs text-slate-500">Monthly new hires onboarded into organization</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hiringTrendData}>
                <defs>
                  <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="hiredCount" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorHired)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Top Performing Talent</span>
          </h3>

          <div className="space-y-3">
            {topPerformers.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <img src={emp.avatarUrl} alt={emp.fullName} className="w-10 h-10 rounded-full object-cover border border-indigo-500/20" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{emp.fullName}</div>
                    <div className="text-[11px] text-slate-500">{emp.position}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                    {emp.performanceScore.toFixed(1)} ★
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
