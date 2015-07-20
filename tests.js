/* globals angular, beforeEach, describe, module, inject, it, sinon */
'use strict';
describe('$store', function() {
  describe('configure', function() {
    describe('default settings', function() {
      beforeEach(module('local.storage'));

      it('should set cookieFallback to true', 
        inject(function ($store) {
          $store.getConfiguration().cookieFallback.should.be.true; // jshint ignore:line
        })
      );

      it('should set useSessionStorage to false',
        inject(function ($store) {
          $store.getConfiguration().useSessionStorage.should.be.false; // jshint ignore:line
        })
      );
    });

    describe('overridden settings', function() {
      beforeEach(
        module('local.storage', function ($storeProvider) {
          $storeProvider.configure({
            cookieFallback: false,
            useSessionStorage: true
          });
        })
      );

      it('should properly set cookieFallback to false',
        inject(function ($store) {
          $store.getConfiguration().cookieFallback.should.be.false; // jshint ignore:line
        })
      );

      it('should properly set useSessionStorage to true',
        inject(function ($store) {
          $store.getConfiguration().useSessionStorage.should.be.true; // jshint ignore:line
        })
      );
    });
  });

  describe('$get', function() {
    beforeEach(module('local.storage'));

    it('should have a list of functions',
      inject(function ($store) {
        var functions = ['set', 'get', 'remove', 'bind', 'unbind', 'has', 'clear', 'getConfiguration'];
        for (var i in functions) {
          $store[functions[i]].should.be.a.Function; // jshint ignore:line
        }
      })
    );

    describe('set', function() {
      it('should remove a key if set is called with an empty value',
        inject(function ($store) {
          sinon.spy($store, 'remove');
          var result = $store.set('foo');
          $store.remove.calledOnce.should.be.true; // jshint ignore:line
          (result === undefined).should.be.true; // jshint ignore:line
        })
      );

      it('should transform the value into json and set the key',
        inject(function ($store) {
          sinon.spy($store.getStorage(), 'setItem');
          sinon.spy(angular, 'toJson');
          var result = $store.set('foo', {bar: 'a'});
          $store.getStorage().setItem.calledOnce.should.be.true; // jshint ignore:line
          angular.toJson.calledOnce.should.be.true; // jshint ignore:line
          result.should.eql({bar: 'a'});
        })
      );

      it('should store info in the cookie store if the environment is not supported',
        inject(function ($store, $cookieStore) {
          sinon.spy($cookieStore, 'put');
          $store.setSupported(false);
          var result = $store.set('foo', 'bar');
          $cookieStore.put.calledOnce.should.be.true; // jshint ignore:line
          result.should.equal('bar');
        })
      );

      it('should store info in the memStorage if the environment is not supported and cookie fallback is disabled', function() {
        module('local.storage', function ($storeProvider) {
          $storeProvider.configure({cookieFallback: false});
        });
        inject(function ($store) {
          $store.setSupported(false);
          var result = $store.set('foo', 'bar');
          $store.getMemStore().foo.should.equal('bar');
          result.should.equal('bar');
        });
      });
    });

    describe('get', function() {
      beforeEach(module('local.storage'));

      it('should return the value from the store',
        inject(function ($store) {
          $store.set('foo', 'bar');
          $store.get('foo').should.equal('bar');
        })
      );

      it('should return the value from the cookie store if the environment is not supported',
        inject(function ($store) {
          $store.setSupported(false);
          $store.set('foo', 'bar');
          $store.get('foo').should.equal('bar');
        })
      );

      it('should return the value from the memStorage if the environment is not supported and cookie fallback is disabled', function() {
        module('local.storage', function ($storeProvider) {
          $storeProvider.configure({cookieFallback: false});
        });
        inject(function ($store) {
          $store.setSupported(false);
          $store.set('foo', 'bar');
          $store.getMemStore().foo.should.equal('bar');
          $store.get('foo').should.equal('bar');
        });
      });
    });

    describe('remove', function() {
      beforeEach(module('local.storage'));

      it('should remove the value from the store',
        inject(function ($store) {
          sinon.spy($store.getStorage(), 'removeItem');
          $store.remove('foo');
          $store.getStorage().removeItem.calledOnce.should.be.true; // jshint ignore:line
        })
      );

      it('should remove the value from the cookie store if the environment is not supported',
        inject(function ($store, $cookieStore) {
          $store.setSupported(false);
          sinon.spy($cookieStore, 'remove');
          $store.remove('foo');
          $cookieStore.remove.calledOnce.should.be.true; // jshint ignore:line
        })
      );

      it('should remove the value from the memStorage if the environment is not supported and cookie fallback is disabled', function() {
        module('local.storage', function ($storeProvider) {
          $storeProvider.configure({cookieFallback: false});
        });
        inject(function ($store) {
          $store.setSupported(false);
          $store.set('foo', 'bar');
          $store.getMemStore().foo.should.equal('bar');
          $store.remove('foo');
          ($store.getMemStore().foo === undefined).should.be.true; // jshint ignore:line
        });
      });
    });

    describe('bind', function() {
      beforeEach(module('local.storage'));

      it('should add a watch to a scope',
        inject(function ($store, $rootScope) {
          var scope = $rootScope.$new();
          sinon.spy(scope, '$watch');
          $store.bind(scope, 'foo');
          scope.$watch.calledOnce.should.be.true; // jshint ignore:line
        })
      );

      it('should set the value to fallback if a fallback is given and key does not already exist',
        inject(function ($store, $rootScope) {
          var scope = $rootScope.$new();
          $store.remove('foo');
          $store.bind(scope, 'foo', 'bar');
          $store.get('foo').should.equal('bar');
        })
      );
    });

    describe('unbind', function() {
      beforeEach(module('local.storage'));

      it('should empty the watcher',
        inject(function ($store, $rootScope) {
          var scope = $rootScope.$new();
          sinon.spy(scope, '$watch');
          $store.bind(scope, 'foo');
          $store.unbind(scope, 'foo');

          // We wanted the first call because the zeroth is the bind call
          var watchCall = scope.$watch.getCall(1);
          watchCall.args[1].toString().should.eql(function(){}.toString());
        })
      );

      it('should remove the key',
        inject(function ($store, $rootScope) {
          var scope = $rootScope.$new();
          $store.bind(scope, 'foo', 'bar');
          $store.get('foo').should.equal('bar');
          $store.unbind(scope, 'foo');
          ($store.get('foo') === null).should.be.true; // jshint ignore:line
        })
      );
    });

    describe('has', function() {
      beforeEach(module('local.storage'));

      it('should return false if the key is not in the store',
        inject(function ($store) {
          $store.remove('foo');
          $store.has('foo').should.be.false; // jshint ignore:line
        })
      );

      it('should return true if the key in the store',
        inject(function ($store) {
          $store.set('foo', 'bar');
          $store.has('foo').should.be.true; // jshint ignore:line
        })
      );
    });

    describe('clear', function() {
      beforeEach(module('local.storage'));

      it('should remove everything if the environment is supported',
        inject(function ($store) {
          $store.set('foo', 1);
          $store.set('bar', 2);
          $store.set('baz', 3);
          $store.clear();
          $store.has('foo').should.be.false; // jshint ignore:line
          $store.has('bar').should.be.false; // jshint ignore:line
          $store.has('baz').should.be.false; // jshint ignore:line
        })
      );

      it('should not remove anything if cookie fallback is enabled',
        inject(function ($store) {
          $store.setSupported(false);
          $store.set('foo', 1);
          $store.set('bar', 2);
          $store.set('baz', 3);
          $store.clear();
          $store.has('foo').should.be.true; // jshint ignore:line
          $store.has('bar').should.be.true; // jshint ignore:line
          $store.has('baz').should.be.true; // jshint ignore:line
        })
      );

      it('should create a new memStorage object if environment is not supported and cookie fallback is disabled', function() {
        module('local.storage', function ($storeProvider) {
          $storeProvider.configure({cookieFallback: false});
        });
        inject(function ($store) {
          var memStorage = $store.getMemStore();
          $store.setSupported(false);
          $store.set('foo', 1);
          $store.set('bar', 2);
          $store.set('baz', 3);
          $store.clear();
          $store.has('foo').should.be.false; // jshint ignore:line
          $store.has('bar').should.be.false; // jshint ignore:line
          $store.has('baz').should.be.false; // jshint ignore:line
          $store.getMemStore().should.not.equal(memStorage);
          $store.getMemStore().should.be.empty; // jshint ignore:line
        });
      });
    });
  });
});