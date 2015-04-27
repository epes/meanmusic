'use strict'

angular.module('app')
  .controller('LobbyCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
    $scope.id = $routeParams.id;
  }]);
