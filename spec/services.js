'use strict';
describe('$store', function() {
  describe('configure', function() {
    var storeProvider;

    beforeEach(function() {
      angular.module('test.store', function() {})
        .config(function($storeProvider) {
          storeProvider = $storeProvider;
        });

      module('local.storage', 'test.store');

      inject(function() {});
    });

    it('should default cookieFallback to true', function() {
      storeProvider.configure().cookieFallback.should.be.true;
    });

    it('should properly set cookiefallback to false', function() {
      storeProvider.configure({cookieFallback: false}).cookieFallback.should.be.false;
    });

    it('should default useSessionStorage to false', function() {
      storeProvider.configure().useSessionStorage.should.be.false;
    });

    it('should properly set useSessionStorage to true', function() {
      storeProvider.configure({useSessionStorage: true}).useSessionStorage.should.be.true;
    });
  });

  describe('$get', function() {
    beforeEach(module('local.storage'));

    it('should have a list of functions', inject(function($store) {
      var functions = ['set', 'get', 'remove', 'bind', 'unbind', 'has', 'clear'];
      for (var i in functions) {
        $store[functions[i]].should.be.a.Function;
      }
    }));
  });
});