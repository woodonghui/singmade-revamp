var pieceControllers = angular.module('pieceControllers', []);

pieceControllers.controller('PieceViewCtrl',
  function($scope, $http, socialAction, $window) {

    $scope.init = function(pieceId, slugId) {
      $scope.pieceId = pieceId;
      $scope.slugId = slugId;
    };

    $scope.like = function() {
      return socialAction.like($scope.slugId)
        .then(function(result) {
          console.log(result);
        }, function(err) {
          console.log(err);
          if (err == 403)
            $window.location.href = '/login';
        });
    };

  }
);



/**
 *  @description
 *  CommentViewCtrl
 *
 */
pieceControllers.controller('CommentViewCtrl',
  function($scope, $http, $window, socket, $q) {

    $scope.init = function(pieceId) {
      $scope.pieceId = pieceId;

      //get all comments 
      //and listen the socket of this piece
      socket.on('commentAddedEvent', function(message) {
        // console.log('Comment is added', message);
        $scope.comments.push(message.data.comment);
      });

      $window.socket.get('/comment/' + $scope.pieceId, {}, function(data) {
        $scope.$apply(function() {
          $scope.comments = data;
        });
      });
    };

    $scope.comment = function() {

      var deferred = $q.defer();
      $http.post('/comment/' + $scope.pieceId, {
        content: $scope.content
      }).success(function(data) {
        deferred.resolve(data)
      }).error(function(err, status) {
        deferred.reject(status);
      });

      return deferred.promise.then(function(result) {
        $scope.content = '';
      }, function(reason) {
        if (reason == 403)
          $window.location.href = '/login';
      });


      // $http.post('/comment/' + $scope.pieceId, {
      //   content: $scope.content
      // }).success(function(data) {
      //   // console.log(data);
      //   $scope.content = '';
      // }).error(function(err, status) {
      //   // console.log(err);
      //   if (status == 403)
      //     $window.location.href = '/login';
      // });

    };

  }
);