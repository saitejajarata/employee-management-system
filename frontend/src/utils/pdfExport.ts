import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Employee, Department, Attendance } from '../types';

export const exportEmployeeDirectoryPDF = (employees: Employee[], title = 'Employee Directory Report') => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, 297, 24, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()} | Total Records: ${employees.length}`, 190, 15);

  const tableHeaders = [['Emp ID', 'Full Name', 'Email', 'Position', 'Department', 'Status', 'Salary', 'Hire Date', 'Rating']];
  const tableData = employees.map(emp => [
    emp.employeeCode,
    emp.fullName,
    emp.email,
    emp.position,
    emp.department?.name || 'General',
    emp.status,
    `$${emp.salary.toLocaleString()}`,
    emp.hireDate,
    `${emp.performanceScore.toFixed(1)} / 5.0`
  ]);

  autoTable(doc, {
    startY: 30,
    head: tableHeaders,
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    }
  });

  doc.save(`Employee_Directory_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportDepartmentsPDF = (departments: Department[]) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('DEPARTMENT GROWTH & BUDGET REPORT', 14, 14);

  const tableHeaders = [['Code', 'Department Name', 'Manager', 'Headcount', 'Allocated Budget', 'Est. Payroll Expense']];
  const tableData = departments.map(d => [
    d.code,
    d.name,
    d.managerName,
    (d.employeeCount || 0).toString(),
    `$${d.budget.toLocaleString()}`,
    `$${(d.totalSalaryExpense || 0).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 28,
    head: tableHeaders,
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] }
  });

  doc.save(`Department_Growth_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportAttendancePDF = (attendance: Attendance[]) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 297, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('ATTENDANCE & PUNCTUALITY PATTERN REPORT', 14, 14);

  const tableHeaders = [['Date', 'Emp Code', 'Employee Name', 'Check-In', 'Check-Out', 'Status', 'Notes']];
  const tableData = attendance.map(a => [
    a.date,
    a.employee?.employeeCode || `EMP-${a.employeeId}`,
    a.employee?.fullName || 'Staff Member',
    a.checkInTime,
    a.checkOutTime,
    a.status,
    a.notes || '-'
  ]);

  autoTable(doc, {
    startY: 28,
    head: tableHeaders,
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] }
  });

  doc.save(`Attendance_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportPerformanceScorecardPDF = (employee: Employee) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('EMPLOYEE PERFORMANCE SCORECARD', 14, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Official Annual Review | ${new Date().getFullYear()}`, 14, 26);

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 42, 182, 45, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(employee.fullName, 20, 52);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Employee Code: ${employee.employeeCode}`, 20, 60);
  doc.text(`Department: ${employee.department?.name || 'Engineering'}`, 20, 67);
  doc.text(`Position: ${employee.position}`, 20, 74);

  doc.text(`Status: ${employee.status}`, 120, 60);
  doc.text(`Hire Date: ${employee.hireDate}`, 120, 67);
  doc.text(`Annual Base Salary: $${employee.salary.toLocaleString()}`, 120, 74);

  doc.setFillColor(238, 242, 255);
  doc.roundedRect(14, 95, 182, 35, 3, 3, 'F');

  doc.setTextColor(79, 70, 229);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('OVERALL RATING', 24, 110);
  doc.setFontSize(26);
  doc.text(`${employee.performanceScore.toFixed(1)} / 5.0`, 24, 122);

  const headers = [['Evaluation Criteria', 'Score (1-5)', 'Assessment Notes']];
  const data = [
    ['Technical Competency & Craft', `${(employee.performanceScore).toFixed(1)}`, 'Demonstrates high domain mastery.'],
    ['Project Delivery & Timelines', `${(employee.performanceScore - 0.1).toFixed(1)}`, 'Consistently meets milestone goals.'],
    ['Teamwork & Communication', `${(employee.performanceScore + 0.1 > 5 ? 5 : employee.performanceScore + 0.1).toFixed(1)}`, 'Proactive cross-team collaboration.'],
    ['Leadership & Mentorship', `${(employee.performanceScore - 0.2).toFixed(1)}`, 'Strong peer support and code quality.']
  ];

  autoTable(doc, {
    startY: 138,
    head: headers,
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59] }
  });

  doc.save(`Performance_Scorecard_${employee.employeeCode}.pdf`);
};
