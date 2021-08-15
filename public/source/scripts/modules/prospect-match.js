//Models
define('pmpropertyeventmodel', function () {
  var PMPropertyEventModel = Backbone.Model.extend({
    defaults: {
      name: null,
      event_city: null,
      event_hoods: null,
      city_id: null,
      hood_id: null,
      bounds: null,
      property_type: null,
      min_price: null,
      max_price: null,
      beds: null,
      baths: null,
      id: ''
    }
  });

  return PMPropertyEventModel;
});

define('pmprojecteventmodel', function () {
  var PMProjectEventModel = Backbone.Model.extend({
    defaults: {
      name: null,
      event_city: null,
      event_hoods: null,
      bounds: null,
      occupancy: null,
      builder: null,
      min_price: null,
      max_price: null,
      beds: null,
      baths: null,
      id: ''
    }
  });

  return PMProjectEventModel;
});

define('registereventmodel', function () {
  var RegisterEventModel = Backbone.Model.extend({
    defaults: {
      full_name: null,
      email: null,
      password: null,
      phone:  null,
      subscribe: false,
      subscription_source: 'registration',
      role_id: 3,
      valid: 1,
      activation: 0
    }
  });

  return RegisterEventModel;
});


define('prospect-match', [ 'main', 'vendor', 'pmpropertyeventmodel', 'registereventmodel',
'pmprojecteventmodel', 'ui-components' ]
, function (m, v, PMPropertyEventModel, RegisterEventModel,
PMProjectEventModel, uiComponents) {
  console.log('Prospect Match Module Started');

  var TheRedPin = window.TheRedPin
    , ProspectMatch = TheRedPin.ProspectMatch = {}
    ;

  var ProspectMatchModel = Backbone.Model.extend({
    defaults: {
      pmSearchHybrid: false, // [Boolean] - enables redirect to listview after PM submit
      pmToggle: false, // [Boolean] - Specify whether user can opt-out of pm subscription
      ga: {}, // [Object] - Google analytics
      gaContact: {}, // [Object] - Contact Google analytics
      fullWidthForm: false, // [Boolean] - Set form to 1 or 2 columns
      headerMessage: null, // [String] - Custom header text
      showPersonalDetails: true, // [Boolean] - Specify whether personal information is editable
      customPropertyTypes: [], // [Array] - Customize which property types to display
      buttonText: null, // [String] - Custom button text
      hideDisclaimer: false, // [Boolean] - Show/hide CASL copy
      layer: null, // [String] - Identifies properties or projects layer
      propertyTypes: [
        {
          'type-id': 'detached-homes',
          'type-value': 'detached-homes',
          'type-name': 'Detached Homes',
          'container-class': '',
          'label-class': 'font-size-small'
        },
        {
          'type-id': 'lofts',
          'type-value': 'lofts',
          'type-name': 'Lofts',
          'container-class': '',
          'label-class': ''
        },
        {
          'type-id': 'semi-detached-homes',
          'type-value': 'semi-detached-homes',
          'type-name': 'Semi-detached Homes',
          'container-class': '',
          'label-class': 'oversized-text'
        },
        {
          'type-id': 'multiplexes',
          'type-value': 'multiplexes',
          'type-name': 'Multiplexes',
          'container-class': '',
          'label-class': ''
        },
        {
          'type-id': 'townhouses',
          'type-value': 'townhouses',
          'type-name': 'Townhouses',
          'container-class': '',
          'label-class': ''
        },
        {
          'type-id': 'cottages',
          'type-value': 'cottages',
          'type-name': 'Cottages',
          'container-class': '',
          'label-class': ''
        },
        {
          'type-id': 'condos',
          'type-value': 'condos',
          'type-name': 'Condos',
          'container-class': '',
          'label-class': ''
        },
        {
          'type-id': 'miscellaneous',
          'type-value': 'miscellaneous,',
          'type-name': 'Misc. Listings',
          'container-class': '',
          'label-class': ''
        },
        {
          'type-id': 'bungalows',
          'type-value': 'bungalows,',
          'type-name': 'Bungalows',
          'container-class': 'end',
          'label-class': ''
        }
      ],
      bedOptions: [
        {
          name: 'All',
          id: 'bed-all',
          value: 'all',
          class: '',
          checked: 'checked'
        },
        {
          name: 'Studio',
          id: 'bed-0',
          value: '0',
          class: '',
          checked: ''
        },
        {
          name: '1+',
          id: 'bed-1-plus',
          value: '1-plus',
          class: '',
          checked: ''
        },
        {
          name: '2+',
          id: 'bed-2-plus',
          value: '2-plus',
          class: '',
          checked: ''
        },
        {
          name: '3+',
          id: 'bed-3-plus',
          value: '3-plus',
          class: '',
          checked: ''
        },
        {
          name: '4+',
          id: 'bed-4-plus',
          value: '4-plus',
          class: '',
          checked: ''
        },
        {
          name: '5+',
          id: 'bed-5-plus',
          value: '5-plus',
          class: 'end',
          checked: ''
        }
      ],
      bathOptions: [
        {
          name: 'All',
          id: 'bath-all',
          value: 'all',
          class: '',
          checked: 'checked'
        },
        {
          name: '1+',
          id: 'bath-1-plus',
          value: '1-plus',
          class: '',
          checked: ''
        },
        {
          name: '2+',
          id: 'bath-2-plus',
          value: '2-plus',
          class: '',
          checked: ''
        },
        {
          name: '3+',
          id: 'bath-3-plus',
          value: '3-plus',
          class: '',
          checked: ''
        }
      ]
    }
  });

  var ProspectMatchView = Backbone.View.extend({

    events: {
      submit: 'submit'
    },

    initialize: function (options) {

      var self = this
      ;
      self.model = new ProspectMatchModel(options);
      self.template = _.template($('#prospect-match-template').html());
      self.options = options;
      self.cityRequest = null;
      self.neighbourhoodRequest = null;
      self.userCheckRequest = null;

      self.model.set('pmSearchHybrid', options.pmSearchHybrid);

      self.citiesData = null;
      self.neighbourhoodData = null;
      self.cityBounds = null;
      self.hoodBounds = null;

      self.$activeSlider = null;
      self.$inactiveSlider = null;

      // PM Event Objects
      self.eventProspectMatch = this.model.get('layer') == 'projects' ?
        new PMProjectEventModel() : new PMPropertyEventModel();
      self.eventRegister = new RegisterEventModel();

      self.gaSendPMOpen();

    },

    render: function () {
      var $el = $(this.el);
      var self = this;
      $el.html(this.template(self.model.toJSON()));
      setTimeout(function () {
        $el.foundation();
        self.initializeFormUI();
      }, 0);
      return this;
    },

    initializeFormUI: function () {
      var self = this;
      // get cities data
      self.getCities();
      // UI components
      self.initializePropertyTypeSelect();
      self.initializePriceSlider();
      self.initializeBedsBaths();
      if (self.model.get('layer') == 'projects') {
        self.builderSelectizeView = new uiComponents.BuilderSelectize({ el: '.builder-selectize' });
        self.builderSelectizeView.render();
        self.occupancySelectizeView = new uiComponents.OccupancySelectize({ el: '.occupancy-selectize' });
        self.occupancySelectizeView.render();
      }
      $.when(self.cityRequest).then(function () {
        self.initCitySelectize();
        self.initNeighbourhoodSelectize();
        self.neighbourhoodSelectize[0].selectize.disable();
        self.presetCity();
      });
      self.presetUserInfo();
      if (self.model.get('onPage') || $('#property-profile').length) {
        self.presetPropertyAttributes();
      }
    },

    initCitySelectize: function () {
      var self = this;
      self.citySelectize = self.$el.find('#prospect-match-form #pm-city').selectize({
        readOnly: true,
        persist: false,
        maxItems: 1,
        valueField: 'id',
        labelField: 'name',
        sortField: [ { field: 'province_web_id' }, { field: 'name' } ],
        searchField: [ 'name' ],
        options: self.citiesData,
        render: {
          option: function (item, escape) {
            return TheRedPin.template('selectize-item-template',
              { graphics: '', contents: item.name + ', ' + item.province_web_id.toUpperCase(), classes: '' });
          },
          item: function (item, escape) {
            return TheRedPin.template('selectize-item-template',
              { graphics: '', contents: item.name + ', ' + item.province_web_id.toUpperCase(), classes: '' });
          }
        },
        onItemAdd: function (value, $item) {
          self.citySelected = true;
          self.hoodBounds = null;
          self.getNeighbourhoods(value);
          $.when(self.neighbourhoodRequest).then(function () {
            self.toggleNeighbourhoodField();
            self.presetHood();
          });
        },
        onItemRemove: function (value) {
          self.citySelected = false;
          self.neighbourhoodSelectize[0].selectize.clear();
          self.toggleNeighbourhoodField();
        },
        onInitialize: function () {
          // need to change selectizes input type to prevent browser autofill
          var $selectizeInput = self.$el.find('.city-column .selectize-input input');
          $selectizeInput.attr('type', 'search');
        }
      });
    },

    presetCity: function () {
      var self = this;
      var formPresets = this.model.get('presets') || {};
      var cityID = formPresets.city ? formPresets.city : $('[data-pm-city]').data('pm-city');
      if (cityID) {
        self.citySelectize[0].selectize.addItem(cityID);
      }
    },

    presetHood: function () {
      var self = this;
      var formPresets = this.model.get('presets') || {};
      var hoodID = formPresets.hood ? formPresets.hood : $('[data-pm-hood]').data('pm-hood');
      if (hoodID) {
        self.neighbourhoodSelectize[0].selectize.addItem(hoodID);
      }
    },

    presetUserInfo: function () {
      var self = this;
      var optionsUser = self.options.user;
      if (!TheRedPin.OAuth.isAuthenticated() && !optionsUser) {
        return;
      }
      var userName = optionsUser ? optionsUser.full_name : $.cookie('trp_user_name')
        , userEmail = optionsUser ? optionsUser.email : $.cookie('trp_user_email')
        ;
      $('#pm-full-name').val(userName).attr('disabled', 'disabled');
      $('#pm-email-address').val(userEmail).attr('disabled', 'disabled');

      self.eventRegister.set('full_name', userName);
      self.eventRegister.set('email', userEmail);
    },

    presetPropertyAttributes: function () {
      var self = this
        , formPresets = self.model.get('presets')
        , propertyFilters = self.model.get('presets') ?
          self.model.get('presets') : $('#property-profile').data('pm-filters')
        ;

      // search name preset ONLY from property
      var profileFilters = $('#property-profile').data('pm-filters');
      if (profileFilters) {
        var searchName = self.buildPMName(profileFilters);
      }

      $('#pm-search-name').val(searchName);
      // price
      var $priceSliders = self.$el.find('.price-range');
      var price = propertyFilters.price;
      var minPrice = propertyFilters.min_price ? propertyFilters.min_price : 0
        , maxPrice = propertyFilters.max_price ? propertyFilters.max_price : price * 1.10
        ;
      $priceSliders.val([ minPrice, maxPrice ]);

      // occupancy
      if (propertyFilters.occupancy) {
        self.occupancySelectizeView.setValue(propertyFilters.occupancy);
      }

      // property type
      var propertyTypeSysName = propertyFilters.property_sys_type;

      $('#' + propertyTypeSysName).click();
      // beds and baths
      var numBeds = (propertyFilters.num_beds <= 4 ? propertyFilters.num_beds : 5)
        , numBaths = (propertyFilters.num_baths <= 3 ? propertyFilters.num_baths : 3)
        , bedsID = 'prop-bed-' + self.switchBedsBaths(numBeds)
        , bathsID = 'prop-bath-' + self.switchBedsBaths(numBaths)
        ;

      $('#' + bedsID).click();
      $('#' + bathsID).click();
    },

    buildPMName: function (pmAttributes) {
      var propertyType = pmAttributes.property_type
        , hood = pmAttributes.hood
        , city = pmAttributes.city
        ;
      var searchName;
      if (!propertyType) {
        searchName = (hood ? hood + ', ' : '') + city;
      } else {
        searchName = propertyType + (propertyType == 'multiplex' ? 'es' : 's')
          + ' in ' + (hood ? hood + ', ' : '') + city;
      }
      return searchName;
    },

    switchBedsBaths: function (val) {
      switch (val) {
        case '0':
          val = '0';
          break;
        default:
          val = val + '-plus';
      }
      return val;
    },

    toggleNeighbourhoodField: function () {
      var self = this
        , $neighbourhoodFields = self.$el.find('#prospect-match-form .neighbourhood-column input')
        ;
      if (self.citySelected && self.neighbourhoodData.length > 0) {
        self.neighbourhoodSelectize[0].selectize.enable();
        self.neighbourhoodSelectize[0].selectize.load(function (callback) {
          var options = self.neighbourhoodData;
          self.neighbourhoodSelectize[0].selectize.clearOptions();
          callback(options);
        });
      } else {
        self.neighbourhoodSelectize[0].selectize.disable();
      }
    },

    initNeighbourhoodSelectize: function () {
      var self = this;
      self.neighbourhoodSelectize = self.$el.find('#prospect-match-form #pm-neighbourhood').selectize({
        readOnly: true,
        persist: false,
        maxItems: 1,
        valueField: 'id',
        labelField: 'name',
        sortField: [ { field: 'primarySort' }, { field: 'name' } ],
        searchField: [ 'name' ],
        options: self.neighbourhoodData,
        render: {
          option: function (item, escape) {
            return TheRedPin.template('selectize-item-template',
              { graphics: '', contents: item.name, classes: '' });
          }
        },
        onItemAdd: function (value, $item) {
          self.selectedHoodID = value;
          self.getHoodPoly();
        },
        onItemRemove: function (value) {
          self.hoodBounds = null;
          self.toggleNeighbourhoodField();
        }
      });
    },

    submit: function (e) {
      e.preventDefault();
      var self = this
        , $form = self.$el.find('form')
        ;
      self.buildEventObjects();
      $form.addClass('loading');
      var emailCheck = self.verifyUserByEmail();
      $.when(emailCheck).then(function () {
        var pmPost, registerPost, contactPost = null;
        var userID = self.eventProspectMatch.get('user_id');
        if (userID) {
          contactPost = self.prospectMatchContactEventPost();
        }
        if (!self.model.get('pmToggle') || self.model.get('pmAccept') == 'on') {
          if (userID) {
            pmPost = self.prospectMatchEventPost();
            $form.removeClass('loading');
          } else {
            registerPost = self.registerEventPost();
            // setup contact deferred
            contactPost = new $.Deferred();
            $.when(registerPost).then(function () {
              contactPost = self.prospectMatchContactEventPost();
              pmPost = self.prospectMatchEventPost();
              $form.removeClass('loading');
            });
          }

        } else {
          self.gaSendPMSubmit();
        }
        if (self.model.get('pmSearchHybrid')) {
          $.when(pmPost, registerPost, contactPost).then(function () {
            var query = self.buildSearchQuery();
            var route = self.model.get('layer') == 'projects' ? '/new-preconstruction/' : '/mls-listings/';
            window.location.href = route + '?' + $.param(query);
          });
        }
      });
    },

    buildSearchQuery: function () {
      var self = this;
      var pmParams = self.eventProspectMatch;
      var query = {};
      query.keywords = pmParams.get('event_hoods') ?
        pmParams.get('event_hoods') + ', ' + pmParams.get('event_city') :
        pmParams.get('event_city');
      query.min_price = pmParams.get('COMMON_price_min');
      query.max_price = pmParams.get('COMMON_price_max');
      query.beds = pmParams.get('COMMON_num_beds');
      query.baths = pmParams.get('COMMON_num_baths');

      if (self.model.get('layer') == 'projects') {
        var builder = pmParams.get('builder');
        var occupancy = pmParams.get('occupancy');
        if (builder) {
          query.builder = builder;
        }
        if (occupancy) {
          query.occupancy = occupancy;
        }
      } else {
        query.type = self.mapPMTypes(this.model.get('rawPMTypes'));
      }

      var hoodSelectizeVal = self.neighbourhoodSelectize[0].selectize.getValue();
      var citySelectizeVal = self.citySelectize[0].selectize.getValue();
      if (hoodSelectizeVal) {
        query.hood = hoodSelectizeVal;
        query.poly_id = hoodSelectizeVal + ',hood';
        query.bound_to = self.buildBoundsQueryString(self.hoodBounds);
      } else {
        query.city = citySelectizeVal;
        query.poly_id = citySelectizeVal + ',city';
        query.bound_to = self.buildBoundsQueryString(self.cityBounds);
      }
      return query;
    },

    mapPMTypes: function (pmTypes) {
      // need to map prospect match types to types supported by search
      var self = this;
      var searchTypes = [];
      _.each(pmTypes, function (pmType, index) {
        var matchedType = _.find(self.model.get('propertyTypes'), function (type) {
          return type['type-value'] == pmType;
        });
        searchTypes.push(matchedType['type-id']);
      });
      return searchTypes.join(',');
    },

    buildBoundsQueryString: function (bounds) {
      var boundsQuery = bounds.southwest.lat + ',' + bounds.southwest.lng + ',' +
        bounds.northeast.lat + ',' + bounds.northeast.lng;

      return boundsQuery;
    },

    registerEventPost: function () {
      var self = this
        , registerData = self.eventRegister.attributes
        , deferred = new $.Deferred()
        ;

      $.ajax({
        url: TheRedPin.url + 'users',
        type: 'POST',
        data: registerData
      }).success(function (data) {
        self.eventProspectMatch.set('user_id', data.result.id);
        self.eventProspectMatch.set('user_obj', data);
        deferred.resolve();
      }).error(function (data) {
        deferred.resolve();
      });
      return deferred;
    },

    prospectMatchContactEventPost: function () {
      var self = this;
      var userInfo = this.eventProspectMatch.get('user_obj') ? this.eventProspectMatch.get('user_obj').result : null;
      if (!$(this.el).is('#prospect-match-onpage') || !userInfo || !userInfo.phone) {
        return;
      }

      function getCapturedTime () {
        var sysTime = new Date ($.cookie ('sysDateTime'))
            , elapsedSeconds = window.TheRedPin.OAuth.elapsedTime () / 1000
            ;

        // get current server time by adding elapsed seconds since page load
        sysTime.setSeconds (sysTime.getSeconds () + elapsedSeconds);
        var formatted = TheRedPin.helpers.formatTime(sysTime);

        if (!(formatted === '0000-00-00 00:00:00' || new RegExp ('[NA]', 'i').test(formatted))) {
          return formatted;
        }

        var fallBackDate = new Date();
        var formattedFallBackDate = TheRedPin.helpers.formatTime(fallBackDate);
        return formattedFallBackDate;
      }

      function getCity (selectizeCity) {
        var cityMatch = selectizeCity.match(/(.+),/);
        if (cityMatch) {
          return cityMatch[1];
        }
        return 'Toronto';
      }

      function getProvinceOfInterest (selectizeCity) {
        var provinceMatch = selectizeCity.match(/,(.+)/);
        var province;
        if (provinceMatch) {
          var provCode = provinceMatch[1].trim().toLowerCase();
          province = TheRedPin.mappings.provCodeToName[provCode];
          return province;
        }
        return 'Ontario';
      }

      function buildBuyerFilters () {
        var layer = self.options.layer;
        var searchFilters = {
          buyer_hoods: self.getSelectizeHood(),
          buyer_city: getCity(self.getSelectizeCity()),
          buyer_province: getProvinceOfInterest(self.getSelectizeCity()),
          buyer_price_from: self.eventProspectMatch.get('COMMON_price_min'),
          buyer_price_to: self.eventProspectMatch.get('COMMON_price_max'),
          buyer_num_beds: self.eventProspectMatch.get('COMMON_num_beds'),
          buyer_num_baths: self.eventProspectMatch.get('COMMON_num_baths')
        };
        if (layer == 'projects') {
          searchFilters.buyer_builder = self.eventProspectMatch.get('builder');
          searchFilters.buyer_occupancy = self.eventProspectMatch.get('occupancy');
        } else {
          searchFilters.buyer_property_type = self.eventProspectMatch.get('RESALE_COMMON_property_type');
        }
        return searchFilters;
      }

      var sysTime = new Date($.cookie('sysDateTime'));
      var elapsedSeconds = window.TheRedPin.OAuth.elapsedTime() / 1000;
      sysTime.setSeconds(sysTime.getSeconds() + elapsedSeconds);

      // build the massive object
      var tracking = TheRedPin.helpers.getUserTracking();
      var buyerFilters = buildBuyerFilters();
      var eventContactParams = {
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        email: userInfo.email,
        phone: userInfo.phone,
        message: '',
        contact_type: 'buyer',
        contact_source: 'metronews',
        captured_on: getCapturedTime (),
        contact_tool_name: 'contact-api',
        province_of_interest: getProvinceOfInterest(this.getSelectizeCity())
      };
      _.extend(eventContactParams, buyerFilters);
      _.extend(eventContactParams, tracking);

      var stringyContactEventParams = JSON.stringify(eventContactParams);

      // end build the massive object

      // send it away

      $.ajax({
        url: TheRedPin.url + 'contacts',
        type: 'POST',
        contentType: 'text/plain',
        data: stringyContactEventParams,
        success: function (data) {
          var gaJSON = self.options.gaContact;
          window.ga('send', 'event', gaJSON.ga_category, gaJSON.ga_action + ' - Submit', gaJSON.ga_label);
        },
        error: function (data) {
          console.log(data);
        }
      });
    },

    prospectMatchEventPost: function (callback) {
      var self = this
        , deferred = new $.Deferred()
        , prospectMatchData = self.eventProspectMatch.attributes
        ;

      $.ajax({
        url: TheRedPin.url + 'saved-searches',
        type: 'POST',
        data: JSON.stringify(prospectMatchData)
      }).success(function (data) {
        $('.reveal-modal').foundation('reveal', 'close');
        self.gaSendPMSubmit();
        $.publish('pm.success');
        if (!self.model.get('pmSearchHybrid')) {
          TheRedPin.Components.revealTemplate({
            template: 'pm-thank-you-modal-template',
            id: 'pm-thank-you-modal',
            classes: 'search medium no-padding'
          });
        }
        deferred.resolve();
      }).error(function (data) {
        console.log(data);
        deferred.resolve();
      });
      return deferred;
    },

    gaSendPMOpen: function () {
      var self = this
        , $gaField = self.$el.find('input[name=ga]')
        , gaJSON = self.model.get('ga') ? self.model.get('ga') : JSON.parse($gaField.attr('value'))
        , gaLabel = (TheRedPin.getLayerLabel() ? TheRedPin.getLayerLabel() : gaJSON.ga_label)
        ;
      window.ga('send', 'event', gaJSON.ga_category, gaJSON.ga_action + ' - Open', gaLabel);
    },

    gaSendPMSubmit: function () {
      var self = this
        , $gaField = self.$el.find('input[name=ga]')
        , gaJSON = self.model.get('ga') ? JSON.parse(self.model.get('ga')) : JSON.parse($gaField.attr('value'))
        , gaLabel = (TheRedPin.getLayerLabel() ? TheRedPin.getLayerLabel() : gaJSON.ga_label)
        ;
      gaJSON.ga_action = self.buildGaAction(gaJSON);
      window.ga('send', 'event', gaJSON.ga_category, gaJSON.ga_action + ' - Submit', gaLabel);
    },

    buildGaAction: function (gaJSON) {
      var self = this;
      // PM forms where subscription is optional will have a pmAccept flag, if on need to append PM to action
      var action = self.model.get('pmAccept') == 'on' ? gaJSON.ga_action + 'PM' : gaJSON.ga_action;
      return action;
    },

    getCities: function () {

      var self = this;
      var useLocalStorage = false;
      self.cityRequest = new $.Deferred();
      try {
        window.localStorage.setItem('test', 'good');
        useLocalStorage = true;
      } catch (e) {
        useLocalStorage = false;
      }
      if (window.localStorage.getItem('cities') == null) {
        $.ajax({
          url: TheRedPin.url + 'cities?format=standard',
          methd: 'GET',
          success: function (response) {
            if (useLocalStorage) {
              window.localStorage.setItem('cities', JSON.stringify(response.result));
            }
            self.citiesData = response.result;
            return self.cityRequest.resolve();
          },
          error: function (response) {
            return self.cityRequest.resolve();
          }
        });
      } else {
        self.citiesData = JSON.parse(window.localStorage.getItem('cities'));
        return self.cityRequest.resolve();
      }
    },

    getNeighbourhoods: function (cityID) {

      var self = this
        , id = cityID
        ;
      self.neighbourhoodSelectize[0].selectize.clearOptions();
      self.neighbourhoodRequest = $.ajax({
        methd: 'GET',
        url: TheRedPin.url + 'cities/' + id + '?options={"includePoly":true}',
        success: function (response) {
          self.cityBounds = self.mapCoordsToBounds(response.result.coords);
          self.neighbourhoodData = response.result.Hoods;
        },
        error: function (response) {
          console.log(response);
        }
      });
    },

    getHoodPoly: function () {
      var self = this
        , hoodID = self.selectedHoodID
        ;
      $.ajax({
        url: TheRedPin.url + 'hoods/' + hoodID + '?options={"includePoly":true}',
        method: 'GET',
        success: function (response) {
          self.hoodBounds = self.mapCoordsToBounds(response.result.coords);
        },
        error: function (response) {
          console.log(response);
        }
      });
    },

    mapCoordsToBounds: function (coords) {
      return { northeast: { lat: coords.x1, lng: coords.y1 }, southwest: { lat: coords.x2, lng: coords.y2 } };
    },

    generatePassword: function () {
      // todo: generate this on the backend!
      var text = ''
        , possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        ;

      for (var i = 0; i < 6; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    },

    getPropertyTypesString: function (types) {
      var sanitizedTypes = _.reject(_.flatten(types), function (val) { return val === ''; })
      , uniqueTypes = _.uniq(sanitizedTypes)
      , sanitizedTypesString = uniqueTypes.join(',')
      ;
      return sanitizedTypesString;
    },

    buildEventObjects: function () {
      var self = this
        , types = []
        , serializedForm = self.$el.find('form').serializeArray()
        ;

      _.each(serializedForm, function (element, index) {
        var field = element.name
          , value = element.value
          ;
        if (field === 'type') {
          types.push(value);
        } else if (self.eventProspectMatch.has(field) || self.eventProspectMatch.get(field) === null) {
          self.eventProspectMatch.set(field, value);
        } else if (self.eventRegister.has(field) || self.eventRegister.get(field) === null) {
          self.eventRegister.set(field, value);
        } else {
          self.model.set(field, value);
        }
      });


      // need to preserve type-values to correctly map to search type-ids
      self.model.set('rawPMTypes', types);

      self.eventRegister.set('password', self.generatePassword());

      self.eventProspectMatch.set('event_city', self.getSelectizeCity().name);
      self.eventProspectMatch.set('event_hoods', self.getSelectizeHood().name);
      self.eventProspectMatch.set('city_id', self.getSelectizeCity().id);
      self.eventProspectMatch.set('hood_id', self.getSelectizeHood().id);
      if (self.model.get('layer') == 'projects') {
        var builder = self.builderSelectizeView.$el.data('builder-filter').builder;
        self.eventProspectMatch.set('builder', builder);
      }

      // ensures a PM name is set when name field is hidden
      if (self.eventProspectMatch.get('name') == null) {
        var hood = self.eventProspectMatch.get('event_hoods');
        var city = self.eventProspectMatch.get('event_city');
        var name = (hood ? hood + ', ' : '') + city;
        self.eventProspectMatch.set('name', name);
      }

      self.eventProspectMatch.set('min_price', $('input[name="min_price"]').val());
      self.eventProspectMatch.set('max_price', $('input[name="max_price"]').val());
      self.eventProspectMatch.set('property_type', self.getPropertyTypesString(types));


      self.appendTrackingParams(self.eventProspectMatch);
      self.appendTrackingParams(self.eventRegister);

      if (self.hoodBounds) {
        self.eventProspectMatch.set('bounds', self.hoodBounds);
      } else if (self.cityBounds) {
        self.eventProspectMatch.set('bounds', self.cityBounds);
      }
    },

    getSelectizeCity: function () {
      var self = this;
      var value = self.citySelectize[0].selectize.getValue();
      return value ? {id : value, name : self.citySelectize[0].selectize.getItem(value).html()} : {id : '', name : ''};
    },

    getSelectizeHood: function () {
      var self = this;
      var value = self.neighbourhoodSelectize[0].selectize.getValue();
      return value ? {id : value, name : self.neighbourhoodSelectize[0].selectize.getItem(value).html()} : {id : '', name : ''};
    },

    verifyUserByEmail: function () {
      var self = this
        , deferred = new $.Deferred()
        , email = self.eventRegister.get('email')
        ;
      $.ajax({
        url: TheRedPin.url + 'users/' +  email + '?response=full&role=3',
        method: 'GET',
        success: function (response) {
          if (response.result && response.result.id) {
            self.eventProspectMatch.set('user_id', response.result.id);
            self.eventProspectMatch.set('user_obj', response);
          }
          deferred.resolve();
        },
        error: function () {
          deferred.resolve();
        }
      });

      return deferred;
    },

    initializePropertyTypeSelect: function () {
      var self = this;

      $.each($('.property-type .type-option input'), function (index, value) {
        var $input = $(value)
          , $parent = $input.parent()
        ;
        $input.change(function (e) {
          var $input = $(this)
          , $parent = $input.parent()
          ;
          if ($input.prop('checked')) {
            $parent.addClass('checked');
          } else {
            $parent.removeClass('checked');
          }
        });
      });

      $('.property-type .type-option').click(function (e) {
        var $this = $(this);
        var $input = $('input', $this);
        var currentState = $('input', $this).prop('checked');
        $('input', $this).prop('checked', !currentState);
        if ($input.prop('checked')) {
          $this.addClass('checked');
        } else {
          $this.removeClass('checked');
        }
      });

      self.$el.find('.property-type .type-option input').click(function (e) {
        e.stopPropagation();
      });
      self.$el.find('.property-type .type-option label').click(function (e) {
        e.stopPropagation();
      });
    },

    initializeBedsBaths: function () {
      this.$el.find('.filter-button-container input').change(function () {
        var $this         = $(this)
          , id            = $(this).attr('id')
          , name          = $this.attr('name')
          , regEx         = /(\w+)-(.+)/i
          , idQtyMatch    = id.match(regEx)
          , idQty
          ;
        if (idQtyMatch) {
          idQty = idQtyMatch[2];
        } else {
          idQty = id;
        }

        // toggle .active class
        if ($this.is(':checked')) {
          if (name === 'beds') {
            $('.filter-bed-button').removeClass('active-button');
            $('div[data-input-id=' + idQty + '] .filter-button').addClass('active-button');
          } else if (name === 'baths') {
            $('.filter-bath-button').removeClass('active-button');
            $('div[data-input-id=' + idQty + '] .filter-button').addClass('active-button');
          }
        }
      });

      $('.filter-button-container input:checked').trigger('change');
    },

    initializePriceSlider: function () {

      var self = this;
      var activeSliderIndex = $(window).width() > 1120 ? 0 : 1;

      self.$activeSlider = $($('.price-slider-row')[activeSliderIndex]);
      self.$inactiveSlider = $($('.price-slider-row')[1 - activeSliderIndex]);

      self.$activeSlider.addClass('active-slider-row');
      self.$activeSlider.removeClass('hidden');

      self.$el.find('.price-range').noUiSlider({
        start: [ 0, 2000000 ],
        connect: true,
        range: {
          min: [ 0, 50000 ],
          '50%': [ 1000000, 100000 ],
          max: 2000000
        },
        format: {
          to: function (value) {
            if (value === 2000000) {
              return '$' + value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + '+';
            } else {
              return '$' + value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            }
          },
          from: function (value) {
            return value.replace(/[$,+]/g, '');
          }
        }
      });
      var formatCurrencyToInteger = {
        to: function (value) {
          if (value === 0 || value === 2000000) {
            return '';
          }
          return value;
        },
        from: function (value) {
          return value.replace(/[$,+]/g, '');
        }
      };

      $('.price-range').on({
        change: function (e) {
          var min = parseInt($('.price-range', self.$activeSlider).val()[0].replace(/[$,]/g, ''))
            , max = parseInt($('.price-range', self.$activeSlider).val()[1].replace(/[$,]/g, ''))
            ;
          $('.price-range', self.$inactiveSlider).val([ min, max ]);
        }
      });

      self.$el.find('.price-range').Link('lower').to($('.min-price'), 'html');
      self.$el.find('.price-range').Link('upper').to($('.max-price'), 'html');
      self.$el.find('.price-range').Link('lower')
        .to($('input[name="min_price"]'), 'val', formatCurrencyToInteger);
      self.$el.find('.price-range').Link('upper')
        .to($('input[name="max_price"]'), 'val', formatCurrencyToInteger);

      $.subscribe('main.window_size_changed', function (event, data) {
        self.toggleSliderVisiblity();
      });
    },

    toggleSliderVisiblity: function () {
      var self = this
        , activeSliderIndex = $(window).width() > 1120 ? 0 : 1
        ;
      self.$activeSlider = $($('.price-slider-row')[activeSliderIndex]);
      self.$inactiveSlider = $($('.price-slider-row')[1 - activeSliderIndex]);

      self.$activeSlider.addClass('active-slider-row');
      self.$activeSlider.removeClass('hidden');

      self.$inactiveSlider.removeClass('active-slider-row');
      self.$inactiveSlider.addClass('hidden');
    },

    appendTrackingParams: function (model) {
      model.set('track_browser', TheRedPin.Reporting.get('browser'));
      model.set('track_browser_version', TheRedPin.Reporting.get('browser-ver'));
      model.set('track_page_url', window.location.href);
      model.set('track_os', TheRedPin.Reporting.get('os'));
      model.set('track_os_version', TheRedPin.Reporting.get('os-ver'));
      model.set('track_landing_url', TheRedPin.Reporting.get('landing-page'));
      model.set('track_http_referrer', TheRedPin.Reporting.get('referrer'));
      model.set('track_ip', TheRedPin.Reporting.get('ip'));
      model.set('track_marketo_cookie', $.cookie('_mkto_trk'));
    }

  });

  ProspectMatch.initialize = function (element, pmOptions) {
    var initialOptions = { el: '#' + element.id };
    pmOptions = pmOptions || {};
    var options = _.extend(initialOptions, pmOptions);
    //TD|SA: not clear where the preserved variable is used; may be important for header ProspectMatch
    ProspectMatch.view = new ProspectMatchView(options);
    ProspectMatch.view.render();
    return ProspectMatch.view;
  };

  ProspectMatch.getNewViewInstance = function (variableElement) {
    //variableElement differs from initialize element by accepting normal options for BB View
    //TD|SA: observe any issues related to not being preserved in parent object
    return new ProspectMatchView({ el: variableElement });
  };

  return ProspectMatch;
});