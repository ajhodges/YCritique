'use strict';

/* Filters */

angular.module('YCritique.filters', [])
   .filter('replacecommas', function() {
      return function(string) {
         return string.replace(/,/g , '.');
      };
   });