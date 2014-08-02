// var casper = require('casper').create();

// require("utils").dump(casper.cli.options);

// casper.echo(casper.cli.get('url'));

// casper.start(casper.cli.get('url'), function() {
//   this.echo(this.getTitle());

//   if (this.exists('.normal-wrapper h1')) {
//     this.echo('the heading exists');
//   }

// });

// casper.thenOpen('http://phantomjs.org', function() {
//   this.echo(this.getTitle());
// });

// casper.run();

casper.test.begin('User: login', 6, function suite(test) {
  casper.start(casper.cli.get('url'), function() {
    test.assertExists('.normal-wrapper h1');
    test.assertSelectorHasText('.normal-wrapper h1', 'Login');
    test.assertVisible('.footer');

    this.fill('form', {
      'email': 'wudonghui',
      'password': '123'
    }, true);

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
    test.assertSelectorHasText('.normal-wrapper h1', 'username');
  });

  casper.run(function() {
    test.done();
  });

});