import * as XLSX from 'xlsx';
import type { Employee, Department, Attendance } from '../types';

export const exportEmployeeDirectoryExcel = (employees: Employee[]) => {
  const data = employees.map(emp => ({
    'Employee Code': emp.employeeCode,
    'Full Name': emp.fullName,
    'Email Address': emp.email,
    'Phone Number': emp.phone,
    'Department': emp.department?.name || 'General',
    'Position': emp.position,
    'Annual Salary ($)': emp.salary,
    'Hire Date': emp.hireDate,
    'Status': emp.status,
    'Performance Score': emp.performanceScore
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

  XLSX.writeFile(workbook, `Employee_Directory_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportDepartmentsExcel = (departments: Department[]) => {
  const data = departments.map(d => ({
    'Department Code': d.code,
    'Department Name': d.name,
    'Manager': d.managerName,
    'Headcount': d.employeeCount || 0,
    'Allocated Budget ($)': d.budget,
    'Total Salary Expense ($)': d.totalSalaryExpense || 0
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Department Growth');

  XLSX.writeFile(workbook, `Department_Growth_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportAttendanceExcel = (attendance: Attendance[]) => {
  const data = attendance.map(a => ({
    'Date': a.date,
    'Employee Code': a.employee?.employeeCode || `EMP-${a.employeeId}`,
    'Full Name': a.employee?.fullName || 'Staff Member',
    'Check-In': a.checkInTime,
    'Check-Out': a.checkOutTime,
    'Status': a.status,
    'Notes': a.notes
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Records');

  XLSX.writeFile(workbook, `Attendance_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const parseExcelOrCSVFile = (file: File): Promise<Partial<Employee>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        const parsed: Partial<Employee>[] = rawJson.map(row => ({
          employeeCode: row['Employee Code'] || row['Code'] || row['empCode'] || '',
          fullName: row['Full Name'] || row['Name'] || row['fullName'] || 'Imported Staff',
          email: row['Email Address'] || row['Email'] || row['email'] || '',
          phone: row['Phone Number'] || row['Phone'] || row['phone'] || '',
          position: row['Position'] || row['Title'] || row['position'] || 'Staff',
          salary: Number(row['Annual Salary ($)'] || row['Salary'] || row['salary']) || 65000,
          hireDate: row['Hire Date'] || row['hireDate'] || new Date().toISOString().split('T')[0],
          status: row['Status'] || row['status'] || 'Active',
          departmentId: 1
        }));

        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
};
