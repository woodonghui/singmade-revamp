/**
 * PieceController
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

var Q = require('q');
var shortId = require('shortid');
var _ = require('../utils/underscore');
var cloudinary = require('../services/cloudinary');

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to PieceController)
   */
  _config: {},


  /**
   *  @GET
   *    /piece/slug-id-with-readable-name
   *
   *  @description
   *  list the details of the piece
   *
   */
  detail: function(req, res) {
    var slug = req.params.slug;

    Piece.findOneBySlugId(slug)
      .then(function(piece) {
        if (!piece) throw new Error('noPieceFound');
        return piece;
      })
      .then(function(piece) {
        return [Designer.findOneByName(piece.designer), piece];
      })
      .spread(function(designer, piece) {
        if (!designer) throw new Error('noPieceFound');
        return res.view({
          designer: designer,
          piece: piece
        });
      })
      .fail(function(err) {
        if (err.message == 'noPieceFound')
          return res.notFound();
        return res.serverError(err);
      });
  },



  /**
   * list pieces for owner
   * to manage pieces
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
   * create/update piece document
   * create new piece if it doesn't exist
   * otherwise update the piece
   */

  //GET
  edit: function(req, res) {
    Q.fcall(function() {
      if (_.isEmpty(req.params.id)) {
        return res.view({
          piece: {}
        });
      }
      return Piece.findOneById(req.params.id);
    }).then(function(piece) {

      if (!piece) {
        return res.view({
          piece: {}
        });
      }
      return res.view({
        piece: piece
      });
    }).fail(function(err) {
      return res.serverError(err);
    });
  },

  //POST
  //TODO
  save: function(req, res) {
    var sessionUser = req.session.user;

    if (_.isEmpty(req.body.id)) {
      var pieceData = req.body;
      pieceData.slugId = _.slug(pieceData.title, 'by', sessionUser.designer.name);
      pieceData.designer = sessionUser.designer.name;

      Piece.create(pieceData).then(function(piece) {
        res.redirect('/me/piece/images/' + piece.id);

      }).fail(function(err) {
        return res.serverError(err);
      });

    } else {
      Piece.findOneById(req.body.id).then(function(piece) {
        piece.title = req.body.title;
        piece.description = req.body.description;
        piece.slugId = _.slug(req.body.title, 'by', sessionUser.designer.name);

        piece.save(function(err) {
          res.redirect('/me/piece/images/' + piece.id);
        });

      }).fail(function(err) {
        return res.serverError(err);
      });
    }

  },



  /**
   * upload (add) images
   *
   */
  images: function(req, res) {
    if (_.isEmpty(req.params.id)) {
      return res.redirect('/me/piece');
    }
    Piece.findOneById(req.params.id).then(function(piece) {
      if (!piece) return res.notFound();
      return res.view({
        piece: piece
      });

    }).fail(function(err) {
      return res.serverError(err);
    });
  },

  upload: function(req, res) {
    if (_.isEmpty(req.params.id)) {
      res.status(400);
      return res.json();
    }

    Piece.findOneById(req.params.id).then(function(piece) {
      if (!piece) {
        res.status(400);
        return res.json();
      };
      return [piece, cloudinary.upload(req.files.file.path)];
    }).spread(function(piece, image) {
      if (!image && !image.public_id) {
        res.status(400);
        return res.json();
      }
      if (!piece.images) piece.images = [];
      piece.images.push(image);
      piece.save(function(err) {
        res.status(200);
        return res.json();
      });
    }).fail(function(err) {
      res.status(500);
      return res.json();
    });
  },

  destroy: function(req, res) {
    if (_.isEmpty(req.params.id) || _.isEmpty(req.query.public_id)) {
      res.status(400);
      return res.json();
    }

    Piece.findOneById(req.params.id).then(function(piece) {
      if (!piece) {
        res.status(400);
        return res.json();
      };

      var image = _.find(piece.images, function(e) {
        return e.public_id == req.query.public_id;
      });
      var index = _.indexOf(piece.images, image);
      if (index > -1) piece.images.splice(index, 1);

      piece.save(function(err) {
        // res.status(200);
        // return res.json();
        return res.redirect('/me/piece/images/' + piece.id);
      });

    }).fail(function(err) {
      // res.status(500);
      // return res.json();
      return res.serverError();
    });

  },


};