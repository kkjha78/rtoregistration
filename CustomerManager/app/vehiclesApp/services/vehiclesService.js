(function () {

    var injectParams = ['$http', '$q'];

    var vehiclesFactory = function ($http, $q) {
        var serviceBase = '/api/dataservice/',
            factory = {};

        factory.getVehicles = function (pageIndex, pageSize) {
            return getPagedResource('vehicles', pageIndex, pageSize);
        };

        factory.getVehiclesSummary = function (pageIndex, pageSize) {
            return getPagedResource('vehiclesSummary', pageIndex, pageSize);
        };

        factory.getStates = function () {
            return $http.get(serviceBase + 'states').then(
                function (results) {
                    return results.data;
                });
        };

        factory.checkUniqueValue = function (id, property, value) {
            if (!id) id = 0;
            return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + '&value=' + escape(value)).then(
                function (results) {
                    return results.data.status;
                });
        };

        factory.insertVehicle = function (vehicle) {
            return $http.post(serviceBase + 'postVehicle', vehicle).then(function (results) {
                vehicle.id = results.data.id;
                return results.data;
            });
        };

        factory.newVehicle = function () {
            return $q.when({id: 0});
        };

        factory.updateVehicle = function (vehicle) {
            return $http.put(serviceBase + 'putVehicle/' + vehicle.id, vehicle).then(function (status) {
                return status.data;
            });
        };

        factory.deleteVehicle = function (id) {
            return $http.delete(serviceBase + 'deleteVehicle/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getVehicle = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'vehicleById/' + id).then(function (results) {
                extendVehicles([results.data]);
                return results.data;
            });
        };

        function extendVehicles(vehicles) {
            var custsLen = vehicles.length;
            //Iterate through vehicles
            for (var i = 0; i < custsLen; i++) {
                var cust = vehicles[i];
                if (!cust.orders) continue;

                var ordersLen = cust.orders.length;
                for (var j = 0; j < ordersLen; j++) {
                    var order = cust.orders[j];
                    order.orderTotal = order.quantity * order.price;
                }
                cust.ordersTotal = ordersTotal(cust);
            }
        }

        function getPagedResource(baseResource, pageIndex, pageSize) {
            var resource = baseResource;
            resource += (arguments.length == 3) ? buildPagingUri(pageIndex, pageSize) : '';
            return $http.get(serviceBase + resource).then(function (response) {
                var custs = response.data;
                extendVehicles(custs);
                return {
                    totalRecords: parseInt(response.headers('X-InlineCount')),
                    results: custs
                };
            });
        }

        function buildPagingUri(pageIndex, pageSize) {
            var uri = '?$top=' + pageSize + '&$skip=' + (pageIndex * pageSize);
            return uri;
        }

        // is this still used???
        function orderTotal(order) {
            return order.quantity * order.price;
        };

        function ordersTotal(vehicle) {
            var total = 0;
            var orders = vehicle.orders;
            var count = orders.length;

            for (var i = 0; i < count; i++) {
                total += orders[i].orderTotal;
            }
            return total;
        };

        return factory;
    };

    vehiclesFactory.$inject = injectParams;

    angular.module('vehiclesApp').factory('vehiclesService', vehiclesFactory);

}());