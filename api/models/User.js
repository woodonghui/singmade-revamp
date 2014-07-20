var Q = require('q');
/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // userId: {  
    //  type: 'string',
    //  required: true,
    //  unique: true
    // },

    email: { // unique user id  
      type: 'email',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true
    },

    resetPasswordToken: 'string',

    iFollows: 'array',
    iLikes: 'array',

    userType: {
      type: 'string',
      defaultsTo: 'user'
    }, // "designer", "user"

    designerId: 'string', // foreign key if user is a designer 


    // Q promise implementation of save()
    saveQ: function() {
      var deferred = Q.defer();

      this.save(function(err, user) {

        if (!user) {
          deferred.reject(err);
        } else {
          deferred.resolve(user);
        }

      });
      return deferred.promise;
    }

  },

  validationMessages: {
    email: {
      required: 'Email is required',
      email: 'Enter valid email'
    },
    password: {
      required: 'Password is required'
    }
  }

};