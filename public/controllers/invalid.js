'use strict'

angular.module('app')
  .controller('InvalidCtrl', ['$scope', '$window', '$timeout', function($scope, $window, $timeout) {
  	$scope.countdown = 6;

  	countdown();

  	function countdown() {
  		$scope.countdown--;

  		if($scope.countdown > 0){
  			$timeout(countdown, 1000);
  		}else{
  			$window.location.href = '/#/';
  		}
  	}
  }]);