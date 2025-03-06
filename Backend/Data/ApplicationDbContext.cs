using Microsoft.EntityFrameworkCore;
using Backend.Models; // Ensure this namespace includes Employee, Client, etc.

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // ✅ Ensure Employee table is included
        public DbSet<Employee> Employees { get; set; }

        // ✅ Ensure Client table is included
        public DbSet<Client> Clients { get; set; }

        // ✅ If you use SubscriptionPlan and PostPlacementPlan, include them as well
        public DbSet<SubscriptionPlan> SubscriptionPlan { get; set; }
        public DbSet<PostPlacementPlan> PostPlacementPlan { get; set; }
        public DbSet<PaymentSchedule> PaymentSchedules { get; set; }
        public DbSet<Interview> Interviews { get; set; }
        public DbSet<ApplicationCount> ApplicationCounts { get; set; }
    }
}