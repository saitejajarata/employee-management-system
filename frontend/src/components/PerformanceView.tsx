import React, { useState } from 'react';
import { Award, Download } from 'lucide-react';
import type { Employee } from '../types';
import { exportPerformanceScorecardPDF } from '../utils/pdfExport';

interface PerformanceViewProps {
  employees: Employee[];
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({ employees }) => {
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(employees[0] || null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Performance Metrics & PDF Scorecard Generator</span>
          </h1>
          <p className="text-xs text-slate-500">Evaluation ratings, KPI milestone scorecards, and downloadable PDF performance reviews.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Select Team Member</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {employees.map((emp) => {
              const isSelected = selectedEmp?.id === emp.id;
              return (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmp(emp)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500/50 shadow-sm'
                      : 'border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img src={emp.avatarUrl} alt={emp.fullName} className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{emp.fullName}</div>
                      <div className="text-[11px] text-slate-400">{emp.position}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-amber-500">{emp.performanceScore.toFixed(1)} ★</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedEmp && (
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-4">
                  <img src={selectedEmp.avatarUrl} alt={selectedEmp.fullName} className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/30" />
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedEmp.fullName}</h2>
                    <p className="text-xs text-slate-500">{selectedEmp.position} • {selectedEmp.department?.name || 'Engineering'}</p>
                    <span className="inline-block mt-1 text-[11px] font-mono text-indigo-600 font-bold">{selectedEmp.employeeCode}</span>
                  </div>
                </div>

                <button
                  onClick={() => exportPerformanceScorecardPDF(selectedEmp)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-center"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Scorecard PDF</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-violet-500/10 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Overall Annual Rating</span>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedEmp.performanceScore.toFixed(1)} <span className="text-lg text-amber-500 font-normal">/ 5.0</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-lg bg-amber-500 text-white text-xs font-extrabold shadow-sm">
                    EXCEEDS EXPECTATIONS
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Dimensions</h4>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Technical Competency & Execution</span>
                    <span className="text-slate-400">Mastery of stack, code hygiene, system architecture impact.</span>
                  </div>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">{selectedEmp.performanceScore.toFixed(1)} / 5</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Project Delivery & Timelines</span>
                    <span className="text-slate-400">On-time milestone achievements and sprint completion rate.</span>
                  </div>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">{(selectedEmp.performanceScore - 0.1).toFixed(1)} / 5</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Team Collaboration & Mentorship</span>
                    <span className="text-slate-400">Peer assistance, code reviews, and positive team culture.</span>
                  </div>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                    {(selectedEmp.performanceScore + 0.1 > 5 ? 5 : selectedEmp.performanceScore + 0.1).toFixed(1)} / 5
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
