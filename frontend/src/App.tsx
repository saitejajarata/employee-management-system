import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import type { NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { EmployeeDirectoryView } from './components/EmployeeDirectoryView';
import { DepartmentGrowthView } from './components/DepartmentGrowthView';
import { AttendanceView } from './components/AttendanceView';
import { PerformanceView } from './components/PerformanceView';
import { ReportsView } from './components/ReportsView';

import { apiService } from './services/api';
import type { Employee, Department, Attendance, AuthUser, OverviewReport } from './types';
import { exportEmployeeDirectoryPDF } from './utils/pdfExport';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [overviewReport, setOverviewReport] = useState<OverviewReport | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const cached = localStorage.getItem('emp_user');
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (err) {
        console.error('Failed to parse cached user', err);
      }
    }
  }, []);

  const loadData = async () => {
    try {
      const [empData, deptData, attData, repData] = await Promise.all([
        apiService.getEmployees(searchTerm),
        apiService.getDepartments(),
        apiService.getAttendance(),
        apiService.getOverviewReport()
      ]);
      setEmployees(empData);
      setDepartments(deptData);
      setAttendanceList(attData);
      setOverviewReport(repData);
    } catch (err) {
      console.error('Error loading data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(async () => {
      const filtered = await apiService.getEmployees(searchTerm);
      setEmployees(filtered);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem('emp_user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        employeeCount={employees.length}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onLogout={handleLogout}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        <main className="p-6 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              employees={employees}
              departments={departments}
              reportData={overviewReport}
              onNavigate={(tab) => setActiveTab(tab)}
              onExportPDF={() => exportEmployeeDirectoryPDF(employees)}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeeDirectoryView
              employees={employees}
              departments={departments}
              searchTerm={searchTerm}
              onRefresh={loadData}
              onCreateEmployee={(emp) => apiService.createEmployee(emp)}
              onUpdateEmployee={(id, emp) => apiService.updateEmployee(id, emp)}
              onDeleteEmployee={(id) => apiService.deleteEmployee(id)}
              onBatchDeleteEmployees={(ids) => apiService.batchDeleteEmployees(ids)}
              onBatchImportEmployees={(recs) => apiService.batchImportEmployees(recs)}
            />
          )}

          {activeTab === 'departments' && (
            <DepartmentGrowthView departments={departments} />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView attendanceList={attendanceList} />
          )}

          {activeTab === 'performance' && (
            <PerformanceView employees={employees} />
          )}

          {activeTab === 'reports' && (
            <ReportsView employees={employees} departments={departments} attendanceList={attendanceList} />
          )}
        </main>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => setUser(loggedUser)}
      />
    </div>
  );
}

export default App;
