'use strict';

// Declare app level module which depends on filters, and services
angular.module('YCritique', [
    'YCritique.config',
    'YCritique.controllers',
    'YCritique.directives',
    'YCritique.routes',
    'angular-loading-bar',
    'ngAnimate'
  ])

  .run(['simpleLogin', function(simpleLogin) {
    simpleLogin.getUser();
  }])  
  
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 0;
  }]);
