using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Backend.Models;

namespace Backend.Services
{
    public interface IAccessControlService
    {
        string GetPermission(string role, string module);
        Expression<Func<T, bool>> GetFilter<T>(string role, string module, int employeeId, int? supervisorId = null) where T : class;
    }
}