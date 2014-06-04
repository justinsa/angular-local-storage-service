Angular-local-storage-service
=============================

This project was originally forked from: https://github.com/agrublev/angularLocalStorage.

The simplest local storage module you will ever use. Allowing you to set, get, remove, and *bind* variables.

*Dependencies:*

* AngularJS - http://angularjs.org
* UnderscoreJS - http://underscorejs.org

*Features:*

* Two way bind your $scope variable value to localStorage or sessionStorage which will be updated whenever the model is updated, and vice versa.
* You can directly store Objects, Arrays, Floats, Booleans, and Strings. No need to convert your objects to strings and then reverse them. 
* Cookie fallback if Storage is not supported.
* In-memory fallback if Storage is not supported and cookies are disabled.

*Basic Setup:*

1. Add this module to your app as a dependency:
```JAVASCRIPT
var app = angular.module('yourApp', [..., 'local.storage']);
```
2. Inject $store as a parameter in declarations that require it:
```JAVASCRIPT
app.controller('yourController', function($scope, $store){ ... });
```
4. Using the $store factory
```JAVASCRIPT
// binding it to a $scope.variable - the params ($scope, varName, defaultValue(optional))
$store.bind($scope, 'viewType', 'cardView');
// will constantly be updating $scope.viewType
// to change the variable both locally in your controller and in localStorage just do
$scope.viewType = "ANYTHING";
// that's it, it will be updated in localStorage.
// Set a key-value pair in localStorage
$store.set("key", "value");
// Get a value from localStorage
$store.get("key");
// Remove a key-value pair from localStorage
$store.remove("key");
```

*Configuration Options:*

The default configuration is:

1. cookieFallback: true - if true, then session cookies are used for storage when the browser does not support the Storage interface.
2. useSessionStorage: false - if true, then sessionStorage is used instead of localStorage, if the browser supports the Storage interface.

To override the default configuration options, configure the module with an options argument during application configuration:
```JAVASCRIPT
app.config(['$store', function($store) {
  $store.configure({
    cookieFallback: false,
    useSessionStorage: true
  });
}]);
```
