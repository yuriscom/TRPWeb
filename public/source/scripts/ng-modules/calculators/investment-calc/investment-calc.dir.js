'use strict';
define([ 'main', 'vendor', 'calculators' ], function () {
  angular.module('CalculatorsApp')
    .directive('trpInvestmentCalculator', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/scripts/ng-modules/calculators/investment-calc/investment-calc.tpl.html',
        compile: function () {
          $('#mortgage-calculator-form').foundation();
        }
      };
    });
});