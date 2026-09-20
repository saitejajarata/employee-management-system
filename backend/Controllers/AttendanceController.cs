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
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendanceController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAttendanceRecords([FromQuery] DateTime? date, [FromQuery] int? employeeId)
        {
            var query = _context.Attendances.Include(a => a.Employee).AsQueryable();

            if (date.HasValue)
            {
                query = query.Where(a => a.Date.Date == date.Value.Date);
            }

            if (employeeId.HasValue && employeeId.Value > 0)
            {
                query = query.Where(a => a.EmployeeId == employeeId.Value);
            }

            var records = await query.OrderByDescending(a => a.Date).ThenBy(a => a.EmployeeId).ToListAsync();
            return Ok(records);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAttendanceRecord([FromBody] AttendanceCreateDto dto)
        {
            var record = new Attendance
            {
                EmployeeId = dto.EmployeeId,
                Date = dto.Date == default ? DateTime.Today : dto.Date,
                CheckInTime = dto.CheckInTime,
                CheckOutTime = dto.CheckOutTime,
                Status = dto.Status,
                Notes = dto.Notes
            };

            _context.Attendances.Add(record);
            await _context.SaveChangesAsync();

            return Ok(record);
        }

        [HttpGet("patterns")]
        public async Task<IActionResult> GetAttendancePatterns()
        {
            var total = await _context.Attendances.CountAsync();
            if (total == 0)
            {
                total = 1; // prevent divide by zero
            }

            var presentCount = await _context.Attendances.CountAsync(a => a.Status == "Present");
            var lateCount = await _context.Attendances.CountAsync(a => a.Status == "Late");
            var absentCount = await _context.Attendances.CountAsync(a => a.Status == "Absent");
            var leaveCount = await _context.Attendances.CountAsync(a => a.Status == "Leave");

            var punctualityRate = Math.Round((double)presentCount / total * 100, 1);

            var response = new
            {
                TotalRecords = total,
                PunctualityRate = punctualityRate,
                Breakdown = new[]
                {
                    new { Status = "Present", Count = presentCount, Percentage = Math.Round((double)presentCount / total * 100, 1) },
                    new { Status = "Late", Count = lateCount, Percentage = Math.Round((double)lateCount / total * 100, 1) },
                    new { Status = "Absent", Count = absentCount, Percentage = Math.Round((double)absentCount / total * 100, 1) },
                    new { Status = "Leave", Count = leaveCount, Percentage = Math.Round((double)leaveCount / total * 100, 1) }
                }
            };

            return Ok(response);
        }
    }
}
