using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverviewReport()
        {
            var totalEmployees = await _context.Employees.CountAsync();
            var activeEmployees = await _context.Employees.CountAsync(e => e.Status == "Active");
            var onLeaveEmployees = await _context.Employees.CountAsync(e => e.Status == "OnLeave");
            var salaries = await _context.Employees.Select(e => e.Salary).ToListAsync();
            var totalPayroll = salaries.Sum();
            var totalDepartments = await _context.Departments.CountAsync();
            var avgPerformance = await _context.Employees.AverageAsync(e => (double?)e.PerformanceScore) ?? 4.0;

            var hiringTrend = await _context.Employees
                .GroupBy(e => new { e.HireDate.Year, e.HireDate.Month })
                .Select(g => new
                {
                    Period = $"{g.Key.Year}-{g.Key.Month:D2}",
                    HiredCount = g.Count()
                })
                .OrderBy(x => x.Period)
                .ToListAsync();

            return Ok(new
            {
                TotalEmployees = totalEmployees,
                ActiveEmployees = activeEmployees,
                OnLeaveEmployees = onLeaveEmployees,
                TotalPayroll = totalPayroll,
                TotalDepartments = totalDepartments,
                AvgPerformanceScore = Math.Round(avgPerformance, 2),
                HiringTrend = hiringTrend
            });
        }
    }
}
