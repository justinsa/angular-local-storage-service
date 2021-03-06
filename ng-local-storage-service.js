/* globals define, module */
(function (root, factory) {
  'use strict';
  if (typeof module !== 'undefined' && module.exports) {
    factory(
      typeof angular === 'undefined' ? require('angular') : root.angular
    );
    module.exports = 'ng-local-storage-service';
  } else if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);
  } else {
    factory(root.angular);
  }
}(this, function (angular, undefined) {
  'use strict';
  angular.module('local-storage.service', []).provider('$store', function() {
    var configuration = {
      cookieFallback: true,
      useSessionStorage: false
    };

    this.configure = function (options) {
      if (typeof options !== 'undefined') {
        configuration.cookieFallback = (typeof options.cookieFallback === 'undefined') ? true : options.cookieFallback;
        configuration.useSessionStorage = (typeof options.useSessionStorage === 'undefined') ? false : options.useSessionStorage;
      }
      return configuration;
    };

    this.$get = ['$injector', '$log', '$parse', '$window', function ($injector, $log, $parse, $window) {
      var storage = (typeof $window.localStorage === 'undefined') ? undefined : $window.localStorage;
      if (configuration.useSessionStorage === true) {
        storage = (typeof $window.sessionStorage === 'undefined') ? undefined : $window.sessionStorage;
      }
      var supported = !(typeof storage === 'undefined' || typeof $window.JSON === 'undefined');
      var memStore = {};

      var ngCookieService;
      var cookieService = function () {
        if (configuration.cookieFallback === false) {
          $log.error('Cookie storage is disabled and the $cookieStore service will not be injected');
          return undefined;
        }
        if (ngCookieService === undefined) {
          if (!$injector.has('$cookieStore')) {
            $log.error('No matching service registered in Angular: $cookieStore');
            return undefined;
          }
          ngCookieService = $injector.get('$cookieStore');
        }
        return ngCookieService;
      };

      return {
        /**
         * getMemStore - get the in-memory storage object.
         * @returns {Object} - the in-memory storage object
         */
        getMemStore: function () { return memStore; },

        /**
         * getStorage - get the supported storage interface (localStorage or sessionStorage).
         * This variable will be undefined if the Storage interface is not supported.
         * @returns {Object} - the supported storage interface
         */
        getStorage: function () { return storage; },

        /**
         * getSupported - get the value of the supported boolean.
         * This value is used by the service for picking the appropriate storage mechanism to use.
         * @returns {Boolean} - the supported value
         */
        getSupported: function () { return supported; },

        /**
         * setSupported - set the supported boolean.
         * This value is used by the service for picking the appropriate storage mechanism to use.
         * @param value - the value to set
         */
        setSupported: function (value) { supported = !!value; },

        /**
         * getConfiguration - get the configuration hash.
         * @returns {*} - the configuration hash
         */
        getConfiguration: function () {
          return configuration;
        },

        /**
         * set - set a new local storage key-value pair
         * @param key - a string that will be used as the accessor for the pair
         * @param value - the value to store
         * @returns {*} - returns @value
         */
        set: function (key, value) {
          if (value === undefined || value === null) {
            this.remove(key);
            return value;
          }
          if (supported === true) {
            storage.setItem(key, angular.toJson(value));
          } else if (configuration.cookieFallback === true) {
            cookieService().put(key, value);
          } else {
            memStore[key] = value;
          }
          return value;
        },

        /**
         * get - get the value associated with a key
         * @param key - the string that is used to access the value
         * @returns {*} - the stored value
         */
        get: function (key){
          if (supported === true) {
            return angular.fromJson(storage.getItem(key));
          } else if (configuration.cookieFallback === true) {
            return cookieService().get(key);
          } else {
            return memStore[key];
          }
        },

        /**
         * remove - remove a key-value pair from local storage
         * @param key - the string that is used to access the pair
         */
        remove: function (key) {
          if (supported === true) {
            storage.removeItem(key);
          } else if (configuration.cookieFallback === true) {
            cookieService().remove(key);
          } else {
            delete memStore[key];
          }
        },

        /**
         * bind - directly bind a local storage value to a $scope variable
         * @param $scope - the current scope you want the variable available in
         * @param key - the name of the variable you are binding
         * @param fallback - the fallback value (OPTIONAL)
         * @returns {*} - the stored value
         */
        bind: function ($scope, key, fallback) {
          fallback = (typeof fallback !== 'undefined') ? fallback : '';
          if (!this.has(key)) {
            this.set(key, fallback);
          }
          $parse(key).assign($scope, this.get(key));
          $scope.$watch(key, function (value) {
            this.set(key, value);
          }, true);
          return this.get(key);
        },

        /**
         * Unbind - unbind and remove a value from local storage
         * @param $scope - the scope the variable was initially set in
         * @param key - the name of the variable you are unbinding
         */
        unbind: function ($scope, key) {
          $parse(key).assign($scope, null);
          $scope.$watch(key, function(){});
          this.remove(key);
        },

        /**
         * has - indicates whether the key is in the store
         * @param key - the key name to check for existence
         * @returns {*} - true if the key is in the store, false otherwise
         */
        has: function (key) {
          var value = this.get(key);
          return !(value === undefined || value === null);
        },

        /**
         * clear - clears all local storage key-value pairs
         */
        clear: function () {
          if (supported === true) {
            storage.clear();
          } else if (configuration.cookieFallback === true) {
            // $cookieStore has no method exposed for iterating over
            // the cookies in it and no way to clear all cookies.
            $log.warn('clearing cookies is unsupported');
          } else {
            memStore = {};
          }
        }
      };
    }];
  });
  return angular;
}));
