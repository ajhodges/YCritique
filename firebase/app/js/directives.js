'use strict';

/* Directives */

angular.module('YCritique.directives', [])
.directive('dirComment', function(){
    return {
      restrict: 'A',
      scope: {
        save: '&',
        application: '=',
        comments: '=',
        commenting: '=',
        field: '@'
      },
      templateUrl: 'partials/comment.html',
    }
});
