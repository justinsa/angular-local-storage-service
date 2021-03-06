[![Bower Version](https://img.shields.io/bower/v/ng-local-storage-service.svg)](https://github.com/justinsa/angular-local-storage-service)
[![NPM Version](https://img.shields.io/npm/v/ng-local-storage-service.svg)](https://www.npmjs.com/package/ng-local-storage-service)
![Master Build Status](https://codeship.com/projects/eedc85e0-33d1-0133-56cd-7a6ac2bad7d6/status?branch=master)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/justinsa/angular-local-storage-service/blob/master/LICENSE)

An Angular service for client-side set, get, remove, bind, and clean of local storage mechanisms. It provides fallbacks to cookies or in-memory storage based on client capabilities and service configuration.

## Dependencies

* AngularJS - http://angularjs.org
* Angular Cookies (ngCookies) - Only required if ```cookieFallback``` is enabled.

## Features

* Directly store Objects, Arrays, Floats, Booleans, and Strings. No need to convert objects to strings and then reverse them.
* Two way bind a $scope variable to localStorage or sessionStorage which will be updated whenever the model is updated, and vice versa.
* Cookie fallback if Storage is not supported.
* In-memory fallback if Storage is not supported and storing to cookies is disabled.

## Basic Setup

Add this module to your app as a dependency:
```JAVASCRIPT
var app = angular.module('yourApp', ['local-storage.service']);
```

Inject $store as a parameter in declarations that require it:
```JAVASCRIPT
app.controller('yourController', function($scope, $store){ ... });
```

## Configuration Options

The default configuration is:

1. ```cookieFallback: true``` - if true, then session cookies are used for storage when the browser does not support the Storage interface. If false, then cookies are never used.
2. ```useSessionStorage: false``` - if true, then sessionStorage is used instead of localStorage. If false, localStorage is used as the default. This is, of course, dependent on the browser supporting the Storage interface.

To override the default configuration options, configure the module with an options argument during application configuration:
```JAVASCRIPT
app.config(['$storeProvider', function ($storeProvider) {
  $storeProvider.configure({
    cookieFallback: false,
    useSessionStorage: true
  });
}]);
```

## Basic Usage

### bind
```JAVASCRIPT
// Binding it to a $scope.variable - the params ($scope, varName, defaultValue(optional))
$store.bind($scope, 'viewType', 'cardView');

// To change the variable both locally in your controller and in storage
$scope.viewType = "ANYTHING";
```

### unbind
```JAVASCRIPT
// Unbinding and remove a $scope.variable
$store.unbind($scope, 'viewType');
```

### set
```JAVASCRIPT
// Set a key-value pair in storage
$store.set("key", "value");
```

### get
```JAVASCRIPT
// Get a value from storage
$store.get("key");
```

### has
```JAVASCRIPT
// Determine if a key is present in storage
$store.has("key");
```

### remove
```JAVASCRIPT
// Remove a key-value pair from storage
$store.remove("key");
```

###Clear
```JAVASCRIPT
// Clear all key-value pairs from storage
// Note: this is not supported for cookie storage as there is no $cookie service support for such an action.
$store.clear();
```

##Additional Methods
These methods were primarily implemented for testing purposes, but they may be useful in special scenarios and are part of the exposed API.

```JAVASCRIPT
// Get the configuration hash
$store.getConfiguration();
```

```JAVASCRIPT
// Get the value of the supported boolean. This value is used by the service for picking
// the appropriate storage mechanism to use.
$store.getSupported();
```

```JAVASCRIPT
// Set the supported boolean. This value is used by the service for picking
// the appropriate storage mechanism to use.
$store.setSupported(false);
```

```JAVASCRIPT
// Get the supported storage interface (localStorage or sessionStorage). This variable will be undefined if the Storage interface is not supported.
$store.getStorage();
```

```JAVASCRIPT
// Get the in-memory storage object.
$store.getMemStore();
```

##Development
After forking you should only have to run ```npm install``` from a command line to get your environment setup.

After install you have two gulp commands available to you:

1. ```gulp js:lint```
2. ```gulp js:test```
