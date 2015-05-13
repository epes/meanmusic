'use strict'

angular.module('app')
  .controller('LobbyCtrl', ['$scope', '$routeParams', '$http', '$window', '$timeout', function($scope, $routeParams, $http, $window, $timeout) {
    $scope.id = $routeParams.id;
    $scope.flavor = null;
    $scope.pop = 1;

    // check if lobby exists
    $http.get('/api/lobby/' + $scope.id)
    .success(function(data) {
      console.log('Data: ' + JSON.stringify(data));

      // if lobby exists, create socket
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
      };

      checkPop();

    })
    .error(function(err) {
      // if lobby doesn't exist, reroute
      $window.location.href = '/#/invalid';
    });

    $scope.chooseFlavor = function(flavor){
    	console.log(flavor);
    	$scope.flavor = flavor;
    }  

    function play(data) {
        new Audio('music/' + data.flavor + '/' + data.number + '.mp3').play();
    }

    function checkPop() {
        $http.get('/api/lobby/' + $scope.id)
        .success(function(data) {
            $scope.pop = (data.pop == 0 ? 1 : data.pop);
            console.log('Pop: ' + $scope.pop);
            $timeout(checkPop, 20000);
        })
        .error(function(err){
            console.log('pop err');
        })
    }

  }]);
