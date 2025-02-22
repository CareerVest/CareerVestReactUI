using Backend.DTOs;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IEmployeeService
    {
        Task<List<RecruiterDTO>> GetRecruitersAsync();
    }
}