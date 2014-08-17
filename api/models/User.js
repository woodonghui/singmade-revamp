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

    /**
     *
     *  @description
     *  email address as unique id
     *
     */
    email: {
      type: 'email',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true
    },

    /**
     *
     *  @description
     *  user avatar image
     *  cloudinary json instance
     *
     */
    avatar: 'json',

    online: {
      type: 'boolean',
      defaultsTo: false
    },


    /**
     *
     *  @description
     *  reset password token to be set when
     *  user requests to change/forget password
     *
     */
    resetPasswordToken: 'string',


    /**
     *
     *  @description
     *  "designer" or "user"
     *
     */
    userType: {
      type: 'string',
      defaultsTo: 'user'
    },


    /**
     *
     *  @description
     *  refer to Designer id
     *  once created, read only
     *
     */
    designerId: 'string',


    /**
     *
     *  @description
     *  Q promise implementation of save()
     *  HOWEVER, IT DOESN'T WORK WHEN SAVE ARRAY
     *
     */
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