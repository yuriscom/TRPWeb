console.log('Main Application Started');


// main application namespace and module
window.TheRedPin = {

  // build timestamp
  build: document.querySelector('html').getAttribute('data-build'),
  // application service endpoint
  url: document.querySelector('html').getAttribute('data-url'),
  mesUrl: document.querySelector('html').getAttribute('data-mes'),

  // regex patterns
  // jscs: disable
  // jshint ignore: start
  patterns: {
    empty: /^$/,
    name: /^[a-zA-Z ,.'-]+$/,
    cityselectize: /^[0-9]+$/,
    searchname: /^[a-zA-Z0-9 ,.'-]+$/,
    alpha: /^[a-zA-Z]+$/,
    alpha_numeric: /^[a-zA-Z0-9]+$/,
    password: /^[a-zA-Z0-9.!@#$%&*+\/=?^_`'"{|}~-]+$/,
    price: /^\$?\s?[\d,]+\.?[\d]{0,}$/,
    percent: /^(\d{1,2}|100)\s?%?$/,
    integer: /^[-+]?\d+$/,
    number: /^[-+]?\d*\.?\d+$/,
    phone: /^((\+[0-9]{1,2}[-. ]?)?(\([0-9]{3}\)|[0-9]{3})[-. ]?[0-9]{3}[-. ]?[0-9]{4}).*$/,
    // amex, visa, diners
    card: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
    cvv: /^([0-9]){3,4}$/,
    // 123.456.789.012
    ip_address: /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    // abc.def@egh.ij
    email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
    // http://www.abc.de
    url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    // abc.de
    domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,
    datetime: /([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))/,
    // YYYY-MM-DD
    date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/,
    // HH:MM:SS
    time: /(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}/,
    dateISO: /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,
    // MM/DD/YYYY
    month_day_year: /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/,
    // #FFF or #FFFFFF
    color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
  },
  // jshint ignore: end
  // jscs: enable

  // timing, durations
  time: {
    fast:   200,
    medium: 500,
    slow:   1000
  },

  searchPrice: {
    options: [
      { value: 0, price: '$0' },
      { value: 100000, price: '$100,000' },
      { value: 200000, price: '$200,000' },
      { value: 300000, price: '$300,000' },
      { value: 400000, price: '$400,000' },
      { value: 500000, price: '$500,000' },
      { value: 600000, price: '$600,000' },
      { value: 700000, price: '$700,000' },
      { value: 800000, price: '$800,000' },
      { value: 900000, price: '$900,000' },
      { value: 1000000, price: '$1 Million' },
      { value: 1500000, price: '$1.5 Million' },
      { value: 2000000, price: '$2 Million' },
      { value: 5000000, price: '$5 Million' },
      { value: 10000000, price: '$10 Million' },
      { value: 25000000, price: '$25 Million' }
    ]
  },

  // so in future, we can support other languages easily!
  i18n: {
    en: {
      validation: {
        password: {
          missing:   'You forgot to enter your password',
          invalid:   'Looks like you entered an invalid password',
          size:      'Password should be between 6 and 20 characters',
          incorrect: 'Incorrect password'
        },
        equal: {
          invalid:   'This does not match the @@@ field'
        },
        select: {
          missing:   'Please make a selection'
        },
        mortgage: {
          price: {
            too_low:   'Home price is too low',
            too_high:  'Home price is too high',
            missing:   'Home price is missing',
            bad_input: 'Wrong format, try using numbers'
          },
          downpayment: {
            too_low:   'Down Payment can not be negative',
            too_high:  'Down Payment exceeds the home price',
            missing:   'Down Payment is missing',
            bad_input: 'Wrong format, try using numbers'
          },
          downpayment_percent: {
            too_low:   'Down Payment Percentage can not be negative',
            too_high:  'Down Payment Percentage exceeds the home price',
            missing:   'Down Payment Percentage is missing',
            bad_input: 'Wrong format, try using numbers'
          },
          rate: {
            too_low:  'Rate is too low',
            too_high: 'Rate is too high',
            number:  'Rate must be a number',
            negative:  'Rate value must be positive',
            missing:  'Rate is missing'
          },
          amortization: {
            too_low:  'Amortization period is too low',
            too_high: 'Amortization period is too high',
            missing:  'Amortization value is missing',
            number:  'Amortization value must be a number',
            negative:  'Amortization value must be positive',
            low_down: 'Amortization period is limited to 25 if the down payment is less than 20%'
          },
          maintenance: {
            too_low:   'Maintenance can not be negative',
            too_high:  'Maintenance exceeds the home price',
            missing:   'Maintenance is missing',
            bad_input: 'Wrong format, try using numbers'
          },
          taxes: {
            too_low:   'Property Tax can not be negative',
            too_high:  'Property Tax exceeds the home price',
            missing:   'Property Tax is missing',
            bad_input: 'Wrong format, try using numbers'
          },
          taxes_percent: {
            too_low:   'Property Tax Rate can not be negative',
            too_high:  'Property Tax Rate exceeds the home price',
            missing:   'Property Tax Rate is missing',
            bad_input: 'Wrong format, try using numbers'
          }
        },
        comment: {
          missing:       'You forgot to enter a comment'
        },
        email: {
          missing:       'You forgot to enter your email address',
          invalid:       'Looks like you entered an invalid email address',
          already_exist: 'This user is already registered. Want to <a href="#login" >login?</a>',
          doesnt_exist:  'We don\'t recognize your email. Want to <a href="#register" >Register?</a>'
        },
        name: {
          missing: 'You forgot to enter your name',
          invalid: 'Looks like you entered an invalid name'
        },
        cityselectize: {
          missing: 'Please select a city',
          invalid: 'Please select a city'
        },
        searchname: {
          missing: 'You forgot to enter a search name',
          invalid: 'Looks like you entered an invalid search name'
        },
        phone: {
          missing: 'You forgot to enter your phone number',
          invalid: 'Looks like you entered an invalid phone number'
        }
      },

      messages: {
        chat: {
          greeting: 'How can I help you today?'
        },
        street_view: {
          unavailable: '<span class="absolute-middle-center">' +
                       'Google Street View is not available for this address, come back later</span>'
        },
        photos: {
          unavailable: '<span class="absolute-middle-center">' +
                       'No photos are available for this listing, come back later</span>'
        },
        account: {
          require_log_in: 'We would love to show you all MLS&reg; listings, ' +
          'but our local board requires you to create a free account.',
          contact_tool: 'Plese register or login to receive listing updates'
        }
      }
    }
  }
};







define('main', [ 'vendor', 'components' ], function () {


  // Underscore templating engine settings
  // _.templateSettings = {
  //   interpolate: /<%=([\s\S]+?)%>/g, // {{ content }} OR <%= %>
  //   evaluate:    /\{\(([\s\S]+?)\)\}/g, // {( code    )}
  //   escape:      /\{\[([\s\S]+?)\]\}/g  // {[ escape  ]}
  // };


  // jQuery AJAX settings
  $.ajaxSetup({
    cache: true,
    crossDomain: true
  });


  // load Google Maps API 3
  var googleMapsAPILoaded = TheRedPin.googleMapsAPILoaded = new $.Deferred()
    , geocoder;

  google.load('maps', '3', {
    other_params: 'libraries=places&sensor=true&language=en',
    callback: function () {
      console.log('Google Maps API Loaded');
      googleMapsAPILoaded.resolve();
    }
  });

  TheRedPin.geoLocateUserLoaded = new $.Deferred();

  $.when(googleMapsAPILoaded).then(function () {

    geocoder = new google.maps.Geocoder();

    TheRedPin.geolocateUser = function () {
      var latlng
        , province
        , self = this
        ;
      self.responded = false;

      setTimeout(function () {
        if (self.responded === false) {
          setDefaultCity('Unknown');
          $.publish('main.geolocateUser');
        }
      }, 10000);

      window.navigator.geolocation.getCurrentPosition(success, error);

      function success (position) {

        var latitude = position.coords.latitude
          , longitude = position.coords.longitude
          ;
        self.responded = true;

        TheRedPin.Storage.set('lat', latitude);
        TheRedPin.Storage.set('lng', longitude);

        latlng = new google.maps.LatLng(latitude, longitude);
        geocoder.geocode({ latLng: latlng }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            province = getGeocodeProvince(results);
            setDefaultCity(province);
          } else {
            setDefaultCity('Unknown');
          }
          $.publish('main.geolocateUser');
        });
      }

      function error (err) {
        self.responded = true;
        setDefaultCity('Unknown');
        $.publish('main.geoLocateUser');
      }

      function setDefaultCity (province) {
        switch (province) {
          case 'British Columbia':
            /* falls through */
          case 'Alberta':
            /* falls through */
          case 'Yukon':
            TheRedPin.Storage.set('default-city', 'Vancouver, BC, Canada');
            $.publish('default-city-set');
            break;
          default:
            TheRedPin.Storage.set('default-city', 'Toronto, ON, Canada');
            $.publish('default-city-set');
            break;
        }
      }

      function getGeocodeProvince (results) {
        var province
          , addressComponent;

        _.each(results, function (address) {
          if (typeof addressComponent === 'undefined') {
            addressComponent = _.find(address.address_components, function (addressComponents) {
              return _.contains(addressComponents.types, 'administrative_area_level_1');
            });
          }
          if (addressComponent) {
            province = addressComponent.long_name;
          }
        });
        return province;
      }
    };

    TheRedPin.geoLocateUserLoaded.resolve();
  });


  // local variables, for sake of Uglify!
  var patterns  = TheRedPin.patterns
    , locale = TheRedPin.locale = TheRedPin.i18n.en // point to selected i18n locale
    ;


  // extend TheRedPin helpers
  _.extend(TheRedPin, {
    environment: {
      screen: {
        size: 'small',
        width: 0,
        height: 0,
        scroll: 0
      },
      hasTouch: Modernizr.touch,
      // jscs: disable
      // jshint ignore: start
      isMobile: (function (a) { return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))})(navigator.userAgent||navigator.vendor||window.opera)
      // jshint ignore: end
      // jscs: enable
    },
    // using these to cache template functions
    templates: {},
    template: function (name, data) {
      if (!TheRedPin.templates[ name ]) {
        TheRedPin.templates[ name ] = _.template(_.string.trim($('#' + name).html()));
      }
      return TheRedPin.templates[ name ](data);
    },
    mappings: {
      provCodeToName: {
        on: 'Ontario',
        bc: 'British Columbia'
      }
    },
    // helpers
    helpers: {
      cacheBust: function (url) {
        return url + '?' + TheRedPin.build;
      },
      // helper method to generate key-value pairs recursively
      // we can't use _.object() here, because there are nested key-values
      // TODO: maybe it would be nice to process a nested map here, if it was needed
      object: function (keys, values, map) {
        //the 'keys' object is assumed to be an array
        map = map || {};
        if (keys.length === 1 && _.isArray(keys[0])) {
          //anonymous nested array requires array return
          var result = [];
          _.each(values, function (value) {
            result.push(TheRedPin.helpers.object(keys[0], value, map));
          });
          return result;
        } else {
          //not a nested array; all keys populate an object
          result = {};
          _.each(keys, function (key, index) {
            if (_.isString(key)) {
              result[ map[ key ] || key ] = values ? values[ index ] : null;
            } else {
              //if not a string, assumed to be an object containing a single key with an array value
              var subKey = Object.keys(key)[0];
              result[ map[ subKey ] || subKey ] = TheRedPin.helpers.object(key[subKey], values[ index ], map);
            }
          });
          return result;
        }
      },
      renameObjectKeys: function (obj, map) {
        _.each(map, function (newKey, oldKey) {
          obj[newKey] = obj[oldKey];
          delete obj[oldKey];
        });
        return obj;
      },
      queryParameters: function (string) {
        var match
          , plusPattern   = /\+/g // regex for replacing addition symbol with a space
          , searchPattern = /([^&=]+)=?([^&]*)/g
          , parameters    = {}
          , queryString   = string || window.location.search.substring(1)
          ;

        function decode (string) {
          return decodeURIComponent(string.replace(plusPattern, ' '));
        }
        match = searchPattern.exec(queryString);
        while (match) {
          parameters[ decode(match[ 1 ]) ] = decode(match[ 2 ]);
          match = searchPattern.exec(queryString);
        }
        return parameters;
      },
      // TODO: implement!
      alert: function (options) {},
      spinner: function (options) {},
      roundPrice: function (price) {
        if (isNaN(price) || price === 0) { return '0'; }
        var suffix = 'K';
        price = parseFloat(price);
        if (price >= 950000) {
          suffix = 'M';
          price = Math.round(price / 100000) / 10;
          if (price % 1 === 0) { Math.round(price); }
        } else {
          price = Math.round(price / 1000);
        }
        return price + suffix;
      },
      parsePrice: function (price) {
        if (typeof price === 'number') {
          return price;
        }

        if (typeof price === 'undefined') {
          return 0;
        }

        price = price.replace(/[$,]+/g, '');
        price = parseFloat(price) || 0;

        if (isNaN(price)) {
          return 0;
        }

        return price;
      },
      formatTime: function (timeObject) {
        var formatedTime = timeObject.getFullYear() + '-'
                                + ('0' + (timeObject.getMonth() + 1)).slice(-2) + '-'
                                + ('0' + timeObject.getDate()).slice(-2)
                                + ' '
                                + ('0' + timeObject.getHours()).slice(-2) + ':'
                                + ('0' + timeObject.getMinutes()).slice(-2) + ':'
                                + ('0' + timeObject.getSeconds()).slice(-2)
                                ;
        return formatedTime;
      },
      serializeObject: function ($form) {
        var o = {};
        var a = $form.serializeArray();
        $.each(a, function () {
          if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
              o[this.name] = [ o[this.name] ];
            }
            o[this.name].push(this.value || '');
          } else {
            o[this.name] = this.value || '';
          }
        });
        return o;
      },
      calculateRebate: function (price) {
        return price * 0.05 * 0.15;
      },
      calculateTRPOneCommission: function (price) {
        return price * 0.025;
      },
      calculateSellSavings: function (price) {
        return price * 0.0075;
      },
      getUserTracking: function () {
        var tracking = {
          track_page_url: window.location.href,
          track_http_referrer: window.TheRedPin.Reporting.get ('referrer') || '',
          track_landing_url: window.TheRedPin.Reporting.get ('landing-page').toLowerCase(),
          track_ip: window.TheRedPin.Reporting.get('ip') || '',
          track_browser: window.TheRedPin.Reporting.get('browser'),
          track_browser_version: window.TheRedPin.Reporting.get('browser-ver'),
          track_os: window.TheRedPin.Reporting.get('os'),
          track_os_version: window.TheRedPin.Reporting.get('os-ver'),
          track_marketo_cookie: $.cookie('_mkto_trk')
        };
        return tracking;
      }
    }
  });


  // detect screen size
  var updateScreenSize = function () {
    var windowWidth  = $(window).width()
      , windowHeight = $(window).height()
      ;
    // media queries, keep this in sync with Foundation settings
    $.each({
      small:  'only screen and (max-width:639px)',
      medium: 'only screen and (min-width:640px) and (max-width:859px)',
      large:  'only screen and (min-width:860px) and (max-width:1439px)',
      xlarge:  'only screen and (min-width:1440px) and (max-width:1919px)',
      xxlarge:  'only screen and (min-width:1920px) and (max-width:2560px)'
    }, function (key, value) {
      if (Modernizr.mq(value)) {
        TheRedPin.environment.screen.size = key;
        return false;
      }
    });
    TheRedPin.environment.screen.width  = windowWidth;
    TheRedPin.environment.screen.height = windowHeight;
    $.publish('main.window_size_changed', {
      width: windowWidth,
      height: windowHeight,
      size: TheRedPin.environment.screen.size
    });
  };

  // detect scroll top
  var updateScreenScroll = function () {
    TheRedPin.environment.screen.scroll = $(window).scrollTop();
    $.publish('main.window_scrolled', { scroll: TheRedPin.environment.screen.scroll });
  };

  updateScreenSize();
  updateScreenScroll();

  $(window).on('resize.main', function () { _.debounce(updateScreenSize(), TheRedPin.time.fast); });
  $(window).on('scroll.main', function () { _.debounce(updateScreenScroll(), TheRedPin.time.fast); });


  // initialize Foundation, after all the dependencies are loaded
  $(document).foundation({
    abide: {
      live_validate: true,
      focus_on_invalid: true,
      error_labels: true,
      validators: {
        // Foundation Abide custom validator runner doesn't trigger valid & invalid event handlers
        // this might change in future versions, for now we trigger them manually
        email: function (el, required, parent) {
          var value = el.value.trim()
            , $message = $('small.error', parent)
            ;
          if (required && patterns.empty.test(value)) {
            $message.html(locale.validation.email.missing);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (!patterns.email.test(value)) {
            $message.text(locale.validation.email.invalid);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if ($(el).is('[data-email-exists]')) {
            if ($(el).attr('data-email-exists') !== $(el).attr('data-email-should-match')) {
              var message = null;
              if ($(el).attr('data-email-exists') === 'true') {
                message = locale.validation.email.already_exist;
              } else {
                message = locale.validation.email.doesnt_exist;
              }
              $message.html(message);
              $(el).attr('data-invalid', '').triggerHandler('invalid');
              return false;
            }
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        'mortgage-amount': function (el, required, parent) {
          var rawValue = el.value.trim()
            , value = TheRedPin.helpers.parsePrice(rawValue)
            , $message = $('small.error', parent)
            ;

          if (value === 0 && rawValue === '') {
            $message.text(locale.validation.mortgage.price.missing);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (patterns.price.test(rawValue) === false) {
            $message.text(locale.validation.mortgage.price.bad_input);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value < 1000) {
            $message.text(locale.validation.mortgage.price.too_low);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        'mortgage-downpayment': function (el, required, parent) {
          var rawValue = el.value.trim()
            , homePrice = parseFloat($('form #mortgage-price').val().replace(/[^0-9.]/g, ''))
            , value = TheRedPin.helpers.parsePrice(rawValue)
            , $message = $('small.error', parent)
            ;

          if (value < 0) {
            $message.text(locale.validation.mortgage.downpayment.too_low);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value === 0 && rawValue === '') {
            $message.text(locale.validation.mortgage.downpayment.missing);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value > homePrice) {
            $message.text(locale.validation.mortgage.downpayment.too_high);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        'mortgage-downpayment-percent': function (el, required, parent) {
          var rawValue = el.value.trim()
            , value = TheRedPin.helpers.parsePrice(rawValue)
            , $message = $('small.error', parent)
            ;
          if (value === 0 && rawValue === '') {
            $message.text(locale.validation.mortgage.downpayment_percent.missing);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        'mortgage-rate': function (el, required, parent) {
          var origValue = el.value.trim()
            , value = TheRedPin.helpers.parsePrice(el.value.trim())
            , $message = $('small.error', parent)
            ;

          if (!patterns.number.test(origValue)) {
            $message.text(locale.validation.mortgage.rate.number);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (required && patterns.empty.test(origValue)) {
            $message.text(locale.validation.mortgage.rate.missing);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value < 0) {
            $message.text(locale.validation.mortgage.rate.negative);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value < 1) {
            $message.text(locale.validation.mortgage.rate.too_low);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value > 25) {
            $message.text(locale.validation.mortgage.rate.too_high);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        'mortgage-maintenance': function (el, required, parent) {
          var rawValue = el.value.trim()
            , homePrice = parseFloat($('form #mortgage-price').val().replace(/[^0-9.]/g, ''))
            , value = TheRedPin.helpers.parsePrice(rawValue)
            , $message = $('small.error', parent)
            ;
          if (value < 0) {
            $message.text(locale.validation.mortgage.maintenance.too_low);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value > homePrice) {
            $message.text(locale.validation.mortgage.maintenance.too_high);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        'mortgage-taxes': function (el, required, parent) {
          var rawValue = el.value.trim()
            , homePrice = parseFloat($('form #mortgage-price').val().replace(/[^0-9.]/g, ''))
            , value = TheRedPin.helpers.parsePrice(rawValue)
            , $message = $('small.error', parent)
            ;
          if (value < 0) {
            $message.text(locale.validation.mortgage.taxes.too_low);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value === 0 && rawValue === '') {
            $message.text(locale.validation.mortgage.taxes.missing);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value > homePrice) {
            $message.text(locale.validation.mortgage.taxes.too_high);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        'mortgage-taxes-percent': function (el, required, parent) {
          var rawValue = el.value.trim()
            , value = TheRedPin.helpers.parsePrice(rawValue)
            , $message = $('small.error', parent)
            ;
          if (value === 0 && rawValue === '') {
            $message.text(locale.validation.mortgage.taxes_percent.missing);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        'mortgage-amortization': function (el, required, parent) {
          var origValue = el.value.trim()
            , value = TheRedPin.helpers.parsePrice(el.value.trim())
            , $message = $('small.error', parent)
            , amount = TheRedPin.helpers.parsePrice($('form #mortgage-price').val())
            , downPaymentPercent = TheRedPin.helpers.parsePrice($('form #mortgage-downpayment-percent').val())
            ;

          if (required && patterns.empty.test(origValue)) {
            $message.text(locale.validation.mortgage.amortization.missing);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value < 0) {
            $message.text(locale.validation.mortgage.amortization.negative);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value < 10) {
            $message.text(locale.validation.mortgage.amortization.too_low);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value > 30) {
            $message.text(locale.validation.mortgage.amortization.too_high);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value > 25 && downPaymentPercent < 20) {
            $message.text(locale.validation.mortgage.amortization.low_down);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        name: function (el, required, parent) {
          var value = el.value.trim()
            , $message = $('small.error', parent)
            ;

          if (required && patterns.empty.test(value)) {
            $message.text(locale.validation.name.missing);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (!patterns.name.test(value)) {
            $message.text(locale.validation.name.invalid);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        cityselectize: function (el, required, parent) {
          var value = el.value.trim()
            , $message = $('small.error', parent)
            ;

          if (required && patterns.empty.test(value)) {
            $message.text(locale.validation.cityselectize.missing);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (!patterns.cityselectize.test(value)) {
            $message.text(locale.validation.cityselectize.invalid);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        searchname: function (el, required, parent) {
          var value = el.value.trim()
            , $message = $('small.error', parent)
            ;

          if (required && patterns.empty.test(value)) {
            $message.text(locale.validation.searchname.missing);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (!patterns.searchname.test(value)) {
            $message.text(locale.validation.searchname.invalid);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        phone: function (el, required, parent) {
          var value = el.value.trim()
            , $message = $('small.error', parent)
            ;

          if (required && patterns.empty.test(value)) {
            $message.text(locale.validation.phone.missing);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          } else if (value.match(/[0-9]/g) == null || value.match(/[0-9]/g).length <= 9) {
            $message.text(locale.validation.phone.invalid);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        password: function (el, required, parent) {
          var value = el.value.trim()
            , $message = $('small.error', parent)
            ;
          if (required && patterns.empty.test(value)) {
            $message.text(locale.validation.password.missing);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          // } else if (!TheRedPin.patterns.password.test(value)) {
          //   $message.text(templates.validation.password.invalid);
          //   $(el).attr('data-invalid', '').triggerHandler('invalid');
          //   return false;
          } else if ((value.length < 6) || (value.length > 20)) {
            $message.text(locale.validation.password.size);
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        },

        equal: function (el, required, parent) {
          var from     = $('#' + $(el).data('abide-equal')).val()
            , to       = el.value
            , valid    = (from === to)
            , $message = $('small.error', parent)
            ;
          if (from || to) {
            var field = $('#' + $(el).data('abide-equal')).attr('placeholder').toLowerCase();
          }

          if (!valid) {
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            $message.text(locale.validation.equal.invalid.replace('@@@', field));
          } else {
            $(el).removeAttr('data-invalid').triggerHandler('valid');
          }
          return valid;
        },

        select: function (el, required, parent) {
          var value = el.value.trim()
            , $message = $('small.error', parent)
            ;

          if ($(el).data('echMultiselect')) {
            if ($(el).data('abide-select')) {
              if ($(el).multiselect('getChecked').length === 0) {
                $(el).attr('data-invalid', '').triggerHandler('invalid');
                return false;
              }
            } else {
              // to prevent validation message when multiselect is initialized
              $(el).data('abide-select', true);
            }
          } else if (patterns.empty.test(value)) {
            $(el).attr('data-invalid', '').triggerHandler('invalid');
            $message.text(locale.validation.select.missing);
            return false;
          }
          $(el).removeAttr('data-invalid').triggerHandler('valid');
          return true;
        }
      }
    },
    offcanvas: {
      close_on_click: true
    }
  });

  /*
    FormStorage is used to pre-populate forms with a user's information
    User information can come from one of two sources:
      1. form cookie (always takes priority)
        - set by a user session OR previously entered form data
      2. extUser cookie
        - set from params passed by external marketing site
  */
  window.TheRedPin.FormStorage = (function () {
    var getItem = function (key) {
      var values = {};
      if ($.cookie('form')) {
        values = JSON.parse($.cookie('form'));
      } else if ($.cookie('extUser')) {
        values = JSON.parse($.cookie('extUser'));
      }
      return values[key];
    };
    var setItem = function (key, value) {
      var values = {};
      if ($.cookie('form')) {
        values = JSON.parse($.cookie('form'));
      }
      values[key] = value;
      $.cookie('form', JSON.stringify(values), { path: '/' });
    };
    var clear = function () {
      $.removeCookie('form', { path: '/' });
    };

    if ($('form').length > 0 && getItem('name') !== 'undefined') {
      $('form input[name="name"]').val(getItem('name'));
      $('form input[name="email"], form input#email').val(getItem('email'));
      $('form input[name="phone"]').val(getItem('phone'));
    }

    return {
      get: getItem,
      set: setItem,
      clear: clear
    };
  })();

  window.TheRedPin.Storage = (function () {
    var useStorage = false;
    try {
      window.localStorage.setItem('test', 'good');
      useStorage = true;
    } catch (e) {
      useStorage = false;
    }
    var getItem = function (key) {
      if (useStorage) {
        return window.localStorage.getItem('storage-' + key);
      } else {
        var values = {};
        if ($.cookie('storage')) {
          values = JSON.parse($.cookie('storage'));
        }
        return values['storage-' + key];
      }
    };
    var setItem = function (key, value) {
      if (useStorage) {
        window.localStorage.setItem('storage-' + key, value);
      } else {
        var values = {};
        if ($.cookie('storage')) {
          values = JSON.parse($.cookie('storage'));
        }
        values['storage-' + key] = value;
        $.cookie('storage', JSON.stringify(values), { path: '/' });
      }
    };

    return {
      get: getItem,
      set: setItem
    };
  })();

  /*
  OAuth token handling
  - deliver set cookies in ajax request headers
  - refresh after timeout
  - listen for login events and set cookies in response
  */
  window.TheRedPin.OAuth = (function () {
    var self = this
      , tokenRefresh = null
      , pageID = new Date().getTime()
      , refreshStates = {
        r_idle: 'r_idle', //not inited or not logged
        r_countdown: 'r_countdown', //in countdown interval
        r_readyToRefresh: 'r_readyToRefresh', //countdown complete, refresh needed
        r_refreshing: 'r_refreshing' //refreshing tokens at server
      }
      , refreshState = refreshStates.r_idle
      , refreshResponse = false
      , standardTimeout = 3600 //in seconds
      , sysTime = parseInt($('meta[name="trp-system-time"]').attr('content'))
      ;

    //for restful refresh request
    var TokenModel = Backbone.Model.extend({
      url: TheRedPin.url + 'sessions',
      defaults: {
        client_id: 'trpweb'
        , client_secret: 'theredpin'
        , grant_type: 'refresh_token'
      }
    });
    var tokenModel = new TokenModel();

    //manages cookie storage of tokens
    var setCookieFromResponse = function (e, response) {
      var expires = new Date();
      expires.setTime(expires.getTime() + parseInt(response.expires_in) * 1000);
      $.cookie(
        'access_token',
        response.access_token,
        { expires: expires, path: '/' }
      );
      expires.setTime(expires.getTime() + 365 * 86400000);
      $.cookie(
        'refresh_token',
        response.refresh_token,
        { expires: expires, path: '/' }
      );
      var sysExpires = new Date();
      sysExpires.setTime(
        sysTime + (elapsedTime()) + parseInt(response.expires_in) * 1000
      );
      $.cookie(
        'auth_timeout',
        sysExpires.getTime(),
        { expires: expires, path: '/' }
      );
      $.cookie(
        'trp_user_name',
        response.user.first_name,
        { expires: expires, path: '/' }
      );
      $.cookie(
        'trp_user_email',
        response.user.email,
        { expires: expires, path: '/' }
      );
      $.cookie(
        'trp_user_id',
        response.user.id,
        { expires: expires, path: '/' }
      );

      var formName = response.user.first_name +
        (response.user.last_name.toLowerCase() == 'unspecified' ? '' : ' ' + response.user.last_name),
        formEmail  = response.user.email,
        formPhone  = response.user.phone,
        formFirstName  = response.user.first_name
        ;

      window.TheRedPin.FormStorage.set('name', formName);
      window.TheRedPin.FormStorage.set('email', formEmail);
      window.TheRedPin.FormStorage.set('phone', formPhone);
      //set name in menu, transfer name to server
      window.TheRedPin.FormStorage.set('trp_user_name', formFirstName);
      $('#account-buttons span').html(formFirstName);
      $('body').addClass('authenticated');
      setRefreshTimer(response.expires_in);
      $.publish('oauth.login-complete');
    };
    //monitors events from authentication service
    $.subscribe('oauth.login', setCookieFromResponse);

    //token refresh at 90% of token expiration time
    var setRefreshTimer = function (expirationSeconds) {
      refreshState = refreshStates.r_countdown;
      expirationSeconds = standardTimeout;
      clearTimeout(tokenRefresh);
      tokenRefresh = setTimeout(
        startRefreshCheck
        , parseInt(expirationSeconds) * 0.9 * 1000
      );
    };

    var startRefreshCheck = function () {
      console.clear();
      refreshCheck();
    };

    //load scripts using require.js
    var requireLoad = function () {
      var dataString = $('body').attr('data-req');
      var dataArray = dataString.split(',');
      var dataAttributes = dataArray.filter(Boolean);
      dataAttributes.forEach (function (n) {
        require([ n ], function () {});
      });
    };
    requireLoad();


    var refreshCheck = function () {
      var currentTimeout = $.cookie('auth_timeout');
      //check must be updated when working on server time
      var now = sysTime + (elapsedTime());
      if (currentTimeout && parseInt(currentTimeout) - now < standardTimeout * 1000 * 0.1) {
        refreshState = refreshStates.r_readyToRefresh;
        refreshResponse = true;
        setTimeout(refreshResponseCheck, 1000);
      } else {
        setRefreshTimer((now - parseInt(currentTimeout)) / 1000);
      }
    };

    var refreshResponseCheck = function () {
      if (refreshResponse) {
        refreshState = refreshStates.r_refreshing;
        refreshToken();
      } else {
        setTimeout(refreshCheck, 100);
      }
    };

    //refresh thread
    var refreshToken = function () {
      tokenModel.save(
        {
          refresh_token: $.cookie('refresh_token')
        }, {
          success: function (model, response) {
            setCookieFromResponse(null, response);
          },
          error: function (model, response) {
            refreshState = refreshStates.r_idle;
            console.log('tokenRefresh failure:');
            console.log(model);
            console.log(response);
          }
        }
      );
    };

    //detect logged state on page load
    if ($.cookie('access_token')) {
      setRefreshTimer(standardTimeout * 1000);
      $('body').addClass('authenticated');
    } else {
      $('body').removeClass('authenticated');
    }

    //removes oAuth token cookies
    var logOut = function (e, silent) {
      refreshState = refreshStates.r_idle;
      clearTimeout(tokenRefresh);
      $('body').removeClass('authenticated');
      if (!silent) {
        var expires = new Date();
        expires.setTime(expires.getTime() - standardTimeout * 1000);
        $.cookie('access_token', '', { expires: expires, path: '/mls-listings' });
        $.cookie('refresh_token', '', { expires: expires, path: '/mls-listings' });
        $.cookie('access_token', '', { expires: expires, path: '/' });
        $.cookie('refresh_token', '', { expires: expires, path: '/' });
        $.cookie('auth_timeout', '', { expires: expires, path: '/' });
        $.cookie('trp_user_name', '', { expires: expires, path: '/' });
        $.cookie('trp_user_email', '', { expires: expires, path: '/' });
        $.cookie('trp_user_id', '', { expires: expires, path: '/' });

        window.TheRedPin.FormStorage.clear();
      }
    };
    //events from authentication service
    $.subscribe('oauth.logout', logOut);

    //attach token cookie values as headers on all ajax requests
    $.ajaxSetup({
      beforeSend: function (xhr) {
        var accessToken = $.cookie('access_token');
        if (accessToken) {
          xhr.setRequestHeader('Authorization', 'BEARER ' + accessToken);
        }
      }
    });

    var isAuthenticated = function () {
      //TD|SA: can be logged out and have cookie, though cookie expiration should prevent this
      return $.cookie('access_token') ? true : false;
    };

    var elapsedTime = function () {
      return new Date().getTime() - pageID;
    };

    //public interface
    return {
      isAuthenticated: isAuthenticated,
      elapsedTime: elapsedTime
    };
  })();

  /*
  Auth modal
  */
  define('auth-init', [
    '/assets/scripts/vendor/text!/template/account/'
    , '/assets/scripts/vendor/text!/assets/styles/pages/authentication.css'
  ], function (templates, css) {
    $('body').append(templates);
    $('<div />', {
      html: '&shy;<style>' + css + '</style>'
    }).appendTo('body');
  });
  window.TheRedPin.invokeAuth = (function () {
    var show = function (hash, modal, accountOptions) {
      if (hash) {
        window.location.hash = hash;
      }
      if (!window.TheRedPin.isAuthPage) {
        require([ 'auth-init', 'account' ], function (authInit, auth) {
          var options = {
            template: 'account-modal-template',
            leaveEventBindings: true,
            modal: modal,
            classes: 'account-modal'
          };
          TheRedPin.Components.revealTemplate(options);
          auth('#account-modal', accountOptions);
          $.subscribe('oauth.login-close-modal', function () {
            $('.close-reveal-modal').trigger('click');
          });
        });
      }
    };
    return show;
  })();
  if ($('body').data('auth') === 1 && $('body').data('auth-type') === 'account-management') {
    window.TheRedPin.invokeAuth('login', true);
    $.subscribe('oauth.login-complete', function () {
      $('body').attr('data-auth', '');
    });
  } else if ($('body').data('auth') === 1) {
    window.history.replaceState(null, document.title, '?m=p');
    window.TheRedPin.invokeAuth('register', true);
    $.subscribe('oauth.login-complete', function () {
      $('body').attr('data-auth', '');
    });
  }
  /*
  TOS modal
  */
  define('tos-init', [
    '/assets/scripts/vendor/text!/template/tos/'
    , '/assets/scripts/vendor/text!/assets/styles/pages/authentication.css'
  ], function (templates, css) {
    $('body').append(templates);
    $('<div />', {
      html: '&shy;<style>' + css + '</style>'
    }).appendTo('body');
  });
  window.TheRedPin.invokeTOS = (function () {
    var show = function (modal) {
      if (!window.TheRedPin.isTOSPage) {
        require([ 'tos-init', 'tos' ], function (TOSInit, tos) {
          var options = {
            template: 'tos-modal-template',
            leaveEventBindings: true,
            modal: modal,
            classes: 'tos-modal'
          };
          TheRedPin.Components.revealTemplate(options);
          tos('#tos-modal');
          $.subscribe('tos.ddf-complete', function () {
            $('.close-reveal-modal').trigger('click');
          });
        });
      }
    };
    return show;
  })();
  var tos = $('[data-tos]').data('tos');
  console.log(tos);
  if (tos && TheRedPin.Storage.get(tos + '-tos') !== '1') {
    window.TheRedPin.invokeTOS(true);
    $('body').attr('data-auth', '1');
    $.subscribe('tos.ddf-accept', function () {
      $('.close-reveal-modal').trigger('click');
      $('body').attr('data-auth', '');
    });
  }

  (function () {
    var redirectAddr = $.cookie('redirectAddr');
    $.removeCookie('redirectAddr', { path: '/' });

    if (redirectAddr) {
      var redirectTemplate = $('#hybrid').data('layer') == 'properties' ?
                              'redirect-property-modal-template' : 'redirect-project-modal-template';
      var options = {
        template: redirectTemplate,
        leaveEventBindings: true,
        classes: '',
        data: { redirectAddr: redirectAddr }
      };
      TheRedPin.Components.revealTemplate(options);
      $('.redirect-accept').click(function () {
        $('#redirect-modal').foundation('reveal', 'close');
      });
    }
  })();

  window.TheRedPin.BrowserDetect = {
    init: function () {
      this.browser = this.searchString(this.dataBrowser) || 'Other';
      this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'Unknown';
    },
    searchString: function (data) {
      for (var i = 0; i < data.length; i++) {
        var dataString = data[i].string;
        this.versionSearchString = data[i].subString;

        if (dataString.indexOf(data[i].subString) !== -1) {
          return data[i].identity;
        }
      }
    },
    searchVersion: function (dataString) {
      var index = dataString.indexOf(this.versionSearchString);
      if (index === -1) {
        return;
      }

      var rv = dataString.indexOf('rv:');
      if (this.versionSearchString === 'Trident' && rv !== -1) {
        return parseFloat(dataString.substring(rv + 3));
      } else {
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
      }
    },

    dataBrowser: [
      { string: navigator.userAgent, subString: 'Chrome', identity: 'Chrome' },
      { string: navigator.userAgent, subString: 'MSIE', identity: 'Explorer' },
      { string: navigator.userAgent, subString: 'Trident', identity: 'Explorer' },
      { string: navigator.userAgent, subString: 'Firefox', identity: 'Firefox' },
      { string: navigator.userAgent, subString: 'Safari', identity: 'Safari' },
      { string: navigator.userAgent, subString: 'Opera', identity: 'Opera' }
    ]
  };

  window.TheRedPin.BrowserIntercept = function () {
    if (window.TheRedPin.BrowserDetect.browser == 'Explorer' && window.TheRedPin.BrowserDetect.version <= 9) {
      TheRedPin.Components.revealTemplate({
        id: 'browser-warning',
        classes: 'contact-tool small',
        data: {
          label: 'subscriptions',
          destination: 'http://res.theredpin.com/account/manage-subscriptions'
        },
        template: 'browser-speedbump-template'
      });
    }
  };

  window.TheRedPin.Reporting = (function () {


    var getItem = function (key) {
      var values = {};
      if ($.cookie('reporting')) {
        values = JSON.parse($.cookie('reporting'));
      }
      return values['reporting-' + key];
    };
    var setItem = function (key, value) {
      var values = {};
      if ($.cookie('reporting')) {
        values = JSON.parse($.cookie('reporting'));
      }
      values['reporting-' + key] = value;
      $.cookie('reporting', JSON.stringify(values));
    };

    try { window.localStorage.test = 2; } catch (e) {
      setItem('private-safari', true);
    }

    if ($.cookie('browser-check') === null || typeof $.cookie('browser-check') === 'undefined') {
      window.TheRedPin.BrowserDetect.init();
      setItem('browser', window.TheRedPin.BrowserDetect.browser);
      setItem('browser-ver', window.TheRedPin.BrowserDetect.version);
      window.TheRedPin.BrowserIntercept();
      $.cookie('browser-check', true);
    }
    return {
      get: getItem
    };
  })();

  /*
    sets interval if user is logged in, and reloads page
    if access_token is subsequently removed (eg. user logs out in a different tab)
  */
  (function () {

    var accessToken;
    window.setInterval(function () {
      if (!accessToken) {
        accessToken = $.cookie('access_token');
      }
      if (accessToken && !$.cookie('access_token')) {
        window.location.reload();
      }
    }, 2000);
  })();

  // load & initialize chat tool, snap engage
  (function () {
    var se = document.createElement('script');
    se.type = 'text/javascript';
    se.async = true;
    se.src = '//storage.googleapis.com/code.snapengage.com/js/62618ffc-4f3b-4614-8bdd-ad46f0be92fd.js';
    var done = false;
    se.onload = se.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
        done = true;
        SnapEngage.allowChatSound(true);
        var viewportReset = $('meta[name=viewport]').attr('content');
        //SnapABug.setCallback does not work for mobile at time of writing
        $('body').on('click', '.-snapengage-chat-container-header-hide', function () {
          $('meta[name=viewport]').attr('content', viewportReset);
        });
        $(document).on('click', '.chat', function () { SnapABug.startLink(); });
      }
    };
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(se, s);
  })();

  (function () {
    window.onpopstate = function (event) {
      if (document.referrer.search('/my/') === -1 && document.location.pathname.search('/my/') !== -1) {
        window.location.reload();
      }
    };
  })();

  $(document).initialize();

  $(document)
    .on('open.fndtn.offcanvas', '[data-offcanvas]', function (event) {
      var headerSize = 60;
      var scrollTop = $(window).scrollTop() + headerSize
        , viewPortHeight = $('body').height() - headerSize
        ;
      $('.off-canvas-wrapper').css('height', viewPortHeight);
      $('html').addClass('hide-overflow');
      $('.left-off-canvas-menu div.off-canvas-wrapper').css('top', scrollTop);
      $('.right-off-canvas-menu div.off-canvas-wrapper').css('top', scrollTop);
      $('body').on('touchmove touchstart', function (e) {
        if (
          $(e.target).parents('.off-canvas-list').length === 0
          && !$(e.target).is('.left-off-canvas-toggle')
          && $(e.target).parents('.left-off-canvas-toggle').length === 0
          && !$(e.target).is('.right-off-canvas-toggle')
          && $(e.target).parents('.right-off-canvas-toggle').length === 0
          && $(e.target).parents('#header').length === 0
          ) {
          e.preventDefault();
        }
      });
    })
    .on('click.fndtn.offcanvas', '.left-off-canvas-toggle', function (event) {
      var canvasWrap = $('.off-canvas-wrap');
      if (canvasWrap.hasClass('move-right') === true) {
        canvasWrap.removeClass('move-left');
        $('.top-bar').removeClass('active-right-menu').addClass('active-left-menu');
        var lastVisitedLink = window.location.pathname;
        $('.left-off-canvas-menu ul.off-canvas-list li:has(a[href="' + lastVisitedLink + '"])').css({
          background: '#da2328'
        });
        $('.left-off-canvas-menu ul.off-canvas-list a[href="' + lastVisitedLink + '"]').css({
          color: '#ffffff'
        });
        $('html').addClass('hide-overflow');
      }
    })
    .on('click.fndtn.offcanvas', '.right-off-canvas-toggle, .off-canvas-list a', function (event) {
      var canvasWrap = $('.off-canvas-wrap');
      if (canvasWrap.hasClass('move-left') === true) {
        canvasWrap.removeClass('move-right');
        $('.top-bar').removeClass('active-left-menu').addClass('active-right-menu');
        $('html').addClass('hide-overflow');
      }
    })
    .on('close.fndtn.offcanvas', '[data-offcanvas]', function () {
      $('.top-bar').removeClass('active-left-menu').removeClass('active-right-menu');
      $('body').off('touchmove touchstart');
      $('html').removeClass('hide-overflow');
    });

  TheRedPin.getLayer = function () {
    return $('#header li.active a').data('layer');
  };

  TheRedPin.getLayerLabel = function () {
    if ($('#project-profile [data-vip="1"]').length > 0) {
      return 'VIP';
    } else {
      return TheRedPin.getLayer();
    }
  };

  TheRedPin.throttledScroll = _.throttle(function (scrollTo, duration) {
    $('html, body').animate({
      scrollTop: scrollTo
    }, duration);
  }, 800, { trailing: false });

  return TheRedPin;

});
