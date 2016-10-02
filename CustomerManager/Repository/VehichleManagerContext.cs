using VehicleManager.Model;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace VehicleManager.Repository
{
    public class VehicleManagerContext : DbContext
    {
        public VehicleManagerContext()
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;
        }

        // DEVELOPMENT ONLY: initialize the database
        static VehicleManagerContext()
        {
            Database.SetInitializer(new VehicleManagerDatabaseInitializer());
        }

        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<State> States { get; set; }
    }
}