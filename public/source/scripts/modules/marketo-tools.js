define('marketo-tools', [ 'vendor', 'jquery' ], function () {
  console.log('Marketo Tools Module Started');

  var TheRedPin = window.TheRedPin
    , MarketoTools = TheRedPin.MarketoTools = {
      mktoUrl: 'https://app-abq.marketo.com'
    }
    ;

  window.ga = window.ga || [];

  MarketoTools.initialize = function ($form) {
    console.log('initialize contact tool');

    /** GA **/
    var gaField = $form.find('input[name=ga]');
    if (gaField.length) {
      var gaData = JSON.parse(gaField.val());
      gaData.ga_action = gaData.ga_action + ' - Open';
      var layer = gaData.ga_label;
      gaData.ga_label = layer;
      if (typeof layer === 'undefined') {
        layer = TheRedPin.getLayerLabel();
      }
      gaData.ga_value = 0;
      window.ga(
        gaData.ga_call, gaData.ga_event, gaData.ga_category, gaData.ga_action, gaData.ga_label, gaData.ga_value
      );
    }
    $('form input[name="name"]').val(window.TheRedPin.FormStorage.get('name'));
    $('form input[name="email"]').val(window.TheRedPin.FormStorage.get('email'));
    $('form input[name="phone"]').val(window.TheRedPin.FormStorage.get('phone'));

    this.setSubmitHandler($form);
  };

  MarketoTools.setSubmitHandler = function ($form) {
    console.log($form);
    var self = this;
    $form.on('valid', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var serializedformData = TheRedPin.helpers.serializeObject($form);
      var gaData = JSON.parse($form.find('input[name=ga]').val());
      var mktoData = self.buildMktoData(serializedformData);

      $.ajax({
        url: self.mktoUrl + '/index.php/leadCapture/save',
        method: 'POST',
        // this will throw an error, but is necessary to remove authorization header set in $.ajaxSetup found in main.js
        beforeSend: function (jqXHR, settings) {
          jqXHR.setRequestHeader('Access-Control-Request-Headers', null);
        },
        data: mktoData
      }).always(function () {
        $('.reveal-modal').foundation('reveal', 'close');

        $form.trigger('reset');

        TheRedPin.Components.revealTemplate({
          template: 'thank-you-modal-template',
          id: 'thank-you-modal',
          classes: 'search medium no-padding'
        });

        //Track after submission
        /** GA **/
        gaData.ga_action = gaData.ga_action + ' - Submit';

        window.ga(
          gaData.ga_call, gaData.ga_event, gaData.ga_category,
          gaData.ga_action, gaData.ga_label, gaData.ga_value
        );
      });
    });
  };

  MarketoTools.buildMktoData = function (formData) {
    var self = this;
    var mktoFormKeys = [ 'formid', 'munchkinId', 'Email' ];
    var mktoData = {};
    _.each(mktoFormKeys, function (key, index) {
      mktoData[key] = formData[key];
    });
    var rawName = formData.name;
    mktoData.FirstName  = rawName.indexOf(' ') != -1 ? rawName.substring(0, rawName.indexOf(' ')) : rawName;
    mktoData.LastName   = rawName.trim().indexOf(' ') != -1 ?
      rawName.trim().substring(rawName.trim().indexOf(' ') + 1) : 'Unspecified';

    mktoData.Referring_Source_URL_Long__c = TheRedPin.Reporting.get('referrer');
    mktoData.Landing_URL_Long__c          = TheRedPin.Reporting.get('landing-page');
    mktoData.Conversion_URL_Long__c       = window.location.href;

    return mktoData;
  };
});