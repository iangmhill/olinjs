var app = angular.module('todos', [
    'ngRoute'
  ]).config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {

    $routeProvider

      // summary landing page
      .when('/', {
        templateUrl: 'partials/todos.html',
        controller: 'TodoController'
      })

    $locationProvider.html5Mode(true);

}])