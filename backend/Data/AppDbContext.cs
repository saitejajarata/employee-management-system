using System;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Department> Departments { get; set; } = null!;
        public DbSet<Employee> Employees { get; set; } = null!;
        public DbSet<Attendance> Attendances { get; set; } = null!;
        public DbSet<PerformanceReview> PerformanceReviews { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Relationships
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Department)
                .WithMany()
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Employee)
                .WithMany()
                .HasForeignKey(a => a.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PerformanceReview>()
                .HasOne(p => p.Employee)
                .WithMany()
                .HasForeignKey(p => p.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed Initial Data
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@company.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "Admin",
                    CreatedAt = new DateTime(2025, 1, 1)
                },
                new User
                {
                    Id = 2,
                    Username = "hr_manager",
                    Email = "hr@company.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("hr123"),
                    Role = "HR",
                    CreatedAt = new DateTime(2025, 1, 5)
                }
            );

            modelBuilder.Entity<Department>().HasData(
                new Department { Id = 1, Name = "Engineering", Code = "ENG", Budget = 450000, ManagerName = "Sarah Jenkins" },
                new Department { Id = 2, Name = "Human Resources", Code = "HR", Budget = 180000, ManagerName = "David Miller" },
                new Department { Id = 3, Name = "Marketing", Code = "MKT", Budget = 250000, ManagerName = "Elena Rostova" },
                new Department { Id = 4, Name = "Sales", Code = "SLS", Budget = 320000, ManagerName = "Marcus Vance" },
                new Department { Id = 5, Name = "Product & Design", Code = "DES", Budget = 280000, ManagerName = "Sophia Chen" }
            );

            modelBuilder.Entity<Employee>().HasData(
                new Employee
                {
                    Id = 1,
                    EmployeeCode = "EMP-001",
                    FullName = "Alex Rivera",
                    Email = "alex.rivera@company.com",
                    Phone = "+1 (555) 234-5678",
                    DepartmentId = 1,
                    Position = "Senior Full-Stack Engineer",
                    Salary = 125000,
                    HireDate = new DateTime(2022, 3, 15),
                    Status = "Active",
                    AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
                    PerformanceScore = 4.8
                },
                new Employee
                {
                    Id = 2,
                    EmployeeCode = "EMP-002",
                    FullName = "Samantha Wu",
                    Email = "samantha.wu@company.com",
                    Phone = "+1 (555) 876-5432",
                    DepartmentId = 5,
                    Position = "Lead UX Designer",
                    Salary = 110000,
                    HireDate = new DateTime(2023, 1, 10),
                    Status = "Active",
                    AvatarUrl = "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300",
                    PerformanceScore = 4.9
                },
                new Employee
                {
                    Id = 3,
                    EmployeeCode = "EMP-003",
                    FullName = "David Kim",
                    Email = "david.kim@company.com",
                    Phone = "+1 (555) 345-6789",
                    DepartmentId = 1,
                    Position = "DevOps Specialist",
                    Salary = 115000,
                    HireDate = new DateTime(2023, 6, 1),
                    Status = "Active",
                    AvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
                    PerformanceScore = 4.6
                },
                new Employee
                {
                    Id = 4,
                    EmployeeCode = "EMP-004",
                    FullName = "Jessica Taylor",
                    Email = "jessica.taylor@company.com",
                    Phone = "+1 (555) 901-2345",
                    DepartmentId = 2,
                    Position = "HR Specialist & Recruiter",
                    Salary = 78000,
                    HireDate = new DateTime(2024, 2, 18),
                    Status = "Active",
                    AvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
                    PerformanceScore = 4.4
                },
                new Employee
                {
                    Id = 5,
                    EmployeeCode = "EMP-005",
                    FullName = "Michael Johnson",
                    Email = "michael.j@company.com",
                    Phone = "+1 (555) 456-7890",
                    DepartmentId = 4,
                    Position = "Account Executive",
                    Salary = 92000,
                    HireDate = new DateTime(2023, 9, 12),
                    Status = "OnLeave",
                    AvatarUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
                    PerformanceScore = 4.2
                },
                new Employee
                {
                    Id = 6,
                    EmployeeCode = "EMP-006",
                    FullName = "Emily Davis",
                    Email = "emily.davis@company.com",
                    Phone = "+1 (555) 678-9012",
                    DepartmentId = 3,
                    Position = "Growth Marketing Strategist",
                    Salary = 85000,
                    HireDate = new DateTime(2024, 5, 20),
                    Status = "Active",
                    AvatarUrl = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
                    PerformanceScore = 4.7
                }
            );

            modelBuilder.Entity<Attendance>().HasData(
                new Attendance { Id = 1, EmployeeId = 1, Date = DateTime.Today.AddDays(-2), CheckInTime = "08:55 AM", CheckOutTime = "05:15 PM", Status = "Present", Notes = "On time" },
                new Attendance { Id = 2, EmployeeId = 2, Date = DateTime.Today.AddDays(-2), CheckInTime = "09:02 AM", CheckOutTime = "05:30 PM", Status = "Present", Notes = "Design sprint workshop" },
                new Attendance { Id = 3, EmployeeId = 3, Date = DateTime.Today.AddDays(-2), CheckInTime = "09:20 AM", CheckOutTime = "06:00 PM", Status = "Late", Notes = "Traffic delay" },
                new Attendance { Id = 4, EmployeeId = 4, Date = DateTime.Today.AddDays(-2), CheckInTime = "09:00 AM", CheckOutTime = "05:00 PM", Status = "Present", Notes = "Standard hours" },
                new Attendance { Id = 5, EmployeeId = 5, Date = DateTime.Today.AddDays(-2), CheckInTime = "-", CheckOutTime = "-", Status = "Leave", Notes = "Medical leave" },
                new Attendance { Id = 6, EmployeeId = 6, Date = DateTime.Today.AddDays(-2), CheckInTime = "08:45 AM", CheckOutTime = "05:10 PM", Status = "Present", Notes = "Early check-in" },
                new Attendance { Id = 7, EmployeeId = 1, Date = DateTime.Today.AddDays(-1), CheckInTime = "09:00 AM", CheckOutTime = "05:00 PM", Status = "Present", Notes = "Normal shift" },
                new Attendance { Id = 8, EmployeeId = 2, Date = DateTime.Today.AddDays(-1), CheckInTime = "08:50 AM", CheckOutTime = "05:05 PM", Status = "Present", Notes = "On time" }
            );

            modelBuilder.Entity<PerformanceReview>().HasData(
                new PerformanceReview
                {
                    Id = 1,
                    EmployeeId = 1,
                    ReviewDate = new DateTime(2025, 6, 15),
                    Rating = 4.8,
                    GoalsAchieved = "Delivered microservices migration 2 weeks ahead of schedule; mentored 2 junior developers.",
                    Comments = "Outstanding technical leadership and code quality.",
                    ReviewerName = "Sarah Jenkins"
                },
                new PerformanceReview
                {
                    Id = 2,
                    EmployeeId = 2,
                    ReviewDate = new DateTime(2025, 6, 20),
                    Rating = 4.9,
                    GoalsAchieved = "Redesigned core SaaS dashboard leading to 35% increase in user retention.",
                    Comments = "Exceptional user research and UI craft.",
                    ReviewerName = "Sophia Chen"
                },
                new PerformanceReview
                {
                    Id = 3,
                    EmployeeId = 3,
                    ReviewDate = new DateTime(2025, 7, 10),
                    Rating = 4.6,
                    GoalsAchieved = "Achieved 99.99% system uptime; reduced CI/CD deployment pipeline times by 45%.",
                    Comments = "Strong reliability and proactive system monitoring.",
                    ReviewerName = "Sarah Jenkins"
                }
            );
        }
    }
}
