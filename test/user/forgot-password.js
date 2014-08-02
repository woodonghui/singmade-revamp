casper.test.begin('User: forgot password', 4, function suite(test) {
  casper.start(casper.cli.get('url') + '/forgot-password', function() {
    this.viewport(1200, 500);

    test.assertSelectorHasText('.normal-wrapper h1', 'reset password');
    this.fill('form', {
      'email': ''
    }, true);

  });

  casper.then(function() {
    this.capture(casper.cli.get('capturefolder') + '/forgot-password-email-required.png');
  });

  casper.then(function() {
    test.assertSelectorHasText('.normal-wrapper .alert', 'Opps...Email is required.');
    this.fill('form', {
      'email': 'abc@gmail.com'
    }, true);
  });

  casper.then(function() {
    this.capture(casper.cli.get('capturefolder') + '/forgot-password-no-email-exists.png');
  });

  casper.then(function() {
    test.assertSelectorHasText('.normal-wrapper .alert', 'No user exists');
    this.fill('form', {
      'email': 'woo.donghui@gmail.com'
    }, true);
  });

  casper.then(function() {
    this.capture(casper.cli.get('capturefolder') + '/forgot-password-email-sent.png');
  });

  casper.then(function() {
    test.assertExists('.normal-wrapper .info');
  });

  casper.run(function() {
    test.done();
  });

});