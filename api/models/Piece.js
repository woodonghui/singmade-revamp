/**
 * Piece
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    slugId: {
      type: 'string',
      required: true,
      unique: true
    },

    // internalId: {
    //   type: 'string',
    //   defaultsTo: require('shortid').generate()
    // },

    title: 'string',
    description: 'string',
    category: 'string', // clothes, home

    images: 'array',

    designer: {
      type: 'string',
      required: true
    }, //Foreign Key --> Designer.name

    // designerId: 'string'

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

  }

};


/*

  // image storage
  cloudinary: {
    images: [{
      public_id: { type: String, required: true },
      size: in KB/MB,
      format: { type: String, required: true, default: 'jpg' },
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    }],
  },

*/