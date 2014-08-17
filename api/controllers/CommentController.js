/**
 * CommentController
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
   * (specific to CommentController)
   */
  _config: {},

  /**
   *  @POST
   *    /comment/:pieceId
   *
   *  @description
   *  post a comment
   *
   */
  add: function(req, res) {
    Comment.create({
      userId: req.session.user.email,
      pieceId: req.params.pieceId,
      content: req.body.content
    }).then(function(comment) {

      Piece.publishUpdate(req.params.pieceId, {
        eventName: 'commentAddedEvent',
        comment: comment
      });

      return res.json(comment, 200);

    }).fail(function(err) {
      return res.serverError(err);
    });
  },

  /**
   *  @GET
   *  @SOCKET
   *
   *    /comment/:pieceId
   *
   *  @description
   *  list the comments of pieceId,
   *  and listen the socket for comments
   *
   */
  list: function(req, res) {
    Piece.findOneById(req.params.pieceId).then(function(piece) {
      Piece.subscribe(req.socket, piece);
      return Comment.findByPieceId(req.params.pieceId).limit(6).sort('createdAt DESC');
    }).then(function(comments) {
      return res.json(comments, 200);
    }).fail(function(err) {
      return res.serverError(err);
    });
  },



};