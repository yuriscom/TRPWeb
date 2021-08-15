'use strict';
define([ 'main', 'vendor', 'trp.app' ], function () {
  angular.module('TRP')
    .controller('ListViewController',
    [ '$scope', function ($scope) {
      // Manage List Columns
      var listItemMinWidth = 280;
      var $list = $('.list');
      $scope.listSettings = {};
      var setDoubleColumns = function () {
        $scope.listSettings.doubleColumn = $list.width() < (listItemMinWidth * 2) ? false : true;
      };
      setDoubleColumns();

      $.subscribe('main.window_size_changed', function () {
        setDoubleColumns();
        $scope.$apply();
      });
    } ]);
});