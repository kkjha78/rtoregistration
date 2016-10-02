using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace VehicleManager.Model
{
    public class Vehicle
    {
        public int Id { get; set; }
        [StringLength(50)] 
        public string FirstName { get; set; }
        [StringLength(50)]
        public string LastName { get; set; }
        [StringLength(100)]
        public string Email { get; set; }
        [StringLength(1000)]
        public string Address { get; set; }
        [StringLength(50)]
        public string City { get; set; }
        public State State { get; set; }
        public int StateId { get; set; }
        public int Zip { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public Gender Gender { get; set; }
        [StringLength(50)]
        public string VehicleNo { get; set; }
        [StringLength(50)]
        public string EngineNo { get; set; }
        [StringLength(50)]
        public string ChesisNo { get; set; }
        [StringLength(50)]
        public string ModelNo { get; set; }
    }

    public enum Gender
    {
        Female,
        Male
    }
}