/**
 * Piece
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    slugId: {
      type: 'string',
      required: true,
      unique: true
    },
    designer: 'string',
    
    // collection: 'string',
    // category: 'string',

  }

};