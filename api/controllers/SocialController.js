/**
 * ManageController
 *
 * @module      :: Controller
 * @description :: A set of functions for user social actions.
 *
 *                 Like, Comment, Share, Follow
 *
 */

var Q = require('q');
var _ = require('../utils/underscore');
var cloudinary = require('../services/cloudinary');

// var errorMessagesParser = require('../utils/errorMessagesParser');

module.exports = {


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ManageController)
   */
  _config: {},



  /**
   *  @GET
   *    /social/follow/:designer
   *
   *  @description
   *  follow designer
   *
   */
  follow: function(req, res) {
    var name = req.params.designer;

    // find the designer instance
    Designer.findOneByName(name).then(function(designer) {
      if (!designer)
        return res.json({
          message: 'designer not exists'
        }, 400);

      return designer;

    }).then(function(designer) {

      // initialize followers array if it is empty

      if (!designer.followers) designer.followers = [];

      var follower;
      // whether the follower exists in the followers 
      // if (designer.followers.indexOf(follower) != -1)
      //   return res.json(designer, 200);
      if (follower = _.findWhere(designer.followers, {
        email: req.session.user.email
      })) {

        follower.isFollowing = true;

      } else {
        // add follower into the array
        designer.followers.push({
          email: req.session.user.email,
          date: Date.now(),
          isFollowing: true
        });
      }

      // save the instance
      designer.save(function(err) {
        if (err) return res.serverError(err);

        return res.json({
          message: 'followed'
        }, 200);
      });

    }).fail(function(err) {
      return res.serverError(err);
    });

  },


  /**
   *  @GET
   *    /user/unfollow/:designer
   *
   *  @description
   *  unfollow designer
   *
   */

  unfollow: function(req, res) {
    var name = req.params.designer;

    // find the designer instance
    Designer.findOneByName(name).then(function(designer) {
      if (!designer)
        return res.json({
          message: 'designer not exists'
        }, 400);

      return designer;

    }).then(function(designer) {

      // initialize followers array if it is empty
      var follower;

      // whether the follower exists in the followers 
      // if (!designer.followers || designer.followers.indexOf(follower) == -1)
      //   return res.json(designer, 200);
      if (!(follower = _.findWhere(designer.followers, {
        email: req.session.user.email
      }))) {
        return res.json({
          message: 'not followed yet'
        }, 200);
      }

      // remove follower from the array
      // var index = _.indexOf(designer.followers, follower);
      // if (index > -1) designer.followers.splice(index, 1);
      follower.isFollowing = false;

      // save the instance
      designer.save(function(err) {
        if (err) return res.serverError(err);

        return res.json({
          message: 'unfollowed'
        }, 200);
      });

    }).fail(function(err) {
      return res.serverError(err);
    });

  },




  /**
   *  @GET
   *    /social/like/:pieceId
   *
   *  @description
   *  user like a piece of design
   *
   */
  like: function(req, res) {

    Piece.findOneBySlugId(req.params.pieceId).then(function(piece) {
      if (!piece) return res.json({
        message: 'params are missing'
      }, 400);

      if (!piece.likes) piece.likes = [];

      if (_.findWhere(piece.likes, {
        email: req.session.user.email
      })) {
        return res.json({
          message: 'already liked'
        }, 200);
      }

      piece.likes.push({
        email: req.session.user.email,
        date: Date.now()
      });

      // save the instance
      piece.save(function(err) {
        if (err) return res.serverError(err);

        return res.json({
          message: 'liked'
        }, 200);
      });

    }).fail(function(err) {
      return res.serverError(err);
    });
  },




};