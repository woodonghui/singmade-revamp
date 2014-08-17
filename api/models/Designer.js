/**
 * Designer
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // active: {
    //   type: 'boolean',
    //   defaultsTo: false
    // },

    name: { // immutable
      type: 'string',
      required: true,
      unique: true
    },

    title: 'string',
    avatar: 'string',
    profile: 'string',

    country: 'string',


    /**
     *  hidden = true means the user unfollowed
     *
     *  @example
     *  {
     *     "email": "woo.donghui@gmail.com",
     *     "date": 1407483844488,
     *     "hidden": true  // --> isFollowing
     *  },
     *
     */
    followers: 'array',


    toJSON: function() {
      var obj = this.toObject();
      if (!obj.avatar)
        obj.avatar = 'http://res.cloudinary.com/boutiquesg/image/upload/v1384063868/singmade-logo-i_vf9sbv.png';
      obj.numOfFollowers = obj.followers ? obj.followers.length : 0;
      return obj;
    },

  },

  validationMessages: {
    name: {
      required: 'designer_validation_message_name_required'
    }
  }


};