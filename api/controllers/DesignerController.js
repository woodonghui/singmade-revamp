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

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to DesignerController)
   */
  _config: {},

  all: function(req, res) {
    Designer.find().then(function(designers) {

      return res.view({
        designers: designers
      });

    }).fail(function(err) {
      return res.view('500');
    });
  },

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
  }

};