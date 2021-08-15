'use strict';
define([ 'main', 'vendor', 'trp.app' ], function () {
  angular.module('TRP')
    .controller('ManageFavoritesController',
      [ '$scope', '$http', 'Notice', 'Favorites', 'User', 'SEO',
        function ($scope, $http, Notice, Favorites, User, SEO) {
          SEO.setTitle(window.location.pathname);

          if (!User.isAuthenticated()) {
            return;
          }

          $scope.target = Modernizr.touch || TheRedPin.Reporting.get('private-safari') ? '_self' : '_blank';

          $scope.notice = new Notice({});
          $scope.favorites = Favorites;
          $scope.noResultsMessage = {
            display: false,
            type: 'resale'
          };

          Favorites.getFavorites(function (response) {
            if (response.result && response.result.projects) {
              $scope.favorites.projectRows = $scope.chunkData(response.result.projects, 2);
            }
            if (response.result && response.result.properties) {
              $scope.favorites.propertyRows = $scope.chunkData(response.result.properties, 2);
            }
            $scope.showProperties();
            $scope.notice.reset();
          }, function (response) {
            $scope.notice.message = 'Failed to get your favourites, please try again.';
            $scope.notice.type = 'error';
          });

          $scope.showProperties = function () {
            $scope.activeType = 'properties';
            $scope.noResultsMessage.display = !$scope.favorites.properties;
            $scope.noResultsMessage.type = 'resale';
            $scope.notice.reset();
          };
          $scope.showProjects = function () {
            $scope.activeType = 'projects';
            $scope.noResultsMessage.display = !$scope.favorites.projects;
            $scope.noResultsMessage.type = 'new';
            $scope.notice.reset();
          };

          $scope.deleteFavorite = function (event, fav) {
            event.preventDefault();
            event.stopPropagation();
            fav.removing = true;
            var deleteSuccess = function (response) {
              fav.removing = false;
              fav.removed = true;
              $scope.notice.reset();
            };
            var deleteError = function (response) {
              fav.removing = false;
              $scope.notice.message = 'Failed to delete favourite, please try again.';
              $scope.notice.type = 'error';
            };
            Favorites.deleteFavorite(fav.favorite_id, deleteSuccess, deleteError);
          };

          $scope.chunkData = function (arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
              newArr.push(arr.slice(i, i + size));
            }
            return newArr;
          };

          var defaultCity = TheRedPin.Storage.get('default-city');
          var baseSEO = (typeof defaultCity == 'string' && defaultCity.search(/vancouver/i) > -1) ?
            '/bc-vancouver/' : '/on-toronto/';
          $scope.noFavUrls = {
            properties: baseSEO + 'mls-listings-for-sale/',
            projects: baseSEO + 'new-preconstruction-for-sale/'
          };

        } ]);
      });