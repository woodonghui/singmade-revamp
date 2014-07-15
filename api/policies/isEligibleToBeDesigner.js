/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow user to sign up as designer
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller

  if (req.session.user.userType === 'designer') {
    return next();
  }

  // if (req.wantsJSON) {
  //   return res.json({
  //     error: 'isAuthenticated fail',
  //     action: '/login',
  //     url: req.url
  //   });
  // }

  return res.redirect('/me');

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  // return res.forbidden('You are not permitted to perform this action.');
};