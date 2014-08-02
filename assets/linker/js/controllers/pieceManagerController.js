var pieceMangerController = angular.module('pieceMangerController', []);

pieceMangerController.controller('PieceUploadCtrl', ['$scope', '$http',
  function($scope, $http) {

    $scope.save = function(piece) {
      console.log(piece);
    }

  }
]);