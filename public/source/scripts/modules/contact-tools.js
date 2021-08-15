define('contact-tools', [ 'vendor', 'jquery', 'jquery-ui-datepicker' ], function () {


  console.log('Contact Tools Module Started');

  var TheRedPin = window.TheRedPin
    , ContactTools = TheRedPin.ContactTools = {}
    ;


  window.ga = window.ga || [];


  ContactTools.initialize = function (element) {
    // TODO: make this better!
    var $datePicker = $(element).find('#pref_tour_date');
    if ($datePicker.length) {
      $datePicker.datepicker({ minDate: 0, dateFormat: 'dd/mm/yy' });
    }
//    var ctaName = $(element).find('input[name=contact_tool_name]').val();
    /** GA **/
    var gaField = $(element).find('input[name=ga]');
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

    // Initialize form submission status for GetSiteControl exit survey
    ContactTools.submitted = false;

    $('form input[name="name"]').val(window.TheRedPin.FormStorage.get('name'));
    $('form input[name="email"]').val(window.TheRedPin.FormStorage.get('email'));
    $('form input[name="phone"]').val(window.TheRedPin.FormStorage.get('phone'));
  };

  $(document).on('closed.fndtn.reveal', '[data-reveal]', function (e) {
    if ($(e.target).is('.contact-tool') && !ContactTools.submitted) {
      // Launch GetSiteControl exit survey
      _gscq.push([ 'trackPage', '/exit-survey' ]);
    }
  });

  $(document).on('valid invalid submit', function (e) {
    e.stopPropagation();
    e.preventDefault();
    // Currently all forms with foundation's validation that don't meet these exceptions will submit a contact event
    // Need to keep this updated or refactor
    // jshint maxstatements:100
    if (e.type === 'valid' && $(e.target).parents('#account-panel').length === 0
       && $(e.target).parents('#account-panel').length === 0 &&
       !$(e.target).parent().is('.prospect-match-wrapper') && !$(e.target).is('#mortgage-calculator-form')) {

      // Mark CTA as submitted if user submits form for GetSiteControl purposes
      ContactTools.submitted = true;

      var $form = $(e.target)
        , url = TheRedPin.url + 'contacts'
        ;

      window.TheRedPin.FormStorage.set('name', $('input[name="name"]', $form).val());
      window.TheRedPin.FormStorage.set('email', $('input[name="email"]', $form).val());
      window.TheRedPin.FormStorage.set('phone', $('input[name="phone"]', $form).val());

      var layer = TheRedPin.getLayerLabel();

      var sysTime = new Date($.cookie('sysDateTime'))
        , elapsedSeconds = window.TheRedPin.OAuth.elapsedTime() / 1000
        ;

      // get current server time by adding elapsed seconds since page load
      sysTime.setSeconds(sysTime.getSeconds() + elapsedSeconds);
      var formatedSysTimeOnSubmit = TheRedPin.helpers.formatTime(sysTime);

      var landingUrl = window.TheRedPin.Reporting.get('landing-page');
      var rawContactData = $form.find('input[name=contactData]').val();
      var contactData = rawContactData ? JSON.parse(rawContactData) :
        $('[data-profile-info]').data('profile-info');
      var eventContact        = contactData || {}
        , contactToolName     = $form.find('input[name=contact_tool_name]').val()
        , gaData              = JSON.parse($form.find('input[name=ga]').val())
        , name                = $form.find('#name').val()
        , firstName           = name.indexOf(' ') != -1 ? name.substring(0, name.indexOf(' ')) : name
        , lastName            = name.trim().indexOf(' ') != -1
                                ? name.trim().substring(name.trim().indexOf(' ') + 1)
                                : 'Unspecified'
        , httpReferrer        = window.TheRedPin.Reporting.get('referrer') || ''
        , landingPage         = (typeof landingUrl === 'string') ? landingUrl.toLowerCase() : landingUrl
        , ip                  = window.TheRedPin.Reporting.get('ip') || ''
        , contactCapturedOn   = formatedSysTimeOnSubmit
        , contactBrowser      = window.TheRedPin.Reporting.get('browser')
        , contactBrowserVer   = window.TheRedPin.Reporting.get('browser-ver')
        , contactOs           = window.TheRedPin.Reporting.get('os')
        , contactOsVer        = window.TheRedPin.Reporting.get('os-ver')
        , trackMarketoCookie  = $.cookie('_mkto_trk');

      // TD/PS: Consider extending Object prototype with a 'rename property' function
      // eg: http://stackoverflow.com/questions/4647817/javascript-object-rename-key
      if (eventContact.property_id) {
        eventContact.prop_id = eventContact.property_id;
        delete eventContact.property_id;
      }

      eventContact.first_name             = firstName;
      eventContact.last_name              = lastName;
      eventContact.email                  = $form.find('#email').val();
      eventContact.phone                  = $form.find('#phone').val();
      eventContact.message                = $form.find('#message').val();
      eventContact.track_page_url         = window.location.href;
      eventContact.track_http_referrer    = httpReferrer;
      eventContact.track_landing_url      = landingPage;
      eventContact.track_ip               = ip;
      eventContact.track_browser          = contactBrowser;
      eventContact.track_browser_version  = contactBrowserVer;
      eventContact.track_os               = contactOs;
      eventContact.track_os_version       = contactOsVer;
      eventContact.track_marketo_cookie   = trackMarketoCookie;
      eventContact.contact_type           = 'buyer';
      eventContact.contact_source         = 'website-form';
      eventContact.captured_on            = contactCapturedOn;

      var subscriptionCheckbox = $form.find('#subscription-checkbox');
      if (subscriptionCheckbox.length) {
        eventContact[subscriptionCheckbox.attr('name')] = subscriptionCheckbox.prop('checked');
      }

      /*
       * Setting contact tools based on criteria
       * @param property_id vs precon_id
       */
      if (eventContact.hasOwnProperty('property_id')) {
        switch (contactToolName){
          case 'Book A Tour':
            contactToolName = 'Book A Tour - Resale';
            break;
          case 'Ask Project Question':
            contactToolName = 'Ask Question - Resale';
            break;
          default:
            break;
        }
      }
      // look for NaN date
      var matchNaN = new RegExp('[NA]', 'i');

      if (eventContact.captured_on === '0000-00-00 00:00:00' ||
        matchNaN.test(eventContact.captured_on)) {
        var fallBackDate = new Date();
        var formattedFallBackDate = fallBackDate.getFullYear() + '-'
                                + ('0' + (fallBackDate.getMonth() + 1)).slice(-2) + '-'
                                + ('0' + fallBackDate.getDate()).slice(-2)
                                + ' '
                                + ('0' + fallBackDate.getHours()).slice(-2) + ':'
                                + ('0' + fallBackDate.getMinutes()).slice(-2) + ':'
                                + ('0' + fallBackDate.getSeconds()).slice(-2)
                                ;
        eventContact.captured_on = formattedFallBackDate;
      }

        /* Specific fields set for tools */
      if (eventContact.contact_tool_name === 'Book A Tour' ||
          eventContact.contact_tool_name === 'Book A Tour - Resale') {

        eventContact.pref_tour_date = $form.find('#pref_tour_date').val();
        eventContact.pref_tour_time = $form.find('#pref_tour_time').val();
      }
      /* [end] Specific fields for tools */

      eventContact.contact_tool_name = contactToolName;

      var postParams = {};
      postParams = eventContact;

      postParams = JSON.stringify(postParams);

      $.ajax({
        url: url,
        type: 'POST',
        contentType: 'text/plain',
        data: postParams,
        success: function (data) {
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
          gaData.ga_value = 25;

          window.ga(
            gaData.ga_call, gaData.ga_event, gaData.ga_category,
            gaData.ga_action, gaData.ga_label, gaData.ga_value
          );

          // jscs: disable
          // jshint ignore: start
          goog_report_conversion();
          // jshint ignore: end
          // jscs: enable

          // Bing event submission
          window.uetq = window.uetq || [];
          window.uetq.push({ ec: 'Hard', ea: gaData.ga_action + ' - Submit', el: layer, ev: 25  });
        },

        error: function (data) {
          console.log(data);
        }
      });
    }
  });
});
