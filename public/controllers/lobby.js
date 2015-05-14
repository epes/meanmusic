'use strict'

angular.module('app')
  .controller('LobbyCtrl', ['$scope', '$routeParams', '$http', '$window', '$timeout', '$document', function($scope, $routeParams, $http, $window, $timeout, $document) {
    $('.button-collapse').sideNav({
        closeOnClick: true
    });

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
    $scope.nav_color = 'pink';

    $scope.visualizer_scale = 0;

    // check if lobby exists
    //initialCheck();

    $scope.chooseFlavor = function(flavor){
    	$scope.flavor = flavor;
    }  

    function play(data) {
      $scope.nav_color = $scope.buttons[data.number - 1].color;
      $scope.visualizer_scale = 1;
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

    function shrinkVisualizer() {
      $scope.visualizer_scale = ($scope.visualizer_scale <= 0 ? 0 : $scope.visualizer_scale - 0.1);
      $timeout(shrinkVisualizer, 100);
    }


    // this function and everything within it will only execute
    // if the lobby is valid
    function initialCheck() {
      $http.get('/api/lobby/' + $scope.id)
      .success(function(data) {

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

        $document.bind("keydown", function(event){
          switch(event.which){
            case 65:
              $scope.sendTune(1);
              break;
            case 83:
              $scope.sendTune(2);
              break;
            case 68:
              $scope.sendTune(3);
              break;
            case 70:
              $scope.sendTune(4);
              break;
          }
        });

        checkPop();
        shrinkVisualizer();

      })
      .error(function(err) {
        // if lobby doesn't exist, reroute
        $window.location.href = '/#/invalid';
      });
    }

  }]);
