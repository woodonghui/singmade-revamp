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





};