

var MP4app = angular.module('MP4app', ['ngRoute', 'mp4Controllers', 'Services','angularUtils.directives.dirPagination']);


MP4app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/users', {
            templateUrl: 'partials/users.html',
            controller: 'UsersController'
        }).
        when('/users/:id', {
            templateUrl: 'partials/userDetails.html',
            controller: 'UserDetailController'
        }).
        when('/addUser', {
            templateUrl: 'partials/addUser.html',
            controller: 'UserAddController'
        }).
        when('/tasks', {
            templateUrl: 'partials/tasks.html',
            controller: 'TasksController'
        }).
        when('/tasks/:id', {
            templateUrl: 'partials/taskDetails.html',
            controller: 'TaskDetailController'
        }).
        when('/addTask', {
            templateUrl: 'partials/addTask.html',
            controller: 'TaskAddController'
        }).
        when('/editTask/:id', {
            templateUrl: 'partials/editTask.html',
            controller: 'TaskEditController'
        }).
        when('/settings', {
            templateUrl: 'partials/settings.html',
            controller: 'SettingsController'
        }).
        otherwise({
            redirectTo: '/settings'
        });
}]);




