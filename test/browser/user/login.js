// test user login

casper.test.begin('User: login', 4, function suite(test) {
  casper.start(casper.cli.get('url') + '/login', function() {
    this.viewport(1200, 500);

    test.assertSelectorHasText('.normal-wrapper h1', 'Login');

    this.fill('form', {
      'email': 'wudonghui',
      'password': '123'
    }, true);

  });

  casper.then(function() {
    this.capture('test/capture/login-fail.png');
  });

  casper.then(function() {
    test.assertExists('.normal-wrapper .alert');
    test.assertSelectorHasText('.normal-wrapper .alert', 'Opps...Login failed.');

    this.fill('form', {
      'email': 'woo.donghui@gmail.com',
      'password': 'test123'
    }, true);
  });

  casper.then(function() {
    this.capture('test/capture/login-success.png');
  });

  casper.then(function() {
    test.assertSelectorHasText('.normal-wrapper h1', 'username');
  });

  casper.run(function() {
    test.done();
  });

});