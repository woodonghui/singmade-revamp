var _ = require('underscore');
var shortid = require('shortid');
var Q = require('q');

var cloudinary = require('../services/cloudinary');
var mailer = require('../services/mailer');

var errorMessagesParser = require('../utils/errorMessagesParser');

/**
 * UserController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},


  signup: function(req, res) {
    if (req.session.user != null) {
      return res.redirect('/me');
    }

    return res.view();
  },


  // POST create a user
  create: function(req, res) {

    User.findOneByEmail(req.body.email).then(function(user) {
      if (user) throw new Error('userExists');

      return User.create(req.body);

    }).then(function(user) {

      return res.view('info', {
        info: 'Sign up successfully',
        redirect: '/login'
      });

    }).fail(function(err) {

      if (err.message == 'userExists') {
        return res.view('user/signup', {
          err: ['User exists']
        });
      }

      if (err.ValidationError) {

        var error = errorMessagesParser.parse(User, err);

        return res.view('user/signup', {
          err: error
        });
      }

      return res.view('500');

    });

  },


  login: function(req, res) {
    if (req.session.user != null) {

      return res.redirect('/me');
    }

    return res.view();
  },

  auth: function(req, res) {

    var email = req.body.email;
    var password = req.body.password;

    User.findOneByEmail(email)
      .then(function(user) {

        // authentication fail
        if (!user || user.password != password) throw new Error('authenticationFail');

        // normal user login, redirect to home page
        req.session.user = {
          email: user.email,
          userType: user.userType
        };

        return res.redirect('/me');
      })
      .fail(function(err) {

        if (err.message == 'authenticationFail')
          return res.view('user/login', {
            err: 'Authentication fail'
          });
        return res.view('500');
      });
  },

  logout: function(req, res) {

    if (req.session.user != null) {
      delete req.session['user'];
      // req.session.user = null; 
    }

    return res.redirect('/user/login');
  },


  me: function(req, res) {
    User.findOneByEmail(req.session.user.email)
      .then(function(user) {

        if (user.userType != 'designer' || !user.designerId) return res.view();

        return Designer.findOneById(user.designerId);

      }).then(function(designer) {
        req.session.user['designer'] = designer;
        return res.view();
      })
      .fail(function(err) {
        return res.view('500');
      });
  },



  // GET forgot password request
  // GET change password request
  resetPasswordRequest: function(req, res) {
    if (!_.isEmpty(req.session.user)) {
      var user = req.session.user;

      User.findOneByEmail(user.email).then(function(user) {

        user.resetPasswordToken = shortid.generate();
        return user.saveQ();

      }).then(function(user) {

        var template_content = [{
          "name": "url",
          "content": "http://localhost:3000/reset-password?email=" + user.email + "&resetPasswordToken=" + user.resetPasswordToken
        }];

        mailer.sendTemplate('reset-password', template_content, null, user.email, null);

        return res.view('info', {
          info: 'Reset password email is sent',
          redirect: '/login'
        });

      }).fail(function(err) {

        return res.view('500')
      });

    } else {
      res.view();
    }
  },


  /**
   *  generate scurity token for password reset
   *  stored as user.resetPasswordToken
   */
  createResetPasswordToken: function(req, res) {
    var email = req.body.email;
    Q.fcall(function() {

      if (_.isEmpty(email)) throw new Error('emailIsRequired');

      return User.findOneByEmail(email);

    }).then(function(user) {

      if (!user) throw new Error('noUserExists');

      user.resetPasswordToken = shortid.generate();
      return user.saveQ();

    }).then(function(user) {

      var template_content = [{
        "name": "url",
        "content": "http://localhost:3000/reset-password?email=" + user.email + "&resetPasswordToken=" + user.resetPasswordToken
      }];

      mailer.sendTemplate('reset-password', template_content, null, user.email, null);

      return res.view('info', {
        info: 'Reset password email is sent',
        redirect: '/login'
      });

    }).fail(function(err) {

      if (err.message == 'emailIsRequired') {
        return res.view('user/resetPassword', {
          err: 'Email is required'
        });
      }

      if (err.message == 'noUserExists') {
        return res.view('user/resetPassword', {
          err: 'No user exists'
        });
      }

      sails.log.error(err);

      return res.view('500');

    });
  },


  /**
   *  GET reset password
   */
  resetPassword: function(req, res) {
    var email = req.query.email;
    var token = req.query.resetPasswordToken;
    Q.fcall(function() {

      if (_.isEmpty(email) || _.isEmpty(token)) throw new Error('invalidToken');

      return User.findOneByEmail(email);

    }).then(function(user) {
      // sails.log.debug(user);

      if (!user || user.resetPasswordToken != token) throw new Error('invalidToken');

      return res.view({
        email: user.email,
        token: user.resetPasswordToken
      });

    }).fail(function(err) {
      if (err.message == 'invalidToken') return res.view('info', {
        info: 'Invalid token',
        redirect: '/login'
      });
      return res.view('500');
    });
  },

  // POST update password
  updatePassword: function(req, res) {
    var email = req.body.email;
    var token = req.body.token;
    var password = req.body.password;

    Q.fcall(function() {
      if (_.isEmpty(email) || _.isEmpty(token)) throw new Error('badRequest');
      if (_.isEmpty(password)) throw new Error('passwordIsRequired');

      return User.findOneByEmail(email);

    }).then(function(user) {
      if (!user || user.resetPasswordToken != token) throw new Error('badRequest');

      user.password = password;
      return user.saveQ()

    }).then(function(user) {

      return res.view('info', {
        info: 'Password changed',
        redirect: '/login'
      })

    }).fail(function(err) {

      if (err.message == 'badRequest') return res.view('info', {
        info: 'Invalid request',
        redirect: '/'
      });

      return res.view('500')
    });
  },



  // designer related

  saveDesigner: function(req, res) {
    var sessionUser = req.session.user;

    Q.fcall(function() {

      if (!_.isEmpty(req.files.avatar.name)) {
        return cloudinary.upload(req.files.avatar.path);
      }

      return '';

    }).then(function(file) {
      var url = '';
      if (_.has(file, 'public_id')) {
        req.body.avatar = cloudinary.url(file.public_id, file.format, {
          width: 200,
          height: 200,
          crop: "fill"
        });
      }

      return User.findOneByEmail(sessionUser.email);
    })

    //find user instance
    .then(function(user) {
        // No designer created yet
        if (!user.designerId) return [Designer.create(req.body), user, true];
        // find the designer instance
        else return [Designer.findOneById(user.designerId), user, false];
      })
      .spread(function(designer, user, isNewDesigner) {
        if (isNewDesigner) {
          user.designerId = designer.id;
          user.save(function(err) {
            return res.redirect('/me');
          });
        } else {

          _.extend(designer, req.body);

          designer.save(function(err) {
            return res.redirect('/me');
          });
        }
      })
      .fail(function(err) {
        console.log(err);
        return res.view('user/me', {
          err: err
        });
      });

  },









  // api calls

  follow: function(req, res) {
    var name = req.params.name;

    // find the designer instance
    Designer.findOneByName(name).done(function(err, designer) {
      if (err || !designer) return res.json({
        error: true
      });

      // initialize followers array if it is empty
      var follower = req.session.user.email;
      if (designer.followers == null) designer.followers = [];

      // whether the follower exists in the followers 
      if (designer.followers.indexOf(follower) != -1)
        return res.json({
          success: true
        });

      // add follower into the array
      designer.followers.push(follower);
      // save the instance
      designer.save(function(err) {
        if (err) return res.json({
          error: err
        });

        return res.json(designer);
      });

    });

    // Designer.findOneByName(name).then(function(designer) {
    //   if (!designer) throw new Error();
    //   return designer;
    // }).then(function(designer) {

    //   var follower = req.session.user.email;
    //   if (designer.followers == null) designer.followers = [];
    //   designer.followers.push(follower);
    //   return designer.save();
    //   // runtime error here
    //   // save not Q promise???
    // }).then(function(err) {
    //   return res.json({
    //     success: true
    //   });
    // }).fail(function(err) {
    //   return res.json({
    //     error: true
    //   });
    // });
  },

  unfollow: function(req, res) {
    var name = req.params.name;

    // Designer.findOneByName(name).done(function(err, designer) {
    //     if (err) return res.view('500');
    //   }
    // }
  }


};