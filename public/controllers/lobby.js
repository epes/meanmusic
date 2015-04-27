'use strict'

angular.module('app')
  .controller('LobbyCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
    $scope.id = $routeParams.id;
    $scope.url = $location.absUrl();
    $scope.instrument = null;

    // look into angular-ui / http://angular-ui.github.io/bootstrap/
    // get rid of jquery and bootstrap.js
    $('#inviteModal').modal('show');

    $scope.chooseInstrument = function(instrument){
    	console.log(instrument);
    	$scope.instrument = instrument;
    }

  }]);
