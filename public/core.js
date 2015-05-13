'use strict'

var app = angular.module('app', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/create.html',
        controller: 'CreateCtrl'
      })
      .when('/invalid', {
        templateUrl: 'views/invalid.html',
        controller: 'InvalidCtrl'
      })
      .when('/:id', {
        templateUrl: 'views/lobby.html',
        controller: 'LobbyCtrl'
      })
      .when('/stopped/create', {
        templateUrl: 'views/create.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
