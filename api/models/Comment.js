/**
 * Comment
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    /**
     *  who commentted
     */
    userId: {
      type: 'string',
      required: true
    },

    /**
     *  commentted on what
     */
    pieceId: {
      type: 'string',
      required: true
    },


    content: {
      type: 'string',
      required: true
    },


  }

};