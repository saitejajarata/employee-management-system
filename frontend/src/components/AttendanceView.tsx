import React, { useState } from 'react';
import { CalendarCheck, CheckCircle, Clock, AlertTriangle, UserX, Download } from 'lucide-react';
import type { Attendance } from '../types';
import { exportAttendancePDF } from '../utils/pdfExport';
import { exportAttendanceExcel } from '../utils/excelExport';

interface AttendanceViewProps {
  attendanceList: Attendance[];
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ attendanceList }) => {
  const [filterDate, setFilterDate] = useState<string>('');

  const total = attendanceList.length || 1;
  const presentCount = attendanceList.filter(a => a.status === 'Present').length;
  const lateCount = attendanceList.filter(a => a.status === 'Late').length;
  const leaveCount = attendanceList.filter(a => a.status === 'Leave').length;

  const punctualityRate = ((presentCount / total) * 100).toFixed(1);

  const filtered = filterDate
    ? attendanceList.filter(a => a.date === filterDate)
    : attendanceList;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            <span>Attendance Pattern & Punctuality Analytics</span>
          </h1>
          <p className="text-xs text-slate-500">Track check-in times, leave pattern reports, and overall workforce punctuality.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportAttendancePDF(filtered)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center space-x-1.5 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Attendance PDF</span>
          </button>
          <button
            onClick={() => exportAttendanceExcel(filtered)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center space-x-1.5 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Punctuality Score</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{punctualityRate}%</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">High Compliance</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Present On Time</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{presentCount}</div>
            <div className="text-xs text-slate-500 mt-1">Records verified</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Late Check-ins</span>
            <div className="text-2xl font-extrabold text-amber-500 mt-1">{lateCount}</div>
            <div className="text-xs text-slate-500 mt-1">Traffic / Delays</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">On Leave</span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">{leaveCount}</div>
            <div className="text-xs text-slate-500 mt-1">Approved Leaves</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center">
        <div className="flex items-center space-x-3 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Filter Date:</span>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white"
          />
          {filterDate && (
            <button onClick={() => setFilterDate('')} className="text-indigo-600 font-semibold hover:underline">
              Clear Filter
            </button>
          )}
        </div>
        <div className="text-xs text-slate-400 font-medium">Showing {filtered.length} logs</div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">Date</th>
                <th className="p-4">Employee</th>
                <th className="p-4">Check-In</th>
                <th className="p-4">Check-Out</th>
                <th className="p-4">Status</th>
                <th className="p-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{item.date}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {item.employee?.fullName || `Employee #${item.employeeId}`}
                    </div>
                    <div className="text-[11px] text-indigo-600 font-mono">
                      {item.employee?.employeeCode || `EMP-${item.employeeId}`}
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-emerald-600">{item.checkInTime}</td>
                  <td className="p-4 font-semibold text-slate-500">{item.checkOutTime}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950'
                          : item.status === 'Late'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950'
                          : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{item.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
