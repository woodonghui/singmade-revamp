/**
 * Designer
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // _id: { // will be deprecated, use auto id
    //   type: 'string',
    //   required: true,
    //   unique: true
    // },

    // active: {
    //   type: 'boolean',
    //   defaultsTo: false
    // },

    name: { // immutable
      type: 'string',
      required: true,
      unique: true
    },

    title: {
      type: 'string'
    },

    // category: 'string',

    followers: {
      type: 'array'
    },

    avatar: 'string',
    profile: 'string',


    // new fields
    country: 'string',


    // toJSON: function() {
    //   var obj = this.toObject();
    //   if (!obj.avatar)
    //     obj['avatar'] = 'http://res.cloudinary.com/boutiquesg/image/upload/v1384063868/singmade-logo-i_vf9sbv.png';
    //   return obj;
    // },

  }

};