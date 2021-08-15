require([ 'main', 'prospect-match' ], function (rMain, ProspectMatch) {
  var TheRedPin = window.TheRedPin || {};
  if (!$('#prospect-match-onpage').length) {
    return;
  }
  var ele = $('#prospect-match-onpage')[0];
  var layer = $.getQueryStringParameter('layer') || 'properties';
  var gaLayer = layer === 'projects' ? 'Project' : 'Resale';
  var allowPreset = {
    projects: [ 'city', 'hood', 'price', 'num_beds', 'num_baths', 'occupancy' ],
    properties: [ 'city', 'hood', 'price', 'num_beds', 'num_baths', 'property_sys_type' ]
  };
  var formDefaults = {
    min_price: layer == 'projects' ? 500000 : 250000,
    max_price: layer == 'projects' ? 800000 : 650000
  };
  var presets = {};
  _.each(allowPreset[layer], function (attr) {
    presets[attr] = $.getQueryStringParameter(attr);
  });

  // set price
  if (!presets.price) {
    presets.min_price = formDefaults.min_price;
    presets.max_price = formDefaults.max_price;
  } else {
    presets.min_price = parseFloat(presets.price) - 100000;
    presets.max_price = parseFloat(presets.price) + 100000;
  }

  // set occupancy
  var y = (new Date()).getFullYear();
  if (presets.occupancy) {
    var occupancyFloat = parseFloat(presets.occupancy) - 1;
    occupancyFloat = Math.max(y, Math.min(y + 4, occupancyFloat));
    presets.occupancy = _.isNaN(occupancyFloat) ? 'all' : occupancyFloat;
  }

  var pmOptions = {
    layer: layer,
    onPage: true,
    ga: {
      ga_call: 'send',
      ga_event: 'event',
      ga_category: 'Soft',
      ga_action: 'SearchPartner' + gaLayer,
      ga_label: 'PartnerSearch',
      ga_value: ''
    },
    gaContact: {
      ga_call: 'send',
      ga_event: 'event',
      ga_category: 'Hard',
      ga_action: 'SearchPartner' + gaLayer + 'ContactUs',
      ga_label: 'PartnerSearch',
      ga_value: ''
    },
    presets: presets,
    pmSearchHybrid: true,
    pmToggle: true,
    showPersonalDetails: false,
    fullWidthForm: true,
    hideDisclaimer: true,
    headerMessage: 'Find Your Dream Home!',
    buttonText: 'Show Me My Dream Home',
    customPropertyTypes:
        [ 'detached', 'semi-detached', 'condo-townhouse,townhouse', 'condo-townhouse,condo-apartment' ]
  };

  var userName = $.getQueryStringParameter('user_name');
  var userEmail = $.getQueryStringParameter('user_email');
  if (userEmail) {
    pmOptions.user = {
      full_name: userName,
      email: userEmail
    };
  }
  TheRedPin.ProspectMatch.initialize(ele, pmOptions);
});