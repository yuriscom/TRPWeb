require([ 'main', 'account', 'search' ], function (rMain, auth) {
  window.TheRedPin.isAuthPage = true;
  if ($('#partner-registration').length) {
    var layer = $.getQueryStringParameter('layer') || 'properties';
    var gaLayer = layer === 'projects' ? 'Project' : 'Resale';
    auth('#content > div.auth-holder', {
      requirePhone: true,
      headerMessage: 'Find Your Dream Home!',
      message: 'partner',
      hideMapButton: true,
      finePrint: 'partner',
      subscriptionCheckbox: false,
      redirect: '/partners/search/',
      keepSearch: true,
      ga: {
        label:    'PartnerRegister',
        regOpen:  'RegisterPartner' + gaLayer + ' -- Open',
        regSub:   'RegisterPartner' + gaLayer + ' -- Submit',
        regToLog: 'RegisterToLoginPartner' + gaLayer,
        logOpen:  'LoginPartner' + gaLayer + ' -- Open',
        logSub:   'LoginPartner' + gaLayer + ' -- Submit',
        logToReg: 'LoginToRegisterPartner' + gaLayer
      }
    });
  } else {
    auth('#content > div.auth-holder');
  }
});