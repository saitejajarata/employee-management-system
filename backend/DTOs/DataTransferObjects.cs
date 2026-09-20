using System;
using System.Collections.Generic;

namespace Backend.DTOs
{
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class EmployeeCreateDto
    {
        public string EmployeeCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string Position { get; set; } = string.Empty;
        public decimal Salary { get; set; }
        public DateTime HireDate { get; set; }
        public string Status { get; set; } = "Active";
        public string AvatarUrl { get; set; } = string.Empty;
        public double PerformanceScore { get; set; } = 4.0;
    }

    public class EmployeeUpdateDto : EmployeeCreateDto
    {
        public int Id { get; set; }
    }

    public class BatchDeleteRequest
    {
        public List<int> EmployeeIds { get; set; } = new List<int>();
    }

    public class AttendanceCreateDto
    {
        public int EmployeeId { get; set; }
        public DateTime Date { get; set; }
        public string CheckInTime { get; set; } = "09:00 AM";
        public string CheckOutTime { get; set; } = "05:00 PM";
        public string Status { get; set; } = "Present";
        public string Notes { get; set; } = string.Empty;
    }

    public class PerformanceCreateDto
    {
        public int EmployeeId { get; set; }
        public DateTime ReviewDate { get; set; }
        public double Rating { get; set; }
        public string GoalsAchieved { get; set; } = string.Empty;
        public string Comments { get; set; } = string.Empty;
        public string ReviewerName { get; set; } = "HR Admin";
    }

    public class DepartmentSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public decimal Budget { get; set; }
        public string ManagerName { get; set; } = string.Empty;
        public int EmployeeCount { get; set; }
        public decimal TotalSalaryExpense { get; set; }
    }
}
