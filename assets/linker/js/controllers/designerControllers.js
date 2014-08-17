var designerControllers = angular.module('designerControllers', []);


/**
 *  @description
 *  DesignerViewCtrl
 *
 */
designerControllers.controller('DesignerViewCtrl',
  function($scope, $http, $filter, socialAction, socket, $window) {

    $scope.isFollowing = false;

    $scope.init = function(name, title, profile, avatar) {
      $scope.designer = {
        name: name,
        title: title,
        profile: profile,
        avatar: avatar
      };

      $http.get('/api/designer/' + $scope.designer.name).success(function(data) {
        $scope.isFollowing = $filter('filter')(data.designer.followers || [], {
          email: data.loginUser,
          isFollowing: true
        }).length > 0;

      });
    };


    $scope.follow = function() {
      // expect returning a promise function
      return socialAction.follow($scope.designer.name)
        .then(function(result) {
          $scope.isFollowing = true;
        }, function(err) {
          console.log(err);
          if (err == 403)
            $window.location.href = '/login';
        });
    };

    $scope.unfollow = function() {
      return socialAction.unfollow($scope.designer.name)
        .then(function(result) {
          $scope.isFollowing = false;
        }, function(err) {
          console.log(err);
          if (err == 403)
            $window.location.href = '/login';
        });
    };

  }
);