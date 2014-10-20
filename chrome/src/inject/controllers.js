'use strict';

angular.module('YCritique.controllers', ['simpleLogin', 'YCritique.config'])
  //Controller to manage login form and functionality
  .controller('LoginCtrl', ['$scope', '$rootScope', 'simpleLogin', '$timeout', function($scope, $rootScope, simpleLogin, $timeout) {
    $scope.email = null;
    $scope.pass = null;
    $scope.confirm = null;
    $scope.createMode = false;
    
    //Update form on login
    simpleLogin.watch(function(user){
      $timeout(function(){
        $scope.$apply(function(){ 
          $scope.loggedIn = (user); 
          $scope.createMode = false; 
        }); 
      });
    }, $rootScope);
    
    $scope.login = function(em, pass) {
      $scope.err = null;
      if( assertValidLoginProps() ) {
        simpleLogin.login(em, pass)
          .then(function(/* user */) {
            // user authenticated with Firebase
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

  //Controller to manage uploading the application to firebase and sharing
  .controller('ApplicationCtrl', ['$scope', '$rootScope', 'simpleLogin', '$firebase', '$timeout', 'FBURL', 'COMMENTURL','MAILGUN_API_KEY', 'MAILGUN_SERVER', function($scope, $rootScope, simpleLogin, $firebase, $timeout, fbUrl, commentUrl, mgKey, mgServer) {
      var ref = new Firebase(fbUrl + '/applications');
      var sync = $firebase(ref);
      
      //Load comments on login
      simpleLogin.watch(loadComments, $rootScope);
      function loadComments(user){
        if(user){
          var commRef = new Firebase(fbUrl + '/comments/' + user.uid);
          var commSync = $firebase(commRef);
          
          var comments = commSync.$asArray();
          comments.$loaded().then(function(){
            $scope.comments = comments;
          });
        }
      }
      
      $scope.share = function($event){
        $event.preventDefault();
        
        simpleLogin.getUser().then(function(){
          $scope.showShare = true;
        }, function(){
          alert("please log in");
        });
      };
      
      //Data is only saved when 'save for later' and 'share' are clicked
      $scope.saveApp = function(){
        simpleLogin.getUser().then(function(user){
          //save application data to firebase
          var app = {};
          app[user.uid] = $scope.application;
          sync.$update(app);
        });
      };
      
      $scope.send = function($event){
        $event.preventDefault();
        
        simpleLogin.getUser().then(function(user){
          //save application data to firebase
          $scope.saveApp();
          
          //grant permission to comment (query /users/:uid/sharedWith/$scope.sharedWith)
          var permission = {};
          permission[$scope.sharedWith.replace(/\./g , ',')] = 'Y';
          var userSync = $firebase(new Firebase(fbUrl + '/users/' + user.uid));
          userSync.$update('sharedWith', permission);
          
          //generate url based on this application's name
          $scope.commentLink = commentUrl + '/#/applications/' + user.uid;
          
          //send email
          var mgData = {
            'from': 'YCritique <postmaster@' + mgServer + '>',
            'to': $scope.sharedWith,
            'subject': 'Request for Your Critique of a YCombinator Startup Application',
            'html': 'Link: <a href="' + $scope.commentLink + '">' + $scope.commentLink + '</a>'
          }
          $.post("https://" + mgKey + "@api.mailgun.net/v2/" + mgServer + "/messages", mgData)
            .done(function(){
              //show confirmation and link
              $scope.$apply(function(){ $scope.shareSent = true; });
            });
        }, function(){
          alert("please log in");
        });

        $scope.showShare = false;
      };
    }]);