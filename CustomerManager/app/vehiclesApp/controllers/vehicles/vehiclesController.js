(function () {

    var injectParams = ['$location', '$filter', '$window',
                        '$timeout', 'authService', 'dataService', 'modalService'];

    var VehiclesController = function ($location, $filter, $window,
        $timeout, authService, dataService, modalService) {

        var vm = this;

        vm.vehicles = [];
        vm.filteredVehicles = [];
        vm.filteredCount = 0;
        vm.orderby = 'lastName';
        vm.reverse = false;
        vm.searchText = null;
      
        //paging
        vm.totalRecords = 0;
        vm.pageSize = 10;
        vm.currentPage = 1;

        vm.pageChanged = function (page) {
            vm.currentPage = page;
            getVehiclesSummary();
        };

        vm.deleteVehicle = function (id) {
            if (!authService.user.isAuthenticated) {
                $location.path(authService.loginPath + $location.$$path);
                return;
            }

            var cust = getVehicleById(id);
            var custName = cust.firstName + ' ' + cust.lastName;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Vehicle',
                headerText: 'Delete ' + custName + '?',
                bodyText: 'Are you sure you want to delete this vehicle?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteVehicle(id).then(function () {
                        for (var i = 0; i < vm.vehicles.length; i++) {
                            if (vm.vehicles[i].id === id) {
                                vm.vehicles.splice(i, 1);
                                break;
                            }
                        }
                        filterVehicles(vm.searchText);
                    }, function (error) {
                        $window.alert('Error deleting vehicle: ' + error.message);
                    });
                }
            });
        };

        vm.DisplayModeEnum = {
            Card: 0,
            List: 1
        };

        vm.changeDisplayMode = function (displayMode) {
            switch (displayMode) {
                case vm.DisplayModeEnum.Card:
                    vm.listDisplayModeEnabled = false;
                    break;
                case vm.DisplayModeEnum.List:
                    vm.listDisplayModeEnabled = true;
                    break;
            }
        };

        vm.navigate = function (url) {
            $location.path(url);
        };

        vm.setOrder = function (orderby) {
            if (orderby === vm.orderby) {
                vm.reverse = !vm.reverse;
            }
            vm.orderby = orderby;
        };

        vm.searchTextChanged = function () {
            filterVehicles(vm.searchText);
        };

        function init() {
            //createWatches();
            getVehiclesSummary();
        }

        //function createWatches() {
        //    //Watch searchText value and pass it and the vehicles to nameCityStateFilter
        //    //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
        //    //while also accessing the filtered count via vm.filteredCount above

        //    //Better to handle this using ng-change on <input>. See searchTextChanged() function.
        //    vm.$watch("searchText", function (filterText) {
        //        filterVehicles(filterText);
        //    });
        //}

        function getVehiclesSummary() {
            dataService.getVehiclesSummary(vm.currentPage - 1, vm.pageSize)
            .then(function (data) {
                vm.totalRecords = data.totalRecords;
                vm.vehicles = data.results;
                filterVehicles(''); //Trigger initial filter

                $timeout(function () {
                    vm.cardAnimationClass = ''; //Turn off animation since it won't keep up with filtering
                }, 1000);

            }, function (error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        }

        function filterVehicles(filterText) {
            vm.filteredVehicles = $filter("nameCityStateFilter")(vm.vehicles, filterText);
            vm.filteredCount = vm.filteredVehicles.length;
        }

        function getVehicleById(id) {
            for (var i = 0; i < vm.vehicles.length; i++) {
                var cust = vm.vehicles[i];
                if (cust.id === id) {
                    return cust;
                }
            }
            return null;
        }

        init();
    };

    VehiclesController.$inject = injectParams;

    angular.module('vehiclesApp').controller('VehiclesController', VehiclesController);

}());
