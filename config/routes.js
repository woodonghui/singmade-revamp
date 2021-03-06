module.exports.routes = {

  /**
   *  IndexController
   *
   */

  'get /': {
    view: 'home/index'
  },
  'get /home/getGridPieces/:page': 'IndexController.gridPieces',
  'get /home/getHotspotDesigners': 'IndexController.hotspotDesigners',

  'get /home/ifollows': 'IndexController.ifollows',

  'get /api/userAvatar/:email': 'IndexController.userAvatar',
  'get /api/designerAvatar/:name': 'IndexController.designerAvatar',



  /**
   *  UserController
   */

  'get /login': 'UserController.login',
  'get /signup': 'UserController.signup',
  'get /logout': 'UserController.logout',

  'get /change-password': 'UserController.resetPasswordRequest',
  'get /forgot-password': 'UserController.resetPasswordRequest',
  'get /reset-password': 'UserController.resetPassword',

  'get /me': 'UserController.me',
  'post /me/avatar': 'UserController.avatar',

  'get /api/me/followees': 'UserController.followees',
  'get /api/me/likes': 'UserController.likes',



  /**
   *  DesignerController
   *
   */
  'post /me/be-a-designer': 'DesignerController.beADesigner',
  'post /me/designer': 'DesignerController.save',

  'get /designers': 'DesignerController.find',
  'get /designer': 'DesignerController.all',

  'get /designer/:name': 'DesignerController.list',
  'get /api/designer/:name': 'DesignerController.designer',

  //sockets
  // 'get /sub_designer/:name': 'DesignerController.subscribe',

  /**
   *
   *  SocialController
   *
   */
  'get /social/like/:pieceId': 'SocialController.like',
  'get /social/follow/:designer': 'SocialController.follow',
  'get /social/unfollow/:designer': 'SocialController.unfollow',





  /**
   *  ManageController
   *
   */
  'get /me/piece': 'ManageController.list',
  'get /me/piece/add': {
    view: 'manage/add'
  },

  'get /me/piece/edit/:id': 'ManageController.edit',
  'get /me/piece/delete/:id': 'ManageController.delete',
  'post /me/piece/save': 'ManageController.save',
  'post /me/piece/update/:id': 'ManageController.update',

  'get /me/piece/images/:id': 'ManageController.images',
  'post /me/piece/images/:id': 'ManageController.upload',
  'delete /me/piece/images/:id/:publicId': 'ManageController.destroy',


  /**
   * PieceController
   *
   */
  'get /piece/:slug': 'PieceController.detail',

  //sockets
  'get /socket/piece/:pieceId': 'PieceController.subscribePiece',





  /**
   *  CommentController
   *
   */
  'post /comment/:pieceId': 'CommentController.add',
  'get /comment/:pieceId': 'CommentController.list',








  /*
  // But what if you want your home page to display
  // a signup form located at `views/user/signup.ejs`?
  '/': {
    view: 'user/signup'
  }


  // Let's say you're building an email client, like Gmail
  // You might want your home route to serve an interface using custom logic.
  // In this scenario, you have a custom controller `MessageController`
  // with an `inbox` action.
  '/': 'MessageController.inbox'


  // Alternatively, you can use the more verbose syntax:
  '/': {
    controller: 'MessageController',
    action: 'inbox'
  }


  // If you decided to call your action `index` instead of `inbox`,
  // since the `index` action is the default, you can shortcut even further to:
  '/': 'MessageController'


  // Up until now, we haven't specified a specific HTTP method/verb
  // The routes above will apply to ALL verbs!
  // If you want to set up a route only for one in particular
  // (GET, POST, PUT, DELETE, etc.), just specify the verb before the path.
  // For example, if you have a `UserController` with a `signup` action,
  // and somewhere else, you're serving a signup form looks like: 
  //
  //    <form action="/signup">
  //      <input name="username" type="text"/>
  //      <input name="password" type="password"/>
  //      <input type="submit"/>
  //    </form>

  // You would want to define the following route to handle your form:
  'post /signup': 'UserController.signup'


  // What about the ever-popular "vanity URLs" aka URL slugs?
  // (you might remember doing this with `mod_rewrite` in Apache)
  //
  // This is where you want to set up root-relative dynamic routes like:
  // http://yourwebsite.com/twinkletoez
  //
  // NOTE:
  // You'll still want to allow requests through to the static assets,
  // so we need to set up this route to ignore URLs that have a trailing ".":
  // (e.g. your javascript, CSS, and image files)
  'get /*(^.*)': 'UserController.profile'

  */
};



/** 
 * (3) Action blueprints
 * These routes can be disabled by setting (in `config/controllers.js`):
 * `module.exports.controllers.blueprints.actions = false`
 *
 * All of your controllers ' actions are automatically bound to a route.  For example:
 *   + If you have a controller, `FooController`:
 *     + its action `bar` is accessible at `/foo/bar`
 *     + its action `index` is accessible at `/foo/index`, and also `/foo`
 */


/**
 * (4) Shortcut CRUD blueprints
 *
 * These routes can be disabled by setting (in config/controllers.js)
 *      `module.exports.controllers.blueprints.shortcuts = false`
 *
 * If you have a model, `Foo`, and a controller, `FooController`,
 * you can access CRUD operations for that model at:
 *    /foo/find/:id?  ->  search lampshades using specified criteria or with id=:id
 *
 *    /foo/create   ->  create a lampshade using specified values
 *
 *    /foo/update/:id ->  update the lampshade with id=:id
 *
 *    /foo/destroy/:id  ->  delete lampshade with id=:id
 *
 */

/**
 * (5) REST blueprints
 *
 * These routes can be disabled by setting (in config/controllers.js)
 *    `module.exports.controllers.blueprints.rest = false`
 *
 * If you have a model, `Foo`, and a controller, `FooController`,
 * you can access CRUD operations for that model at:
 *
 *    get /foo/:id? ->  search lampshades using specified criteria or with id=:id
 *
 *    post /foo   -> create a lampshade using specified values
 *
 *    put /foo/:id  ->  update the lampshade with id=:id
 *
 *    delete /foo/:id ->  delete lampshade with id=:id
 *
 */

/**
 * (6) Static assets
 *
 * Flat files in your `assets` directory- (these are sometimes referred to as 'public')
 * If you have an image file at `/assets/images/foo.jpg`, it will be made available
 * automatically via the route:  `/images/foo.jpg`
 *
 */



/**
 * (7) 404 (not found) handler
 *
 * Finally, if nothing else matched, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 */