var myAppControllers = angular.module('myAppControllers', []);


// follow controller
myAppControllers.controller('DesignerCtrl', ['$scope', '$http',
  function($scope, $http) {

    $scope.disabled = false;

    $scope.isProcessing = function() {
      return $scope.disabled;
    };

    $scope.follow = function(designer) {

      $scope.disabled = true;

      var url = '/user/follow/' + designer;
      $http.get(url, {
        cache: false
      }).success(function(data) {

        console.log(data);
        // $scope.disabled = false;

      });

    };

  }
]);