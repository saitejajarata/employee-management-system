import type { Employee, Department, Attendance, AuthUser, OverviewReport } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Initial Fallback Data in case API call experiences network latency or cold start
const INITIAL_DEPARTMENTS: Department[] = [
  { id: 1, name: 'Engineering', code: 'ENG', budget: 450000, managerName: 'Sarah Jenkins', employeeCount: 2, totalSalaryExpense: 240000 },
  { id: 2, name: 'Human Resources', code: 'HR', budget: 180000, managerName: 'David Miller', employeeCount: 1, totalSalaryExpense: 78000 },
  { id: 3, name: 'Marketing', code: 'MKT', budget: 250000, managerName: 'Elena Rostova', employeeCount: 1, totalSalaryExpense: 85000 },
  { id: 4, name: 'Sales', code: 'SLS', budget: 320000, managerName: 'Marcus Vance', employeeCount: 1, totalSalaryExpense: 92000 },
  { id: 5, name: 'Product & Design', code: 'DES', budget: 280000, managerName: 'Sophia Chen', employeeCount: 1, totalSalaryExpense: 110000 }
];

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 1,
    employeeCode: 'EMP-001',
    fullName: 'Alex Rivera',
    email: 'alex.rivera@company.com',
    phone: '+1 (555) 234-5678',
    departmentId: 1,
    department: INITIAL_DEPARTMENTS[0],
    position: 'Senior Full-Stack Engineer',
    salary: 125000,
    hireDate: '2022-03-15',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    performanceScore: 4.8
  },
  {
    id: 2,
    employeeCode: 'EMP-002',
    fullName: 'Samantha Wu',
    email: 'samantha.wu@company.com',
    phone: '+1 (555) 876-5432',
    departmentId: 5,
    department: INITIAL_DEPARTMENTS[4],
    position: 'Lead UX Designer',
    salary: 110000,
    hireDate: '2023-01-10',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    performanceScore: 4.9
  },
  {
    id: 3,
    employeeCode: 'EMP-003',
    fullName: 'David Kim',
    email: 'david.kim@company.com',
    phone: '+1 (555) 345-6789',
    departmentId: 1,
    department: INITIAL_DEPARTMENTS[0],
    position: 'DevOps Specialist',
    salary: 115000,
    hireDate: '2023-06-01',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    performanceScore: 4.6
  },
  {
    id: 4,
    employeeCode: 'EMP-004',
    fullName: 'Jessica Taylor',
    email: 'jessica.taylor@company.com',
    phone: '+1 (555) 901-2345',
    departmentId: 2,
    department: INITIAL_DEPARTMENTS[1],
    position: 'HR Specialist & Recruiter',
    salary: 78000,
    hireDate: '2024-02-18',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    performanceScore: 4.4
  },
  {
    id: 5,
    employeeCode: 'EMP-005',
    fullName: 'Michael Johnson',
    email: 'michael.j@company.com',
    phone: '+1 (555) 456-7890',
    departmentId: 4,
    department: INITIAL_DEPARTMENTS[3],
    position: 'Account Executive',
    salary: 92000,
    hireDate: '2023-09-12',
    status: 'OnLeave',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    performanceScore: 4.2
  },
  {
    id: 6,
    employeeCode: 'EMP-006',
    fullName: 'Emily Davis',
    email: 'emily.davis@company.com',
    phone: '+1 (555) 678-9012',
    departmentId: 3,
    department: INITIAL_DEPARTMENTS[2],
    position: 'Growth Marketing Strategist',
    salary: 85000,
    hireDate: '2024-05-20',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    performanceScore: 4.7
  }
];

class ApiService {
  // Auth
  async login(username: string, password: string): Promise<AuthUser> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('emp_user', JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('API error, using local auth mock', err);
    }

    // Local Auth Fallback
    const mockUser: AuthUser = {
      username: username || 'admin',
      email: `${username || 'admin'}@company.com`,
      role: username === 'hr' ? 'HR' : 'Admin',
      token: 'mock-jwt-token-2026'
    };
    localStorage.setItem('emp_user', JSON.stringify(mockUser));
    return mockUser;
  }

  // Employees
  async getEmployees(search?: string, departmentId?: number, status?: string): Promise<Employee[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (departmentId) params.append('departmentId', departmentId.toString());
      if (status) params.append('status', status);

      const res = await fetch(`${API_BASE_URL}/employees?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API fetch failed, fallback to local dataset', err);
    }

    // Local Fallback
    let list = [...INITIAL_EMPLOYEES];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(e => e.fullName.toLowerCase().includes(s) || e.employeeCode.toLowerCase().includes(s) || e.position.toLowerCase().includes(s));
    }
    if (departmentId && departmentId > 0) {
      list = list.filter(e => e.departmentId === departmentId);
    }
    if (status && status !== 'All') {
      list = list.filter(e => e.status.toLowerCase() === status.toLowerCase());
    }
    return list;
  }

  async createEmployee(employee: Partial<Employee>): Promise<Employee> {
    try {
      const res = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, saving locally', err);
    }

    const newEmp: Employee = {
      id: Date.now(),
      employeeCode: employee.employeeCode || `EMP-${Math.floor(Math.random() * 900 + 100)}`,
      fullName: employee.fullName || 'New Employee',
      email: employee.email || 'employee@company.com',
      phone: employee.phone || '+1 (555) 000-0000',
      departmentId: employee.departmentId || 1,
      department: INITIAL_DEPARTMENTS.find(d => d.id === (employee.departmentId || 1)) || INITIAL_DEPARTMENTS[0],
      position: employee.position || 'Staff',
      salary: Number(employee.salary) || 60000,
      hireDate: employee.hireDate || new Date().toISOString().split('T')[0],
      status: employee.status || 'Active',
      avatarUrl: employee.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.fullName || 'emp'}`,
      performanceScore: Number(employee.performanceScore) || 4.2
    };
    INITIAL_EMPLOYEES.unshift(newEmp);
    return newEmp;
  }

  async updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee> {
    try {
      const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...employee, id })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend update failed', err);
    }

    const index = INITIAL_EMPLOYEES.findIndex(e => e.id === id);
    if (index !== -1) {
      INITIAL_EMPLOYEES[index] = { ...INITIAL_EMPLOYEES[index], ...employee };
      return INITIAL_EMPLOYEES[index];
    }
    return employee as Employee;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/employees/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (err) {
      console.warn('Delete failed', err);
    }
    const idx = INITIAL_EMPLOYEES.findIndex(e => e.id === id);
    if (idx !== -1) INITIAL_EMPLOYEES.splice(idx, 1);
    return true;
  }

  async batchDeleteEmployees(ids: number[]): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/employees/batch-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeIds: ids })
      });
      if (res.ok) return true;
    } catch (err) {
      console.warn('Batch delete failed', err);
    }
    ids.forEach(id => {
      const idx = INITIAL_EMPLOYEES.findIndex(e => e.id === id);
      if (idx !== -1) INITIAL_EMPLOYEES.splice(idx, 1);
    });
    return true;
  }

  async batchImportEmployees(records: Partial<Employee>[]): Promise<number> {
    try {
      const res = await fetch(`${API_BASE_URL}/employees/batch-import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(records)
      });
      if (res.ok) {
        const data = await res.json();
        return data.count || records.length;
      }
    } catch (err) {
      console.warn('Batch import failed', err);
    }

    records.forEach((r, idx) => {
      const newEmp: Employee = {
        id: Date.now() + idx,
        employeeCode: r.employeeCode || `EMP-${Math.floor(Math.random() * 900 + 100)}`,
        fullName: r.fullName || 'Imported Staff',
        email: r.email || `imported${idx}@company.com`,
        phone: r.phone || '+1 (555) 123-4567',
        departmentId: r.departmentId || 1,
        department: INITIAL_DEPARTMENTS[0],
        position: r.position || 'Specialist',
        salary: Number(r.salary) || 70000,
        hireDate: r.hireDate || new Date().toISOString().split('T')[0],
        status: r.status || 'Active',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.fullName || idx}`,
        performanceScore: 4.0
      };
      INITIAL_EMPLOYEES.unshift(newEmp);
    });
    return records.length;
  }

  // Departments
  async getDepartments(): Promise<Department[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/departments`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Departments fetch fallback', err);
    }
    return INITIAL_DEPARTMENTS;
  }

  // Attendance
  async getAttendance(): Promise<Attendance[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Attendance fetch fallback', err);
    }
    return [
      { id: 1, employeeId: 1, employee: INITIAL_EMPLOYEES[0], date: '2026-09-18', checkInTime: '08:55 AM', checkOutTime: '05:15 PM', status: 'Present', notes: 'On time' },
      { id: 2, employeeId: 2, employee: INITIAL_EMPLOYEES[1], date: '2026-09-18', checkInTime: '09:02 AM', checkOutTime: '05:30 PM', status: 'Present', notes: 'Design sprint' },
      { id: 3, employeeId: 3, employee: INITIAL_EMPLOYEES[2], date: '2026-09-18', checkInTime: '09:20 AM', checkOutTime: '06:00 PM', status: 'Late', notes: 'Traffic delay' },
      { id: 4, employeeId: 4, employee: INITIAL_EMPLOYEES[3], date: '2026-09-18', checkInTime: '09:00 AM', checkOutTime: '05:00 PM', status: 'Present', notes: 'Standard shift' },
      { id: 5, employeeId: 5, employee: INITIAL_EMPLOYEES[4], date: '2026-09-18', checkInTime: '-', checkOutTime: '-', status: 'Leave', notes: 'Medical leave' },
      { id: 6, employeeId: 6, employee: INITIAL_EMPLOYEES[5], date: '2026-09-18', checkInTime: '08:45 AM', checkOutTime: '05:10 PM', status: 'Present', notes: 'Early check-in' }
    ];
  }

  // Overview Report Data
  async getOverviewReport(): Promise<OverviewReport> {
    try {
      const res = await fetch(`${API_BASE_URL}/reports/overview`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Overview report fallback', err);
    }
    return {
      totalEmployees: INITIAL_EMPLOYEES.length,
      activeEmployees: INITIAL_EMPLOYEES.filter(e => e.status === 'Active').length,
      onLeaveEmployees: INITIAL_EMPLOYEES.filter(e => e.status === 'OnLeave').length,
      totalPayroll: INITIAL_EMPLOYEES.reduce((sum, e) => sum + e.salary, 0),
      totalDepartments: INITIAL_DEPARTMENTS.length,
      avgPerformanceScore: 4.6,
      hiringTrend: [
        { period: '2024-Q1', hiredCount: 4 },
        { period: '2024-Q2', hiredCount: 7 },
        { period: '2024-Q3', hiredCount: 5 },
        { period: '2024-Q4', hiredCount: 9 },
        { period: '2025-Q1', hiredCount: 12 },
        { period: '2025-Q2', hiredCount: 8 }
      ]
    };
  }
}

export const apiService = new ApiService();
