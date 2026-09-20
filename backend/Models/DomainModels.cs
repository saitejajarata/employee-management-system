using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Admin"; // Admin, HR, Manager
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Department
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public decimal Budget { get; set; }
        public string ManagerName { get; set; } = string.Empty;
    }

    public class Employee
    {
        public int Id { get; set; }
        [Required]
        public string EmployeeCode { get; set; } = string.Empty;
        [Required]
        public string FullName { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public Department? Department { get; set; }
        public string Position { get; set; } = string.Empty;
        public decimal Salary { get; set; }
        public DateTime HireDate { get; set; }
        public string Status { get; set; } = "Active"; // Active, OnLeave, Terminated
        public string AvatarUrl { get; set; } = string.Empty;
        public double PerformanceScore { get; set; } = 4.5;
    }

    public class Attendance
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        public DateTime Date { get; set; }
        public string CheckInTime { get; set; } = "09:00 AM";
        public string CheckOutTime { get; set; } = "05:00 PM";
        public string Status { get; set; } = "Present"; // Present, Absent, Late, Leave
        public string Notes { get; set; } = string.Empty;
    }

    public class PerformanceReview
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        public DateTime ReviewDate { get; set; }
        public double Rating { get; set; } // 1.0 - 5.0
        public string GoalsAchieved { get; set; } = string.Empty;
        public string Comments { get; set; } = string.Empty;
        public string ReviewerName { get; set; } = "HR Admin";
    }
}
