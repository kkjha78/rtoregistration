(function () {

    var injectParams = ['config', 'vehiclesService', 'vehiclesBreezeService'];

    var dataService = function (config, vehiclesService, vehiclesBreezeService) {
        return (config.useBreeze) ? vehiclesBreezeService : vehiclesService;
    };

    dataService.$inject = injectParams;

    angular.module('vehiclesApp').factory('dataService', dataService);

}());

