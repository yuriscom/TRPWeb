'use strict';
define([ 'main', 'vendor', 'trp.app', 'prospect-match' ], function () {
  angular.module('TRP')
      .controller('ManageSavedSearchesController',
          [ '$scope', '$http', 'SavedSearches', 'Notice', 'User', 'SEO',
            function ($scope, $http, SavedSearches, Notice, User, SEO) {
              SEO.setTitle(window.location.pathname);
              $scope.notice = new Notice({});
              $scope.gaLabel = 'Account';
              if (!User.isAuthenticated()) {
                return;
              }
              var ssSuccess = function (response) {
                $scope.notice.reset();
              };
              var ssError = function (response) {
                $scope.notice.message = 'Failed to get your saved searches, please try again.';
                $scope.notice.type = 'error';
              };
              SavedSearches.getSavedSearches(ssSuccess, ssError);

              $.subscribe('pm.success', function () {
                SavedSearches.getSavedSearches(ssSuccess, ssError);
              });

              $scope.savedSearches = SavedSearches;

              $scope.deleteSavedSearch = function (search) {
                SavedSearches.deleteSavedSearch(search.id, function (response) {
                  $scope.notice.reset();
                  search.removed = true;
                }, function (response) {
                  $scope.notice.message = 'Failed to delete saved search, please try again.';
                  $scope.notice.type = 'error';
                });
              };

              $scope.propertiesActive = true;
            } ]);
});