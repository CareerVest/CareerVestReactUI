using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public class AccessControlService : IAccessControlService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AccessControlService(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public string GetPermission(string role, string module)
        {
            var permissions = _configuration.GetSection("RolePermissions").Get<Dictionary<string, Dictionary<string, string>>>();
            return permissions.TryGetValue(role, out var rolePermissions) && rolePermissions.TryGetValue(module, out var permission)
                ? permission
                : permissions["Default"][module];
        }

        public Expression<Func<T, bool>> GetFilter<T>(string role, string module, int employeeId, int? supervisorId = null) where T : class
        {
            var permission = GetPermission(role, module);

            if (typeof(T) == typeof(Client))
            {
                return CreateClientFilter(permission, employeeId, supervisorId) as Expression<Func<T, bool>>;
            }
            // else if (typeof(T) == typeof(Employee))
            // {
            //     return CreateEmployeeFilter(permission, employeeId, supervisorId) as Expression<Func<T, bool>>;
            // }
            // else if (typeof(T) == typeof(Interview))
            // {
            //     return CreateInterviewFilter(permission, employeeId, supervisorId) as Expression<Func<T, bool>>;
            // }
            // else if (typeof(T) == typeof(MarketingActivity))
            // {
            //     return CreateMarketingActivityFilter(permission, employeeId, supervisorId) as Expression<Func<T, bool>>;
            // }
            // Add more modules as needed (Subscriptions, PostPlacements, Payments, Adjustments)
            else
            {
                return _ => false; // Default: no access
            }
        }

        private Expression<Func<Client, bool>> CreateClientFilter(string permission, int employeeId, int? supervisorId)
        {
            switch (permission)
            {
                case "All":
                    return c => true;
                case "Assigned":
                    return c => c.AssignedRecruiterID == employeeId;
                case "Team":
                    return CreateTeamFilterForClients(employeeId, supervisorId);
                case "None":
                default:
                    return c => false;
            }
        }

        private Expression<Func<Employee, bool>> CreateEmployeeFilter(string permission, int employeeId, int? supervisorId)
        {
            switch (permission)
            {
                case "All":
                    return e => true;
                case "Team":
                    return CreateTeamFilterForEmployees(employeeId, supervisorId);
                case "None":
                default:
                    return e => false;
            }
        }

        // private Expression<Func<Interview, bool>> CreateInterviewFilter(string permission, int employeeId, int? supervisorId)
        // {
        //     switch (permission)
        //     {
        //         case "All":
        //             return i => true;
        //         case "Own":
        //             return i => i.InterviewRecruiterID == employeeId;
        //         case "Team":
        //             return CreateTeamFilterForInterviews(employeeId, supervisorId);
        //         case "None":
        //         default:
        //             return i => false;
        //     }
        // }

        // private Expression<Func<MarketingActivity, bool>> CreateMarketingActivityFilter(string permission, int employeeId, int? supervisorId)
        // {
        //     switch (permission)
        //     {
        //         case "All":
        //             return m => true;
        //         case "None":
        //         default:
        //             return m => false;
        //     }
        // }

        private Expression<Func<Client, bool>> CreateTeamFilterForClients(int employeeId, int? supervisorId)
        {
            // If supervisorId is null, derive it from the employee’s record (assuming Senior Recruiter’s EmployeeID is their SupervisorID)
            if (!supervisorId.HasValue)
            {
                var employee = _context.Employees.FirstOrDefault(e => e.EmployeeID == employeeId);
                supervisorId = employee?.EmployeeID; // Use the employee’s own ID as their SupervisorID (for Senior Recruiters)
            }

            if (!supervisorId.HasValue)
                return c => false; // No supervisor ID found, no access

            return c => c.AssignedRecruiterID == employeeId ||
                       _context.Employees.Any(e => e.SupervisorID == supervisorId && e.EmployeeID == c.AssignedRecruiterID);
        }

        private Expression<Func<Employee, bool>> CreateTeamFilterForEmployees(int employeeId, int? supervisorId)
        {
            if (!supervisorId.HasValue)
                return e => false;

            return e => e.EmployeeID == employeeId || e.SupervisorID == supervisorId;
        }

        // private Expression<Func<Interview, bool>> CreateTeamFilterForInterviews(int employeeId, int? supervisorId)
        // {
        //     if (!supervisorId.HasValue)
        //         return i => false;

        //     return i => i.InterviewRecruiterID == employeeId || 
        //                _context.Employees.Any(e => e.SupervisorID == supervisorId && e.EmployeeID == i.InterviewRecruiterID);
        // }
    }
}