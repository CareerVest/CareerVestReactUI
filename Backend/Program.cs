using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.HttpsPolicy;

var builder = WebApplication.CreateBuilder(args);

// ✅ Configure HTTPS Redirection Options
builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = 7070; // Ensure this matches launchSettings.json
});

// ✅ Add environment-specific configuration
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                      .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
                      .AddEnvironmentVariables();

// ✅ Add DbContext with connection string
builder.Services.AddDbContext<Backend.Data.ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.Never;
        });
builder.Services.AddEndpointsApiExplorer();

// ✅ Swagger configuration with JWT Bearer token support
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "CareerVest API", Version = "v1" });

    // Add JWT Bearer authentication to Swagger UI
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' followed by your token. Example: Bearer {token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://login.microsoftonline.com/afd6b282-b8b0-4dbb-9985-f5c3249623f9/v2.0";
        options.Audience = "api://3b5b4b15-81ff-4c83-a9fd-569dc8fdf282"; // Explicit Audience

        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuers = new[]
            {
                "https://login.microsoftonline.com/afd6b282-b8b0-4dbb-9985-f5c3249623f9/v2.0",
                "https://sts.windows.net/afd6b282-b8b0-4dbb-9985-f5c3249623f9/"
            },
            ValidateAudience = true,
            ValidAudience = "api://3b5b4b15-81ff-4c83-a9fd-569dc8fdf282",
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true
        };
    });

// ✅ Enable CORS for frontend requests
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// ✅ Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CareerVest API V1");
        c.RoutePrefix = string.Empty; // ✅ Makes Swagger UI accessible at https://localhost:7070/index.html
    });
}

// ✅ Middleware
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();