define('polygonCheckByID', [ 'main' ], function () {
  /*
  PolygonCheck

  Backbone model for retrieving a polygon and bounds for a given polygon ID
  */
  var PolygonCheck = Backbone.Model.extend({
    urlRoot: TheRedPin.url + 'locations/'
  });

  return PolygonCheck;
});

require([ 'main', 'jquery-slick', 'grid-list-view', 'search', 'polygonCheckByID' ],
function (rMain, rSlick, GridListView, search, PolygonCheckByID) {

  console.log('Hybrid Page Started');


  var TheRedPin    = window.TheRedPin
    , Hybrid       = TheRedPin.Hybrid = {}
    , baseUrl      = TheRedPin.url
    , hybridAction = $('#hybrid').data('action')
    , layer        = $('#hybrid').data('layer') // properties / projects
    , zoomLevels   = { street: 11, hood: 1000, city: 8, region: 4, country: 0 }
    // map zoom breakpoints: closest value where zoom > value chooses breakpoint
    , maximumCount = 10000 // max markers to display on map (including those in clusters)
    , savedSearchID = $('#hybrid').data('saved-search-id')
    , savedSearchSince = $('#hybrid').data('saved-search-since')
    , savedSearchBounds = $('#hybrid').data('saved-search-bounds')
    ;

  Hybrid.layer = layer;
  // shared filters, including format, bounds, beds, baths, price range, zoom etc.
  Hybrid.filters = { format: 'compact' };

  /*
  checkPoly

  Preserves a polygon present in the filters for future consumption by the map, removing
  it from the filters passed to the app

  Arguments:
  [Object] filters: associative array of property/map filter parameters
  */
  Hybrid.checkPoly = function (filters) {
    if (filters.poly && filters.bound_to) {
      //main needs to temporarily retain display polygon, as map may not exist
      Hybrid.limiterPolygon = filters.poly;
      delete filters.poly;
      Hybrid.limiterBounds = filters.bound_to.split(',');
      for (var i = 0; i < Hybrid.limiterBounds.length; i++) {
        Hybrid.limiterBounds[i] = parseFloat(Hybrid.limiterBounds[i]);
      }
    } else if (filters.poly_bounds && filters.bound_to) {
      Hybrid.limiterPolygon = Hybrid.buildPolyBounds(filters.poly_bounds);
      Hybrid.limiterBounds = filters.bound_to.split(',');
      for (var j = 0; j < Hybrid.limiterBounds.length; j++) {
        Hybrid.limiterBounds[j] = parseFloat(Hybrid.limiterBounds[j]);
      }
    }
    if (filters.poly_id) {
      delete filters.poly_bounds;
      delete Hybrid.filters.poly_bounds;
      this.limiterIsPolyBounds = false;
    } else if (filters.poly_bounds) {
      delete filters.poly_id;
      delete Hybrid.filters.poly_id;
      this.limiterIsPolyBounds = true;
    }
  };

  /*
  buildPolyBounds

  Builds a basic polygon from a given bounds

  Arguments:
  [String] bounds: string of 4 numbers making up two coordinates that represent a boundary
  */
  Hybrid.buildPolyBounds = function (bounds) {
    var parsedBounds = bounds.split(',');
    var polygon = [
                    [ { y: parseFloat(parsedBounds[0]), x: parseFloat(parsedBounds[1]) },
                      { y: parseFloat(parsedBounds[2]), x: parseFloat(parsedBounds[1]) },
                      { y: parseFloat(parsedBounds[2]), x: parseFloat(parsedBounds[3]) },
                      { y: parseFloat(parsedBounds[0]), x: parseFloat(parsedBounds[3]) },
                      { y: parseFloat(parsedBounds[0]), x: parseFloat(parsedBounds[1]) }
                    ]
                  ];
    return polygon;
  };

  /*
  setSearchFilters

  Resets property filters based on a supplied filters argument. Expected parameters
  will be used to set the current filters if present, absent expected parameters are
  deleted from the current filters (e.g. 'beds' was set to 3-plus in a previous search,
  and are no longer relevant; 'beds' will therefore be deleted from the request to the
  app.)

  Arguments:
  [Object] filters: associative array of property/map filter parameters
  */
  Hybrid.setSearchFilters = function (filters, silent) {
    _.each([
      'beds',
      'baths',
      'min_price',
      'max_price',
      'type',
      'occupancy',
      'builder',
      'builder-name',
      'keywords',
      'listview',
      'is_exact',
      'vip',
      'amenities',
      'dom',
      'saved_search_id',
      'since'
    ],
    function (filter) {
      if (_.has(filters, filter) && filters[ filter ] !== '') {
        Hybrid.filters[ filter ] = filters[ filter ];
      } else {
        delete Hybrid.filters[ filter ];
      }
    });
    if (hybridAction != 'matches') {
      delete Hybrid.filters.since;
      delete Hybrid.filters.saved_search_id;
    }
    if (!silent) {
      $.publish('hybrid.search_filters_changed');
    }
  };

  /*
  setViewFilters

  Sets property filters based on a supplied filters argument. Expected parameters
  will be used to set the current filters if present, with previous values left as is
  if not supplied (e.g. 'bounds' are not defined after a search from the search modal;
  the previously defined 'bounds' will be retained)

  Arguments:
  [Object] filters: associative array of property/map filter parameters
  */
  Hybrid.setViewFilters = function (filters, silent) {
    Hybrid.checkPoly(filters);
    _.each([ 'bounds', 'center', 'zoom_level', 'bound_to', 'center_to',
    'order_by', 'poly_id', 'poly_bounds' ], function (filter) {
      if (_.has(filters, filter) && filters[ filter ] !== '') {
        Hybrid.filters[ filter ] = filters[ filter ];
      }
    });
    if ((Hybrid.filters.bound_to || Hybrid.filters.center_to)
       && (Hybrid.filters.center || Hybrid.filters.zoom_level)) {
      // bound_to and center_to should override center & zoom_level
      // but should be removed and replaced with center & zoom_level as soon as the map bounds are updated
      delete Hybrid.filters.center;
      delete Hybrid.filters.zoom_level;
    }
    if (!silent) {
      $.publish('hybrid.view_filters_changed');
    }
  };

  /*
  updateURL

  Sets URL to reflect the current search parameters in order to allow for copy/pasting
  the URL to share search results.

  Takes no arguments
  */
  Hybrid.updateURL = function () {
    var filters = _.clone(Hybrid.filters)
      , parameters
      ;
    delete filters.format; // format is useless for url
    delete filters.bounds; // instead of bounds, we should use center & zoom level
    parameters = $.param(filters);

    if (_.isFunction(window.history.replaceState) && Hybrid.mapIsInited !== true) {
      $.subscribe('map.initialized, hybrid.geolocated', function () {
        window.history.replaceState(null, document.title, '?' + parameters);
      });
    } else if (_.isFunction(window.history.replaceState)) {
      window.history.replaceState(null, document.title, '?' + parameters);
    } else {
      window.location.hash = '#' + parameters;
    }
    if (hybridAction == 'matches') {
      $('.back-to-hybrid a').attr('href', '/mls-listings/?' + parameters);
    }
  };

  /*
  MapModel

  Backbone model for storing marker and cluster data
  */
  var MapModel = Backbone.Model.extend({

    defaults: {
      id:      null,
      label:   null,
      lat:     null,
      lng:     null,
      data:    null, // data is bounds for city & hood markers, and ids for clusters
      type:    null, // house, building or cluster
      classes: null  // vip, favorite
    }

  });

  /*
  PanelModel

  Backbone model for storing property data as used for marker labels and property
  card display.
  */
  var PanelModel = Backbone.Model.extend({

    defaults: {
      id:             null,
      index:          null,
      name:           null,
      price:          null,
      // lat:            null,
      // lng:            null,
      address:        null,
      // address_slug:   null,
      // city_slug:      null,
      property_type:  [],
      images:         [],
      beds:           null,
      baths:          null,
      units:          null,
      floors:         null,
      // occupancy:      null,
      // footage:        null,
      // rebate:         null,
      // taxes:          null,
      // maintenance:    null,
      // days_on_market: null,
      url:            null,
      // builder:        null,
      // broker:         null,
      // has_cashback:   false,
      // is_bookmarked:  false,
      is_vip:         false,
      is_public:      false
    }

  });

  /*
  MapCollection

  Backbone collection for storing MapModel models
  */
  var MapCollection = Backbone.Collection.extend({
    requests:  [], //stores active set of requests
    initialFetch: true,
    url:       baseUrl + layer,
    zoomLevel: null,
    model:     MapModel,

    /*
    fetch

    Based on search parameters, determines appropriate endpoint based on zoom level (e.g.
    markers call for city zoom level, region count call for region zoom level), and removes
    unnecessary data

    Arguments:
    [Object] filters: associative array of property/map filter parameters
    */
    fetch: function (filters) {
      var self = this
        , requests = self.requests
        , process = self.process
        , zoomLevel = Hybrid.view.zoomLevel
        ;

      // if zoom level has changed
      if (zoomLevel != self.zoomLevel) {
        self.reset();
        self.zoomLevel = zoomLevel;
      }
      if (hybridAction == 'matches' || Hybrid.limiterIsPolyBounds) {
        zoomLevel = 'street';
      }
      switch (zoomLevel) {
        case 'street':
          self.url = baseUrl + layer;
          filters = _.extend(
            { response: 'markers', num: maximumCount },
            Hybrid.filters,
            filters
          );
          if (!filters.zoom_level) {
            //TD|SA: map is loading default zoom with SEO data
            filters.zoom_level = Hybrid.view.mapView.map.zoom;
          }
          break;
        case 'hood':
          self.url = baseUrl + 'hoods';
          filters = _.extend(
            { count: layer },
            Hybrid.filters,
            filters
          );
          // zoom level is not needed for hood level
          delete filters.zoom_level;
          break;
        case 'city':
          self.url = baseUrl + 'cities';
          filters = _.extend(
            { count: layer },
            Hybrid.filters,
            filters
          );
          // zoom level is not needed for city level
          delete filters.zoom_level;
          // temporarily not limit city level to poly
          delete filters.poly_id;
          break;
        case 'region':
          self.url = baseUrl + 'regions';
          filters = _.extend(
            { count: layer },
            Hybrid.filters,
            filters
          );
          // zoom level is not needed for city level
          delete filters.zoom_level;
          // temporarily not limit region level to poly
          delete filters.poly_id;
          break;
        default:
          return;
      }
      delete filters.center; // center is only used for generating urls
      delete filters.order_by; // order is irrelevant for markers
      // TODO: remove this when the backend is fixed
      if (layer == 'projects') { delete filters.order_by; }

      // replace poly_id with [type]=id
      if (filters.poly_id) {
        var areaKey = filters.poly_id.split(',')[1]
          , areaID  = filters.poly_id.split(',')[0]
          ;
        filters[areaKey] = areaID;
        delete filters.poly_id;
      }

      if (filters.poly_bounds) {
        filters.bounds = filters.poly_bounds;
        delete filters.poly_bounds;
      }

      // abort previous unfinished requests
      _.each(requests, function (request) { request.abort(); });
      requests = self.requests = [];

      $.publish('hybrid.ajax');

      // add saved_search params
      if (savedSearchID) {
        filters = self.setSavedSearchFilters(filters);
      }

      requests.push(
        $.ajax({
          url: self.url,
          data: filters
        }).done(function (response) {
          // process current request
          process.call(self, response);
          // check if there are more batches
          var currentPage = response.result.currentPage
            , totalPages  = Math.ceil(response.result.totalCount / filters.num)
            ;
          for (var page = ++currentPage; page <= totalPages; page++) {
            requests.push(
              $.ajax({
                url: self.url,
                data: _.extend({}, filters, { page: page })
              }).done(_.bind(process, self))
            );
          }
          $.when.apply($, requests).then(function () {
            self.requests = [];
          });
        })
      );
      self.initialFetch = false;
    },

    setSavedSearchFilters: function (filters) {
      var self = this;
      filters.saved_search_id = savedSearchID;

      if (savedSearchSince) {
        filters.since = savedSearchSince;
      }

      if (self.initialFetch) {
        delete filters.bounds;
        delete filters.center;
      }

      return filters;
    },

    /*
    process

    Massage data and create MapModel models based on the type of response

    Arguments:
    [Object] response: jQuery AJAX response object
    */
    process: function (response) {
      var self = this
        , results = response.result
        , keys
        , model
        ;
      if (Hybrid.view.zoomLevel == 'street' || hybridAction == 'matches' || Hybrid.limiterIsPolyBounds) {
        // street level, we have clusters and markers
        if (results.listings) {
          keys = results.listings.shift();
          _.each(results.listings, function (values) {
            model = TheRedPin.helpers.object(keys, values);
            // TODO: remove these once I get clean data from backend
            if (model.type == 'vip') {
              model.classes = 'vip';
            }
            if (layer == 'projects') {
              model.type = 'building';
            } else {
              if (model.type === 'Apartment' || model.type === 'Lofts') {
                model.type = 'building';
              } else {
                model.type = 'house';
              }
            }
            self.addModel(model);
          });
        }
        if (results.clusters) {
          keys = results.clusters.shift();
          _.each(results.clusters, function (values) {
            model = TheRedPin.helpers.object(keys, values, { listings: 'data' });
            self.addModel(model);
          });
        }
      } else {
        // we have city & hood markers
        keys = results.shift();
        _.each(results, function (values) {
          model = TheRedPin.helpers.object(keys, values, { x: 'lng', y: 'lat', count: 'label' });
          self.addModel(model);
        });
      }

      $.publish('hybrid.markers-processed', response.result);
      self.trigger('processed');
    },

    /*
    addModel

    Method for final massage of model data before adding to the collection; at this point,
    only used for cleansing display of private property markers when the user is not
    authenticated

    Arguments:
    [Object] model: Backbone model (MapModel)
    */
    addModel: function (model) {
      var privateClass = ' private-listing';
      if (model.label === '-') {
        model.label = 'login';
        model.classes = model.classes ? model.classes + ' ' + privateClass : privateClass;
      }
      this.add(model);
    }
  });

  /*
  PanelCollection

  Backbone collection for storing PanelModel models
  */
  var PanelCollection = Backbone.Collection.extend({
    request:      null, // last request
    filters:      { format: 'standard', response: 'summary', assets_num: 1 }, // default filters for this collection
    url:          baseUrl + layer,
    model:        PanelModel,
    totalCount:   null,

    /*
    fetch

    Retrieves data for listings based on search filters, either for a bounding area or with
    no bounds if selecting data for specifically selected IDs (e.g. when the user activates
    a marker or cluster), and removes unnecessary data

    Arguments:
    [Object] filters: associative array of property/map filter parameters
    */
    fetch: function (filters) {
      if (!Hybrid.view || !Hybrid.view.appState || Hybrid.view.appState.mapInit) {
        return;
      }
      var self = this
        , request = self.request
        , process = self.process
        ;
      Hybrid.view.appState.panelInited = true;
      if (window.initListingData) {
        var initData = window.initListingData;
        window.initListingData = null;
        process.call(self, initData);
      } else {
        // don't kill the server after panel view initial size calculations while map's not ready yet!
        if (!Hybrid.filters.bounds) { return; }

        // extend default filters with new filters, fetch number could be variable for this collection
        filters = _.extend({}, self.filters, Hybrid.filters, filters);

        // TD|PS: Refactor! Overrides format set from Hybrid.filters
        filters.format = 'standard';

        // zoom_level, center, bound_to & center_to are not needed for panel view
        delete filters.zoom_level;
        delete filters.center;
        delete filters.bound_to;
        delete filters.center_to;

        // check if we're fetching by ids, remove bounds/poly & set maximum num & first page
        if (filters.ids) {
          delete filters.bounds;
          delete filters.poly_id;
          filters.num = maximumCount;
          filters.page = 1;
        } else if (_.has(filters, 'from') && _.has(filters, 'to')) {
          filters.num = filters.to - filters.from;
          filters.offset = filters.from;
          delete filters.from;
          delete filters.to;
        } else {
          filters.num = maximumCount;
          filters.page = filters.page || 1;
        }

        // sort by public / private if user is not authenticated
        if (!window.TheRedPin.OAuth.isAuthenticated() && layer === 'properties') {
          filters.order_by = 'is_public,desc' + (filters.order_by === '' ? '' : '|' + filters.order_by);
        }

        // replace poly_id with [type]=id
        if (filters.poly_id) {
          var areaKey = filters.poly_id.split(',')[1]
            , areaID  = filters.poly_id.split(',')[0]
            ;
          filters[areaKey] = areaID;
          delete filters.poly_id;
        }

        // add saved_search params
        if (savedSearchID) {
          filters.saved_search_id = savedSearchID;

          if (savedSearchSince) {
            filters.since = savedSearchSince;
          }

          delete filters.bounds;
          delete filters.center;
          delete filters.zoom_level;
        }

        // replace bounds with poly_bounds if present
        if (filters.poly_bounds) {
          filters.bounds = filters.poly_bounds;
          delete filters.poly_bounds;
        }
        // abort previous unfinished requests
        if (request) { request.abort(); }

        request = self.request = $.ajax({
          url: self.url,
          data: filters
        }).done(function (response) {
          process.call(self, response);
          request = self.requests = null;
        });
      }
    },

    /*
    process

    Massage data and create/update PanelModel models based on the type of response

    Arguments:
    [Object] response: jQuery AJAX response object
    */
    process: function (response) {
      var self = this
        , results = response.result.listings
        , offset = isNaN(response.result.offset) ? 0 : response.result.offset
        , parameters
        , model
        , existing
        ;
      self.totalCount = response.result.totalCount;
      if (layer == 'projects') {
        parameters = '?' + $.param(_.pick(Hybrid.filters, 'beds', 'baths', 'min_price', 'max_price'));
      }

      var imagesBuilder = TheRedPin.Components.imagesBuilder();
      _.each(results, function (listing, index) {
        model = TheRedPin.helpers.renameObjectKeys(listing, {
          PropertyType: 'property_type',
          City: 'city',
          Hood: 'hood',
          num_beds: 'beds',
          num_baths: 'baths',
          num_units: 'units',
          num_floors: 'floors',
          is_vip_active: 'is_vip'
        });
        if (parameters) {
          model.url = model.url + parameters;
        }
        var modelAddress = model.address
          , modelAddrFull = model.addr_full
          , modelImages = model.images
          , matchNull = new RegExp('(null)', 'i')
          ;
        if (matchNull.test(modelAddress)) {
          model.address = null;
        }
        if (typeof model.addr_full !== 'undefined') {
          model.addr_full = TheRedPin.Components.toTitleCase(modelAddrFull);
        }

        model.images = imagesBuilder.buildImages(modelImages);

        model.index = offset + index;
        existing = self.get(model.id);
        if (!existing) {
          self.add(model);
        } else {
          existing.set(model);
        }
      });
      self.trigger('processed');
    },

    propertiesStatusCounts: function (listings) {
      var counts = _.countBy(listings, function (listing) {
        return listing[9] === true ? 'public' : 'private';
      });
      if (typeof counts.public === 'undefined') { counts.public = 0; }
      return counts;
    }
  });


  // initialize collections
  Hybrid.mapCollection = new MapCollection();
  Hybrid.panelResultsCollection = new PanelCollection();
  Hybrid.panelSelectedCollection = new PanelCollection();


  // main hybrid view
  var HybridView = Backbone.View.extend({
    el: '#hybrid',
    mapView: null,
    panelView: null,
    events: {},
    appState: {},


    initialize: function () {
      var self = this;

      //ensure all published events are handled within the controller
      var controllerEvents = [
        'main.window_size_changed'
        , 'map.bounds_changed'
        , 'hybrid.view_filters_changed'
        , 'hybrid.search_filters_changed'
        , 'map.marker_selected'
        , 'map.marker_deselected'
        , 'map.initialized'
        , 'panel.map_toggle'
        , 'map.idle'
        , 'hybrid.expose_marker'
        , 'map.markerscalculated'
        , 'search.filter'
        , 'oauth.login-complete'
        , 'map.limiter_removed'
      ];
      for (var i = 0; i < controllerEvents.length; i++) {
        $.subscribe(controllerEvents[i], _.bind(self.controller, self));
      }

      //initialize subviews
      var parameters = this.getInitialFilterData();
      if (parameters != null) {
        Hybrid.setSearchFilters(parameters);
        Hybrid.setViewFilters(parameters);
      }
      self.panelView = new HybridPanelView();
      if (Hybrid.filters.listview) {
        self.appState.initWithoutMap = true;
        self.panelView.toggleFullScreen();
        self.zoomLevel = 'street';
        self.forceFilterBounds();
        self.panelView.startData();
        self.resize();
      } else {
        self.panelView.startData();
        self.loadMap();
        self.resize();
      }

      this.controller($.Event('init'));
    },

    /*
    controller

    Function that responds to various map and hybrid events, setting application state variables
    and responding to action requests based on that state

    Current app state variables:

    appState.inited: indicates whether Hybrid view initialization is complete
    appState.mapVolatile: flags that the map is undergoing dragging or animation
    appState.mapInit: flags if map is undergoing initialization, and may not yet reflect init bounds
    appState.mapJustInited: flags that the map has just been initialized with correct bounds
    appState.searchFilter: flags that a request has been made by a user search that is not fulfilled
    appState.waitingForMarkers: flags that the map has made a marker request which is still pending
    appState.initWithoutMap: indicates the map should not be loaded on init; listview only
    appState.panelInited: indicates the panel view has at least initiated a fetch on its collection
    appState.pendingMarker: holds data for a marker activation event until the map is ready

    Arguments:
    [Object] e: the event object
    [variable] data: data delivered with the event; can be of any type, specific to event type
    */
    //this switch statement generates a maxstatements error in jshint
    /* jshint maxstatements: 100 */
    controller: function (e, data) {
      var self = this;
      var request = e.type + (e.namespace ? '.' + e.namespace : '');

      switch (request) {
        case 'init':
          self.appState.inited = true;
          if (self.mapView) {
            self.mapView.refresh();
          } else {
            self.panelRefresh();
          }
          break;
        case 'main.window_size_changed':
          self.delayedResize(e, data);
          break;
        case 'map.bounds_changed':
          self.appState.mapVolatile = true;
          self.boundsChanged(e, data);
          break;
        case 'map.limiter_removed':
          self.removeLimiter();
          self.mapView.refreshData();
          /* falls through */
        case 'hybrid.search_filters_changed':
          if (self.appState.inited) {
            if (self.mapView) {
              self.mapView.refreshMap();
            } else {
              //must transfer bound_to to bounds for appropriate call if map is not doing it
              if (Hybrid.filters.bound_to) {
                Hybrid.filters.bounds = Hybrid.filters.bound_to;
              }
            }
            self.panelRefresh();
          }
          break;
        case 'map.idle':
          self.appState.mapVolatile = false;
          if (self.appState.mapInit) {
            //must see if map is inited with appropriate data; if not, break
            if (Hybrid.filters.bounds === data.bounds.join(',')) {
              self.appState.mapInit = false;
              self.appState.mapJustInited = true;
            } else {
              break;
            }
            if (hybridAction == 'matches') {
              self.mapView.map.backToHybrid();
            }
          }
          /* falls through */
        case 'hybrid.view_filters_changed':
          if (self.appState.inited && self.mapView) {
            self.mapView.refreshMap();
            if (!self.appState.mapVolatile && !self.appState.mapInit) {
              if (self.appState.searchFilter || self.appState.mapJustInited) {
                var zoom = self.mapView.map.map.zoom;
                TheRedPin.Storage.set('last-search-zoom', zoom);
              }
              self.appState.waitingForMarkers = true;
              if (Hybrid.limiterPolygon) {
                self.mapView.setLimiterPolygon(Hybrid.limiterPolygon, Hybrid.limiterBounds);
                delete Hybrid.limiterPolygon;
                delete Hybrid.limiterBounds;
              } else {
                if (data) {
                  self.mapView.testLimiterPolygon(data);
                }
              }
              self.mapView.refreshData();
              if (self.appState.initWithoutMap) {
                if (!self.appState.panelInited) {
                  self.panelRefresh();
                }
              } else {
                if (self.appState.mapJustInited) {
                  self.panelRefresh();
                } else {
                  if (!self.appState.searchFilter) {
                    self.delayedPanelRefresh();
                  }
                }
              }
              self.appState.initWithoutMap = false;
              self.appState.mapJustInited = false;
              self.appState.searchFilter = false;
            } else {
              self.clearPanelRefresh();
            }
          }
          break;
        case 'hybrid.expose_marker':
          if (self.mapView && !self.appState.waitingForMarkers) {
            self.mapView.map.exposeMarkerById(data.id);
          } else {
            self.appState.pendingMarker = {
              e: e,
              data: data
            };
          }
          break;
        case 'map.marker_selected':
          self.select(e, data);
          break;
        case 'map.marker_deselected':
          self.deselect(e, data);
          break;
        case 'map.initialized':
          self.appState.mapVolatile = true;
          self.appState.mapInit = true;
          Hybrid.mapIsInited = true;
          break;
        case 'panel.map_toggle':
          if (self.appState.inited && !self.mapView) {
            self.loadMap();
          }
          break;
        case 'map.markerscalculated':
          self.appState.waitingForMarkers = false;
          if (self.appState.pendingMarker) {
            self.controller(self.appState.pendingMarker.e, self.appState.pendingMarker.data);
            self.appState.pendingMarker = null;
          }
          break;
        case 'search.filter':
          self.appState.searchFilter = true;
          if (typeof data.poly_id === 'undefined' && typeof data.poly_bounds === 'undefined') {
            TheRedPin.Hybrid.view.removeLimiter();
            Hybrid.view.mapView.map.removeLimiterPolygon();
          }
          $.publish('hybrid.view_filters_changed');
          $.publish('hybrid.search_filters_changed');
          break;
        case 'oauth.login-complete':
          /* falls through */
        case 'in-page-login':
          /* falls through */
        case 'in-page-logout':
          if (self.mapView) {
            Hybrid.view.mapView.map.removeMarkers();
            Hybrid.setViewFilters(Hybrid.filters);
          } else {
            Hybrid.setSearchFilters(Hybrid.filters);
          }
      }
    },

    /*
    panelRefresh Debounce methods

    Refreshes the panel with listings, either immediately (via panelRefresh) or with a delay
    (via delayedPanelRefresh). Not set up as a straight debounce in order to allow clearing a pending
    refresh without triggering a refresh.

    Takes no arguments
    */
    panelRefresh: function () {
      this.panelView.refresh();
      Hybrid.updateURL();
    },
    panelTimeout: null,
    clearPanelRefresh: function () {
      window.clearTimeout(this.panelTimeout);
    },
    delayedPanelRefresh: function () {
      this.clearPanelRefresh();
      this.panelTimeout = window.setTimeout(_.bind(this.panelRefresh, this), TheRedPin.time.slow);
    },

    /*
    delayedResize

    debounce wrapper for view resize function

    Arguments:
    [Object] e: the event object
    [variable] data: window size object as defined in main.js:updateScreenSize
    */
    delayedResize: _.debounce(function (e, data) {
      this.resize(e, data);
    }, TheRedPin.time.slow),

    /*
    forceFilterBounds

    Ensures search filters contain a 'bounds' value when not provided by the map, either using
    existing bounds in the search, calculating average screen size bounds from a provided centre
    and zoom, or from a default bounding of bloor/yonge

    Takes no arguments
    */
    //constant is width at zoom 18 on 1280 width monitor
    //height is 2/3 of this value; possibly only accurate at Toronto's latitude
    forceFilterConstant: 0.002553463,
    forceFilterBounds: function () {
      if (Hybrid.filters.bounds) {
        return;
      } else if (Hybrid.filters.bound_to) {
        Hybrid.filters.bounds = Hybrid.filters.bound_to;
      } else if (Hybrid.filters.center) {
        var zoom = 16;
        if (Hybrid.filters.zoom_level) {
          zoom = parseInt(Hybrid.filters.zoom_level);
        }
        var radius = (this.forceFilterConstant * Math.pow(2, 18 - zoom)) / 2;
        var center = Hybrid.filters.center.split(',');
        Hybrid.filters.bounds = [
          parseFloat(center[0]) - (2 / 3) * radius,
          parseFloat(center[1]) - radius,
          parseFloat(center[0]) + (2 / 3) * radius,
          parseFloat(center[1]) + radius
        ].join(',');
      } else {
        //TD|SA: using default square centred on bloor/yonge; will need to geolocate user
        //or use geocoded location as basis for non-TO markets
        Hybrid.filters.bounds =
          '43.66699746729978,-79.3916732069153,43.67345415905165,-79.38184559308473';
      }
    },

    /*
    removeLimiter

    Cleans up limiter polygon from search filters, and removes Hybrid scope polygon info

    Takes no arguments
    */
    removeLimiter: function () {
      delete Hybrid.limiterPolygon;
      delete Hybrid.filters.poly_id;
      delete Hybrid.filters.poly_bounds;
    },

    /*
    loadMap

    Loads map related javascript and initializes map view

    Takes no arguments
    */
    loadMap: function () {
      var self = this;
      require([ 'map' ], function (rMap) {
        self.mapView = new HybridMapView();
      });
    },

    /*
    getInitialFilterData

    Obtains initialization parameters from a priority source, and loads limiter polygon data
    if a poly_id is specified, but no polygon data is available. First priority for filters comes
    from query string parameters, and if relevant parameters are absent or if the parameters
    indicate a legacy URL was accessed, filters passed from the PHP layer via the DOM are used,
    which are populated in the event of an SEO style URL by the controller.

    Takes no arguments
    */
    getInitialFilterData: function () {
      var parameters = {};
      var windowParameters = {};
      if (window.location.hash) {
        windowParameters = TheRedPin.helpers.queryParameters(window.location.hash.substring(1));
        // in case a user with nice browser got the link from another user with old browser!
        if (_.isFunction(window.history.replaceState)) {
          window.location.hash = '';
        }
      } else if (window.location.search) {
        windowParameters = TheRedPin.helpers.queryParameters(window.location.search.substring(1));
      }
      //parameters may be added that are not relevant enough to override SEO filters
      var testParameters = _.clone(windowParameters);
      delete testParameters.listview;
      delete testParameters.order_by;

      if (($.isEmptyObject(testParameters) || testParameters.legacy) && $('#hybrid[data-filters]').length > 0) {
        parameters = $('#hybrid').data('filters');
        _.extend(parameters, windowParameters);
        this.appState.initWithoutMap = true;
      } else {
        parameters = windowParameters;
        window.initListingData = null;
      }

      if (parameters != null) {
        parameters.order_by = parameters.order_by ? parameters.order_by :
          (layer == 'properties') ? 'dom,asc' : 'price,asc';
      }
      if (parameters.poly_id && !parameters.poly) {
        var polygonCheck = new PolygonCheckByID();
        polygonCheck.set('id', parameters.poly_id);
        polygonCheck.fetch({
          success: function (model, response) {
            if (response.result !== null) {
              Hybrid.limiterPolygon = response.result.polygon;
              Hybrid.limiterBounds = [
                response.result.coords.x2
                , response.result.coords.y2
                , response.result.coords.x1
                , response.result.coords.y1
              ];
              $.publish('hybrid.search_filters_changed');
            } else {
              //a possible race condition
              delete parameters.poly_id;
              delete Hybrid.filters.poly_id;
            }
          },
          error: function (model, response) {
            //a possible race condition
            delete parameters.poly_id;
            delete Hybrid.filters.poly_id;
          }
        });
      } else if (parameters.poly_bounds) {
        Hybrid.limiterPolygon = Hybrid.buildPolyBounds(parameters.poly_bounds);
        $.publish('hybrid.search_filters_changed');
      }
      return parameters;
    },

    /*
    boundsChanged

    Stores new bounds info from the map by calling setViewFilters with mildly cleansed data
    from the map instance

    Arguments:
    [Object] event: the event object
    [Object] data: bounds information as delivered by map:boundsReport
    */
    boundsChanged: function (event, data) {
      var self = this;
      if (data) {
        // figure out the zoom level
        self.zoomLevel = self.getZoomLevel(data.zoom);
        Hybrid.setViewFilters({
          bounds: data.bounds.join(','),
          center: data.center.join(','),
          zoom_level: data.zoom
        });
      }

      $.publish('hybrid.boundschanged');
    },

    /*
    getZoomLevel

    returns the level (e.g. hood, city) for a given zoom value

    Arguments:
    [int] zoomInt: the zoom value to analyze
    */
    getZoomLevel: function (zoomInt) {
      var zoomReturn = null;
      $.each(zoomLevels, function (zoomLevel, zoom) {
        if (zoomInt > zoom) {
          zoomReturn = zoomLevel;
          return false;
        }
      });
      return zoomReturn;
    },

    /*
    select

    handles marker selection from map interaction; passes id(s) from marker (or cluster)
    to panel view in order to populate the selection panel

    Arguments:
    [Object] event: the event object
    [Object] data: marker from map:selectMarker
    */
    select: function (event, data) {
      this.panelView.select(data.ids);
    },

    /*
    deselect

    handles marker deselection from map interaction; informs panel view that the selection
    panel can be cleared

    Arguments:
    [Object] event: the event object
    [Object] data: marker from map:selectMarker
    */
    deselect: function (event, data) {
      this.panelView.deselect();
    },

    /*
    resize

    handles rearrangement of subviews on a window size change

    Takes no arguments
    */
    resize: function () {
      var self = this
        , screenWidth  = TheRedPin.environment.screen.width
        , screenHeight = TheRedPin.environment.screen.height
        , height = screenHeight - $('#header').height()
        ;

      if (screenWidth > screenHeight) {
        self.$el.removeClass('portrait').addClass('landscape');
        self.panelView.orientation = 'landscape';
      } else {
        self.$el.removeClass('landscape').addClass('portrait');
        self.panelView.orientation = 'portrait';
      }
      self.$el.css({ height: height })
        .delay(TheRedPin.time.medium)
        .queue(function (next) {
          if (self.mapView) {
            self.mapView.resize();
          }
          self.panelView.resize();
          next();
        });
    }


  });



  // hybrid panel view
  var HybridPanelView = Backbone.View.extend({
    el: '#panel',
    $resultsList: $('#results-list-container'),
    $selectedList: $('#selected-list-container'),
    $panelInformation: $('#panel-information'),
    resultsCollection: Hybrid.panelResultsCollection,
    selectedCollection: Hybrid.panelSelectedCollection,
    resultsGridList: null,
    selectedGridList: null,
    scrollTimeOut: null,

    events: {
      'click .map-toggle-button': 'toggleListView',
      'click #close-selected-list-button': 'closeSelectedList',
      'click span.map-marker': 'exposeMarker'
    },

    initialize: function () {
      var self = this;

      $('body').css({ overflow: 'hidden' });

      // initialize sort selector
      $('#sort-select').selectize({
        readOnly: true,
        onDelete: function () {
          return false;
        },
        onChange: function (value) {
          Hybrid.filters.order_by = value;
          Hybrid.updateURL();
          self.refresh();
        },
        render: {
          item: function (data, escape) {
            return TheRedPin.template(
              'selectize-item-template',
              { graphics: 'green icon icon-sort',
                contents: data.text,
                classes: ''
              }
            );
          }
        }
      });
      if (Hybrid.filters.order_by) {
        $('#sort-select')[ 0 ].selectize.setValue(Hybrid.filters.order_by);
      }

      // toggle button is on map, for small screens
      $.subscribe('map.toggled', _.bind(self.toggleListView, self));

      //this displays the location brief, which is delivered from the PHP layer for SEO URLs
      //TD|SA: location brief temporarily disabled: remove 'false &&' to activate
      if (false && $('.location-brief').length > 0) {
        setTimeout(function () {
          var ele = $('.location-brief img').get(0);
          var onLoad = function () {
            if (ele && ele.complete) {
              if (typeof ele.naturalWidth !== 'undefined' && ele.naturalWidth === 0) {
                $('.location-brief').addClass('no-image');
              }
              window.clearInterval(monitor);
              return true;
            }
            return false;
          };
          if (!onLoad()) {
            var monitor = setInterval(onLoad, 100);
          }
          $('#selected-list-container')
            .html($('.location-brief'))
            .addClass('location-brief-display');
          self.select();
        }, TheRedPin.time.slow);
      }
    },

    /*
    startData

    Delays the initialization of the GridListView until the panel is ready; since the GridListView
    is semi-autonomous and will attempt to update its own collection (due to pagination, which
    is based on displayed area), this is not inited until the panel's final size is set, in order
    to avoid redundant calls

    Takes no arguments
    */
    startData: function () {
      var self = this;
      //init GridList subviews
      self.resultsGridList = new GridListView({
        collection: self.resultsCollection,
        el: self.$resultsList,
        layer: layer
      });
      self.resultsGridList.bind('list.updated', self.resultsUpdated, this);
    },

    toggleListView: function () {
      var searchBounds;
      var queryString = window.location.search;
      if (Hybrid.filters.poly_id) {
        var polyType = Hybrid.filters.poly_id.split(',')[1];
        var polyId = Hybrid.filters.poly_id.split(',')[0];
        var polySearch = polyType + '=' + polyId;
        queryString += '&' + polySearch;
      }
      if (Hybrid.filters.poly_bounds) {
        searchBounds = Hybrid.filters.poly_bounds;
      } else {
        searchBounds = Hybrid.filters.bounds;
      }
      queryString += '&bounds=' + searchBounds;
      var route = layer === 'projects' ? '/new-preconstruction/' : '/mls-listings/';
      window.location.href = window.location.origin + route + queryString;
    },
    /*
    toggleFullScreen

    Switches between displaying only listings, and displaying listings plus the map

    Arguments:
    [Object] event: the event object
    [function] callback: callback to execute at the termination of the toggle animation
    */
    toggleFullScreen: function (event, callback) {
      $.publish('panel.map_toggle');
      var self = this;
      self.$el
        .toggleClass('full-screen')
        .delay(TheRedPin.time.slow)
        .queue(function (next) {
          self.resize();
          if ($(this).is('.full-screen')) {
            self.$el.find('.map-toggle-button')
              .html(TheRedPin.template('icon-template', { classes: 'icon-globe' }) +
                ' <span class="hide-for-small-only">Show </span>Map');
            Hybrid.filters.listview = 'true';
          } else {
            self.$el.find('.map-toggle-button')
              .html(TheRedPin.template('icon-template', { classes: 'icon-globe' }) +
                ' <span class="hide-for-small-only">Hide </span>Map');
            delete Hybrid.filters.listview;
          }
          Hybrid.updateURL();
          if (_.isFunction(callback)) { callback(); }
          next();
        });
    },

    /*
    resize

    Handles resizing of subviews based on the resizing of the panel, called either from a window
    resize or from toggleFullScreen

    Takes no arguments
    */
    resize: function () {
      if (this.resultsGridList) {
        this.resultsGridList.resize();
      }
      if (this.selectedGridList) {
        this.selectedGridList.resize();
      }
      this.$el.addClass('initialized');
    },

    /*
    refresh

    Responsible for handling requests for data updates, including maintaining application
    state

    Takes no arguments
    */
    refresh: function () {
      var self = this;
      this.refreshResultsList();
      if (self.$el.hasClass('has-selected')) {
        setTimeout(function () {self.select(null, true);}, 2000);
      }
    },

    /*
    refreshResultsList

    Responsible for resetting and updating updating data

    Takes no arguments
    */
    refreshResultsList: function () {
      var self = this;
      if (self.resultsGridList) {
        self.resultsCollection.reset();
        self.resultsCollection.totalCount = null;
        self.resultsGridList.refresh();
      }
    },

    /*
    select

    Shows the selection overlay, and updates data either by passed IDs, or from the existing
    ID list if the list is being refreshed from an authentication event instead of a selection

    Arguments:
    [int Array] ids: the ids to display
    [boolean] refresh: flag to use existing selection data instead of passed ID array
    */
    select: function (ids, refresh) {
      if (refresh) {
        ids = [];
        _.each(this.selectedCollection.models, function (model) {
          ids.push(model.get('id'));
        });
      }
      var self = this;
      self.selected = true;
      self.$el
        .addClass('has-selected')
        .css({
          'min-width': TheRedPin.environment.screen.width * 0.38,
          'min-height': TheRedPin.environment.screen.height * 0.70
        })
        ;
      // show the selected list
      self.$selectedList.addClass('in');
      // reset & fetch selected ids
      if (ids) {
        if (!self.selectedGridList) {
          $('#selected-list-container').removeClass('location-brief-display');
          $('.location-brief').remove();
          self.selectedGridList = new GridListView({
            collection: self.selectedCollection,
            el: self.$selectedList,
            layer: layer
          });
        }
        self.selectedCollection.reset();
        self.selectedGridList.clear();
        self.selectedCollection.fetch({ ids: ids.join(',') });
      }
    },

    /*
    deselect

    Hides the selection overlay, and clears the selected collection and GridListView

    Takes no arguments
    */
    deselect: function () {
      var self = this;
      self.selected = false;
      self.$el
        .removeClass('has-selected')
        .removeAttr('style')
        ;
      // hide the selected list
      self.$selectedList
        .removeClass('in')
        .delay(TheRedPin.time.medium)
        .queue(function (next) {
          if (!self.selected) {
            if (self.selectedGridList) {
              self.selectedGridList.clear();
              self.selectedCollection.reset();
            }
          }
          next();
        });
    },

    /*
    closeSelectedList

    Handles the closure of the selection panel by the user

    Arguments:
    [Object] event: the event object
    */
    closeSelectedList: function (event) {
      this.deselect();
      $.publish('hybrid.deselect_marker');
    },

    /*
    exposeMarker

    Handles user interaction with the 'Map' button for a particular property card

    Arguments:
    [Object] event: the event object
    */
    exposeMarker: function (event) {
      event.preventDefault();
      var self = this
        , $listItem = $(event.target).closest('.list-item')
        , id = $listItem.data('id')
        ;
      if (self.$el.is('.full-screen')) {
        var index = $listItem.data('index');
        self.toggleFullScreen(null, function () {
          self.resultsGridList.scrollToListItem(index);
          $.publish('hybrid.expose_marker', { id: id });
        });
      } else {
        $.publish('hybrid.expose_marker', { id: id });
      }
    },

    /*
    resultsUpdated

    Responsible for panel view specific presentation considerations (e.g. paging and match
    indicator) given an update to the GridListView contained results

    Arguments:
    [Object] pagingState: an object indicating the GridListView paging state as defined in
                          GridListView:updateList
    */
    resultsUpdated: function (pagingState) {
      var self = this
        , information = ''
        ;

      if (Hybrid.view) {
        if (Hybrid.view.zoomLevel == 'street' || hybridAction == 'matches') {
          self.$resultsList.removeClass('no-map');
        } else {
          self.$resultsList.addClass('no-map');
        }
      }

      // update information bar
      if (self.resultsCollection.totalCount) {
        if (TheRedPin.environment.screen.size == 'large' || self.$el.is('.full-screen')) {
          information += (pagingState.index + 1);
          if (pagingState.itemsPerPage > 1) {
            information += ' - ' + Math.min(
                pagingState.index + pagingState.itemsPerPage, self.resultsCollection.totalCount
              );
          }
          information += ' of ';
        }
        information += self.resultsCollection.totalCount;

      }
      self.$panelInformation.html(information + '<span class="visible-for-medium-up"> Matches</span>');
    }

  });


  // hybrid map view
  var HybridMapView = Backbone.View.extend({
    el: '#map',
    map: null,
    events: {},
    collection: Hybrid.mapCollection,
    zoomLevel: null,
    // using rounded bounds for city & hood levels
    virtualBounds: null,


    initialize: function () {
      var self = this
        , mapOptions = {
          container: self.$el.find('.map-container').get(0),
          customControls: {
            zoomControl: true,
            locateControl: true,
            statusBar: true
          }
        }
        ;
      self.geolocatingUser = false;

      if (Hybrid.filters.zoom_level) {
        mapOptions.zoom = parseInt(Hybrid.filters.zoom_level);
      }
      if (Hybrid.filters.center) {
        var center = Hybrid.filters.center.split(',');
        mapOptions.lat = parseFloat(center[ 0 ]);
        mapOptions.lng = parseFloat(center[ 1 ]);
      } else if (Hybrid.filters.bound_to) {
        var bounds = Hybrid.filters.bound_to.split(',');
        mapOptions.lat = parseFloat((parseFloat(bounds[0]) + parseFloat(bounds[2])) / 2);
        mapOptions.lng = parseFloat((parseFloat(bounds[1]) + parseFloat(bounds[3])) / 2);
      } else if (TheRedPin.Storage.get('last-search-lat') && TheRedPin.Storage.get('last-search-lng')) {
        mapOptions.lat = TheRedPin.Storage.get('last-search-lat');
        mapOptions.lng = TheRedPin.Storage.get('last-search-lng');
        var storedZoom = parseInt(TheRedPin.Storage.get('last-search-zoom'));
        if (storedZoom == TheRedPin.Storage.get('last-search-zoom')) {
          mapOptions.zoom = storedZoom;
        }
      } else if (TheRedPin.Storage.get('lat') && TheRedPin.Storage.get('lng')) {
        mapOptions.lat = TheRedPin.Storage.get('lat');
        mapOptions.lng = TheRedPin.Storage.get('lng');
      } else {
        // self.geolocatingUser = true;
      }

      // event bindings
      self.collection.bind('processed', self.update, self);

      $.subscribeOnce('map.initialized', function (e, map) {
        // get the map's status bar container and hold on to it
        self.$statusBar = $(map.statusBar);
        self.$statusBar.children('#map-filter-button').on('click', function () {
          TheRedPin.Components.revealTemplate({
            template: 'search-modal-template',
            id: 'search-modal',
            classes: 'search small no-padding'
          });
        });
      });
      $.subscribe('hybrid.deselect_marker', _.bind(self.deselectMarker, self));

      // create map
      if (self.geolocatingUser === true) {
        $.when(self.geolocateUserOnMap()).then(function (result) {
          $.publish('hybrid.geolocated');
          mapOptions.lat = TheRedPin.Storage.get('lat');
          mapOptions.lng = TheRedPin.Storage.get('lng');
          Hybrid.updateURL();
          self.map = new TheRedPin.Map(mapOptions);
        });
      } else {
        $.publish('hybrid.geolocated');
        Hybrid.updateURL();
        self.map = new TheRedPin.Map(mapOptions);
      }

      if (!Hybrid.filters.bounds && !Hybrid.filters.center && !Hybrid.filters.bound_to && hybridAction == 'matches') {
        // generate bounds
        $.subscribeOnce('hybrid.markers-processed', function (e, markersResult) {
          var bounds = self.generateBounds(markersResult);
          if (bounds) {
            self.map.fitBounds(bounds);
          }
        });
      }
    },

    generateBounds: function (markers) {
      var self = this;
      var latCoords = []
        , lngCoords = []
        ;

      if (markers.listings) {
        _.each(markers.listings, function (listing, index) {
          latCoords.push(listing[1]);
          lngCoords.push(listing[2]);
        });
      }

      if (markers.clusters) {
        _.each(markers.clusters, function (cluster, index) {
          if (cluster[3].length > 0) {
            _.each(cluster[3], function (listing, index) {
              latCoords.push(listing[1]);
              lngCoords.push(listing[2]);
            });
          } else {
            latCoords.push(cluster[1]);
            lngCoords.push(cluster[2]);
          }
        });
      }

      if (latCoords.length > 0 && lngCoords.length > 0) {
        var coordNW =  { lat: _.min(latCoords), lng: _.max(lngCoords) };
        var coordSE = { lat: _.max(latCoords), lng: _.min(lngCoords) };
        return coordSE.lat + ',' + coordSE.lng + ',' + coordNW.lat + ',' + coordNW.lng;
      } else {
        return null;
      }
    },

    geolocateUserOnMap: function () {
      var self = this;
      var deferred = new $.Deferred();

      window.navigator.geolocation.getCurrentPosition(success, error);
      return deferred;

      function success (position) {
        TheRedPin.Storage.set('lat', position.coords.latitude);
        TheRedPin.Storage.set('lng', position.coords.longitude);
        deferred.resolve();
      }

      function error (err) {
        deferred.resolve();
      }
    },

    resize: function () {
      if (this.map) {
        this.map.refresh();
      }
    },


    refreshMap: function () {
      var self = this
        , zoomLevel = Hybrid.view.zoomLevel
        ;

      if (Hybrid.filters.bound_to) {
        self.map.fitBounds(Hybrid.filters.bound_to);
        delete Hybrid.filters.bound_to;
      } else if (Hybrid.filters.center_to) {
        self.map.setLocation(Hybrid.filters.center_to, true);
        delete Hybrid.filters.center_to;
      }

      // if zoom level has changed
      if (zoomLevel != self.zoomLevel) {
        self.map.removePolygons();
        self.map.removeMarkers();
        self.zoomLevel = zoomLevel;
      }
    },

    setLimiterPolygon: function (polygon, bounds) {
      if (typeof polygon === 'string') {
        polygon = JSON.parse(polygon);
      }
      this.map.setLimiterPolygon(polygon);
      this.limiterBounds = bounds;
    },

    testLimiterPolygon: function (data) {
      var self = this;
      //assuming 1 limiter polygon for now
      if (this.limiterBounds) {
        var mapBounds = [];
        for (var i = 0; i < data.bounds.length; i++) {
          mapBounds[i] = parseFloat(data.bounds[i]);
        }
        if (!(mapBounds[1] < this.limiterBounds[3]
          && mapBounds[3] > this.limiterBounds[1]
          && mapBounds[2] > this.limiterBounds[0]
          && mapBounds[0] < this.limiterBounds[2])) {
          delete this.limiterBounds;
          this.map.removeLimiterPolygon();
        }
      }
    },

    refreshData: function () {
      this.collection.reset();
      this.collection.fetch();
      this.updateStatusBar();
    },

    update: function () {
      var self = this
        , zoomLevel = Hybrid.view.zoomLevel
        , data = self.collection.map(function (model) {
          model = model.toJSON();
          if (zoomLevel == 'street' || hybridAction == 'matches' || Hybrid.limiterIsPolyBounds) {
            return {
              ids: model.id ? [ model.id ] : _.pluck(model.data, 'id'),
              lat: model.lat,
              lng: model.lng,
              type: model.id ? model.type : 'cluster',
              labelContent: model.label,
              classes: model.classes
            };
          } else {
            return {
              id: model.id,
              lat: model.lat,
              lng: model.lng,
              type: 'area',
              labelContent: model.label,
              paths: model.polygon
            };
          }
        })
        ;
      self.map.aggregate(data);
    },


    updateStatusBar: function () {
      var self = this
        ;
      if (self.$statusBar) {
        self.$statusBar.children('#map-filter-information').html('');
      }
    },


    deselectMarker: function (event, data) {
      this.map.deselectAllMarkers();
    }


  });




  // initialize main hybrid view, which would also initialize map & panel sub-views
  Hybrid.view = new HybridView();




  return Hybrid;




});
