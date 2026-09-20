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
            var depts = await _context.Departments.ToListAsync();
            var emps = await _context.Employees.ToListAsync();

            var list = depts.Select(d => new DepartmentSummaryDto
            {
                Id = d.Id,
                Name = d.Name,
                Code = d.Code,
                Budget = d.Budget,
                ManagerName = d.ManagerName,
                EmployeeCount = emps.Count(e => e.DepartmentId == d.Id),
                TotalSalaryExpense = emps.Where(e => e.DepartmentId == d.Id).Sum(e => e.Salary)
            }).ToList();

            return Ok(list);
        }

        [HttpGet("growth-metrics")]
        public async Task<IActionResult> GetGrowthMetrics()
        {
            var depts = await _context.Departments.ToListAsync();
            var emps = await _context.Employees.ToListAsync();

            var departmentMetrics = depts.Select(d =>
            {
                var deptEmps = emps.Where(e => e.DepartmentId == d.Id).ToList();
                return new
                {
                    d.Id,
                    d.Name,
                    d.Code,
                    Headcount = deptEmps.Count,
                    Budget = d.Budget,
                    SalaryExpense = deptEmps.Sum(e => e.Salary),
                    AvgPerformance = deptEmps.Any() ? deptEmps.Average(e => e.PerformanceScore) : 4.0
                };
            }).ToList();

            return Ok(departmentMetrics);
        }
    }
}
