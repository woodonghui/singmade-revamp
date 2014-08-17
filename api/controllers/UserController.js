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

var _ = require('underscore');
var shortid = require('shortid');
var Q = require('q');

var cloudinary = require('../services/cloudinary');
var mailer = require('../services/mailer');

var errorMessagesParser = require('../utils/errorMessagesParser');


module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},


  /**
   *  @GET
   *    /signup
   *
   *  @description
   *  description
   *
   */
  signup: function(req, res) {
    if (req.session.user != null) return res.redirect('/me');
    return res.view();
  },


  /**
   *  @POST
   *    /user/create
   *
   *  @description
   *  create a user
   *
   */
  create: function(req, res) {
    User.findOneByEmail(req.body.email).then(function(user) {
      if (user) throw new Error('user_message_user_exists');
      return User.create({
        email: req.body.email,
        password: req.body.password
      });
    }).then(function(user) {
      return res.view('info', {
        info: 'Sign up successfully',
        action: 'login now',
        redirect: '/login'
      });
    }).fail(function(err) {
      if (err.message == 'user_message_user_exists') {
        return res.view('user/signup', {
          err: [err.message]
        });
      }

      if (err.ValidationError) {
        var error = errorMessagesParser.parse(User, err);
        return res.view('user/signup', {
          err: error
        });
      }
      return res.serverError(err);
    });

  },


  login: function(req, res) {
    if (req.session.user != null) return res.redirect('/me');
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
          userType: user.userType,
          avatar: user.avatar
        };

        user.online = true;
        user.save(function(err) {

          User.publishUpdate(user.id, {
            loggedIn: true,
            eventName: 'loggedIn',
            datetime: Date.now(),
            id: user.id,
            email: user.email
          });

          return res.redirect('/me');
        });

      })
      .fail(function(err) {

        if (err.message == 'authenticationFail')
          return res.view('user/login', {
            err: 'Authentication fail'
          });
        return res.view('500');
      });
  },


  /**
   *  @GET
   *    /logout
   *
   *  @description
   *  user logout
   *
   */
  logout: function(req, res) {
    User.findOneByEmail(req.session.user.email, function(err, user) {
      if (err) return next(err);

      user.online = false;
      user.save(function(err) {

        delete req.session['user'];

        User.publishUpdate(user.id, {
          loggedIn: false,
          datetime: Date.now(),
          id: user.id,
          email: user.email
        });

        return res.redirect('/login');
      });

    });
  },


  /**
   *  @GET
   *    /me
   *
   *  @description
   *  user profile page
   *
   */
  me: function(req, res) {
    User.findOneByEmail(req.session.user.email)
      .then(function(user) {
        if (user.userType != 'designer' || !user.designerId)
          return res.view();

        return Designer.findOneById(user.designerId);
      }).then(function(designer) {
        req.session.user['designer'] = designer;
        return res.view();
      })
      .fail(function(err) {
        return res.serverError(err);
      });
  },



  /**
   *  @GET
   *    /forgot-password
   *    /change-password
   *
   *  @description
   *  request to change/reset password
   *
   */
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
          info: 'Reset password email is sent'
        });

      }).fail(function(err) {
        return res.serverError(err);
      });

    } else {
      return res.view();
    }
  },


  /**
   *@description
   *  generate scurity token for password reset
   *  stored in user.resetPasswordToken
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
        return res.view('user/resetPasswordRequest', {
          err: 'Email is required'
        });
      }

      if (err.message == 'noUserExists') {
        return res.view('user/resetPasswordRequest', {
          err: 'No user exists'
        });
      }

      return res.serverError(err);

    });
  },


  /**
   *  @GET
   *    /reset-password?email={email}&resetPasswordToken={token}
   *
   *  @description
   *  display reset password form
   *
   */
  resetPassword: function(req, res) {
    var email = req.query.email;
    var token = req.query.resetPasswordToken;
    Q.fcall(function() {
      if (_.isEmpty(email) || _.isEmpty(token))
        throw new Error('invalidToken');
      return User.findOneByEmail(email);
    }).then(function(user) {
      if (!user || user.resetPasswordToken != token)
        throw new Error('invalidToken');
      return res.view({
        email: user.email,
        token: user.resetPasswordToken
      });
    }).fail(function(err) {
      if (err.message == 'invalidToken')
        return res.view('info', {
          info: 'Invalid token'
        });
      return res.serverError(err);
    });
  },


  /**
   *  @POST
   *    /user/updatePassword
   *
   *  @description
   *  update password
   *
   */
  updatePassword: function(req, res) {
    var email = req.body.email;
    var token = req.body.token;
    var password = req.body.password;

    Q.fcall(function() {
      if (_.isEmpty(email) || _.isEmpty(token))
        throw new Error('badRequest');
      if (_.isEmpty(password))
        throw new Error('passwordIsRequired');
      return User.findOneByEmail(email);
    }).then(function(user) {
      if (!user || user.resetPasswordToken != token)
        throw new Error('badRequest');

      user.password = password;
      return user.saveQ();
    }).then(function(user) {
      return res.view('info', {
        info: 'password changed',
        action: 'go back to login',
        redirect: '/login'
      });

    }).fail(function(err) {
      if (err.message == 'passwordIsRequired') {
        return res.view('user/resetPassword', {
          email: email,
          token: token,
          err: 'password is required'
        });
      }
      if (err.message == 'badRequest')
        return res.view('info', {
          info: 'invalid request'
        });
      return res.serverError(err);
    });
  },


  /**
   *  @POST
   *    /me/avatar
   *
   *  @description
   *  save user avatar image on cloudinary
   *
   */
  avatar: function(req, res) {

    if (_.isEmpty(req.files.avatar.name))
      return res.redirect('/me');

    var email = req.session.user.email;
    cloudinary.upload(req.files.avatar.path).then(function(file) {
      // if (_.has(file, 'public_id')) {
      //   req.body.avatar = cloudinary.url(file.public_id, file.format, {
      //     width: 200,
      //     height: 200,
      //     crop: "fill"
      //   });
      // }
      if (file && file.public_id)
        return [User.findOneByEmail(email), file];
      return res.redirect('/me');
    }).spread(function(user, file) {
      user.avatar = file;
      user.save(function(err) {
        req.session.user.avatar = user.avatar;
        return res.redirect('/me');
      });
    }).fail(function(err) {
      return res.serverError(err);
    })

  },


  // TRY socket
  // subscribe: function(req, res) {

  //   User.find(function(err, users) {
  //     if (err) return next(err);
  //     User.subscribe(req.socket);

  //     User.subscribe(req.socket, users);

  //     res.send(200);

  //   });

  // },



  /**
   *  @GET
   *  @AJAX
   *    /api/me/followees
   *
   *  @description
   *  get who i am following
   *  SAILS.JS DOES'T SUPPORT ACCOCIATION
   *  QUERY LIKE
   *  FOLLOWERS: {EMAIL: 'EMAIL'}
   *  WON'T WORK
   *
   *  use mongo-native
   */

  followees: function(req, res) {
    Designer.native(function(err, collection) {
      collection.find({
          "followers.email": req.session.user.email,
          "followers.isFollowing": true
        })
        .toArray(function(err, docs) {
          if (err) return res.serverError(err);
          return res.json(docs);
        });
    });
  },

  /**
   *  @GET
   *    /api/me/likes
   *
   *  @description
   *  my likes
   *
   */

  likes: function(req, res) {
    Piece.native(function(err, collection) {
      collection.find({
          "likes.email": req.session.user.email,
        })
        .toArray(function(err, docs) {
          if (err) return res.serverError(err);
          return res.json(docs);
        });
    });
  },






};