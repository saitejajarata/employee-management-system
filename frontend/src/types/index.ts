export interface Department {
  id: number;
  name: string;
  code: string;
  budget: number;
  managerName: string;
  employeeCount?: number;
  totalSalaryExpense?: number;
}

export interface Employee {
  id: number;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: number;
  department?: Department;
  position: string;
  salary: number;
  hireDate: string;
  status: 'Active' | 'OnLeave' | 'Terminated' | string;
  avatarUrl: string;
  performanceScore: number;
}

export interface Attendance {
  id: number;
  employeeId: number;
  employee?: Employee;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: 'Present' | 'Late' | 'Absent' | 'Leave' | string;
  notes: string;
}

export interface PerformanceReview {
  id: number;
  employeeId: number;
  employee?: Employee;
  reviewDate: string;
  rating: number;
  goalsAchieved: string;
  comments: string;
  reviewerName: string;
}

export interface AuthUser {
  username: string;
  email: string;
  role: string;
  token: string;
}

export interface OverviewReport {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  totalPayroll: number;
  totalDepartments: number;
  avgPerformanceScore: number;
  hiringTrend: { period: string; hiredCount: number }[];
}
