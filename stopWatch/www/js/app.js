angular.module('spartaStopWatch', ['ionic'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .controller('StopWatchController', function($scope, $timeout) {

    var startTime = 0;
    var currentInterval;

    var adjustDigits = function (value) {
      return (value < 10 ? '0' + value.toString() : value.toString())
    };

    var setTimeSpent = function (hours, minutes, seconds) {

      hours = adjustDigits(hours);
      minutes = adjustDigits(minutes);
      seconds = adjustDigits(seconds);

      $scope.timeSpent = {
        hours: hours,
        minutes: minutes,
        seconds: seconds
      };
    };

    var resetTimeSpent = function () {
      setTimeSpent(0, 0, 0);
    };

    var refreshTimeSpent = function () {
       var now = new Date().getTime();

      $timeout(function () {

        var time = (now - startTime) / 1000;
        var hours = Math.floor(time / 3600);
        var minutes = Math.floor(time / 60) - Math.floor(hours * 60);
        var seconds = Math.floor(time) - Math.floor(hours * 60) - Math.floor(minutes * 60);

        setTimeSpent(hours, minutes, seconds);
      }, 0);
    };

    $scope.startNewTimeEntry = function () {
      if (currentInterval) {
        $scope.stopTimeEntry();
      }

      startTime = new Date().getTime();

      currentInterval = setInterval(refreshTimeSpent, 1000);

      socket.emit('startTimer');

      $scope.measuringTime = true;
    };

    $scope.stopTimeEntry = function () {
      clearInterval(currentInterval);

      startTime = 0;

      $scope.measuringTime = false;

      resetTimeSpent();


    };

    resetTimeSpent();

  })

;
