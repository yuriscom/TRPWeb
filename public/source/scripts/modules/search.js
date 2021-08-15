define('polygonCheck', [ 'main' ], function () {
  /*
  PolygonCheck

  Backbone model for retrieving a polygon for a given location centre, name, and hierarchical
  level
  */
  var PolygonCheck = Backbone.Model.extend({
    url: TheRedPin.url + 'locations/'
  });

  return PolygonCheck;
});

define('search', [ 'main', 'vendor', 'polygonCheck' ], function (m, v, PolygonCheck) {

  console.log('Search Module Started');

  var TheRedPin = window.TheRedPin
    , Search = TheRedPin.Search = {}
    , autocompleteService
    , geocoder
    , location
    , radius
    , hybridAction = $('#hybrid').data('action')
    ;


  //initialize necessary google services; uses deferred objects to inform dependent methods
  TheRedPin.autocompleteServiceLoaded = new $.Deferred();
  TheRedPin.geocodeLoaded = new $.Deferred();
  $.when(TheRedPin.googleMapsAPILoaded).then(function () {
    // initiate Google auto complete & geocoder services
    autocompleteService = new google.maps.places.AutocompleteService();
    TheRedPin.autocompleteServiceLoaded.resolve({});
    geocoder = new google.maps.Geocoder();
    TheRedPin.geocodeLoaded.resolve({});
    // default location, currently Toronto
    location = new google.maps.LatLng(43.7000, -79.4000);
    // radius for search, meters
    radius = 10000;
  });

  /*
  autocomplete

  Use google's autocomplete service to provide suggestions for a particular partial
  or complete address string. Returns a deferred object that will resolve to google's
  suggestion results.

  Arguments:
  [String] address: The address string (can be partial or complete)

  Returns a deferred object, resolved to google's autocomplete service's results
  */
  function autocomplete (address) {
    var deferred = new $.Deferred();
    $.when(TheRedPin.autocompleteServiceLoaded).then(function () {
      autocompleteService.getPlacePredictions(
        { input: address,
          types: [ 'geocode' ],
          componentRestrictions: { country: 'CA' }
        },
        function (predictions, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            deferred.resolve(predictions);
          } else {
            console.log(status);
            deferred.resolve([]);
          }
        }
      );
    });
    return deferred;
  }

  /*
  geocode

  Use google's geocode service to provide a location for a particular partial
  or complete address string. Returns a deferred object that will resolve to google's
  geocoding results.

  Arguments:
  [String] address: The address string (can be partial or complete)

  Returns a deferred object, resolved to google's geocode service's results
  */
  function geocode (address) {
    var deferred = new $.Deferred();
    $.when(TheRedPin.geocodeLoaded).then(function () {
      geocoder.geocode(
        { address: address,
          componentRestrictions: { country: 'CA' }
        },
        function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            deferred.resolve(results);
          } else {
            console.log(status);
            deferred.resolve([]);
          }
        }
      );
    });
    return deferred;
  }


  // View for search panel
  // note that this can be initialized for any form (see getNewViewInstance)
  var SearchView = Backbone.View.extend({
    keywordSelectize: null, //jQuery object containing keyword fields for this view instance
    //the following are a series of deferred objects used to chain a query and track its completion
    lastQuery: {},
    activeAutocomplete: {},
    activeGeocode: {},
    activeRequest: {},
    builderAutocomplete: null,
    builderRequest: null,

    /*
    getAllPromises

    Collects all promises relevant to a particular keyword selectize; used to ensure all
    queries are complete before submission

    Arguments:
    [int] index: The index of the keyword selectize whose selection queries must be monitored

    Returns an array or relevant deferred objects
    */
    getAllPromises: function (index) {
      return [
        this.loseFocusForceSelection[index]
        , this.lastQuery[index]
        , this.activeAutocomplete[index]
        , this.activeGeocode[index]
      ];
    },

    /*
    submitHandler

    The default submitHandler, a method that is called before submit that should ensure
    all necessary data from asynchronous activities is available before processing into a
    submission

    Takes no arguments

    Returns a deferred object, resolved when all necessary activity has completed
    */
    submitHandler: function () {
      var self      = this
        , index     = this.layer === 'properties' ? 0 : 1
        , deferred  = new $.Deferred()
        ;
      if (self.singleQuickLinkOption(index)) {
        self.openQuickLink();
      } else {
        $.when(self.loseFocusForceSelection[index]).then(function (response) {
          $.when.apply(self, self.getAllPromises(index)).then(function (response) {
            deferred.resolve([]);
          });
          self.keywordUserInput = '';
        });
        return deferred;
      }
    },

    //Only listen to click events on the submit class; click events are triggered artificially for 'enter'
    events: {
      'click .submit': 'submit'
    },

    initialize: function () {
      var self = this
        ;

      var lastLayer = $.cookie('last-search-layer');
      if (lastLayer) {
        $('#layer-tab').find('a[data-layer=' + lastLayer + ']').click();
      }

      self.keywordSelectize = self.$el.find('[name=keywords]').selectize({
        plugins: [ 'restore_on_backspace' ],
        readOnly: true,
        uid: new Date().getTime(),
        maxItems: 1,
        presist: true,
        /*
        score

        Used by selectize to order options; rigged to ensure the sort returned by google is
        used for location results, and allows selectize to order quicklinks.

        Takes no arguments

        Returns a function that determines sort as per selectize's documentation
        */
        score: function () {
          var locationsSortIndex = 999;
          return function (item) {
            if (item.group === 'locations') {
              locationsSortIndex--;
              item.primarySort = 1 - locationsSortIndex;
              return locationsSortIndex;
            } else {
              item.primarySort = 1;
              return 1;
            }
          };
        },
        loadThrottle: null,
        valueField: 'value',
        labelField: 'label',
        searchField: [ 'label', 'mls', 'address' ],
        optgroupField: 'group',
        optgroupOrder: [ 'locations', 'links' ],
        optgroups: [
          { value: 'links', label: 'Quick Links' },
          { value: 'locations', label: 'Locations' }
        ],
        // create: function (value) {},
        // createOnBlur: true,
        /*
        onChange

        Called by selectize when a selection is made

        Arguments:
        [String] value: the value of the selection, set for keywords to be a stringified JSON
        object containing an 'address' value
        */
        onChange: function (value) {
          // we need to preserve the selectize context, and self is set to the parent view
          // jscs: disable safeContextKeyword
          var activeSelectize = this;
          // jscs: enable safeContextKeyword

          //clear data retrieved from services for the previous selection
          self.$el.data('location-filter-' + activeSelectize.settings.uid, {});
          self.$el.data('location-poly-' + activeSelectize.settings.uid, {});
          if (value !== '') {
            value = JSON.parse(value);
            if (value.url) {
              window.open(value.url);
              if (self.layer === 'projects') {
                self.keywordSelectize[1].selectize.clearOptions();
              } else if (self.layer === 'properties') {
                self.keywordSelectize[0].selectize.clearOptions();
              }
            } else if (value.address) {
              var index = self.getIndexOfTarget(this.$input);
              self.setAllForceSelection = new $.Deferred();
              self.activeGeocode[index] = new $.Deferred();

              $.when(geocode(value.address)).then(function (locations) {
                var location = locations[ 0 ];
                if (location.geometry.location) {
                  TheRedPin.Storage.set('last-search-lat', location.geometry.location.lat());
                  TheRedPin.Storage.set('last-search-lng', location.geometry.location.lng());
                }
                var parsedBounds;
                var bounds;
                if (location.geometry.bounds) {
                  bounds = location.geometry.bounds.toString();
                  bounds = bounds.replace(/[\s\(\)]/g, '');
                  self.$el.data('location-filter-' + activeSelectize.settings.uid, { bound_to: bounds });

                  parsedBounds = bounds.split(',');
                  var parsedBoundsLat = parseFloat((parseFloat(parsedBounds[0]) + parseFloat(parsedBounds[2])) / 2);
                  var parsedBoundsLng = parseFloat((parseFloat(parsedBounds[1]) + parseFloat(parsedBounds[3])) / 2);

                  TheRedPin.Storage.set('last-search-lat', parsedBoundsLat);
                  TheRedPin.Storage.set('last-search-lng', parsedBoundsLng);
                } else if (location.geometry.location) {
                  // if a POINT and we're on the map, use center_to otherwise use bound_to from the viewport
                  if (TheRedPin.Hybrid) {
                    var center = location.geometry.location.toString();
                    center = center.replace(/[\s\(\)]/g, '');
                    self.$el.data('location-filter-' + activeSelectize.settings.uid,
                      { center_to: center, bound_type: 'point' });
                  } else {
                    bounds = location.geometry.viewport.toString();
                    bounds = bounds.replace(/[\s\(\)]/g, '');
                    self.$el.data('location-filter-' + activeSelectize.settings.uid,
                      { bound_to: bounds, bound_type: 'point' });
                    parsedBounds = bounds.split(',');
                  }

                  TheRedPin.Storage.set('last-search-lat', location.geometry.location.lat());
                  TheRedPin.Storage.set('last-search-lng', location.geometry.location.lng());
                }
                self.$el.data('location-name-' + activeSelectize.settings.uid, { keywords: value.address });
                var polygonSearchData = {
                  name: location.address_components[0].long_name
                  , type: location.address_components[0].types[0]
                  , lat: location.geometry.location.lat()
                  , lng: location.geometry.location.lng()
                };
                // if location is hood or city check if we polygon
                if (polygonSearchData.type === 'neighborhood' || polygonSearchData.type === 'locality'
                  || polygonSearchData.type.match(/^administrative_area/)
                ) {
                  var polyDeferred = new $.Deferred();
                  var polygonCheck = new PolygonCheck();
                  polygonCheck.fetch({
                    data: {
                      options: JSON.stringify(polygonSearchData)
                    },
                    success: function (model, response) {
                      if (response.result !== null) {
                        self.$el.data('location-poly-' + activeSelectize.settings.uid, {
                          poly_id: response.result.poly_id
                          , poly: response.result.polygon
                        });
                      }
                      polyDeferred.resolve();
                    },
                    error: function (model, response) {
                      polyDeferred.resolve();
                    }
                  });
                }
                // if we did not get a poly from the previous step but have bounds, set polyBounds param
                // polyBounds is used by Hybrid.js to build a polygon from given bounds
                var excludedLocationTypes = [ 'premise', 'route', 'administrative_area_level_1' ];
                $.when(polyDeferred).then(function () {
                  if (_.isEmpty(self.$el.data('location-poly-' + activeSelectize.settings.uid)) &&
                    self.$el.data('location-filter-' + activeSelectize.settings.uid).bound_type != 'point' &&
                    bounds && typeof polygonSearchData.type !== 'undefined' &&
                    _.indexOf(excludedLocationTypes, polygonSearchData.type) === -1) {
                    self.$el.data('location-poly-' + activeSelectize.settings.uid, { poly_bounds: bounds });
                    self.activeGeocode[index].resolve([]);
                  } else {
                    self.activeGeocode[index].resolve([]);
                  }
                });
                self.setAllValue = value;

                // TD|PS: Find a better fix for iPad Mini / iPad Air not setting intitial selectize option
                $('.item', activeSelectize.$control).html(value.address);
              });
            }
          }
          if (value) {
            $('.remove-option').addClass('visible');
          } else {
            $('.remove-option').removeClass('visible');
          }
        },
        render: {
          option: function (item, escape) {
            if (item.group == 'links') {
              if (self.layer == 'properties') {
                return TheRedPin.template('selectize-properties-quick-link-template', item);
              } else if (self.layer == 'projects') {
                return TheRedPin.template('selectize-projects-quick-link-template', item);
              }
            } else {
              return TheRedPin.template('selectize-item-template', { graphics: '', contents: item.label, classes: '' });
            }
          },
          optgroup_header: function (data, escape) {
            return TheRedPin.template(
              'selectize-group-header-template',
              { graphics: data.value == 'locations' ? 'logo logo-google-mono-small right' : '',
                contents: data.label,
                classes: ''
              }
            );
          }
        },
        load: function (query, callback) {
          this.clearOptions();
          this.renderCache = {};
          // we need to preserve the selectize context, and self is set to the parent view
          // jscs: disable safeContextKeyword
          var activeSelectize = this;
          // jscs: enable safeContextKeyword
          if (query.length < 2) { return callback(); }

          query = query.replace(/\s\s+/g, ' ');
          query = query.replace(/^\s+/, '');

          var index = self.getIndexOfTarget(activeSelectize.$input);
          // abort previous unfinished requests
          if (self.activeRequest[index]) {
            self.activeRequest[index].abort();
          }
          self.activeRequest[index] = $.ajax({
            url: TheRedPin.url + self.layer,
            data: { response: 'autocomplete', match: query }
          });
          self.activeAutocomplete[index] = autocomplete(query);

          $.when(self.activeRequest[index], self.activeAutocomplete[index]).then(function (quickLinks, locations) {
            self.lastQuery[activeSelectize.settings.uid] = query;
            locations = locations.slice(0, 4);
            quickLinks = quickLinks[ 0 ].result.listings.slice(0, 5);
            var keys = quickLinks.shift()
              , options = []
              , option
              ;

            _.each(quickLinks, function (values, index) {
              if (self.layer == 'properties') {
                option = TheRedPin.helpers.object(keys, values, {
                  addr_full: 'label',
                  mls_num: 'mls',
                  num_beds: 'beds',
                  num_baths: 'baths'
                });
              } else if (self.layer == 'projects') {
                option = TheRedPin.helpers.object(keys, values, {
                  name: 'label',
                  addr_street: 'address'
                });
              }
              option.group = 'links';
              option.value = JSON.stringify({ url: option.url });
              options.push(option);
            });
            _.each(locations, function (location, index) {
              option = {
                label: location.description,
                group: 'locations',
                value: JSON.stringify({ address: location.description })
              };
              options.push(option);
            });

            callback(options);
            self.trigger('loaded', activeSelectize);
          });
        }
      });

      self.loseFocusForceSelection = {};
      self.setAllForceSelection = null;
      self.keywordUserInput = '';

      _.each(self.$el.find('form'), function (form, index) {
        var $form = $(form);
        if ($form.has('[name=keywords]')) {
          var $field = $('.selectize-input input', $('form [name=keywords]').siblings('div'));
          var $userInputField = $($('input[placeholder*="City, neighbourhood, address"]', $form)[1]);
          self.loseFocusSelectHandler($field, index);
          self.gainFocusSelectHandler($field, index);
          self.keyUpKeywordHandler($userInputField);
        }
      });

      $('.keywords-column:not(:has("div.remove-option"))')
        .append('<div class="remove-option"></div>');

      $('.keywords-column .remove-option').click(function () {
        // if data('layer') is 'properties' OR undefined defaults to 0
        var index = $('dd.active a').data('layer') === 'projects' ? 1 : 0;
        self.keywordSelectize[index].selectize.clear();
        self.keywordSelectize[index].selectize.clearOptions();
      });

      self.keypressEnterSelectHandler();

      // initialize Builder autocomplete

      self.BuilderSelectize = self.$el.find('#search-projects [name=builder]').selectize({
        readOnly: true,
        uid: new Date().getTime(),
        maxItems: 1,
        persist: false,
        loadThrottle: null,
        valueField: 'value',
        labelField: 'label',
        sortField: [ { field: 'primarySort' }, { field: 'label' } ],
        searchField: [ 'label' ],
        create: false,
        onChange: function (value) {
          if (value !== '') {
            value = JSON.parse(value);
            self.$el.data('builder-filter', { builder: value.web_id });
          } else {
            self.$el.data('builder-filter', {});
          }
        },
        render: {
          option: function (item, escape) {
            return TheRedPin.template('selectize-item-template', { graphics: '', contents: item.label, classes: '' });
          }
        },
        load: function (query, callback) {
          this.clearOptions();
          this.renderCache = {};
          // we need to preserve the selectize context, and self is set to the parent view
          // jscs: disable safeContextKeyword
          var activeSelectize = this;
          // jscs: enable safeContextKeyword
          if (query.length < 2) { return callback(); }

          //var index = self.getIndexOfTarget(activeSelectize.$input);
          // abort previous unfinished requests
          if (self.builderRequest) { self.builderRequest.abort(); }
          self.builderRequest = $.ajax({
            url: TheRedPin.url + 'builders',
            data: { response: 'autocomplete', match: query }
          });
          self.builderAutocomplete = autocomplete(query);

          $.when(self.builderRequest, self.builderAutocomplete).then(function (builders) {

            builders = builders[ 0 ].result.slice(0, 5);
            var keys = builders.shift()
              , options = []
              , option
              ;

            _.each(builders, function (values, index) {
              option = TheRedPin.helpers.object(keys, values, {
                name: 'label'
              });
              option.value = JSON.stringify({ web_id: option.web_id, name: option.label });
              options.push(option);
            });

            callback(options);
            self.trigger('loaded', activeSelectize);
          });
        }
      });



      // initialize UI components
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

      self.$el.find('.price-range').on({
        change: function (e) {
          var $activeSlider = $(e.target);
          var min, max, $passiveSlider;

          if ($activeSlider.hasClass('properties-price-range')) {
            $passiveSlider = $('.projects-price-range');
          } else {
            $passiveSlider = $('.properties-price-range');
          }

          min = parseInt($activeSlider.val()[0].replace(/[$,]/g, ''));
          max = parseInt($activeSlider.val()[1].replace(/[$,]/g, ''));

          $passiveSlider.val([ min, max ]);
        }
      });

      self.$el.find('.price-range').Link('lower').to(self.$el.find('.min-price'), 'html');
      self.$el.find('.price-range').Link('upper').to(self.$el.find('.max-price'), 'html');
      self.$el.find('.price-range').Link('lower')
        .to(self.$el.find('input[name="min_price"]'), 'val', formatCurrencyToInteger);
      self.$el.find('.price-range').Link('upper')
        .to(self.$el.find('input[name="max_price"]'), 'val', formatCurrencyToInteger);

      self.$el.find('.dom-range').noUiSlider({
        start: [ 100 ],
        snap: true,
        connect: 'lower',
        range: {
          min: 1,
          '33%': 7,
          '66%': 31,
          max: 100
        },
        format: {
          to: function (value) {
            if (value === 100) {
              return 'all';
            } else {
              return value;
            }
          },
          from: function (value) {
            if (value === 'all') {
              return 100;
            } else {
              return value;
            }
          }
        }
      });

      self.$el.find('.dom-range').noUiSlider_pips({
        mode: 'positions',
        values: [ 0, 33, 66, 100 ],
        density: 33,
        format: {
          to: function (value) {
            switch (value) {
              case 1:
                return '<span data-dom="1">Under<br>24 Hours</span>';
              case 7:
                return '<span data-dom="7">Under<br>1 Week</span>';
              case 31:
                return '<span data-dom="31">Under<br>1 Month</span>';
              case 100:
                return '<span data-dom="all">Show<br>All</span>';
            }
          },
          from: function (value) {
            if (value === 'all') {
              return 100;
            } else {
              return value;
            }
          }
        }
      });

      self.$el.find('.dom-range').Link('lower').to($('input[name="dom"]'), 'val');

      self.$el.find('.dom-range .noUi-pips span[data-dom]').click(function () {
        var domVal = $(this).data('dom');
        self.$el.find('.dom-range').val(domVal);
      });

      self.$el.find('#search-projects [name=occupancy]').selectize();

      $('#search-modal .filter-button-container input').change(function () {
        var $this         = $(this)
          , id            = $(this).attr('id')
          , inactiveLayer = $('dd.active a').data('layer') === 'properties' ? 'proj-' : 'prop-'
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
          // inactive layer should track active layer's radio buttons
          $('#' + inactiveLayer + idQty).prop('checked', true);
        }
      });

      $('.filter-button-container input:checked').trigger('change');

      // event bindings
      self.$el.find('#layer-tab').on('click', 'a', _.bind(self.layerTabClicked, self));

      var filters;
      if ((TheRedPin.Hybrid && hybridAction != 'matches')) {
        // if we're on Hybrid page
        self.layer = TheRedPin.Hybrid.layer;

        // TD:PS Find appropriate solution for iPhone 6 scrolling when list-view and search modal are open
        if (TheRedPin.environment.screen.size === 'small' && $('#panel').hasClass('full-screen')) {
          $('.map-toggle-button').first().click();
        }

        self.mobileResizeModal(self.$el);

        $.subscribe('main.window_size_changed', function (event, data) {
          self.mobileResizeModal(self.$el);
        });

        // get current filters from Hybrid module and pre-fill form values
        filters = _.pick(
            TheRedPin.Hybrid.filters,
            'min_price',
            'max_price',
            'beds',
            'baths',
            'type',
            'occupancy',
            'builder',
            'keywords',
            'listview',
            'is_exact',
            'vip',
            'amenities',
            'dom'
            );
        self.presetFilters(filters);
      } else if ($('.listview-container').data('controller') == 'listview') {
        self.layer = $('.listview-container').data('layer');
        var ListviewFilters = $('.listview-container[data-filters]').data('filters');
        filters = _.pick(
            ListviewFilters,
            'min_price',
            'max_price',
            'beds',
            'baths',
            'type',
            'occupancy',
            'builder',
            'keywords',
            'is_exact',
            'vip',
            'amenities',
            'dom'
            );
        self.presetFilters(filters);
      } else {
        // if we're on other pages
        self.layer = $('#layer-tab').find('.active a:first').data('layer');
      }
    },

    presetFilters: function (filters) {
      var self = this;
      var $field;
      $('#layer-tab').find('a[data-layer=' + self.layer + ']').click();

      _.each(self.$el.find('form'), function (form, index) {
        var $form = $(form);

        _.each(filters, function (value, name) {
          var $field = $form.find('[name=' + name + ']');
          if ($field.length && $field[ 0 ].selectize) {
            if (name == 'keywords') {
              $field.siblings('.selectize-control').find('input').val(value).trigger('keyup');
              self.forceSelection(index);
            } else if (name == 'builder') {

              var sel = $field[0].selectize;

              self.once('loaded', function () {
                window.sel = sel;
                var selection = _.sortBy(sel.options, function (item) {
                  return item.primarySort;
                })[0];
                sel.setValue(selection.value);
              });

              $field.siblings('.selectize-control').find('input').val(filters.builder).trigger('keyup');
              self.forceSelection(index);

            } else {
              $field[ 0 ].selectize.setValue(value.split(','));
            }
          } else if ($field.size() > 1) {
            // TODO: handle radio buttons
            if (name === 'beds' || name === 'baths') {
              var $bedBathField = $('#search-modal input[name="' + name + '"][value="' + value + '"]');
              $bedBathField.prop('checked', true);
              $bedBathField.trigger('change');
            } else {
              value = value.split(',');
              $field.each(function () {
                if (_.contains(value, $(this).val())) { $(this).prop('checked', true); }
              });
            }
          } else if ($field.is(':checkbox') || $field.is(':radio')) {
            //use inverse value of is_exact filter value to set interface element
            //written as ternary for clarity
            if (value == 'on' || value == 1) {
              $field.prop('checked', name !== 'is_exact' ? true : false);
            } else {
              $field.prop('checked', name !== 'is_exact' ? false : true);
            }
          } else if (name === 'max_price' || name === 'min_price') {
            if (name === 'min_price') {
              $('.price-range').val([ value, null ]);
            } else {
              $('.price-range').val([ null, value ]);
            }
          } else if (name === 'dom') {
            $('.dom-range').val(value);
          } else {
            $field.val(value);
          }
        });
        $('[name=type]').trigger('change');
      });
    },

    mobileResizeModal: function ($modal) {
      if (window.innerWidth < 440 || window.innerHeight < 440) {
        var modalHeight = window.innerHeight + 'px'
          , scrollingFormHeight = window.innerHeight - 96 + 'px'
          ;
        $modal.css('top', 0);
        $modal.css('height', modalHeight);
        $modal.css('min-height', '384px');
        // $modal.css('min-height', modalHeight);
        $modal.find('.scrolling-form').css('height', scrollingFormHeight);
        $modal.find('.scrolling-form').css('max-height', scrollingFormHeight);
      }
    },

    setAll: function (value) {
      var self = this
        , val = JSON.stringify(value)
        , index = self.getActiveIndex()
        , deferreds = []
        ;
      _.each(this.keywordSelectize, function (ele, i) {
        if (ele.selectize.getValue() !== val) {
          var deferred = new $.Deferred();
          deferreds.push(deferred);
          $(ele).siblings('.selectize-control').find('input').val(value.address).trigger('keyup');
          $.when(self.forceSelection(i)).then(function (response) {
            deferred.resolve();
          });
        }
      });
      $.when.apply(self, deferreds).then(function (response) {
        self.setAllForceSelection.resolve([]);
      });
    },

    getLastQuery: function () {
      var values = [];
      var self = this;
      _.each(this.keywordSelectize, function (ele) {
        values.push(self.lastQuery[ele.selectize.settings.uid]);
      });
      return values;
    },

    purgeLastQuery: function (index) {
      delete this.lastQuery[this.keywordSelectize[index].selectize.settings.uid];
    },

    getKeywordSelections: function () {
      var values = [];
      _.each(this.keywordSelectize, function (ele) {
        values.push(ele.selectize.getValue());
      });
      return values;
    },

    layerTabClicked: function (event) {
      if (this.setAllValue) {
        this.setAll(this.setAllValue);
      }
      this.setLayer($(event.target).data('layer'), false);
    },

    setLayer: function (layer, reset) {
      if (reset) {
        _.each(this.keywordSelectize, function (ele) {
          ele.selectize.close();
          ele.selectize.clearOptions();
        });
      }
      this.layer = layer;
    },

    getActiveIndex: function () {
      var self = this;
      var index = 0;
      var form = self.$el.is('form') ? self.$el : self.$el.find('.content.active:first form');
      _.each(self.keywordSelectize, function (input, i) {
        if (form.find(input).length > 0) {
          index = i;
        }
      });
      return index;
    },

    getIndexOfTarget: function (target) {
      var self = this;
      var index = 0;
      var forms = self.$el.is('form') ? self.$el : self.$el.find('form');
      _.each(forms, function (form, i) {
        if ($(form).find(target).length > 0) {
          index = i;
        }
      });
      return index;
    },

    getText: function (index) {
      return $(this.keywordSelectize[0]).siblings('.selectize-control').find('input').val();
    },

    forceSelection: function (index) {
      var deferred = new $.Deferred();
      var self = this;
      if (typeof index === 'undefined') {
        index = this.getActiveIndex();
      }
      $.when(self.activeRequest[index], self.activeAutocomplete[index]).then(function () {
        var sel = self.keywordSelectize[index].selectize;
        window.tester = sel;
        if (sel.getValue() === '') {
          if (sel.hasOptions && Object.keys(sel.options) > 0) {
            var selection = _.sortBy(_.filter(sel.options, function (item) {
              return item.group === 'locations';
            }), function (item) {
              return item.primarySort;
            })[0];
            sel.setValue(selection.value);
            $.when(self.activeGeocode[index]).then(function () {
              deferred.resolve(true);
            });
          } else {
            //test a direct geolocation for the value
            $.when(geocode(sel.lastQuery)).then(function (locations) {
              var location = locations[ 0 ];
              if (location.geometry.bounds || location.geometry.location) {
                if (location.geometry.location &&
                    location.geometry.location.toString() !== '(56.130366, -106.34677099999999)') {
                  TheRedPin.Storage.set('last-search-lat', location.geometry.location.lat());
                  TheRedPin.Storage.set('last-search-lng', location.geometry.location.lng());
                }
                //geocode will ALWAYS return a result; we must prevent default Canada location,
                //which is an indication of finding nothing while limiting the search to Canada
                if (!location.geometry.location ||
                  location.geometry.location.toString() !== '(56.130366, -106.34677099999999)') {
                  //add option and select it
                  var value = JSON.stringify({ address: sel.lastQuery });
                  sel.addOption({
                    group: 'locations',
                    label: sel.lastQuery,
                    primarySort: 1,
                    value: value
                  });
                  sel.setValue(value);
                  $.when(self.activeGeocode[index]).then(function () {
                    deferred.resolve(true);
                  });
                } else {
                  deferred.resolve(true);
                }
              } else {
                deferred.resolve(false);
              }
            });
          }
        } else {
          deferred.resolve(true);
        }
      });
      return deferred;
    },

    loseFocusSelectHandler: function ($field, index) {
      var self = this;
      $field.focusout(function () {
        if (self.keywordUserInput === '') {
          if (self.setAllForceSelection) {
            self.setAllForceSelection.resolve();
          }
        }
        $.when(self.forceSelection(index)).then(function (response) {
          if (self.loseFocusForceSelection[index] !== undefined) {
            self.loseFocusForceSelection[index].resolve();
          }
        });
      });
    },

    keypressEnterSelectHandler: function () {
      var self = this;

      $('#search-modal').keypress(function (e) {
        if (e.keyCode === 13) {
          if ($(e.target).is('input')) {
            $(e.target).focusout();
          }
          var $activeForm = $('.reveal-modal .active form');
          $('.submit', $activeForm).trigger('click');
        }
      });
    },

    gainFocusSelectHandler: function ($field, index) {
      var self = this;
      $field.focus(function () {
        self.loseFocusForceSelection[index] = new $.Deferred();
      });
    },

    keyUpKeywordHandler: function ($field) {
      var self = this;
      $field.keyup(function () {
        self.keywordUserInput = $field.val();
      });
    },

    addSubmitHandler: function (submitHandler) {
      this.submitHandler = submitHandler;
    },

    singleQuickLinkOption: function (index) {
      var self = this
        , options = this.keywordSelectize[index].selectize.options
        , firstOption = _.values(options)[0]
        ;
      if (_.size(options) === 1 && firstOption.group === 'links') {
        self.option_url = _.values(options)[0].url;
        return self.option_url;
      }
    },

    openQuickLink: function () {
      window.open(this.option_url);
    },

    submit: function (event) {
      var self = this;
      self.submitting = true;
      $.when(this.submitHandler()).then(function (response) {
        if (response) {
          self.completeSubmit(event);
        } else {
          self.submitting = false;
        }
      });
    },

    delayedSubmit: function (index) {
      var self = this;
      setTimeout(function () {
        $.when(
          self.activeAutocomplete[index]
          , self.activeGeocode[index]
          , self.activeRequest[index]
          ).then(function () {
            self.submit($.Event('click'));
          });
      }, 1);
    },

    completeSubmit: function (event) {
      event.preventDefault();

      var self = this
        , form = self.$el.is('form') ? self.$el : self.$el.find('.content.active:first form')
        , fields = form.serializeArray()
        , filters = {}
        ;

      //use inverse value from is_exact field when requesting project data
      if (self.layer == 'projects') {
        var isExact = _.findWhere(fields, { name: 'is_exact' });
        if (!isExact) {
          // when show incomplete switch is not present, is_exact = 0
          fields.push({
            name: 'is_exact',
            value: form.find('#show-all-projects-switch').length
          });
        } else {
          isExact.value = 0;
        }
        var vip = _.findWhere(fields, { name: 'vip' });
        if (!vip) {
          fields.push({ name: 'vip', value: 0 });
        } else {
          vip.value = 1;
        }
      }
      var sel = self.keywordSelectize[self.getActiveIndex()].selectize;
      _.each(fields, function (field) {
        var locationfilter = self.$el.data('location-filter' + sel.settings.uid);
        if (field.name == 'keywords' && locationfilter && !_.isEmpty(locationfilter)) {
          // special case, bounds or center geometry
          _.extend(filters, self.$el.data('location-filter-' + sel.settings.uid));
          _.extend(filters, self.$el.data('location-name-' + sel.settings.uid));
          _.extend(filters, self.$el.data('location-poly-' + sel.settings.uid));
        } else if (field.name == 'builder') {
          _.extend(filters, self.$el.data('builder-filter'));
        } else {
          var $field = self.$el.find('[name="' + field.name + '"]');
          if ($field.size() > 1 || ($field.is(':checkbox') || $field.is(':radio'))) {
            if (field.value == 'on') { field.value = 1; }
            if (!filters[ field.name ]) {
              filters[ field.name ] = field.value;
            } else {
              filters[ field.name ] += ',' + field.value;
            }
          } else {
            filters[ field.name ] = field.value;
          }
        }
      });
      if (filters.keywords) {
        TheRedPin.Storage.set('last-search', filters.keywords);
      }
      var route;
      if (TheRedPin.Hybrid && TheRedPin.Hybrid.layer == self.layer && hybridAction != 'matches') {
        TheRedPin.Hybrid.setSearchFilters(filters, true);
        TheRedPin.Hybrid.setViewFilters(filters, true);
        $.publish('search.filter', filters);
        self.$el.foundation('reveal', 'close');
      } else if (TheRedPin.Hybrid && hybridAction != 'matches') {
        route = self.layer == 'properties' ? '/mls-listings/map' : '/new-preconstruction/map';
        if (filters.poly) {
          delete filters.poly;
        }
        window.location.href = window.location.origin + route + '?' + $.param(filters);
      } else {
        route = self.layer === 'projects' ?
          '/new-preconstruction/' : '/mls-listings/';
        if (filters.poly) {
          delete filters.poly;
        }
        // Build the FULL query if going to list view
        if (filters.bound_to) {
          filters.bounds = filters.bound_to;
        }
        if (!filters.keywords) {
          var onPageFilters = $('.listview-container').data('filters');
          var locationFilters = _.pick(onPageFilters, 'hood', 'city', 'region', 'province', 'bounds');
          filters = _.extend(locationFilters, filters);
        }
        if (filters.poly_id) {
          var polyType = filters.poly_id.split(',')[1];
          var polyId = filters.poly_id.split(',')[0];
          filters[polyType] = polyId;
        }
        window.location.href = window.location.origin + route + '?' + $.param(filters);
      }
      $.cookie('last-search-layer', self.layer, { path: '/' });
      self.submitting = false;
    }
  });

  Search.initialize = function (element) {
    //TD|SA: not clear where the preserved variable is used; may be important for header search
    Search.view = new SearchView({ el: '#' + element.id });
    return Search.view;
  };

  Search.getNewViewInstance = function (variableElement) {
    //variableElement differs from initialize element by accepting normal options for BB View
    //TD|SA: observe any issues related to not being preserved in parent object
    return new SearchView({ el: variableElement });
  };

  return Search;

});
