'use strict';

// Declare app level module which depends on filters, and services
angular.module('YCritique', [
    'YCritique.config',
    'YCritique.controllers',
    'YCritique.directives',
    'YCritique.filters',
  ]);
angular.bootstrap(document, ['YCritique']);