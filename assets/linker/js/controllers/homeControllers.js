var homeControllers = angular.module('homeControllers', []);

homeControllers.controller('BlockGridCtrl',
  function($scope, $http) {
    $scope.page = 0;
    $scope.getGridPieces = function(page) {
      $http.get('/home/getGridPieces/' + page).success(function(data) {
        $scope.pieces = data;
        $scope.page = page;
        if (data.length < 5) {
          $scope.pageSize = $scope.page;
        }
      });
    };
    $scope.$evalAsync(function() {
      $scope.getGridPieces(0);
    });
  }
);

homeControllers.controller('HotspotDesignerCtrl',
  function($scope, $http) {
    $http.get('/home/getHotspotDesigners').success(function(data) {
      $scope.designers = data;
    });
  }
);