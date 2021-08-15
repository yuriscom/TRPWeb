'use strict';
define ([ 'main', 'vendor', 'trp.app' ], function () {
  angular.module('TRP')
    .config([ '$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      var baseTemplateUrl = '/assets/scripts/ng-modules';
      $routeProvider
        .when('/my/alerts-and-emails-settings/', {
          templateUrl: baseTemplateUrl + '/account-management/manage-subscriptions/manage-subscriptions.tpl.html',
          controller: 'ManageSubscriptionsController'
        })
        .when('/my/saved-homes/', {
          templateUrl: baseTemplateUrl + '/account-management/manage-favorites/manage-favorites.tpl.html',
          controller: 'ManageFavoritesController'
        })
        .when('/my/saved-searches/', {
          templateUrl: baseTemplateUrl + '/account-management/manage-saved-searches/manage-saved-searches.tpl.html',
          controller: 'ManageSavedSearchesController'
        })
        .otherwise({
          templateUrl: baseTemplateUrl + '/templates/navigating.tpl.html',
          redirectTo: function (routeParams, path, search) {
            window.location.reload();
          }
        });

      // use the HTML5 History API
      $locationProvider.html5Mode(true);
    } ])
    .run([ '$http', function ($http) {
      var accessToken = $.cookie('access_token');
      $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
      $http.defaults.headers.put['Content-Type'] = 'text/html; charset=utf-8';
    } ]);
});