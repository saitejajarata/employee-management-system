import React from 'react';
import { Building2, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import type { Department } from '../types';
import { exportDepartmentsPDF } from '../utils/pdfExport';
import { exportDepartmentsExcel } from '../utils/excelExport';

interface DepartmentGrowthViewProps {
  departments: Department[];
}

export const DepartmentGrowthView: React.FC<DepartmentGrowthViewProps> = ({ departments }) => {
  const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0);
  const totalExpense = departments.reduce((sum, d) => sum + (d.totalSalaryExpense || 0), 0);

  const chartData = departments.map(d => ({
    name: d.name,
    budget: Math.round(d.budget / 1000),
    payroll: Math.round((d.totalSalaryExpense || 0) / 1000),
    headcount: d.employeeCount || 0
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-cyan-600" />
            <span>Department Growth & Budget Tracking</span>
          </h1>
          <p className="text-xs text-slate-500">Monitor department expansion, allocated budget vs actual payroll expense.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportDepartmentsPDF(departments)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center space-x-1.5 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="w-4 h-4 text-cyan-600" />
            <span>Export Department PDF</span>
          </button>
          <button
            onClick={() => exportDepartmentsExcel(departments)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center space-x-1.5 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Allocated Budget</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">${totalBudget.toLocaleString()}</div>
          <div className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mt-1">FY 2026 Allocation</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Payroll Expense</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">${totalExpense.toLocaleString()}</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            {((totalExpense / (totalBudget || 1)) * 100).toFixed(1)}% of Budget Utilized
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remaining Reserve</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            ${(totalBudget - totalExpense).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Available expansion fund</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Budget vs Salary Expense Breakdown ($ in Thousands)</h3>
          <p className="text-xs text-slate-500">Comparison of department funding against annual salary commitments</p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
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
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="budget" name="Allocated Budget ($K)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              <Bar dataKey="payroll" name="Actual Payroll ($K)" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 font-bold text-xs">
                {dept.code}
              </span>
              <span className="text-xs text-slate-400 font-medium">{dept.employeeCount || 0} Employees</span>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">{dept.name}</h4>
              <p className="text-xs text-slate-500">Manager: {dept.managerName}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Budget</span>
                <span className="font-bold text-slate-900 dark:text-white">${dept.budget.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Total Payroll</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">${(dept.totalSalaryExpense || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
