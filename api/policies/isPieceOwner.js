/**
 * isDesigner
 *
 * @module      :: Policy
 * @description :: Simple policy to check whether the piece belongs to designer
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller

  if (!req.params.id) {

    if (req.wantsJSON) {
      return res.json({
        message: 'permission denied',
      }, 403);
    }

    return res.redirect('/me/piece');

  }


  Piece.findOneById(req.params.id).then(function(piece) {
    if (!piece) return res.notFound();

    if (piece.designer == req.session.user.designer.name) {
      return next();
    }

    if (req.wantsJSON) {
      return res.json({
        message: 'permission denied',
      }, 403);
    }

    return res.redirect('/me/piece');

  }).fail(function(err) {
    return res.serverError(err);
  });

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  // return res.forbidden('You are not permitted to perform this action.');
};