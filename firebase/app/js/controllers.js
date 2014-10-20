'use strict';

/* Controllers */

angular.module('YCritique.controllers', ['YCritique.config', 'firebase', 'ngRoute', 'simpleLogin'])
  .controller('LoginCtrl', ['$scope', 'simpleLogin', '$location', '$rootScope', '$timeout', function($scope, simpleLogin, $location, $rootScope, $timeout) {
    //put $timeout in rootScope to be used by loading bar
    $rootScope.$timeout = $timeout;
  
    $scope.email = null;
    $scope.pass = null;
    $scope.confirm = null;
    $scope.createMode = false;

    $scope.login = function(em, pass) {
      $scope.err = null;
      if( assertValidLoginProps() ) {
        simpleLogin.login(em, pass)
          .then(function(/* user */) {
            if($rootScope.path){
              //redirect
              $location.path($rootScope.path);
            }
          }, function(err) {
            $scope.err = errMessage(err);
          });
      }
    };
    
    $scope.createAccount = function() {
      $scope.err = null;
      if( assertValidAccountProps() ) {
        simpleLogin.createAccount($scope.email, $scope.pass)
          .then(function(user) {
            $scope.login($scope.email, $scope.pass);
          }, function(err) {
            $scope.err = errMessage(err);
          });
      }
    };

    function assertValidLoginProps() {
      if( !$scope.email ) {
        $scope.err = 'Please enter an email address';
      }
      else if( !$scope.pass) {
        $scope.err = 'Please enter a password';
      }
      return !$scope.err;
    }
    
    function assertValidAccountProps() {
      assertValidLoginProps();
      
      if( !$scope.confirm ) {
        $scope.err = 'Please enter a password confirmation';
      }
      else if( $scope.createMode && $scope.pass !== $scope.confirm ) {
        $scope.err = 'Passwords do not match';
      }
      return !$scope.err;
    }
    
    function errMessage(err) {
      return angular.isObject(err) && err.code? err.code : err + '';
    }
  }])
  
  .controller('ApplicationCtrl', ['$scope', 'simpleLogin', '$location', '$firebase', 'FBURL', '$routeParams', function($scope, simpleLogin, $location, $firebase, fbUrl, $routeParams){
    $scope.application = $firebase(new Firebase(fbUrl + '/applications/' + $routeParams.uid)).$asObject();
    
    simpleLogin.getUser().then(function(user){
      $scope.comments = $firebase(new Firebase(fbUrl + '/comments/' + $scope.application.$id + '/' + user.email.replace(/\./g , ','))).$asObject();
    });
    
    $scope.saveComment = function(field){
      simpleLogin.getUser().then(function(user){
        var comment = $firebase(new Firebase(fbUrl + '/comments/' + $scope.application.$id + '/' + user.email.replace(/\./g , ',') + '/' + field)).$asObject();
        comment.$value = $scope.comments[field];
        comment.$save();
      });
    };
  }]);
