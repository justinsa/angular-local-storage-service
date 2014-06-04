'use strict';
describe('services', function() {
  beforeEach(module('local.storage'));
  describe('$store', function() {
    it('should have a list of functions', inject(function($store) {
      var functions = ['set', 'get', 'remove', 'bind', 'unbind', 'has', 'clear'];
      for (var i in functions) {
        $store[functions[i]].should.be.a.Function;
      }
    }));
  });
});