using Backend.Data;
using Backend.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class EmployeeSyncService : BackgroundService, IEmployeeSyncService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<EmployeeSyncService> _logger;

        public EmployeeSyncService(
            IServiceProvider serviceProvider,
            ILogger<EmployeeSyncService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Running employee sync task.");
                await SyncEmployeesAsync();
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken); // Run daily
            }
        }

        public async Task SyncEmployeesAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var graphClient = scope.ServiceProvider.GetRequiredService<GraphServiceClient>();

            try
            {
                var employees = await context.Employees.ToListAsync();
                foreach (var employee in employees)
                {
                    try
                    {
                        var graphUser = await graphClient.Users[employee.EmployeeReferenceID]
                            .Request()
                            .GetAsync();

                        if (graphUser.AccountEnabled != true && employee.Status != "Inactive")
                        {
                            employee.Status = "Inactive";
                            employee.TerminatedDate = DateTime.UtcNow;
                            context.Employees.Update(employee);
                            _logger.LogInformation($"Employee {employee.EmployeeReferenceID} marked as Inactive.");
                        }
                        else if (graphUser.AccountEnabled == true && employee.Status == "Inactive")
                        {
                            employee.Status = "Active";
                            employee.TerminatedDate = null;
                            context.Employees.Update(employee);
                            _logger.LogInformation($"Employee {employee.EmployeeReferenceID} marked as Active.");
                        }
                    }
                    catch (ServiceException ex) when (ex.Error.Code == "Request_ResourceNotFound")
                    {
                        employee.Status = "Inactive";
                        employee.TerminatedDate = DateTime.UtcNow;
                        context.Employees.Update(employee);
                        _logger.LogInformation($"Employee {employee.EmployeeReferenceID} not found in Microsoft 365, marked as Inactive.");
                    }
                }
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during employee sync.");
            }
        }
    }
}