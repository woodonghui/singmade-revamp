/**
 * IndexController
 *
 * @module      :: Controller
 * @description :: Index page controller.
 *
 *                 Build grid images, retrieve hotspot designers
 *
 */

var Q = require('q');
var _ = require('../utils/underscore');
var cloudinary = require('../services/cloudinary');


module.exports = {


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ManageController)
   */
  _config: {},




  /**
   *  @GET
   *    /api/userAvatar/:email
   *
   *  @description
   *  description
   *
   */
  userAvatar: function(req, res) {
    User.findOneByEmail(req.params.email, function(err, user) {
      if (err) return res.serverError(err);
      return res.json(user.avatar);
    });
  },


  /**
   *  @GET
   *    /api/designerAvatar/:name
   *
   *  @description
   *  description
   *
   */

  designerAvatar: function(req, res) {
    Designer.findOneByName(req.params.name, function(err, designer) {
      if (err) return res.serverError(err);
      return res.json(designer.avatar);
    });
  },




  /**
   *  @GET
   *    /
   *
   *  @description
   *  index page builder
   *
   */
  // index: function(req, res) {

  //   Piece.find({
  //       // designer: 'huang yichuan'
  //     }).limit(5).sort('createdAt DESC').then(function(pieces) {
  //       return [Designer.find().limit(8), pieces]
  //     })
  //     .spread(function(designers, pieces) {
  //       return res.view('home/index', {
  //         designers: designers,
  //         pieces: pieces
  //       });

  //     })
  //     .fail(function(err) {
  //       return res.serverError(err);
  //     });
  // },



  /**
   *  @GET
   *    /home/getHotspotDesigners?query
   *
   *  @description
   *  retrieve hotspot designers
   *
   */
  hotspotDesigners: function(req, res) {
    Designer.find({
        // where: {
        //   name: {
        //     '>=': 'a'
        //   }
        // },
        limit: 6,
      }).then(function(designers) {
        return res.json(designers);
      })
      .fail(function(err) {
        return res.serverError(err);
      });
  },

  /**
   *  @GET
   *    /home/getGridPieces/:page?query
   *
   *  @description
   *  retrieve pieces
   *
   */
  gridPieces: function(req, res) {
    var page = req.params.page || 0;
    Piece.find({
        // where: {
        //   name: {
        //     '>=': 'a'
        //   }
        // },
        limit: 5,
        skip: 5 * page,
        sort: 'createdAt DESC'
      }).then(function(pieces) {
        return res.json(pieces);
      })
      .fail(function(err) {
        return res.serverError(err);
      });
  },



  // Location.native(function(err, collection) {
  //     collection.find(
  //         "q": {
  //             "location": {
  //                 "$near": {
  //                     "$maxDistance": 80467.35439432222,
  //                     "$geometry": {
  //                         "type": "Point",
  //                         "coordinates": [-80.37504577636719, 25.974933624267578]
  //                     }
  //                 }
  //             }
  //         },
  //         "fields": {
  //             "category": 1,
  //             "title": 1
  //         }
  //     )
  //     .sort( { "created": -1 } )
  //     .limit(24)
  //     .toArray(function(err, docs) {
  //         // Handle Error and use docs
  //     });
  // });


};