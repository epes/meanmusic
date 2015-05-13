'use strict'

angular.module('app')
  .controller('LobbyCtrl', ['$scope', '$routeParams', '$http', '$window', '$timeout', function($scope, $routeParams, $http, $window, $timeout) {
    $scope.id = $routeParams.id;
    $scope.pop = 1;
    $scope.buttons = [
        {
            number: 1,
            color: 'red'
        },{
            number: 2,
            color: 'green'
        },{
            number: 3,
            color: 'blue'
        },{
            number: 4,
            color: 'orange'
        }
    ]

    $scope.flavors = ['kick'];
    $scope.flavor = $scope.flavors[0];
    $scope.nav_color = null;

    // check if lobby exists
    initialCheck();

    $scope.chooseFlavor = function(flavor){
    	console.log(flavor);
    	$scope.flavor = flavor;
    }  

    function play(data) {
        $scope.nav_color = $scope.buttons[data.number - 1].color;
        $scope.$apply();
        new Audio('music/' + data.flavor + '/' + data.number + '.mp3').play();
    }

    function checkPop() {
        $http.get('/api/lobby/' + $scope.id)
        .success(function(data) {
            $scope.pop = (data.pop == 0 ? 1 : data.pop);
            $timeout(checkPop, 20000);
        })
        .error(function(err){
            console.log('pop err');
            $window.location.href = '/#/invalid';
        })
    }

    function initialCheck() {
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
    }

  }]);
