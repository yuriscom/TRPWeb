(function (window, document) {

  // for cache busting
  // jQuery is not loaded yet, so we use pure JavaScript
  var build = document.querySelector('html').getAttribute('data-build');

  // RequireJS configuration
  window.require = {

    baseUrl: '/assets/scripts',
    urlArgs: build,

    // for consistent and unified look, allow 'single' word keys with single quotes in this object
    // jscs: disable disallowQuotedKeysInObjects
    paths: {

      // RequireJS plugins
      async:             'vendor/require/async',
      font:              'vendor/require/font',
      goog:              'vendor/require/goog',
      image:             'vendor/require/image',
      json:              'vendor/require/json',
      noext:             'vendor/require/noext',
      mdown:             'vendor/require/mdown',
      propertyParser:    'vendor/require/propertyParser',
      markdownConverter: 'vendor/require/Markdown.Converter',

      // application main
      'main':          'main',

      // pages
      'profile':       'pages/profile',

      // shared modules
      'map':              'modules/map',
      'carousel':         'modules/carousel',
      'summary':          'modules/summary',
      'share':            'modules/share',
      'contact-tools':    'modules/contact-tools',
      'floor-plans':      'modules/floor-plans',
      'grid-list-view':   'modules/grid-list-view',
      'account':          'modules/account',
      'tos':              'modules/tos',
      'marketo-tools':    'modules/marketo-tools',
      'favorites':        'modules/favorites',

      // shared modules which were merged into main
      'components':    'main',
      'search':        'main',
      'ui-components': 'main',

      // vendor libraries
      'vendor':        'vendor/vendor',

      // jQuery, Underscore, Backbone & Foundation are merged into vendor.js and loaded before RequireJS
      'jquery':        'vendor/vendor',

      // optional libraries
      // 'handlebars':             'vendor/handlebars',
      'hammer':        'vendor/hammer',

      // Foundation components
      'foundation-equalizer':   'vendor/foundation/foundation.equalizer',
      'foundation.dropdown':    'vendor/foundation/foundation.dropdown',

      // jQuery UI widgets
      'jquery-ui-accordion':    'vendor/jquery/jquery.ui.accordion',
      'jquery-ui-autocomplete': 'vendor/jquery/jquery.ui.autocomplete',
      'jquery-ui-button':       'vendor/jquery/jquery.ui.button',
      'jquery-ui-menu':         'vendor/jquery/jquery.ui.menu',
      'jquery-ui-position':     'vendor/jquery/jquery.ui.position',
      'jquery-ui-tooltip':      'vendor/jquery/jquery.ui.tooltip',
      'jquery-ui-datepicker':   'vendor/jquery/jquery.ui.datepicker',

      // jQuery UI effects
      'jquery-ui-effect-fade':  'vendor/jquery/jquery.ui.effect-fade',
      'jquery-ui-effect-slide': 'vendor/jquery/jquery.ui.effect-slide',

      // 3rd party jQuery widgets and plugins
      'jquery-slick':           'vendor/jquery/jquery.slick',
      'jquery-nouislider':      'vendor/jquery/jquery.nouislider.all',

      // Google maps utilities
      'google-maps-marker-with-label': 'vendor/google/markerwithlabel',
      'google-maps-marker-animate':    'vendor/google/markeranimate',

      // Angular Modules
      'calculators': 'ng-modules/calculators/calculators',
      'investment-calc': 'ng-modules/calculators/investment-calc/investment-calc',
      'investment-calc.ctrl': 'ng-modules/calculators/investment-calc/investment-calc.ctrl',
      'investment-calc.dir': 'ng-modules/calculators/investment-calc/investment-calc.dir',

      'trp.app': 'ng-modules/trp.app',
      'account-management': 'ng-modules/account-management/account-management',
      'account-management.config': 'ng-modules/account-management/account-management.config',
      'account-management.svc': 'ng-modules/account-management/account-management.svc',
      'manage-favorites.ctrl': 'ng-modules/account-management/manage-favorites/manage-favorites.ctrl',
      'manage-subscriptions.ctrl': 'ng-modules/account-management/manage-subscriptions/manage-subscriptions.ctrl',
      'manage-saved-searches.ctrl': 'ng-modules/account-management/manage-saved-searches/manage-saved-searches.ctrl',
      'saved-search.dir': 'ng-modules/account-management/manage-saved-searches/saved-search.dir',

      'list-view.ctrl': 'ng-modules/list-view/list-view.ctrl',
      'list-view.dir': 'ng-modules/list-view/list-view.dir'
    },

    shim: {
      // 'vendor': {},
      // 'underscore': {
      //   exports: '_'
      // },
      // 'backbone': {
      //   deps: ['underscore', 'jquery'],
      //   exports: 'Backbone'
      // },
      // 'handlebars': {
      //   exports: 'Handlebars'
      // },
      'jquery-ui-autocomplete': {
        deps: [ 'jquery-ui-position', 'jquery-ui-menu' ]
      },
      'jquery-ui-menu': {
        deps: [ 'jquery-ui-position' ]
      },
      'jquery-ui-tooltip': {
        deps: [ 'jquery-ui-position' ]
      }
    },
    // jscs: enable disallowQuotedKeysInObjects

    waitSeconds: 0,
    deps: [ 'vendor' ]
  };

})(window, document);
/* jQuery UI load order
 *   UI Core      // included in vendors
 *   Widget       // included in vendors
 *   Mouse        // included in vendors
 *   Draggable
 *   Droppable
 *   Resizeable
 *   Selectable
 *   Sortable
 *   Effects Core // included in vendors
 *   All effects  // alphabetically orded
 *   Accordion
 *   Autocomplete
 *   Button
 *   Datepicker
 *   Dialog
 *   Menu
 *   Menubar
 *   Popup
 *   Positon
 *   Progress bar
 *   Slider
 *   Spinner
 *   Tabs
 *   Tooltip
 */
