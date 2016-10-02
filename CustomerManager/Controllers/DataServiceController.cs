using VehicleManager.Model;
using VehicleManager.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace VehicleManager.Controllers
{
    public class DataServiceController : ApiController
    {
        VehicleRepository _Repository;

        public DataServiceController()
        {
            _Repository = new VehicleRepository();
        }

        [HttpGet]
        [Queryable]
        public HttpResponseMessage Vehicles()
        {
            var vehicles = _Repository.GetVehicles();
            var totalRecords = vehicles.Count();
            HttpContext.Current.Response.Headers.Add("X-InlineCount", totalRecords.ToString());
            return Request.CreateResponse(HttpStatusCode.OK, vehicles);
        }

        [HttpGet]
        public HttpResponseMessage States()
        {
            var states = _Repository.GetStates();
            return Request.CreateResponse(HttpStatusCode.OK, states);
        }

        [HttpGet]
        [Queryable]
        public HttpResponseMessage VehiclesSummary()
        {
            int totalRecords;
            var custSummary = _Repository.GetVehiclesSummary(out totalRecords);
            HttpContext.Current.Response.Headers.Add("X-InlineCount", totalRecords.ToString());
            return Request.CreateResponse(HttpStatusCode.OK, custSummary);
        }

        [HttpGet]
        public HttpResponseMessage CheckUnique(int id, string property, string value)
        {
            var opStatus = _Repository.CheckUnique(id, property, value);
            return Request.CreateResponse(HttpStatusCode.OK, opStatus);
        }

        [HttpPost]
        public HttpResponseMessage Login([FromBody]UserLogin userLogin)
        {
            //Simulated login
            return Request.CreateResponse(HttpStatusCode.OK, new { status = true});
        }

        [HttpPost]
        public HttpResponseMessage Logout()
        {
            //Simulated logout
            return Request.CreateResponse(HttpStatusCode.OK, new { status = true });
        }

        // GET api/<controller>/5
        [HttpGet]
        public HttpResponseMessage VehicleById(int id)
        {
            var vehicle = _Repository.GetVehicleById(id);
            return Request.CreateResponse(HttpStatusCode.OK, vehicle);
        }

        // POST api/<controller>
        public HttpResponseMessage PostVehicle([FromBody]Vehicle vehicle)
        {
            var opStatus = _Repository.InsertVehicle(vehicle);
            if (opStatus.Status)
            {
                var response = Request.CreateResponse<Vehicle>(HttpStatusCode.Created, vehicle);
                string uri = Url.Link("DefaultApi", new { id = vehicle.Id });
                response.Headers.Location = new Uri(uri);
                return response;
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, opStatus.ExceptionMessage);
        }

        // PUT api/<controller>/5
        public HttpResponseMessage PutVehicle(int id, [FromBody]Vehicle vehicle)
        {
            var opStatus = _Repository.UpdateVehicle(vehicle);
            if (opStatus.Status)
            {
                return Request.CreateResponse<Vehicle>(HttpStatusCode.Accepted, vehicle);
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotModified, opStatus.ExceptionMessage);
        }

        // DELETE api/<controller>/5
        public HttpResponseMessage DeleteVehicle(int id)
        {
            var opStatus = _Repository.DeleteVehicle(id);

            if (opStatus.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, opStatus.ExceptionMessage);
            }
        }
    }
}