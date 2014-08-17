/**
 * ManageController
 *
 * @module      :: Controller
 * @description :: A set of functions for designers to organize the pieces.
 *
 *                 Upload, Delete pieces and images
 *
 */

var Q = require('q');
var shortId = require('shortid');
var _ = require('../utils/underscore');
var cloudinary = require('../services/cloudinary');

var errorMessagesParser = require('../utils/errorMessagesParser');


module.exports = {


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ManageController)
   */
  _config: {},


  /**
   *  @GET
   *    /me/piece
   *
   *  @description
   *  list my pieces
   *
   */
  list: function(req, res) {
    var sessionUser = req.session.user;
    Piece.findByDesigner(sessionUser.designer.name).then(function(pieces) {
      return res.view({
        pieces: pieces
      });
    }).fail(function(err) {
      return res.serverError(err);
    });
  },



  /**
   *  @GET
   *    /me/piece/edit/:id
   *
   *  @description
   *  create/update piece document
   *  create new piece if it doesn't exist
   *  otherwise update the piece
   */
  edit: function(req, res) {
    Piece.findOneById(req.params.id).then(function(piece) {
      return res.view({
        piece: piece
      });
    }).fail(function(err) {
      return res.serverError(err);
    });
  },


  /**
   *  @GET
   *    /me/piece/delete/:id
   *
   *  @description
   *  delete piece document
   *
   */
  delete: function(req, res) {
    Piece.destroy({
      id: req.params.id
    }).done(function(err) {
      if (err) {
        return res.serverError(err);
      } else {
        return res.redirect('/me/piece');
      }
    });
  },


  /**
   *  @POST
   *    /me/piece/save
   *
   *  @description
   *  create new piece
   *
   */
  save: function(req, res) {

    var pieceData = {
      title: req.body.title,
      description: req.body.description
    };

    Piece.findOne({
      title: req.body.title,
      designer: req.session.user.designer.name
    }).then(function(piece) {

      if (piece) throw new Error('titleExists');
      return Piece.create({
        title: req.body.title,
        description: req.body.description,
        designer: req.session.user.designer.name
      });

    }).then(function(piece) {
      res.redirect('/me/piece/images/' + piece.id);
    }).fail(function(err) {

      console.log(err);

      if (err.message == 'titleExists') {
        return res.view('manage/add', {
          err: ['title exists']
        });
      }

      if (err.ValidationError) {
        var error = errorMessagesParser.parse(Piece, err);
        return res.view('manage/add', {
          err: error
        });
      }

      return res.serverError(err);
    });

  },


  /**
   *  @POST
   *    /me/piece/update/:id
   *
   *  @description
   *  update piece
   *
   */
  update: function(req, res) {
    // var designerName = req.session.user.designer.name;
    // var slugId = _.slug(req.body.title, 'by', designerName);

    var pieceData = {
      id: req.params.id,
      title: req.body.title,
      description: req.body.description
    };

    Piece.findOne({
      title: req.body.title,
      designer: req.session.user.designer.name
    }).then(function(piece) {

      if (piece && piece.id != pieceData.id) throw new Error('titleExists');
      return Piece.findOneById(pieceData.id);

    }).then(function(piece) {

      piece.title = pieceData.title;
      piece.description = pieceData.description;

      return piece.saveQ();

    }).then(function(piece) {

      return res.redirect('/me/piece/images/' + piece.id);

    }).fail(function(err) {

      if (err.message == 'titleExists') {
        return res.view('manage/edit', {
          piece: pieceData,
          err: ['title exists']
        });
      }

      if (err.ValidationError) {
        var error = errorMessagesParser.parse(Piece, err);
        return res.view('manage/edit', {
          piece: pieceData,
          err: error
        });
      }

      return res.serverError(err);
    });

  },



  /**
   *  @GET
   *    /me/piece/images/:id
   *
   *  @description
   *  list piece images
   *
   */
  images: function(req, res) {
    Piece.findOneById(req.params.id).then(function(piece) {
      return res.view({
        piece: piece
      });
    }).fail(function(err) {
      return res.serverError(err);
    });
  },


  /**
   *  @POST
   *  @AJAX
   *    /me/piece/images/:id
   *
   *  @description
   *  post piece image
   *
   */
  upload: function(req, res) {
    Piece.findOneById(req.params.id).then(function(piece) {
      return [piece, cloudinary.upload(req.files.file.path)];
    }).spread(function(piece, image) {
      if (!image && !image.public_id) {
        return res.json({
          message: 'upload failed'
        }, 400);
      }
      if (!piece.images) piece.images = [];
      piece.images.push(image);
      piece.save(function(err) {
        return res.json(200);
      });
    }).fail(function(err) {
      res.serverError(err);
    });
  },


  /**
   *  @GET
   *    /me/piece/images/destroy/:id
   *
   *  @description
   *  delete images
   *
   */
  destroy: function(req, res) {
    // if (_.isEmpty(req.query.public_id))
    //   return res.json({
    //     message: 'no image found'
    //   }, 400);

    if (_.isEmpty(req.params.publicId))
      return res.json({
        message: 'no image found'
      }, 400);

    Piece.findOneById(req.params.id).then(function(piece) {
      var image = _.find(piece.images, function(e) {
        return e.public_id == req.params.publicId;
      });
      var index = _.indexOf(piece.images, image);
      if (index > -1) piece.images.splice(index, 1);

      piece.save(function(err) {
        return res.json(200);
        // return res.redirect('/me/piece/images/' + piece.id);
      });

    }).fail(function(err) {
      return res.serverError();
    });

  },


};