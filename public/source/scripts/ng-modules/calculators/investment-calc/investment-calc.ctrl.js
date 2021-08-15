'use strict';
define([ 'main', 'vendor', 'calculators' ], function () {
  angular.module('CalculatorsApp')
    .controller('InvestmentCalculatorController', [ '$scope', '$filter', '$timeout',
      function ($scope, $filter, $timeout) {
        $scope.checkVal = 0;
        $scope.invest = {
          price: 250000,
          downpayment: 50000,
          downpaymentPercent: 20,
          mortgageInterestPercent: 2.69,
          amortization: 25,
          homeInsurance: 2300,
          tax: 2500,
          taxPercent: 1,
          unitSize: 650,
          maintenance: 0.5,
          rentalIncome: 1900,
          annualGain: 3
        };

        $scope.investSummary = {
          numYears: 3,
          principal: function () {
            return $scope.invest.price - $scope.invest.downpayment;
          },
          totalMonthlyIncome: function () {
            var monthlyIncome = $scope.invest.rentalIncome;
            var annualGainRate = $scope.invest.annualGain / 100;
            var data = [];
            for (var i = 0; i < this.numYears; i++) {
              var adjustedMonthlyIncome = monthlyIncome * Math.pow((1 + annualGainRate), i);
              data.push(adjustedMonthlyIncome);
            }
            return data;
          },
          monthlyExpenses: [],
          insurance: function () {
            var annualInsurance = $scope.invest.homeInsurance;
            var monthlyInsurance = annualInsurance / 12;
            var data = [];
            for (var i = 0; i < this.numYears; i++) {
              data.push(monthlyInsurance);
            }
            return data;
          },
          tax: function () {
            var annualTax = $scope.invest.tax;
            var monthlyTax = annualTax / 12;
            var data = [];
            for (var i = 0; i < this.numYears; i++) {
              data.push(monthlyTax);
            }
            return data;
          },
          mortgage: function () {
            var principal = this.principal();
            var rate = $scope.invest.mortgageInterestPercent / 100;
            var amortization = $scope.invest.amortization;
            var monthlyMortgage = ((principal * (rate / 12)) * Math.pow((1 + (rate / 12)), (amortization * 12))) /
              (Math.pow((1 + (rate / 12)), (amortization * 12)) - 1);
            var data = [];
            for (var i = 0; i < this.numYears; i++) {
              data.push(monthlyMortgage);
            }
            return data;
          },
          maintenance: function () {
            var monthlyMaintenance = $scope.invest.unitSize * $scope.invest.maintenance;
            var data = [];
            for (var i = 0; i < this.numYears; i++) {
              data.push(monthlyMaintenance);
            }
            return data;
          },
          totalMonthlyExpenses: function () {
            var insurance = this.insurance();
            var tax = this.tax();
            var mortgage = this.mortgage();
            var maintenance = this.maintenance();
            var data = [];
            for (var i = 0; i < this.numYears; i++) {
              data.push(insurance[ i ] + tax[ i ] + mortgage[ i ] + maintenance[ i ]);
            }
            return data;
          },
          roi: [],
          annualCashflowAfterExpenses: function () {
            var monthlyIncome = this.totalMonthlyIncome();
            var monthlyExpenses = this.totalMonthlyExpenses();
            var data = [];
            for (var i = 0; i < this.numYears; i++) {
              var annualCashFlow = (monthlyIncome[ i ] - monthlyExpenses[ i ]) * 12;
              data.push(annualCashFlow);
            }
            return data;
          },
          monthlyCashflowAfterExpenses: function () {
            var monthlyIncome = this.totalMonthlyIncome();
            var monthlyExpenses = this.totalMonthlyExpenses();
            var data = [];
            for (var i = 0; i < this.numYears; i++) {
              var monthlyCashFlow = (monthlyIncome[ i ] - monthlyExpenses[ i ]);
              data.push(monthlyCashFlow);
            }
            return data;
          },
          mortgagePrincipalPayDown: function () {
            var principal = this.principal();
            var runningPayDown = 0;
            var monthlyRate = $scope.invest.mortgageInterestPercent / 100 / 12;
            var numPayments = $scope.invest.amortization * 12;
            var data = [];
            for (var i = 0; i < this.numYears; i++) {
              var elapsedMonths = (i + 1) * 12;
              var payDown = principal - runningPayDown -
                principal * (Math.pow((1 + monthlyRate), (numPayments)) - Math.pow((1 + monthlyRate), elapsedMonths)) /
                (Math.pow((1 + monthlyRate), numPayments) - 1);
              runningPayDown += payDown;
              data.push(payDown);
            }
            return data;
          },
          annualReturn: function () {
            var self = this;
            var data = [];
            var annualCashFlow = self.annualCashflowAfterExpenses();
            var payDown = self.mortgagePrincipalPayDown();
            var downpayment = $scope.invest.downpayment;
            for (var i = 0; i < self.numYears; i++) {
              var annualReturn = (annualCashFlow[ i ] + payDown[ i ]) / downpayment * 100;
              data.push(annualReturn);
            }
            return data;
          }
        };

        // Calculator
        $scope.calculator = {
          changePrice: function () {
            this.calculateDownpaymentPercent();
            this.calculateTax();
          },
          changeDownpayment: function () {
            this.calculateDownpaymentPercent();
          },
          changeDownpaymentPercent: function () {
            this.calculateDownpayment();
          },
          changeTax: function () {
            this.calculateTaxPercent();
          },
          changeTaxPercent: function () {
            this.calculateTax();
          },
          // Calculators
          calculateDownpayment: function () {
            $scope.invest.downpayment = $scope.invest.downpaymentPercent * $scope.invest.price / 100;
          },
          calculateDownpaymentPercent: function () {
            $scope.invest.downpaymentPercent = $scope.invest.downpayment / $scope.invest.price * 100;
          },
          calculateTax: function () {
            $scope.invest.tax = $scope.invest.taxPercent * $scope.invest.price / 100;
          },
          calculateTaxPercent: function () {
            $scope.invest.taxPercent = $scope.invest.tax / $scope.invest.price * 100;
          }
        };

        $scope.$watchCollection('invest', function () {
          $scope.checkVal += 1;
        });

        $scope.flickerSummary = function () {
          $scope.flickerClicked = true;
          $timeout(function () {
            $scope.flickerClicked = false;
          }, 140);
        };
      } ])

    // This is used to trigger validation done by foundation.
    .directive('checkRender', function () {
      return {
        link: function (scope, element) {
          $(element).attr('data-check-val', scope.checkVal);
          scope.$watch('checkVal', function () {
            $(element).attr('data-check-val', scope.checkVal);
          });
          scope.$watch(function () {
            return $(element).attr('data-check-val');
          }, function (newVal, oldVal) {
            if (newVal !== oldVal) {
              $('form', element).trigger('validate.fndtn.abide');
            }
          });
        }
      };
    })
    .directive('integer', [ '$filter', function ($filter) {
      return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelController) {
          ngModelController.$parsers.push(function (data) {
            //convert data from view format to model format
            data = data.replace(/[^0-9.]/g, '');
            data = parseFloat(data);
            element.val($filter('number')(data, 0));
            return data; //converted
          });

          ngModelController.$formatters.push(function (data) {
            return $filter('number')(data, 0);
          });

          scope.$watch(function () {
            return element.val();
          }, function (val) {
            if (val === '') {
              element.val(0);
            }
          });
        }
      };
    } ])
    .directive('percent', [ '$filter', function ($filter) {
      return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelController) {
          ngModelController.$parsers.push(function (data) {
            //convert data from view format to model format
            data = data.replace(/[^0-9.]/g, '');
            data = parseFloat(data);
            element.val($filter('number')(data, 2));
            return data; //converted
          });

          ngModelController.$formatters.push(function (data) {
            //convert data from model format to view format
            data = $filter('number')(data, 2);
            return data; //converted
          });
          scope.$watch(function () {
            return element.val();
          }, function (val) {
            if (val === '') {
              element.val(0);
            }
          });
        }
      };
    }
    ]);
});