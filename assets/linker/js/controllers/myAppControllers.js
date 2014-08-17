var myAppControllers = angular.module('myAppControllers', []);


myAppControllers.controller('UserProfileCtrl',
  function($scope, $http) {
    $scope.init = function() {
      $http.get('/api/me/followees')
        .success(function(data) {
          $scope.followees = data;
        });

      $http.get('/api/me/likes')
        .success(function(data) {
          $scope.likes = data;
        });
    };
  }
);

myAppControllers.controller('PieceImageCtrl', ['$scope', '$http',
  function($scope, $http) {

    $scope.delete = function(pieceId, imageId) {
      //url: /me/piece/images/destroy/:id
      var url = '/me/piece/images/' + pieceId + '/' + imageId;
      console.log(url);
      $http.delete(url).success(function(data) {
        console.log(data);
      }).error(function(err) {
        console.log(err);
      });
    }
  }
]);