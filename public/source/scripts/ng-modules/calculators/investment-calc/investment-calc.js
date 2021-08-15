require ([ 'calculators', 'investment-calc.dir', 'investment-calc.ctrl' ], function () {
  angular.element (document).ready (function () {
    angular.bootstrap (document, [ 'CalculatorsApp' ]);
  });
});