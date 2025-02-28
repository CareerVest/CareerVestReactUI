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
            if (typeof(T) == typeof(Employee))
            {
                return CreateEmployeeFilter(role, module, employeeId, supervisorId) as Expression<Func<T, bool>>;
            }
            else if (typeof(T) == typeof(Client))
            {
                string permission = GetPermission(role, module);
                return CreateClientFilter(permission, employeeId, supervisorId) as Expression<Func<T, bool>>;
            }
            else
            {
                return _ => false; // Default: no access for unrecognized types
            }
        }

        private Expression<Func<Employee, bool>> CreateEmployeeFilter(string role, string module, int employeeId, int? supervisorId)
        {
            switch (role.ToLowerInvariant())
            {
                case "admin":
                    return e => true; // Admin sees all employees

                case "senior_recruiter":
                    // Senior Recruiter sees their record and employees under their supervision
                    return e => e.EmployeeID == employeeId || e.SupervisorID == employeeId;

                case "recruiter":
                case "sales_executive":
                case "resume_writer":
                case "default":
                    // Others see only their own record
                    return e => e.EmployeeID == employeeId;

                default:
                    return e => false; // No access by default for unrecognized roles
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

        private Expression<Func<Client, bool>> CreateTeamFilterForClients(int employeeId, int? supervisorId)
        {
            if (!supervisorId.HasValue)
            {
                var employee = _context.Employees.FirstOrDefault(e => e.EmployeeID == employeeId);
                supervisorId = employee?.EmployeeID;
            }

            if (!supervisorId.HasValue)
                return c => false;

            return c => c.AssignedRecruiterID == employeeId ||
                       _context.Employees.Any(e => e.SupervisorID == supervisorId && e.EmployeeID == c.AssignedRecruiterID);
        }
    }
}