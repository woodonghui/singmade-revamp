casper.test.begin('User: signup', 4, function suite(test) {
  casper.start(casper.cli.get('url') + '/signup', function() {
    test.assertSelectorHasText('.normal-wrapper h1', 'Sign up as member');

    this.fill('form', {}, true);
  });

  casper.then(function() {
    test.assertElementCount('.alert', 3);

    this.fill('form', {
      email: 'abc',
      password: '123'
    }, true);

  });

  casper.then(function() {
    test.assertSelectorHasText('.alert', 'Opps...Valid email is required.')

    this.fill('form', {
      email: 'woo.donghui@gmail.com',
      password: '123'
    }, true);

  });

  casper.then(function() {
    test.assertSelectorHasText('.alert', 'Opps...It seems the email has been registered.');
  });

  casper.run(function() {
    test.done();
  });

});