using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<IActionResult> GetEmployees([FromQuery] string? search, [FromQuery] int? departmentId, [FromQuery] string? status)
        {
            var query = _context.Employees.Include(e => e.Department).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(e => e.FullName.ToLower().Contains(term) ||
                                         e.EmployeeCode.ToLower().Contains(term) ||
                                         e.Email.ToLower().Contains(term) ||
                                         e.Position.ToLower().Contains(term));
            }

            if (departmentId.HasValue && departmentId.Value > 0)
            {
                query = query.Where(e => e.DepartmentId == departmentId.Value);
            }

            if (!string.IsNullOrWhiteSpace(status) && status != "All")
            {
                query = query.Where(e => e.Status.ToLower() == status.ToLower());
            }

            var employees = await query.OrderByDescending(e => e.Id).ToListAsync();
            return Ok(employees);
        }

        // GET: api/employees/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.Department)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (employee == null) return NotFound(new { message = "Employee not found" });
            return Ok(employee);
        }

        // POST: api/employees
        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] EmployeeCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var departmentExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId);
            if (!departmentExists) return BadRequest(new { message = "Invalid Department ID" });

            // Generate employee code if empty
            var code = string.IsNullOrWhiteSpace(dto.EmployeeCode) 
                ? $"EMP-{(await _context.Employees.CountAsync() + 1):D3}" 
                : dto.EmployeeCode;

            var employee = new Employee
            {
                EmployeeCode = code,
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                DepartmentId = dto.DepartmentId,
                Position = dto.Position,
                Salary = dto.Salary,
                HireDate = dto.HireDate == default ? DateTime.Today : dto.HireDate,
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status,
                AvatarUrl = string.IsNullOrWhiteSpace(dto.AvatarUrl) 
                    ? $"https://api.dicebear.com/7.x/avataaars/svg?seed={Uri.EscapeDataString(dto.FullName)}" 
                    : dto.AvatarUrl,
                PerformanceScore = dto.PerformanceScore > 0 ? dto.PerformanceScore : 4.2
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            // Load Department info
            await _context.Entry(employee).Reference(e => e.Department).LoadAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        // PUT: api/employees/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest(new { message = "ID mismatch" });

            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound(new { message = "Employee not found" });

            employee.FullName = dto.FullName;
            employee.Email = dto.Email;
            employee.Phone = dto.Phone;
            employee.DepartmentId = dto.DepartmentId;
            employee.Position = dto.Position;
            employee.Salary = dto.Salary;
            employee.HireDate = dto.HireDate;
            employee.Status = dto.Status;
            if (!string.IsNullOrWhiteSpace(dto.AvatarUrl)) employee.AvatarUrl = dto.AvatarUrl;
            if (dto.PerformanceScore > 0) employee.PerformanceScore = dto.PerformanceScore;

            await _context.SaveChangesAsync();
            await _context.Entry(employee).Reference(e => e.Department).LoadAsync();

            return Ok(employee);
        }

        // DELETE: api/employees/5 (Single Delete)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound(new { message = "Employee not found" });

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Employee deleted successfully", id });
        }

        // POST: api/employees/batch-delete (Multiple Delete)
        [HttpPost("batch-delete")]
        public async Task<IActionResult> BatchDelete([FromBody] BatchDeleteRequest request)
        {
            if (request.EmployeeIds == null || !request.EmployeeIds.Any())
            {
                return BadRequest(new { message = "No employee IDs provided for batch deletion" });
            }

            var employees = await _context.Employees.Where(e => request.EmployeeIds.Contains(e.Id)).ToListAsync();
            if (!employees.Any())
            {
                return NotFound(new { message = "No matching employees found" });
            }

            _context.Employees.RemoveRange(employees);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Successfully deleted {employees.Count} employee records", deletedCount = employees.Count });
        }

        // POST: api/employees/batch-import (Bulk Import from CSV/Excel data)
        [HttpPost("batch-import")]
        public async Task<IActionResult> BatchImport([FromBody] List<EmployeeCreateDto> dtoList)
        {
            if (dtoList == null || !dtoList.Any())
            {
                return BadRequest(new { message = "No employee data supplied" });
            }

            var defaultDept = await _context.Departments.FirstOrDefaultAsync();
            int defaultDeptId = defaultDept?.Id ?? 1;
            int count = await _context.Employees.CountAsync();

            var newEmployees = new List<Employee>();
            foreach (var dto in dtoList)
            {
                count++;
                var deptId = dto.DepartmentId > 0 && await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId)
                    ? dto.DepartmentId
                    : defaultDeptId;

                newEmployees.Add(new Employee
                {
                    EmployeeCode = string.IsNullOrWhiteSpace(dto.EmployeeCode) ? $"EMP-{count:D3}" : dto.EmployeeCode,
                    FullName = dto.FullName,
                    Email = dto.Email,
                    Phone = string.IsNullOrWhiteSpace(dto.Phone) ? "+1 (555) 000-0000" : dto.Phone,
                    DepartmentId = deptId,
                    Position = string.IsNullOrWhiteSpace(dto.Position) ? "Staff Member" : dto.Position,
                    Salary = dto.Salary > 0 ? dto.Salary : 65000,
                    HireDate = dto.HireDate == default ? DateTime.Today : dto.HireDate,
                    Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status,
                    AvatarUrl = $"https://api.dicebear.com/7.x/avataaars/svg?seed={Uri.EscapeDataString(dto.FullName)}",
                    PerformanceScore = 4.0
                });
            }

            await _context.Employees.AddRangeAsync(newEmployees);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Successfully imported {newEmployees.Count} employees", count = newEmployees.Count });
        }
    }
}
