using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Backend.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 2. Configure SQLite DB (AppDbContext)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Data Source=app.db";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// 3. Configure CORS to allow frontend calls
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. Configure JWT Authentication
var secretKey = builder.Configuration["Jwt:SecretKey"] ?? "super_secret_employee_management_key_2026_safe_and_long_enough";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "EmployeeManagementAPI",
            ValidAudience = "EmployeeManagementClient",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

var app = builder.Build();

// 5. Ensure DB is created & seeded on app start
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run("http://localhost:5000");
