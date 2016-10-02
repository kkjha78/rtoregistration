(function () {

    var nameProductFilter = function () {

        function matchesProduct(vehicle, filterValue) {
            if (vehicle.orders) {
                for (var i = 0; i < vehicle.orders.length; i++) {
                    if (vehicle.orders[i].product.toLowerCase().indexOf(filterValue) > -1) {
                        return true;
                    }
                }
            }
            return false;
        }

        return function (vehicles, filterValue) {
            if (!filterValue || !vehicles) return vehicles;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < vehicles.length; i++) {
                var cust = vehicles[i];
                if (cust.firstName.toLowerCase().indexOf(filterValue) > -1 ||
                    cust.lastName.toLowerCase().indexOf(filterValue) > -1 ||
                    matchesProduct(cust, filterValue)) {

                    matches.push(cust);
                }
            }
            return matches;
        };
    };

    angular.module('vehiclesApp').filter('nameProductFilter', nameProductFilter);

}());