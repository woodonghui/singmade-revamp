var _ = require('../../api/utils/underscore');

casper.test.begin('Utils: underscore', 2, {

  setUp: function(test) {},

  tearDown: function(test) {},

  test: function(test) {
    var name = "Fashion T-SHIRT ";
    test.assertEquals(_.slug(name, 'by', 'donghui wu'), 'fashion-t-shirt-by-donghui-wu');

    name = "时尚男士 T shirt";
    test.assertEquals(_.slug(name, 'by', 'donghui wu'), '时尚男士-t-shirt-by-donghui-wu');

    test.done();
  }

});