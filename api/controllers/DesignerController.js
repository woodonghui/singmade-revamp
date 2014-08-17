/**
 * DesignerController
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
var Q = require('q');
var cloudinary = require('../services/cloudinary');

var errorMessagesParser = require('../utils/errorMessagesParser');


module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to DesignerController)
   */
  _config: {},




  /**
   *  @POST
   *    /me/be-a-designer
   *
   *  @description
   *  change the userType from user to designer
   *
   */

  beADesigner: function(req, res) {
    var sessionUser = req.session.user;
    if (sessionUser.userType == 'user') {
      User.findOneByEmail(sessionUser.email).then(function(user) {
        user.userType = 'designer';
        return user.saveQ();
      }).then(function(user) {
        req.session.user.userType = 'designer';
        return res.redirect('/me');
      }).fail(function(err) {
        return res.serverError(err);
      });
    } else {
      return res.redirect('/me');
    }
  },


  /**
   *  @POST
   *    /me/designer
   *
   *  @description
   *  save designer profile
   *
   */
  save: function(req, res) {
    var email = req.session.user.email;
    Designer.findOneByName(req.body.name).then(function(designer) {
        //if designer name exists and 
        //not belongs to current login user
        if (designer) {
          if (!req.session.user.designerId)
            throw new Error('designer_validation_message_name_has_been_taken');
          else if (req.session.user.designerId != designer.id)
            throw new Error('designer_validation_message_name_has_been_taken');
        }
        return User.findOneByEmail(email);
      })
      .then(function(user) {
        // No designer created yet
        if (!user.designerId)
          return [Designer.create(req.body), user, true];

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

      if (err.message == 'designer_validation_message_name_has_been_taken') {
        return res.view('user/me', {
          err: [err.message]
        });
      }

      if (err.ValidationError) {
        var error = errorMessagesParser.parse(Designer, err);
        return res.view('user/me', {
          err: error
        });
      }

      return res.serverError(err);
    });

  },



  /**
   *  @GET
   *    /designer
   *
   *  @description
   *  show all the designers
   *
   */
  all: function(req, res) {
    Designer.find().then(function(designers) {

      return res.view({
        designers: designers
      });

    }).fail(function(err) {
      return res.view('500');
    });
  },


  /**
   *  @GET
   *    /designer/:name
   *
   *  @description
   *  show designer
   *
   */
  list: function(req, res) {
    var name = req.params.name;

    Designer.findOneByName(name).then(function(designer) {

      if (!designer) throw new Error('noDesignerFound');

      return designer;

    }).then(function(designer) {

      return [Piece.findByDesigner(designer.name), designer];

    }).spread(function(pieces, designer) {

      return res.view({
        designer: designer,
        pieces: pieces
      });

    }).fail(function(err) {

      if (err.message == 'noDesignerFound') return res.view('designer/noDesignerFound', {
        lookhere: 'look here'
      });

      return res.view('500');

    });
  },


  /**
   *  @GET
   *    /api/designer/:name
   *
   *  @description
   *  get designer
   *
   */
  designer: function(req, res) {
    Designer.findOneByName(req.params.name).then(function(designer) {
        return res.json({
          designer: designer,
          loginUser: req.session.user ? req.session.user.email : ''
        });
      })
      .fail(function(err) {
        return res.serverError(err);
      });
  },


  // subscribe: function(req, res) {
  //   Designer.findOneByName(req.params.name, function(err, designer) {
  //     if (err) return next(err);

  //     Designer.subscribe(req.socket, designer);
  //     res.send(200);
  //   });
  // },



};