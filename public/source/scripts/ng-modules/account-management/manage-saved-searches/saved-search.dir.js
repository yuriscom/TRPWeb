'use strict';
define([ 'main', 'vendor', 'trp.app' ], function () {
  angular.module('TRP')
    .directive('savedSearch', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/scripts/ng-modules/account-management/manage-saved-searches/saved-search.tpl.html'
      };
    });
});