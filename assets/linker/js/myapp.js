var myApp = angular.module('myApp', [
  'myAppControllers',
  'homeControllers',
  'designerControllers',
  'pieceControllers'
]);


/**
 *  sails js socket io
 *  example:
 *  socket.on(eventName, callback);
 *
 */
myApp.factory('socket', function($window, $rootScope) {
  var socket;

  if (!(socket = $window.socket)) {
    socket = $window.io.connect();

    socket.on('connect', function socketConnected() {
      // Listen for Comet messages from Sails
      socket.on('message', messageReceived);

      console.log(
        'Socket is now connected and globally accessible as `socket`.\n' +
        'e.g. to send a GET request to Sails, try \n' +
        '`socket.get("/", function (response) ' +
        '{ console.log(response); })`'
      );

    });

    $window.socket = socket;
  }

  var messageCallbackMapping = {};

  var messageReceived = function(message) {

    ///////////////////////////////////////////////////////////
    // Replace the following with your own custom logic
    // to run when a new message arrives from the Sails.js
    // server.
    ///////////////////////////////////////////////////////////
    var callback = messageCallbackMapping[message.data.eventName];

    $rootScope.$apply(function() {
      if (callback) {
        callback.call(socket, message);
      }
    });

    //////////////////////////////////////////////////////
  };

  return {
    on: function(eventName, callback) {
      messageCallbackMapping[eventName] = callback;
    }

  };

});



/**
 *  service
 *  like, comment, follow, unfollow
 *
 */
myApp.service('socialAction', function($http, $window, $q) {

  this.follow = function(name) {
    var deferred = $q.defer();

    var url = '/social/follow/' + name;
    $http.get(url, {
      cache: false
    }).success(function(data) {
      deferred.resolve(data)
    }).error(function(err, status) {
      deferred.reject(status);
    });

    return deferred.promise;
  };


  this.unfollow = function(name) {
    var deferred = $q.defer();

    var url = '/social/unfollow/' + name;
    $http.get(url, {
      cache: false
    }).success(function(data) {
      deferred.resolve(data)
    }).error(function(err, status) {
      deferred.reject(status);
    });

    return deferred.promise;
  };

  this.like = function(slugId, callback) {
    var deferred = $q.defer();

    var url = '/social/like/' + slugId;
    $http.get(url, {
      cache: false
    }).success(function(data) {
      deferred.resolve(data)
    }).error(function(err, status) {
      deferred.reject(status);
    });

    return deferred.promise;
  };

});






/**
 *  App Settings
 *
 */
myApp.factory('settings', function() {
  return {
    imageHostUrl: "http://res.cloudinary.com/boutiquesg/image/upload/",
    noImageUrl: "http://res.cloudinary.com/boutiquesg/image/upload/c_pad,h_200,w_250/image-placeholder_q3ebib.png",
    noImageAvatarUrl: "http://res.cloudinary.com/boutiquesg/image/upload/v1384063868/singmade-logo-i_vf9sbv.png"
  };
});




myApp.directive('noAvatar', function(settings) {

  var setDefaultImage = function(el) {
    el.attr('src', settings.noImageAvatarUrl);
  };

  return {
    restrict: 'A',
    link: function(scope, el, attr) {
      scope.$watch(function() {
        return attr.ngSrc;
      }, function() {
        if (!attr.ngSrc) {
          setDefaultImage(el);
        } else {
          // var src = settings.imageHostUrl + 'c_fill,h_' + attr.gridHeight + ',w_' + attr.gridWidth + '/' + attr.imageId + '.' + attr.format;
          el.attr('src', attr.ngSrc);
        }
      });
      el.bind('error', function() {
        setDefaultImage(el);
      });
    }
  };

});



/**
 *  no-image directive
 *  use default image if the ng-src is not accessible
 *
 */
myApp.directive('noImage', function(settings) {

  var setDefaultImage = function(el) {
    el.attr('src', settings.noImageUrl);
  };

  return {
    restrict: 'A',
    link: function(scope, el, attr) {
      scope.$watch(function() {
        return attr.imageId;
      }, function() {
        if (!attr.imageId) {
          setDefaultImage(el);
        } else {
          var src = settings.imageHostUrl + 'c_fill,h_' + attr.gridHeight + ',w_' + attr.gridWidth + '/' + attr.imageId + '.' + attr.format;
          el.attr('src', src);
        }
      });

      el.bind('error', function() {
        setDefaultImage(el);
      });
    }
  };

});



/**
 *  user avatar directive
 *  use default image if the ng-src is not accessible
 *
 */
myApp.directive('userAvatar', function($http, settings) {

  return {
    restrict: 'A',
    link: function(scope, el, attr) {
      scope.$watch(function() {
        return attr.userId;
      }, function() {
        if (!attr.userId) {
          el.attr('src', settings.noImageAvatarUrl);
        } else {
          $http.get('/api/userAvatar/' + attr.userId, {
            cache: true
          }).success(function(data) {
            var src = settings.imageHostUrl + 'c_fill,h_100,w_100/' + data.public_id + '.' + data.format;
            el.attr('src', src);
          }).error(function(err, status) {});
        }
      });

      el.bind('error', function() {
        el.attr('src', settings.noImageAvatarUrl);
      });
    }
  };

});




myApp.directive('busyButton', function($parse) {
  return {
    restrict: 'A',
    link: function($scope, el, attr) {
      //$parse default ng-click event into a function
      //Doc: https://docs.angularjs.org/api/ng/service/$parse
      var fn = $parse(attr.ngClick);
      // unbind the default click event
      el.unbind('click');
      // bind the new click event
      el.bind('click', function(event) {
        $scope.$apply(function() {
          // console.log('busy button disabled')
          attr.$set('disabled', true);
          //trigger the default ngClick event
          //it should return a promise function
          fn($scope, {
            $event: event
          }).then(function(result) {
            // console.log('busy button enabled in resolve function');
            attr.$set('disabled', false);
          }, function(reason) {
            // console.log('busy button enabled in reject function');
            attr.$set('disabled', false);
          });
        });
      });
    }
  };

});