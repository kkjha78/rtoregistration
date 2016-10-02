using VehicleManager.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VehicleManager.Repository
{
    public class VehicleRepository
    {
        VehicleManagerContext _Context;

        public VehicleRepository()
        {
            _Context = new VehicleManagerContext();
            //System.Threading.Thread.Sleep(5000); 
        }

        public IQueryable<Vehicle> GetVehicles()
        {
            var query = _Context.Vehicles
                        .Include("State")
                        .OrderBy(c => c.LastName);
            return query.AsQueryable();
        }

        public List<State> GetStates()
        {
            return _Context.States.OrderBy(s => s.Name).ToList();
        }

        public IQueryable<VehicleSummary> GetVehiclesSummary(out int totalRecords)
        {
            var query = _Context.Vehicles
               .Include("States")
               .OrderBy(c => c.LastName);

            totalRecords = query.Count();

            return query.Select(c => new VehicleSummary
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                City = c.City,
                State = c.State,
                Gender = c.Gender
            }).AsQueryable();
        }

        public OperationStatus CheckUnique(int id, string property, string value)
        {
            switch (property.ToLower())
            {
                case "email":
                    var unique = !_Context.Vehicles.Any(c => c.Id != id && c.Email == value);
                    return new OperationStatus { Status = unique };
                default:
                    return new OperationStatus();
            }
        }

        public Vehicle GetVehicleById(int id)
        {
            return _Context.Vehicles
                    .Include("State")
                    .SingleOrDefault(c => c.Id == id);
        }

        public OperationStatus InsertVehicle(Vehicle vehicle)
        {
            var opStatus = new OperationStatus { Status = true };
            try
            {
                _Context.Vehicles.Add(vehicle);
                _Context.SaveChanges();
            }
            catch (Exception exp)
            {
                opStatus.Status = false;
                opStatus.ExceptionMessage = exp.Message;
            }
            return opStatus;
        }

        public OperationStatus UpdateVehicle(Vehicle vehicle) 
        {
            var opStatus = new OperationStatus { Status = true };
            try
            {
                vehicle.State.Id = vehicle.StateId;
                _Context.Vehicles.Attach(vehicle);
                _Context.Entry<Vehicle>(vehicle).State = System.Data.Entity.EntityState.Modified;
                _Context.SaveChanges();
            }
            catch (Exception exp)
            {
                opStatus.Status = false;
                opStatus.ExceptionMessage = exp.Message;
            }
            return opStatus;
        }

        public OperationStatus DeleteVehicle(int id)
        {
            var opStatus = new OperationStatus { Status = true };
            try
            {
                var cust = _Context.Vehicles.SingleOrDefault(c => c.Id == id);
                if (cust != null)
                {
                    _Context.Vehicles.Remove(cust);
                    _Context.SaveChanges();
                }
                else
                {
                    opStatus.Status = false;
                    opStatus.ExceptionMessage = "Vehicle not found";
                }
            }
            catch (Exception exp)
            {
                opStatus.Status = false;
                opStatus.ExceptionMessage = exp.Message;
            }
            return opStatus;
        }
    }
}