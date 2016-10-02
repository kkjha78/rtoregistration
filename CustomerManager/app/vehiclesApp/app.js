(function () {

    var app = angular.module('vehiclesApp',
        ['ngRoute', 'ngAnimate', 'wc.directives', 'ui.bootstrap', 'breeze.angular']);

    app.config(['$routeProvider', function ($routeProvider) {
        var viewBase = '/app/vehiclesApp/views/';

        $routeProvider
            .when('/vehicles', {
                controller: 'VehiclesController',
                templateUrl: viewBase + 'vehicles/vehicles.html',
                controllerAs: 'vm'
            })
           .when('/vehicleedit/:vehicleId', {
                controller: 'VehicleEditController',
                templateUrl: viewBase + 'vehicles/vehicleEdit.html',
                controllerAs: 'vm',
                secure: true //This route requires an authenticated user
            })
            .when('/login/:redirect*?', {
                controller: 'LoginController',
                templateUrl: viewBase + 'login.html',
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/vehicles' });

    }]);

    app.run(['$rootScope', '$location', 'authService',
        function ($rootScope, $location, authService) {
            
            //Client-side security. Server-side framework MUST add it's 
            //own security as well since client-based security is easily hacked
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (next && next.$$route && next.$$route.secure) {
                    if (!authService.user.isAuthenticated) {
                        $rootScope.$evalAsync(function () {
                            authService.redirectToLogin();
                        });
                    }
                }
            });

    }]);

}());

