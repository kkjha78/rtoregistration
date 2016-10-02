(function () {

    var injectParams = ['breeze', '$q', '$window'];

    var vehiclesBreezeService = function (breeze, $q, $window) {

        var factory = {};
        var EntityQuery = breeze.EntityQuery;

        // configure to use the model library for Angular
        breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);
        // configure to use camelCase
        breeze.NamingConvention.camelCase.setAsDefault();
        // create entity Manager
        var serviceName = 'breeze/breezedataservice';
        var entityManager = new breeze.EntityManager(serviceName);

        factory.getVehicles = function (pageIndex, pageSize) {
            return getPagedResource('Vehicles', pageIndex, pageSize);
        };

        factory.getVehiclesSummary = function (pageIndex, pageSize) {
            return getPagedResource('VehiclesSummary', pageIndex, pageSize);
        };

        factory.getStates = function () {
            return getAll('States');
        };

        factory.getVehicle = function (id) {
            var query = EntityQuery
                .from('Vehicles')
                .where('id', '==', id)
                .expand('state');
            return executeQuery(query, true);
        };

        factory.checkUniqueValue = function (id, property, value) {
            var propertyPredicate = new breeze.Predicate(property, "==", value);
            var predicate = (id) ? propertyPredicate.and(new breeze.Predicate("id", "!=", id)) : propertyPredicate;

            var query = EntityQuery.from('Vehicles').where(predicate).take(0).inlineCount();

            return query.using(entityManager).execute().then(function (data) {
                return (data && data.inlineCount == 0) ? true : false;
            });
        };

        factory.insertVehicle = function (vehicle) {
            return entityManager.saveChanges();
        };

        factory.newVehicle = function () {
            return getMetadata().then(function () {
                return entityManager.createEntity('Vehicle', { firstName: '', lastName: '' });
            });
        };

        factory.deleteVehicle = function (id) {
            if (!id) {
                $window.alert('ID was null - cannot delete');
                return null;
            }
            var vehicle = entityManager.getEntityByKey('Vehicle', id);

            /*  When the vehicle is deleted the vehicleID is set to 0 
               
            */
            if (vehicle) {
              vehicle.entityAspect.setDeleted();
            }
            else {
                //Really a VehicleSummary so we're going to add a new Vehicle 
                //and mark it as deleted. That allows us to save some code and avoid having
                //a separate method to deal with the VehicleSummary projection
                vehicle = entityManager.createEntity('Vehicle', { id: id, gender: 'Male' }, breeze.EntityState.Deleted);
            }

            return entityManager.saveChanges();
        };

        factory.updateVehicle = function (vehicle) {
            return entityManager.saveChanges();
        };

        function executeQuery(query, takeFirst) {
            return query.using(entityManager).execute().then(querySuccess, queryError);

            function querySuccess(data, status, headers) {
                return takeFirst ? data.results[0] : data.results;
            }

            function queryError(error) {
                $window.alert(error.message);
            }
        }

        function getAll(entityName, expand) {
            var query = EntityQuery.from(entityName);
            if (expand) {
                query = query.expand(expand);
            }
            return executeQuery(query);
        }

        function getMetadata() {
            var store = entityManager.metadataStore;
            if (store.hasMetadataFor(serviceName)) { //Have metadata
                return $q.when(true);
            }
            else { //Get metadata
                return store.fetchMetadata(serviceName);
            }
        }

        function getPagedResource(entityName, pageIndex, pageSize) {
            var query = EntityQuery
            .from(entityName)
            .skip(pageIndex * pageSize)
            .take(pageSize)
            .inlineCount(true);

          
            //Not calling the re-useable executeQuery() function here since we need to get to more details
            //and return a custom object
            return query.using(entityManager).execute().then(function (data) {
                return {
                    totalRecords: parseInt(data.inlineCount),
                    results: data.results
                };
            }, function (error) {
                $window.alert('Error ' + error.message);
            });
        }

   
        //var VehicleCtor = function() {

        //};

        
        //entityManager.metadataStore.registerEntityTypeCtor('Vehicle', VehicleCtor, vehicleInit);

        return factory;
    };

    vehiclesBreezeService.$inject = injectParams;

    angular.module('vehiclesApp')
        .factory('vehiclesBreezeService', vehiclesBreezeService);

}());