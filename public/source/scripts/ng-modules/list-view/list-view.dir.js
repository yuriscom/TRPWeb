'use strict';
define([ 'main', 'vendor', 'trp.app' ], function () {
  angular.module('TRP')
    .directive('favPropertyCard', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/scripts/ng-modules/templates/favorites-property-card.tpl.html'
      };
    })

    .directive('favProjectCard', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/scripts/ng-modules/templates/favorites-project-card.tpl.html'
      };
    });
});