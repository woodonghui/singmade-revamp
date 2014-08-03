/**
 * isDesigner
 *
 * @module      :: Policy
 * @description :: Simple policy to check whether user is a designer
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller

  if (req.session.user.designer) {
    return next();
  }

  if (req.wantsJSON) {
    return res.json({
      message: 'login as designer required',
    }, 403);
  }

  return res.redirect('/me');

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  // return res.forbidden('You are not permitted to perform this action.');
};