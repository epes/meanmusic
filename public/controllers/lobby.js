'use strict'

angular.module('app')
  .controller('LobbyCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
    $scope.id = $routeParams.id;
    $scope.url = $location.absUrl();
    $scope.flavor = null;

    // look into angular-ui / http://angular-ui.github.io/bootstrap/
    // get rid of jquery and bootstrap.js
    $('#inviteModal').modal('show');

    $scope.chooseFlavor = function(flavor){
    	console.log(flavor);
    	$scope.flavor = flavor;
    }

    var socket = io();
    socket.on('connect', function(){
        socket.emit('join', $scope.id);
    });

    socket.on('playback', function(data){
        play(data);
    });

    $scope.sendTune = function(number) {
        socket.emit('tune', 
            {
                room: $scope.id,
                flavor: $scope.flavor, 
                number: number
            });
    }

    function play(data) {
        new Audio('music/' + data.flavor + '/' + data.number + '.mp3').play();
    }

  }]);
