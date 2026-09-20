using System;
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
    public class PerformanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PerformanceController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetReviews([FromQuery] int? employeeId)
        {
            var query = _context.PerformanceReviews.Include(p => p.Employee).AsQueryable();

            if (employeeId.HasValue && employeeId.Value > 0)
            {
                query = query.Where(p => p.EmployeeId == employeeId.Value);
            }

            var reviews = await query.OrderByDescending(p => p.ReviewDate).ToListAsync();
            return Ok(reviews);
        }

        [HttpPost]
        public async Task<IActionResult> AddReview([FromBody] PerformanceCreateDto dto)
        {
            var review = new PerformanceReview
            {
                EmployeeId = dto.EmployeeId,
                ReviewDate = dto.ReviewDate == default ? DateTime.Today : dto.ReviewDate,
                Rating = dto.Rating,
                GoalsAchieved = dto.GoalsAchieved,
                Comments = dto.Comments,
                ReviewerName = string.IsNullOrWhiteSpace(dto.ReviewerName) ? "HR Manager" : dto.ReviewerName
            };

            _context.PerformanceReviews.Add(review);

            // Also update employee's performance score
            var employee = await _context.Employees.FindAsync(dto.EmployeeId);
            if (employee != null)
            {
                employee.PerformanceScore = dto.Rating;
            }

            await _context.SaveChangesAsync();
            return Ok(review);
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetPerformanceSummary()
        {
            var avgRating = await _context.Employees.AverageAsync(e => (double?)e.PerformanceScore) ?? 4.0;
            var topPerformers = await _context.Employees
                .Include(e => e.Department)
                .Where(e => e.PerformanceScore >= 4.5)
                .OrderByDescending(e => e.PerformanceScore)
                .Take(5)
                .ToListAsync();

            var distribution = new[]
            {
                new { Range = "4.5 - 5.0 (Exceeds)", Count = await _context.Employees.CountAsync(e => e.PerformanceScore >= 4.5) },
                new { Range = "4.0 - 4.4 (Meets)", Count = await _context.Employees.CountAsync(e => e.PerformanceScore >= 4.0 && e.PerformanceScore < 4.5) },
                new { Range = "3.0 - 3.9 (Needs Improvement)", Count = await _context.Employees.CountAsync(e => e.PerformanceScore >= 3.0 && e.PerformanceScore < 4.0) },
                new { Range = "< 3.0 (Unsatisfactory)", Count = await _context.Employees.CountAsync(e => e.PerformanceScore < 3.0) }
            };

            return Ok(new
            {
                AverageCompanyScore = Math.Round(avgRating, 2),
                TopPerformers = topPerformers,
                Distribution = distribution
            });
        }
    }
}
