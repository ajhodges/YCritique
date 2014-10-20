'use strict';

//Inject controller attribute
$('.startupform').attr('ng-controller','ApplicationCtrl');

//Inject model attributes to form inputs
$("*[id^='app_questions_']").each(function(i, el){
  var id = $(el).attr('id');
  var field = id.substring(14);
  $(el).attr('ng-model', 'application.' + field);
  $(el).attr('ng-initial', '');
  
  //Inject comment tabs
  $(this).parent().append("<div comments='comments' dir-comment='" + field + "'></div>");
});

//Inject login template div
$('#edit_app').prepend("<div dir-login></div>");

//Inject share button template div
$('#f_submit').append("<div dir-share></div>");

/* Directives */
angular.module('YCritique.directives', ['ui.bootstrap'])
  .directive('dirShare', function($sce){
      return {
        restrict: 'A',
        replace: true,
        templateUrl: $sce.trustAsResourceUrl(chrome.extension.getURL('src/partials/share.html')),
      }
  })
  .directive('dirLogin', function($sce){
      return {
        restrict: 'A',
        replace: true,
        templateUrl: $sce.trustAsResourceUrl(chrome.extension.getURL('src/partials/login.html')),
      }
  })
  .directive('dirComment', function($sce){
      return {
        restrict: 'A',
        scope: {
          comments: '=',
          dirComment: '@'
        },
        templateUrl: $sce.trustAsResourceUrl(chrome.extension.getURL('src/partials/comment.html')),
      }
  })
  //Directive for loading preexisting field values
  //Thanks http://stackoverflow.com/a/21756856 !!
  .directive('ngInitial', function($parse) {
      return {
          restrict: "A",
          compile: function($element, $attrs) {
              var initialValue = $attrs.value || $element.val();
              return {
                  pre: function($scope, $element, $attrs) {
                      $parse($attrs.ngModel).assign($scope, initialValue);
                  }
              }
          }
      }
  })
  //Override 'save for later' button, use it to also save our data
  .directive('linkButton', function($sce){
      return {
          restrict: "C",
          replace: true,
          templateUrl: $sce.trustAsResourceUrl(chrome.extension.getURL('src/partials/save.html')),
      }
  });
