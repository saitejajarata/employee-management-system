using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DepartmentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            var list = await _context.Departments
                .Select(d => new DepartmentSummaryDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Code = d.Code,
                    Budget = d.Budget,
                    ManagerName = d.ManagerName,
                    EmployeeCount = _context.Employees.Count(e => e.DepartmentId == d.Id),
                    TotalSalaryExpense = _context.Employees.Where(e => e.DepartmentId == d.Id).Sum(e => e.Salary)
                })
                .ToListAsync();

            return Ok(list);
        }

        [HttpGet("growth-metrics")]
        public async Task<IActionResult> GetGrowthMetrics()
        {
            var departmentMetrics = await _context.Departments
                .Select(d => new
                {
                    d.Id,
                    d.Name,
                    d.Code,
                    Headcount = _context.Employees.Count(e => e.DepartmentId == d.Id),
                    Budget = d.Budget,
                    SalaryExpense = _context.Employees.Where(e => e.DepartmentId == d.Id).Sum(e => e.Salary),
                    AvgPerformance = _context.Employees.Where(e => e.DepartmentId == d.Id).Average(e => (double?)e.PerformanceScore) ?? 4.0
                })
                .ToListAsync();

            return Ok(departmentMetrics);
        }
    }
}
