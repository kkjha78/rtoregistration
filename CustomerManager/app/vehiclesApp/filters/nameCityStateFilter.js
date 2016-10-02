(function () {

    var nameCityStateFilter = function () {

        return function (vehicles, filterValue) {
            if (!filterValue) return vehicles;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < vehicles.length; i++) {
                var cust = vehicles[i];
                if (cust.firstName.toLowerCase().indexOf(filterValue) > -1 ||
                    cust.lastName.toLowerCase().indexOf(filterValue) > -1 ||
                    cust.city.toLowerCase().indexOf(filterValue) > -1 ||
                    cust.state.name.toLowerCase().indexOf(filterValue) > -1) {

                    matches.push(cust);
                }
            }
            return matches;
        };
    };

    angular.module('vehiclesApp').filter('nameCityStateFilter', nameCityStateFilter);

}());