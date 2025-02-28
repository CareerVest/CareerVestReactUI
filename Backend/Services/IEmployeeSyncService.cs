using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IEmployeeSyncService
    {
        Task SyncEmployeesAsync();
    }
}