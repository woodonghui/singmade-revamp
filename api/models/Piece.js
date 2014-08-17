/**
 * Piece
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var Q = require('q');
var _ = require('../utils/underscore');

module.exports = {

  attributes: {

    slugId: {
      type: 'string',
      // unique: true
    },

    // internalId: {
    //   type: 'string',
    //   defaultsTo: require('shortid').generate()
    // },

    title: {
      type: 'string',
      required: true
    },
    description: 'string',
    images: 'array',


    /**
     *
     *  @description
     *  refer to Designer name
     *
     */
    designer: {
      type: 'string',
      required: true
    },

    designerId: 'string',

    likes: 'array',
    // comments: 'array',
    // shares: 'array',

    // category: 'string', // clothes, home
    // collection: 'string', //group pieces into collections like year, style


    // Q promise implementation of save()
    saveQ: function() {
      var deferred = Q.defer();
      this.save(function(err, piece) {
        if (!piece) {
          deferred.reject(err);
        } else {
          deferred.resolve(piece);
        }

      });
      return deferred.promise;
    }

  },


  // beforeValidation: function(values, next) {
  //   next();
  // },

  beforeCreate: function(values, next) {
    values.slugId = _.slug(values.title, 'by', values.designer);
    next();
  },

  beforeUpdate: function(values, next) {
    values.slugId = _.slug(values.title, 'by', values.designer);
    next();
  },


  validationMessages: {
    title: {
      required: 'title is required'
    }
  }


};