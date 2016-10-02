(function () {

    var injectParams = ['$scope', '$location', '$routeParams',
                        '$timeout', 'config', 'dataService', 'modalService'];

    var VehicleEditController = function ($scope, $location, $routeParams,
                                           $timeout, config, dataService, modalService) {

        var vm = this,
            vehicleId = ($routeParams.vehicleId) ? parseInt($routeParams.vehicleId) : 0,
            timer,
            onRouteChangeOff;

        vm.vehicle = {};
        vm.states = [];
        vm.title = (vehicleId > 0) ? 'Edit' : 'Add';
        vm.buttonText = (vehicleId > 0) ? 'Update' : 'Add';
        vm.updateStatus = false;
        vm.errorMessage = '';

        vm.isStateSelected = function (vehicleStateId, stateId) {
            return vehicleStateId === stateId;
        };

        vm.saveVehicle = function () {
            if ($scope.editForm.$valid) {
                if (!vm.vehicle.id) {
                    dataService.insertVehicle(vm.vehicle).then(processSuccess, processError);
                }
                else {
                    dataService.updateVehicle(vm.vehicle).then(processSuccess, processError);
                }
            }
        };

        vm.deleteVehicle = function () {
            var custName = vm.vehicle.firstName + ' ' + vm.vehicle.lastName;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Vehicle',
                headerText: 'Delete ' + custName + '?',
                bodyText: 'Are you sure you want to delete this vehicle?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteVehicle(vm.vehicle.id).then(function () {
                        onRouteChangeOff(); //Stop listening for location changes
                        $location.path('/vehicles');
                    }, processError);
                }
            });
        };

        function init() {

            getStates().then(function () {
                if (vehicleId > 0) {
                    dataService.getVehicle(vehicleId).then(function (vehicle) {
                        vm.vehicle = vehicle;
                    }, processError);
                } else {
                    dataService.newVehicle().then(function (vehicle) {
                        vm.vehicle = vehicle;
                    });
                }
            });


            //Make sure they're warned if they made a change but didn't save it
            //Call to $on returns a "deregistration" function that can be called to
            //remove the listener (see routeChange() for an example of using it)
            onRouteChangeOff = $scope.$on('$locationChangeStart', routeChange);
        }

        init();

        function routeChange(event, newUrl, oldUrl) {
            //Navigate to newUrl if the form isn't dirty
            if (!vm.editForm || !vm.editForm.$dirty) return;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ignore Changes',
                headerText: 'Unsaved Changes',
                bodyText: 'You have unsaved changes. Leave the page?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    onRouteChangeOff(); //Stop listening for location changes
                    $location.path($location.url(newUrl).hash()); //Go to page they're interested in
                }
            });

            //prevent navigation by default since we'll handle it
            //once the user selects a dialog option
            event.preventDefault();
            return;
        }

        function getStates() {
            return dataService.getStates().then(function (states) {
                vm.states = states;
            }, processError);
        }

        function processSuccess() {
            $scope.editForm.$dirty = false;
            vm.updateStatus = true;
            vm.title = 'Edit';
            vm.buttonText = 'Update';
            startTimer();
        }

        function processError(error) {
            vm.errorMessage = error.message;
            startTimer();
        }

        function startTimer() {
            timer = $timeout(function () {
                $timeout.cancel(timer);
                vm.errorMessage = '';
                vm.updateStatus = false;
            }, 3000);
        }
    };

    VehicleEditController.$inject = injectParams;

    angular.module('vehiclesApp').controller('VehicleEditController', VehicleEditController);

}());