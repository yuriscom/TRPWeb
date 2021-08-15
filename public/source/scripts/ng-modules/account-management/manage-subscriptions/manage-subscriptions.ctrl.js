'use strict';
define([ 'main', 'vendor', 'trp.app' ], function () {
  angular.module('TRP')
    .controller('ManageSubscriptionsController',
    [ '$scope', '$http', '$location', 'Notice', 'Subscriptions', 'User', 'SEO',
      function ($scope, $http, $location, Notice, Subscriptions, User, SEO) {
        SEO.setTitle(window.location.pathname);

        $scope.notice = new Notice({});
        $scope.alternateEmail = $location.search().email;

        var getSubsSuccess = function (response) {
          var subscriptions = response.result;
          $scope.subscriptions = _.filter(subscriptions, function (sub) {
            return sub.SubscriptionType.sys_name !== 'global';
          });
          $scope.globalSubscription = _.find(subscriptions, function (sub) {
            return sub.SubscriptionType.sys_name === 'global';
          });
        };

        if ($scope.alternateEmail) {
          User.getUserByEmail($scope.alternateEmail, function (response) {
            if (User.searchStatus === 'success') {
              var userID = User.id;
              $scope.alternateUserID = userID;
              Subscriptions.getSubscriptions(userID, getSubsSuccess, function (response) {
                $scope.notice.message = 'An error occurred while trying to get subscriptions for '
                  + $scope.alternateEmail;
                $scope.notice.type = 'error';
              });
            } else {
              $scope.notice.message = 'A user with email ' + $scope.alternateEmail + ' could not be found';
              $scope.notice.type = 'error';
            }
          }, function (response) {
            $scope.notice.message = 'An error occurred while trying to find user with email:' + $scope.alternateEmail;
            $scope.notice.type = 'error';
          });
        } else {
          Subscriptions.getSubscriptions(null, getSubsSuccess, function (response) {
            $scope.notice.message = 'An error occurred while trying to get your subscriptions, please try again.';
            $scope.notice.type = 'error';
          });
        }

        $scope.toggleGlobal = function () {
          if (!$scope.globalSubscription.status) {
            angular.forEach($scope.subscriptions, function (sub) {
              sub.status = 0;
            });
          }
        };
        $scope.updateSubscriptions = function () {
          $scope.updatingSubscriptions = true;
          $scope.notice.reset();

          var updateSuccess = function (response) {
            $scope.updatingSubscriptions = false;
            $scope.notice.message = $scope.alternateEmail ?
              'Subscriptions for ' + $scope.alternateEmail + ' updated successfully.' :
              'Your subscriptions were updated successfully.';
            // $scope.notice.message = 'Subscriptions updated successfully.';
            $scope.notice.type = 'success';
          };
          var updateError = function (response) {
            $scope.updatingSubscriptions = false;
            $scope.notice.message = 'There was an error updating your subscriptions, please try again.';
            $scope.notice.type = 'error';
          };
          var subData = _.map($scope.subscriptions, function (sub) {
            return _.pick(sub, 'id', 'status', 'unsubscription_source_id');
          });
          var globalSubData = _.pick($scope.globalSubscription, 'id', 'status', 'unsubscription_source_id');
          var data = subData.concat(globalSubData);
          data = setUnsubscriptionID(data);
          Subscriptions.updateSubscriptions($scope.alternateUserID, data, updateSuccess, updateError);
        };

        var setUnsubscriptionID = function (data) {
          return _.map(data, function (sub) {
            if (sub.status === 0) {
              sub.unsubscription_source_id = 2;
            }
            return sub;
          });
        };
      } ]);
    });