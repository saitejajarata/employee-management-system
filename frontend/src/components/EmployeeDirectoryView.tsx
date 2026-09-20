import React, { useState } from 'react';
import {
  Users, Plus, Trash2, Download, Filter, Edit3, Eye, FileUp, CheckSquare, Square, X, ShieldAlert
} from 'lucide-react';
import type { Employee, Department } from '../types';
import { exportEmployeeDirectoryPDF } from '../utils/pdfExport';
import { exportEmployeeDirectoryExcel, parseExcelOrCSVFile } from '../utils/excelExport';

interface EmployeeDirectoryViewProps {
  employees: Employee[];
  departments: Department[];
  searchTerm: string;
  onRefresh: () => void;
  onCreateEmployee: (emp: Partial<Employee>) => Promise<any>;
  onUpdateEmployee: (id: number, emp: Partial<Employee>) => Promise<any>;
  onDeleteEmployee: (id: number) => Promise<any>;
  onBatchDeleteEmployees: (ids: number[]) => Promise<any>;
  onBatchImportEmployees: (records: Partial<Employee>[]) => Promise<any>;
}

export const EmployeeDirectoryView: React.FC<EmployeeDirectoryViewProps> = ({
  employees,
  departments,
  searchTerm,
  onRefresh,
  onCreateEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onBatchDeleteEmployees,
  onBatchImportEmployees
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [viewingEmp, setViewingEmp] = useState<Employee | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Employee>>({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    departmentId: 1,
    salary: 75000,
    hireDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    employeeCode: ''
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDeptId === 0 || emp.departmentId === selectedDeptId;
    const matchesStatus = selectedStatus === 'All' || emp.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredEmployees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEmployees.map((e) => e.id));
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setFormData({
      fullName: emp.fullName,
      email: emp.email,
      phone: emp.phone,
      position: emp.position,
      departmentId: emp.departmentId,
      salary: emp.salary,
      hireDate: emp.hireDate.split('T')[0],
      status: emp.status,
      employeeCode: emp.employeeCode
    });
    setIsAddModalOpen(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingEmp) {
        await onUpdateEmployee(editingEmp.id, formData);
      } else {
        await onCreateEmployee(formData);
      }
      setIsAddModalOpen(false);
      setEditingEmp(null);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      await onBatchDeleteEmployees(selectedIds);
      setSelectedIds([]);
      setIsDeleteConfirmOpen(false);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const records = await parseExcelOrCSVFile(file);
      if (records.length > 0) {
        await onBatchImportEmployees(records);
        setIsImportModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      alert('Failed to parse file. Please verify column format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Employee Directory</span>
          </h1>
          <p className="text-xs text-slate-500">Manage employee records, bulk actions, multi-select deletion, and exports.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-rose-600/20 transition-all animate-in fade-in"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <FileUp className="w-4 h-4 text-emerald-600" />
            <span>Import CSV / Excel</span>
          </button>

          <button
            onClick={() => exportEmployeeDirectoryPDF(filteredEmployees)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-sm"
            title="Export PDF"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => exportEmployeeDirectoryExcel(filteredEmployees)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-sm"
            title="Export Excel"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => {
              setEditingEmp(null);
              setFormData({
                fullName: '',
                email: '',
                phone: '',
                position: '',
                departmentId: 1,
                salary: 75000,
                hireDate: new Date().toISOString().split('T')[0],
                status: 'Active',
                employeeCode: `EMP-${Math.floor(Math.random() * 900 + 100)}`
              });
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(Number(e.target.value))}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={0}>All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="OnLeave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900 dark:text-white">{filteredEmployees.length}</span> records
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 w-10">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-indigo-600">
                    {selectedIds.length > 0 && selectedIds.length === filteredEmployees.length ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4">Employee</th>
                <th className="p-4">Department & Position</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Salary</th>
                <th className="p-4">Status</th>
                <th className="p-4">Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredEmployees.map((emp) => {
                const isSelected = selectedIds.includes(emp.id);
                return (
                  <tr
                    key={emp.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <td className="p-4">
                      <button onClick={() => handleSelectOne(emp.id)} className="text-slate-400 hover:text-indigo-600">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img src={emp.avatarUrl} alt={emp.fullName} className="w-9 h-9 rounded-xl object-cover bg-slate-100" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{emp.fullName}</div>
                          <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-medium">{emp.employeeCode}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{emp.position}</div>
                      <div className="text-slate-400">{emp.department?.name || 'General'}</div>
                    </td>

                    <td className="p-4">
                      <div>{emp.email}</div>
                      <div className="text-[11px] text-slate-400">{emp.phone}</div>
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                      ${emp.salary.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ yr</span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                            : emp.status === 'OnLeave'
                            ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                            : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">
                      {emp.performanceScore.toFixed(1)} ★
                    </td>

                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => setViewingEmp(emp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View Employee Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(emp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                        title="Edit Employee"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm(`Delete employee ${emp.fullName}?`)) {
                            await onDeleteEmployee(emp.id);
                            onRefresh();
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {editingEmp ? 'Edit Employee Record' : 'Add New Employee'}
            </h3>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Employee Code</label>
                  <input
                    type="text"
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Position / Job Title</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Annual Salary ($)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="OnLeave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hire Date</label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/30"
                >
                  {editingEmp ? 'Update Record' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative text-center">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>

            <FileUp className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Bulk Employee Import</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select a CSV or Excel (.xlsx) file containing employee columns (Full Name, Position, Email, Salary).
            </p>

            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileUpload}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
            />
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-center">
            <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Batch Delete</h3>
            <p className="text-xs text-slate-500 mb-4">
              Are you sure you want to permanently delete <span className="font-bold text-rose-600">{selectedIds.length}</span> employee records?
            </p>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingEmp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full p-6 shadow-2xl overflow-y-auto relative">
            <button
              onClick={() => setViewingEmp(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pt-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <img src={viewingEmp.avatarUrl} alt={viewingEmp.fullName} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 shadow-lg" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{viewingEmp.fullName}</h2>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">{viewingEmp.employeeCode}</span>
              <div className="text-xs text-slate-500 mt-1">{viewingEmp.position} • {viewingEmp.department?.name || 'Engineering'}</div>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Email Address</span>
                <span className="font-semibold text-slate-900 dark:text-white">{viewingEmp.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Phone</span>
                <span className="font-semibold text-slate-900 dark:text-white">{viewingEmp.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Hire Date</span>
                <span className="font-semibold text-slate-900 dark:text-white">{viewingEmp.hireDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Annual Salary</span>
                <span className="font-bold text-emerald-600">${viewingEmp.salary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Performance Rating</span>
                <span className="font-bold text-indigo-600">{viewingEmp.performanceScore.toFixed(1)} / 5.0 ★</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
