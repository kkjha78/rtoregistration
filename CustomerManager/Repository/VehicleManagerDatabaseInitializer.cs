using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace VehicleManager.Repository
{
    ////DropCreateDatabaseIfModelChanges<TodosContext>
    public class VehicleManagerDatabaseInitializer : DropCreateDatabaseAlways<VehicleManagerContext> // re-creates every time the server starts
    {
        protected override void Seed(VehicleManagerContext context)
        {
            DataInitializer.Initialize(context);
            base.Seed(context);
        }
    }
}
