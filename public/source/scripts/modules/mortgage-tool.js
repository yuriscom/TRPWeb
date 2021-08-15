define('mortgage-tool-model', [ 'main', 'vendor' ], function (main, vendor) {
  var MortgageToolModel = Backbone.Model.extend({
    defaults: {
      mortgage_amortization: 25,
      mortgage_downpayment: 60000,
      mortgage_downpayment_percent: 20,
      mortgage_home_insurance: 0,
      mortgage_include_taxes_insurance: false,
      mortgage_insurance_payment: 0,
      mortgage_interest_percent: 3,
      mortgage_interest_payment: 0,
      mortgage_interest_total: 0,
      mortgage_is_vip_active: 0,
      mortgage_listing_type: '',
      mortgage_maintenance: 0,
      mortgage_monthly_maintenance: 0,
      mortgage_maintenance_payment: 0,
      mortgage_insurance: 0,
      mortgage_payment: 0,
      mortgage_total: 0,
      mortgage_payment_total: 0,
      mortgage_payment_period: 'monthly',
      mortgage_price: 300000,
      mortgage_principal: 240000,
      mortgage_principal_payment: 0,
      mortgage_rebate_amount: 0,
      mortgage_rental_income: 0,
      mortgage_rental_income_payment: 0,
      mortgage_taxes: 3000,
      mortgage_taxes_payment: 0,
      mortgage_tax_percent: 1,
      showTitle: true
    },
    initialize: function () {
      var self = this;
      var deferredInterestRate = this.getInterestRate();
      $.when(deferredInterestRate).then(function () {
        self.listenTo(self, 'change:mortgage_price', self.changePrice);
        self.listenTo(self, 'change:mortgage_downpayment', self.changeDownpayment);
        self.listenTo(self, 'change:mortgage_downpayment_percent', self.changeDownpaymentPercent);
        self.listenTo(self, 'change:mortgage_taxes', self.changeTaxes);
        self.listenTo(self, 'change:mortgage_tax_percent', self.changeTaxPercent);
        self.listenTo(self, 'change', self.calculateSummary);

        self.trigger('change:mortgage_price');
        self.trigger('change');
        self.trigger('updateView');
      });
    },
    changePrice: function () {
      var downpayment = this.calculateDownpayment();
      var taxes = this.calculateTaxes();

      this.set('mortgage_downpayment', downpayment, { silent: true });
      this.set('mortgage_taxes', taxes, { silent: true });
    },
    // Handle model changes
    changeDownpayment: function () {
      var downpaymentPercent = this.calculateDownpaymentPercent();
      this.set('mortgage_downpayment_percent', downpaymentPercent, { silent: true });
    },
    changeDownpaymentPercent: function () {
      var downpayment = this.calculateDownpayment();
      this.set('mortgage_downpayment', downpayment, { silent: true });
    },
    changeTaxes: function () {
      var taxPercent = this.calculateTaxPercent();
      this.set('mortgage_tax_percent', taxPercent, { silent: true });
    },
    changeTaxPercent: function () {
      var taxes = this.calculateTaxes();
      this.set('mortgage_taxes', taxes, { silent: true });
    },
    // Calculate Model Values
    calculateDownpayment: function () {
      return this.get('mortgage_price') * this.downpaymentRate();
    },
    calculateDownpaymentPercent: function () {
      return this.get('mortgage_downpayment') / this.get('mortgage_price') * 100;
    },
    calculateTaxes: function () {
      return this.get('mortgage_price') * this.taxRate();
    },
    calculateTaxPercent: function () {
      return this.get('mortgage_taxes') / this.get('mortgage_price') * 100;
    },
    calculatePrincipal: function () {
      return this.get('mortgage_price') * (1 - this.downpaymentRate());
    },
    calculateSummary: function () {
      this.set('mortgage_principal', this.calculatePrincipal(), { silent: true });
      this.set('mortgage_payment', this.calculateMortgagePayment(), { silent: true });

      // depends on principal and mortgage_payment
      this.set('mortgage_total', this.calculateMortgageTotal(), { silent: true });
      // depends on mortgage_total
      this.set('mortgage_interest_total', this.calculateInterestTotal(), { silent: true });

      this.set('mortgage_principal_payment', this.calculatePrincipalPayment(), { silent: true });
      this.set('mortgage_interest_payment', this.calculateInterestPayment(), { silent: true });
      this.calculateExtrasPayment();
      this.calculatePaymentTotal();
    },
    calculatePaymentTotal: function () {
      var paymentTotal = this.get('mortgage_principal_payment') + this.get('mortgage_interest_payment') -
                          this.get('mortgage_rental_income_payment') + this.get('mortgage_maintenance_payment');
      if (this.get('mortgage_include_taxes_insurance')) {
        paymentTotal += this.get('mortgage_taxes_payment') + this.get('mortgage_insurance_payment');
      }
      this.set('mortgage_payment_total', paymentTotal, { silent: true });
      this.trigger('mortgagePaymentUpdated');
    },
    calculateMortgagePayment: function () {
      var numAnnualPayments = this.numAnnualPayments();
      var interestRate = Math.pow(Math.pow((1 + (this.get('mortgage_interest_percent') / 200)), 2)
                        , (1 / numAnnualPayments)) - 1;
      var total = (this.get('mortgage_principal') * interestRate) /
                  (1 - Math.pow((1 + interestRate), (-this.get('mortgage_amortization') * numAnnualPayments)));
      return total;
    },
    calculateMortgageTotal: function () {
      var numAnnualPayments = this.numAnnualPayments();
      var total = this.get('mortgage_payment') * numAnnualPayments * this.get('mortgage_amortization');

      return total;
    },
    calculateInterestTotal: function () {
      var numAnnualPayments = this.numAnnualPayments();
      var total = this.get('mortgage_total') - this.get('mortgage_principal');

      return total;
    },
    calculateInterestPayment: function () {
      var numAnnualPayments = this.numAnnualPayments();
      var numTotalPayments = numAnnualPayments * this.get('mortgage_amortization');
      var total = this.get('mortgage_interest_total') / numTotalPayments;

      return total;
    },
    calculatePrincipalPayment: function () {
      var numAnnualPayments = this.numAnnualPayments();
      var numTotalPayments = numAnnualPayments * this.get('mortgage_amortization');
      var total = this.get('mortgage_principal') / numTotalPayments;

      return total;
    },
    calculateExtrasPayment: function () {
      var numAnnualPayments = this.numAnnualPayments();
      var taxesPayment = this.get('mortgage_taxes') / numAnnualPayments;
      var insurancePayment = (this.get('mortgage_home_insurance') + this.get('mortgage_insurance')) / numAnnualPayments;
      var rentalIncomePayment = this.get('mortgage_rental_income') * 12 / numAnnualPayments;
      var maintenancePayment = this.get('mortgage_maintenance') * 12 / numAnnualPayments;
      this.set('mortgage_taxes_payment', taxesPayment, { silent: true });
      this.set('mortgage_insurance_payment', insurancePayment, { silent: true });
      this.set('mortgage_rental_income_payment', rentalIncomePayment, { silent: true });
      this.set('mortgage_maintenance_payment', maintenancePayment, { silent: true });
    },
    // Model Helpers
    numAnnualPayments: function () {
      var total = this.get('mortgage_payment_period') === 'monthly' ? 12 : 26;

      return total;
    },
    taxRate: function () {
      return this.get('mortgage_tax_percent') / 100;
    },
    downpaymentRate: function () {
      return this.get('mortgage_downpayment_percent') / 100;
    },
    interestRate: function () {
      return this.get('mortgage_interest_percent') / 100;
    },
    getInterestRate: function () {
      var self = this;
      var deferred = new $.Deferred();
      var url = TheRedPin.url + 'rates?type=interestRate';
      $.ajax({
        url: url,
        success: function (response) {
          var interestPercent = parseFloat(response.result[0].content);
          self.set('mortgage_interest_percent', interestPercent);
          deferred.resolve();
        },
        error: function (response) {
          self.set('mortgage_interest_percent', 3);
          deferred.resolve();
        }
      });
      return deferred;
    }
  });

  return MortgageToolModel;
});

define('mortgage-tool', [ 'main', 'vendor', 'mortgage-tool-model' ], function (m, v, MortgageToolModel) {
  console.log('Mortgage Tool Module Started');

  var MortgageToolView = Backbone.View.extend({
    initialize: function () {
      this.listenTo(this, 'updateView', this.render);
      this.listenTo(this.model, 'updateView', this.render);
      this.listenTo(this.model, 'mortgagePaymentUpdated', this.updateMortgageButton);
      this.template = _.template($('#mortgage-tool-template').html());

      $(this.el).on('keydown', function (e) {
        if (e.keyCode === 13) {
          e.preventDefault();

          var parent = e.target.parentElement;
          var field = document.createElement('input');

          field.id = 'pseudo-input';
          field.setAttribute('type', 'text');
          field.setAttribute('style', 'height: 1px; border: none; position: absolute; left: -1000px');
          parent.appendChild(field);
          field.focus();
          setTimeout(function () {
            field.setAttribute('style', 'display: none;');
            $(parent).remove('#pseudo-input');
          }, 50);
        }
      });
    },

    events: {
      'change #mortgage-calculator-form input': 'inputChanged',
      'click #mortgage-calculator-form .payment-option': 'paymentClicked',
      'click #mortgage-refresh-payment': 'flickerPayment'
    },

    updateModel: function (attr, val) {
      this.model.set(attr, val);
      this.trigger('updateView');
    },

    flickerPayment: function () {
      $('.summary-value').hide();
      setTimeout(function () {
        $('.summary-value').show();
      }, 100);
    },

    inputChanged: function (e) {
      e.preventDefault();
      var attr = e.target.id;
      var val;
      var parsedVal;

      var modelAttribute = attr.replace(/-/g, '_');

      if (e.target.value === '') {
        val = 0;
      } else if (e.target.id == 'mortgage-include-taxes-insurance') {
        val = !this.model.get('mortgage_include_taxes_insurance');
      } else {
        parsedVal = e.target.value.replace(/[^0-9.]/g, '');
        if (parsedVal === '') {
          val = 0;
        } else {
          val = parseFloat(parsedVal);
        }
      }

      this.updateModel(modelAttribute, val);
    },

    paymentClicked: function (e) {
      e.preventDefault();
      var attr = 'mortgage_payment_period';
      var val = $(e.target).data('mortgage-payment-period');
      if (val !== this.model.get('mortgage_payment_period')) {
        this.updateModel(attr, val);
      }
    },

    updateMortgageButton: function (e) {
      var monthlyMortgagePayment = this.model.get('mortgage_payment_total') * this.model.numAnnualPayments() / 12;
      var formattedMonthlyMortgagePayment = _.string.numberFormat(monthlyMortgagePayment);
      $('[data-calculated-monthly-payment]').html(formattedMonthlyMortgagePayment);
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template(this.model.toJSON()));
      // re-attach foundation handlers
      $el.foundation();
      // trigger abide's validations
      $el.find('form').trigger('validate.fndtn.abide');
      $($('input[data-invalid]')[0]).focus();

      return this;
    }
  });

  return MortgageToolView;
});