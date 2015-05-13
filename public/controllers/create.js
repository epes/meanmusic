'use strict'

angular.module('app')
  .controller('CreateCtrl', ['$scope', '$window', '$http', function($scope, $window, $http) {

  $http.post('/api/lobby/')
    .success(function(lobby) {
      console.log('Data: ' + lobby);

      $window.location.href = '/#/' + lobby;

    })
    .error(function(err) {
      console.log('Error: ' + err);
    });
  }]);
