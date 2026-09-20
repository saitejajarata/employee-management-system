import React from 'react';
import { FileSpreadsheet, FileText, Users, Building2, CalendarCheck } from 'lucide-react';
import type { Employee, Department, Attendance } from '../types';
import { exportEmployeeDirectoryPDF, exportDepartmentsPDF, exportAttendancePDF } from '../utils/pdfExport';
import { exportEmployeeDirectoryExcel, exportDepartmentsExcel, exportAttendanceExcel } from '../utils/excelExport';

interface ReportsViewProps {
  employees: Employee[];
  departments: Department[];
  attendanceList: Attendance[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ employees, departments, attendanceList }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <span>PDF & Excel Reporting Center</span>
          </h1>
          <p className="text-xs text-slate-500">Generate and download official compliance reports in PDF and Excel formats.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Master Employee Directory Report</h3>
            <p className="text-xs text-slate-500">
              Complete list of all active and inactive employees with salaries, job titles, department codes, and contact info.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => exportEmployeeDirectoryPDF(employees)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20"
            >
              <FileText className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => exportEmployeeDirectoryExcel(employees)}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Download Excel</span>
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center text-cyan-600">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Department Headcount & Budget Report</h3>
            <p className="text-xs text-slate-500">
              Breakdown of allocated department funding, manager assignments, total headcount, and annual payroll expense.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => exportDepartmentsPDF(departments)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-600/20"
            >
              <FileText className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => exportDepartmentsExcel(departments)}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Download Excel</span>
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Attendance & Punctuality Audit Log</h3>
            <p className="text-xs text-slate-500">
              Historical record of check-in times, leave applications, punctuality rates, and daily attendance logs.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => exportAttendancePDF(attendanceList)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20"
            >
              <FileText className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => exportAttendanceExcel(attendanceList)}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Download Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
