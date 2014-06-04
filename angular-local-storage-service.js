(function (window, angular, undefined) {
  'use strict';
  angular.module('local.storage', ['ngCookies']).factory('$store', ['$cookieStore', '$log', '$parse', function($cookieStore, $log, $parse) {
    var configuration = {
      cookieFallback: true,
      useSessionStorage: false
    };
    var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;
    var supported = !(typeof storage === 'undefined' || typeof window.JSON === 'undefined');
    var memStore = {};

    return {
      configure: function(options) {
        configuration.cookieFallback = (typeof options.cookieFallback === 'undefined') ? true : options.cookieFallback;
        configuration.useSessionStorage = (typeof options.useSessionStorage === 'undefined') ? false : options.useSessionStorage;
        if (configuration.useSessionStorage === true) {
          storage = (typeof window.sessionStorage === 'undefined') ? undefined : window.sessionStorage;
        }
        supported = !(typeof storage === 'undefined' || typeof window.JSON === 'undefined');
      },
      /**
       * set - set a new local storage key-value pair
       * @param key - a string that will be used as the accessor for the pair
       * @param value - the value to store
       * @returns {*} - returns @value
       */
      set: function(key, value) {
        if (value === undefined || value === null) {
          this.remove(key);
          return value;
        }

        if (supported === true) {
          storage.setItem(key, angular.toJson(value));
        } else if (configuration.cookieFallback === true) {
          $cookieStore.put(key, value);
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
      get: function(key){
        if (supported === true) {
          return angular.fromJson(storage.getItem(key));
        } else if (configuration.cookieFallback === true) {
          return $cookieStore.get(key);
        } else {
          return memStore[key];
        }
      },
      /**
       * remove - remove a key-value pair from local storage
       * @param key - the string that is used to access the pair
       */
      remove: function(key) {
        if (supported === true) {
          storage.removeItem(key);
        } else if (configuration.cookieFallback === true) {
          $cookieStore.remove(key);
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
      unbind: function($scope, key) {
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
       * Clear - clears all local storage key-value pairs
       */
      clear: function() {
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
  }]);
})(window, window.angular);