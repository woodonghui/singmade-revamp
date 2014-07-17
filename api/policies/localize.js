/**
 * localize
 *
 * @module      :: Policy
 * @description :: i18n localization
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  var locale = req.query.lang;

  if(locale) {

    req.session['locale'] = locale;

    sails.log.debug('Switch locale to --> ', locale);
  }

  req.locale = req.session.locale;

  return next();
};