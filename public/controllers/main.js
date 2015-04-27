'use strict'

angular.module('app')
  .controller('MainCtrl', ['$scope', '$http', '$location', '$timeout', function($scope, $http, $location, $timeout) {

    $scope.lobby = {};

    $scope.lobbyGet = function() {
      $http.get('/api/lobby/' + $scope.lobby.id)
        .success(function(data) {
          console.log('Data: ' + JSON.stringify(data));
        })
        .error(function(err) {
          console.log('Error: ' + err);
        });
    }

    $scope.lobbyPost = function() {
      $http.post('/api/lobby/')
        .success(function(data) {
          console.log('Data: ' + data);

          $location.path('/api/lobby/' + data).replace();
          //NOT WORKING

        })
        .error(function(err) {
          console.log('Error: ' + err);
        });
    }

  }]);
