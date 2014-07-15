var cloudinary = require('cloudinary');
var Q = require('q');

cloudinary.config({
  cloud_name: 'boutiquesg',
  api_key: '981248284822466',
  api_secret: 'g3c0E0y9TlhylPZUAqJ5TJSRH8g'
});

exports.url = function(public_id, format, option) {
  return cloudinary.url(public_id + "." + format, option);
};

exports.upload = function(path) {
  var deferred = Q.defer();

  cloudinary.uploader.upload(path, function(result) {
    console.log(result);

    if (!result) {
      deferred.reject(new Error());
    } else {
      deferred.resolve(result);
    }

  });

  return deferred.promise;

};