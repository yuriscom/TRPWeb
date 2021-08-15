define('map', ['main', 'vendor'], function () {


  console.log('Map Module Started');


  var TheRedPin = window.TheRedPin
    , screenSize = TheRedPin.environment.screen.size
    , defaults = {
      address: (screenSize == 'small')
        ? 'Yonge Street and Bloor Street, Toronto, Ontario'
        : 'Yonge Street and Bloor Street, Toronto, Ontario'
      //  : 'Church Street and Front Street East, Toronto, Ontario'
      ,
      markers: {
        // these should be overridden by initializer, and later options
        theredpin: { // TheRedPin marker
          position: null,
          map: null,
          flat: true,
          animation: 'drop',
          title: null,
          width: 20,
          height: 26,
          icon: TheRedPin.helpers.cacheBust('/assets/graphics/marker-theredpin.png')
        },
        house: { // properties, house & building
          disposable: true,
          selectable: true,
          animatable: true,
          position: null,
          map: null,
          flat: true,
          animation: 'drop',
          template: 'marker-template',
          labelContent: '',
          labelClass: 'marker house',
          labelAnchorX: 13,
          labelAnchorY: 39,
          width: 1,
          height: 1,
          icon: TheRedPin.helpers.cacheBust('/assets/graphics/marker-blank.png')
        },
        building: { // projects, mostly buildings
          disposable: true,
          selectable: true,
          animatable: true,
          position: null,
          map: null,
          flat: true,
          animation: 'drop',
          template: 'marker-template',
          labelContent: '',
          labelClass: 'marker building',
          labelAnchorX: 13,
          labelAnchorY: 39,
          width: 1,
          height: 1,
          icon: TheRedPin.helpers.cacheBust('/assets/graphics/marker-blank.png')
        },
        cluster: { // clusters of properties or projects at street zoom level
          disposable: true,
          selectable: true,
          position: null,
          map: null,
          flat: true,
          animation: 'drop',
          template: 'cluster-template',
          labelContent: '',
          labelClass: 'marker cluster',
          // changed these to make animations look nicer
          labelAnchorX: 13,
          labelAnchorY: 35,
          width: 1,
          height: 1,
          icon: TheRedPin.helpers.cacheBust('/assets/graphics/marker-blank.png')
        },
        area: { // clusters for city or hood zoom levels
          disposable: false,
          zoomable: true,
          position: null,
          map: null,
          flat: true,
          animation: 'drop',
          template: 'cluster-template',
          labelContent: '',
          labelClass: 'marker area',
          labelAnchorX: 18,
          labelAnchorY: 18,
          width: 1,
          height: 1,
          icon: TheRedPin.helpers.cacheBust('/assets/graphics/marker-blank.png')
        }

      },
      street_view_options: {
        panControl: false,
        zoomControl: false,
        scrollwheel: false,
        linksControl: false,
        addressControl: false
      },
      polygons: {
        area: {
          paths: null,
          strokeColor: '#17314f',
          strokeOpacity: 0.5,
          strokeWeight: 1,
          fillColor: '#17314f',
          fillOpacity: 0.05,
          zIndex: 0
        },
        resultLimit: {
          paths: null,
          strokeColor: '#da2328',
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: '#000000',
          fillOpacity: 0.15,
          zIndex: 10
        }
      },
      options: {
        zoom: (screenSize == 'small') ? 14 : 16,
        minZoom: (screenSize == 'small') ? 6 : 6,
        maxZoom: (screenSize == 'small') ? 18 : 18,
        defaultZoom: (screenSize == 'small') ? 16 : 16,
        disableDefaultUI: true,
        scrollwheel: true,
        zoomControl: false,
        panControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        customControls: {
          zoomControl: false,
          locateControl: false,
          filtersControl: false
        },
        styles: [
          // jscs: disable
          // jshint ignore: start
          {
            "featureType": "poi.school",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#ebdecd"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#b8dba0"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#a6a6a6"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#e39c7b"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#f5ebda"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#86b2e0"
              }
            ]
          },
          {
            "featureType": "transit.station.airport",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#dddfe0"
              }
            ]
          },
          {
            "featureType": "administrative.neighborhood",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#80454e"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#303030"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#525252"
              },
              {
                "weight": 0.32
              }
            ]
          },
          {
            "featureType": "administrative.neighborhood",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#c2ae90"
              },
              {
                "weight": 0.42
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#31528f"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#e3e5fa"
              },
              {
                "weight": 1.59
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#ffffff"
              },
              {
                "weight": 2.44
              }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f0eae4"
              }
            ]
          },
          {
            "featureType": "poi.medical",
            "elementType": "geometry",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#7a7674"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#3b3b3b"
              }
            ]
          },
          {
            "featureType": "poi.attraction",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.attraction",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.government",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.government",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.place_of_worship",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.sports_complex",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
          // jshint ignore: end
          // jscs: enable
        ]
      }
    }
    , geocoder = null
    , markerWithLabelLoaded = new $.Deferred()
    , markerAnimateLoaded = new $.Deferred()
    , hybridAction = $('#hybrid').data('action')
    ;


  $.when(TheRedPin.googleMapsAPILoaded).then(function () {
    // set options
    defaults.options.mapTypeId = google.maps.MapTypeId.ROADMAP;
    defaults.options.zoomControlOptions = {
      style: google.maps.ZoomControlStyle.SMALL,
      position: google.maps.ControlPosition.TOP_LEFT
    };
    // initiate a geocoder
    geocoder = new google.maps.Geocoder();
    // initiate markers
    _.each(defaults.markers, function (marker) {
      if (marker.icon) {
        var mapSize = new google.maps.Size(marker.width, marker.height)
          , icon = new google.maps.MarkerImage(marker.icon, null, null, null, mapSize);
        marker.icon = icon;
      }
      if (marker.animation) {
        marker.animation = google.maps.Animation[marker.animation.toUpperCase()];
      }
      if (marker.labelAnchorX && marker.labelAnchorY) {
        var anchorPoint = new google.maps.Point(marker.labelAnchorX, marker.labelAnchorY);
        marker.labelAnchor = anchorPoint;
      }
      if (marker.template) {
        marker.template = _.template(_.string.trim($('#' + marker.template).html()));
      }
    });
    // require & resolve markers with labels
    require(['google-maps-marker-with-label'], function () {
      markerWithLabelLoaded.resolve();
    });
    // require & resolve marker animate library
    require(['google-maps-marker-animate'], function () {
      markerAnimateLoaded.resolve();
    });
  });


  // returns deferred object
  function geocode(address) {
    var deferred = new $.Deferred();
    geocoder.geocode({
      address: address + ', Ontario, Canada'
    }, function (results, status) {
      deferred.resolve(results);
    });
    return deferred;
  }


  // Map class
  var Map = TheRedPin.Map = function (options) {
    this.initialize(options);
  }
    , Maps = Map.prototype;


  Maps.initialize = function (options) {
    var self = this
      , initialOptions = options
      , container
      , statusBar
      ;

    // instance variables
    self.mapCreated = new $.Deferred();
    self.zoom = defaults.options.zoom;
    self.bounds = null;
    self.center = null;

    if (options.container) {
      container = $(options.container).get(0);
    } else {
      container = $('#map').get(0);
    }

    if (!container) {
      throw 'No container element for map';
    }

    $.when(TheRedPin.googleMapsAPILoaded).then(function () {

      var finalOptions = $.extend(true, {}, defaults.options, initialOptions)
        , googleMap = new google.maps.Map(container, finalOptions)
        ;

      // the show / hide map toggle button for small screens only
      var $toggleControl = $(TheRedPin.template('map-toggle-control-template')).on('click', 'a', function (event) {
        $.publish('map.toggled');
      });
      googleMap.controls[google.maps.ControlPosition.TOP_RIGHT].push($toggleControl.get(0));
      if (hybridAction == 'matches') {
        $toggleControl.addClass('matches-control');
      }

      // custom controls
      if (finalOptions.customControls.statusBar && hybridAction != 'matches') {
        var $statusBar = $(TheRedPin.template('map-status-bar-template'));
        self.statusBar = $statusBar.get(0);
        googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(self.statusBar);
      }

      if (finalOptions.customControls.zoomControl) {
        var $zoomControls = $(TheRedPin.template('map-zoom-control-template')).on('click', 'a', function (event) {
          if ($(this).is('#map-zoom-in-button')) {
            self.zoomIn();
          } else if ($(this).is('#map-zoom-out-button')) {
            self.zoomOut();
          }
        });
        googleMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push($zoomControls.get(0));
      }

      if (finalOptions.customControls.locateControl) {
        var $locateControl = $(TheRedPin.template('map-locate-control-template'))
          .on('click', 'a', _.bind(self.detectLocation, self))
          ;
        // attach it to self, so we can control the loading spinner
        self.$locateControl = $locateControl;
        googleMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push($locateControl.get(0));
      }

      self.loadingBar();
      self.addLoadingBar(googleMap);

      var boundsReport = function (eventType) {
        var bounds = self.map.getBounds().toString()
          , center = self.map.getCenter().toString()
          ;

        bounds = bounds.replace(/[\s\(\)]/g, '');
        center = center.replace(/[\s\(\)]/g, '');
        self.bounds = bounds.split(',');
        self.center = center.split(',');
        self.zoom = self.map.getZoom();

        // self.filterBoundMarkers();
        self.deselectAllMarkers();

        $.publish('map.' + eventType, {bounds: self.bounds, zoom: self.zoom, center: self.center});
      };

      self.map = googleMap;
      self.setLocation(finalOptions);

      // add map event listeners
      google.maps.event.addListener(self.map, 'bounds_changed', function () {
        boundsReport('bounds_changed');
      });

      google.maps.event.addListener(self.map, 'idle', function (event) {
        boundsReport('idle');
      });

      google.maps.event.addListener(self.map, 'click', function (event) {
        self.deselectAllMarkers();
      });

      self.mapCreated.resolve(googleMap);
      $.publish('map.initialized', self);

    });
  };


  // create street view
  // TODO: cleanup & refactor
  Maps.createStreetView = function (options) {
    var self = this;
    if (!$(options.container).size()) {
      return;
    }
    var $container = $(options.container)
      , deferred = new $.Deferred()
      , initialOptions = _.extend({}, defaults.street_view_options, options)
      ;

    $.when(self.mapCreated).then(function () {

      var latLng = new google.maps.LatLng(parseFloat(initialOptions.lat), parseFloat(initialOptions.lng))
      // nothing needs to be overriden here, for street view
        , finalOptions = initialOptions
        , streetView = new google.maps.StreetViewService()
        , pov = {}
        , panorama
        ;

      streetView.getPanoramaByLocation(latLng, 50, function (data, status) {
        // $streetView.removeClass('loaderSmall');

        if (status == google.maps.StreetViewStatus.OK) {

          var actualLatLng = data.location.latLng;
          panorama = new google.maps.StreetViewPanorama($container.get(0), finalOptions);
          pov.zoom = 1;
          pov.pitch = 0;
          pov.heading = (Math.atan2(latLng.lat() - actualLatLng.lng(), latLng.lat() - actualLatLng.lng()) * 180) - 180;
          panorama.setPano(data.location.pano);
          panorama.setPov(pov);
          panorama.setVisible(true);

          deferred.resolve(panorama);

        } else {
          // TD|PS: This template does not exist, find out why and what it should be
          // $container.html(TheRedPin.templates.messages.street_view.unavailable);
          deferred.resolve();

        }
      });
    });
    return deferred;
  };


  Maps.detectLocation = function () {
    var self = this;
    $.when(self.mapCreated).then(function () {
      if (navigator.geolocation) {
        if (self.$locateControl) {
          self.$locateControl.addClass('loading');
        }
        navigator.geolocation.getCurrentPosition(function (position) {
            if (self.$locateControl) {
              self.$locateControl.removeClass('loading');
            }
            self.map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            self.map.setZoom(defaults.options.maxZoom);
          }, function () {
            // error
            if (self.$locateControl) {
              self.$locateControl.removeClass('loading');
            }
          },
          {
            enableHighAccuracy: true
          });
      } else {
        // no browser support
      }
    });
  };


  Maps.setLocation = function (options, zoomedIn) {
    var self = this
      , deferreds = [self.mapCreated]
      , location
      ;

    if (_.isString(options)) {
      if (options.match(/[0-9.,-]*/)) {
        // comma separated latitude & longitude
        options = options.split(',');
        location = new google.maps.LatLng(parseFloat(options[0]), parseFloat(options[1]));
      } else {
        // address
        deferreds.push(geocode(options).then(function (data) {
          location = data[0].geometry.location;
        }));
      }
    } else if (_.isObject(options) && (options.lat && options.lng)) { // latitude & longitude
      location = new google.maps.LatLng(parseFloat(options.lat), parseFloat(options.lng));
    } else { // default address
      deferreds.push(geocode(defaults.address).then(function (data) {
        location = data[0].geometry.location;
      }));
    }

    // when all the deffereds are resolved
    $.when.apply($, deferreds).then(function () {
      self.map.panTo(location);
      if (zoomedIn) {
        self.map.setZoom(defaults.options.defaultZoom);
      }
    });
  };


  Maps.getCenter = function () {
    return this.center;
  };

  Maps.getExtraZoom = function (projection, expectedBounds, actualBounds) {
    // in: LatLngBounds bounds -> out: height and width as a Point
    function getSizeInPixels(bounds) {
      var sw = projection.fromLatLngToContainerPixel(bounds.getSouthWest());
      var ne = projection.fromLatLngToContainerPixel(bounds.getNorthEast());
      return new google.maps.Point(Math.abs(sw.y - ne.y), Math.abs(sw.x - ne.x));
    }

    var expectedSize = getSizeInPixels(expectedBounds),
      actualSize = getSizeInPixels(actualBounds);

    if (Math.floor(expectedSize.x) === 0 || Math.floor(expectedSize.y) === 0) {
      return 0;
    }

    var qx = actualSize.x / expectedSize.x;
    var qy = actualSize.y / expectedSize.y;
    var min = Math.min(qx, qy);

    if (min < 1) {
      return 0;
    }

    return Math.floor(Math.log(min) / Math.LN2 /* = log2(min) */);
  };

  Maps.aggressiveFitBounds = function (myMap, bounds) {
    myMap.fitBounds(bounds); // calling fitBounds() here to center the map for the bounds
    var overlayHelper = new google.maps.OverlayView();
    overlayHelper.draw = function () {
      if (!this.ready) {
        var extraZoom = Maps.getExtraZoom(this.getProjection(), bounds, myMap.getBounds());
        if (extraZoom > 0) {
          myMap.setZoom(myMap.getZoom() + extraZoom);
        }
        this.ready = true;
        google.maps.event.trigger(this, 'ready');
      }
    };
    overlayHelper.setMap(myMap);
  };

  Maps.fitBounds = function (options) {
    var self = this
      , bounds
      ;

    if (_.isString(options)) { // comma separated bounds
      bounds = options.split(',');
      bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(parseFloat(bounds[0]), parseFloat(bounds[1])),
        new google.maps.LatLng(parseFloat(bounds[2]), parseFloat(bounds[3]))
      );
    }

    Maps.aggressiveFitBounds(self.map, bounds);
  };

  Maps.refresh = function () {
    var self = this;
    $.when(self.mapCreated).then(function () {
      // trigger resize on Google map
      google.maps.event.trigger(self.map, 'resize');
    });
  };


  Maps.getBounds = function () {
    return this.bounds;
  };


  Maps.getZoom = function () {
    return this.zoom;
  };


  Maps.setZoom = function (zoom) {
    var self = this;
    $.when(self.mapCreated).then(function () {
      self.map.setZoom(zoom);
    });
  };


  Maps.zoomIn = function () {
    var self = this;
    $.when(self.mapCreated).then(function () {
      self.map.setZoom(self.zoom + 1);
    });
  };


  Maps.zoomOut = function () {
    var self = this;
    $.when(self.mapCreated).then(function () {
      self.map.setZoom(self.zoom - 1);
    });
  };


  // remove "disposable" markers outside of view bounds
  Maps.filterBoundMarkers = function () {
    var self = this;
    $.when(self.mapCreated).then(function () {
      // remove disposable markers outside bounds
      if (self.markers) {
        self.markers = _.filter(self.markers, function (marker) {
          // TODO: use "deltas" as soon as we figure out about clustering edge cases
          if (marker.disposable && !self.map.getBounds().contains(marker.position)) {
            google.maps.event.clearInstanceListeners(marker);
            marker.setMap(null);
            return false;
          }
          return true;
        });
      }
    });
  };


  // remove all markers
  Maps.removeMarkers = function () {
    var self = this;
    $.when(self.mapCreated).then(function () {
      _.each(self.markers, function (marker) {
        google.maps.event.clearInstanceListeners(marker);
        marker.setMap(null);
      });
      self.markers = [];
    });
  };


  // remove a marker
  Maps.removeMarker = function (marker) {
    google.maps.event.clearInstanceListeners(marker);
    marker.setMap(null);
    this.markers.splice(this.markers.indexOf(marker), 1);
  };


  Maps.addMarker = function (options) {
    var self = this;

    if (!options.type) {
      throw 'No type specified for marker';
    }
    if (!self.markers) {
      self.markers = [];
    }

    var marker = defaults.markers[options.type]
      , deferred = new $.Deferred()
      , initialOptions = _.extend({}, marker, options)
      ;

    $.when.apply([TheRedPin.googleMapsAPILoaded, markerWithLabelLoaded]).then(function () {

      var position = initialOptions.position
          ? initialOptions.position
          : new google.maps.LatLng(parseFloat(initialOptions.lat), parseFloat(initialOptions.lng))
        , finalOptions = _.extend(initialOptions, {map: self.map, position: position})
        ;

      if (finalOptions.classes) {
        finalOptions.labelClass += ' ' + finalOptions.classes;
      }

      if (finalOptions.labelContent) {
        if (_.isFunction(finalOptions.template)) {
          finalOptions.labelContent = finalOptions.template({
            label: finalOptions.labelContent
          });
        }
        marker = new MarkerWithLabel(finalOptions);
      } else {
        marker = new google.maps.Marker(finalOptions);
      }

      // behaviours
      if (finalOptions.selectable) {
        google.maps.event.addListener(marker, 'click', function (event) {
          self.selectMarker(this);
        });
      }

      if (finalOptions.zoomable) {
        google.maps.event.addListener(marker, 'click', function (event) {
          self.map.setCenter(position);
          self.zoomIn();
        });
      }


      // TODO: should double click on all markers zoom into that marker?
      google.maps.event.addListener(marker, 'dblclick', function (event) {
        self.map.setCenter(position);
        self.zoomIn();
      });


      self.markers.push(marker);
      deferred.resolve(marker);
    });

    return deferred;
  };


  // for street level markers or clusters that have ids
  Maps.getMarkerById = function (id) {
    var self = this
      , result
      ;
    $.each(self.markers, function (index, marker) {
      if (_.contains(marker.ids, id)) {
        result = marker;
        return false;
      }
    });
    return result;
  };


  Maps.getMarkers = function () {
    return this.markers;
  };


  // remove a polygon
  Maps.removePolygon = function (polygon) {
    google.maps.event.clearInstanceListeners(polygon);
    polygon.setMap(null);
    this.polygons.splice(this.polygons.indexOf(polygon), 1);
  };


  Maps.addPolygon = function (options) {
    var self = this;

    if (!options.type) {
      throw 'No type specified for polygon';
    }
    if (!options.paths) {
      throw 'No paths specified for polygon';
    }
    if (!self.polygons) {
      self.polygons = [];
    }
    if (!self.limiterPolygons) {
      self.limiterPolygons = [];
    }

    var polygon = defaults.polygons[options.type]
      , deferred = new $.Deferred()
      , initialOptions = _.extend({}, polygon, options)
      ;

    $.when(TheRedPin.googleMapsAPILoaded).then(function () {

      var finalOptions = _.extend(initialOptions, {map: self.map});
      var mappedPaths = [];
      _.each(initialOptions.paths, function (path) {
        var mapped = _.map(path, function (path) {
          return new google.maps.LatLng(path.lat, path.lng);
        });
        mappedPaths.push(mapped);
      });
      finalOptions.paths = mappedPaths;

      polygon = new google.maps.Polygon(finalOptions);
      if (options.limiterPolygon) {
        self.limiterPolygons.push(polygon);
      } else {
        self.polygons.push(polygon);
      }
      deferred.resolve(polygon);
    });

    return deferred;
  };

  Maps.setLimiterPolygon = function (polygon) {
    var self = this;
    var isNewPolyStructure = false;
    if (polygon.hasOwnProperty("coordinates")) {
      // new structure of sequelize polygon
      isNewPolyStructure = true;
      polygon = polygon['coordinates'];
    }
    self.removeLimiterPolygon(null, true);
    //for now, the mask is set to approximately the size of Canada (extra padding added)
    var canadaBounds = '39,-142,84,-53';
    canadaBounds = canadaBounds.split(',');
    //Google requires gaps in a mask to be in the opposite direction to the mask
    //our polygons are sometimes clockwise, sometimes counter, so we need to change the mask
    var polyDirection = 0;

    if (isNewPolyStructure) {
      for (var i = 0; i < polygon[0].length - 1; i++) {
        // [0,1] == [lng,lat] == [x,y]
        polyDirection +=
          (parseFloat(polygon[0][i + 1][0]) - parseFloat(polygon[0][i][0])) *
          (parseFloat(polygon[0][i + 1][1]) + parseFloat(polygon[0][i][1]));
      }
    } else {
      for (var i = 0; i < polygon[0].length - 1; i++) {
        polyDirection +=
          (parseFloat(polygon[0][i + 1].x) - parseFloat(polygon[0][i].x)) *
          (parseFloat(polygon[0][i + 1].y) + parseFloat(polygon[0][i].y));
      }
    }


    var mask = [
      {lng: parseFloat(canadaBounds[1]), lat: parseFloat(canadaBounds[polyDirection > 0 ? 0 : 2])},
      {lng: parseFloat(canadaBounds[3]), lat: parseFloat(canadaBounds[polyDirection > 0 ? 0 : 2])},
      {lng: parseFloat(canadaBounds[3]), lat: parseFloat(canadaBounds[polyDirection > 0 ? 2 : 0])},
      {lng: parseFloat(canadaBounds[1]), lat: parseFloat(canadaBounds[polyDirection > 0 ? 2 : 0])}
    ];
    var model = {
      limiterPolygon: true,
      type: 'resultLimit',
      paths: [mask]
    };

    _.each(polygon, function (poly) {
      _.each(poly, function (coords) {
        if (isNewPolyStructure) {
          coords.lat = coords[1];
          coords.lng = coords[0];
          delete coords[1];
          delete coords[0];
        } else {
          coords.lat = coords.y;
          coords.lng = coords.x;
          delete coords.x;
          delete coords.y;
        }
      });
      model.paths.push(poly);
    });

    $.when(self.addPolygon(model)).then(function (polygon) {
      polygon.setMap(self.map);
      google.maps.event.addListener(polygon, 'click', _.bind(self.limiterClickHandler, self));
      var $showAll = $(TheRedPin.template('map-show-all-template'));
      self.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear();
      self.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push($showAll.get(0));
      self.addLoadingBar(self.map);
      $showAll.find('.button').on('click', _.bind(self.removeLimiterPolygon, self));
    });
  };

  Maps.removeLimiterPolygon = function (e, silent) {
    var self = this;
    _.each(self.limiterPolygons, function (polygon) {
      google.maps.event.clearInstanceListeners(polygon);
      polygon.setMap(null);
      self.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear();
      self.addLoadingBar(self.map);
      $('#map-progress-bar').hide();
      if (!silent) {
        $.publish('map.limiter_removed');
      }
    });
    self.limiterPolygons = [];
  };

  // remove all polygons
  Maps.removePolygons = function () {
    var self = this;
    $.when(self.mapCreated).then(function () {
      _.each(self.polygons, function (polygon) {
        google.maps.event.clearInstanceListeners(polygon);
        polygon.setMap(null);
      });
      self.polygons = [];
    });
  };

  Maps.limiterClickHandler = function () {
    if (!this.deselectAllMarkers()) {
      this.removeLimiterPolygon();
    }
  };

  // select a marker
  Maps.selectMarker = function (marker) {
    var self = this;
    // for now we deselect the previous selected markers,
    // but maybe in future we want to be able to select multiple markers
    if (self.selected) {
      if (self.selected === marker) {
        // its already selected
        return;
      } else {
        self.deselectMarker(self.selected);
      }
    }
    self.exposeMarker(marker);
    self.selected = marker;
    $.publish('map.marker_selected', marker);
  };


  // deselect a marker
  Maps.deselectMarker = function (marker) {
    var self = this;
    self.unexposeMarker(marker);
    self.selected = null;
    $.publish('map.marker_deselected', marker);
  };


  // deselect all markers
  Maps.deselectAllMarkers = function () {
    var self = this;
    // for now we select only one marker at the time,
    // but maybe in future we want to be able to select multiple markers
    var somethingDeselected = false;
    if (self.selected) {
      self.deselectMarker(self.selected);
      somethingDeselected = true;
    } else if (self.exposed) {
      self.unexposeMarker(self.exposed);
      somethingDeselected = true;
    }
    return somethingDeselected;
  };


  Maps.exposeMarkerById = function (id) {
    var self = this
      , exposed
      ;

    $.each(self.markers, function (index, marker) {
      if (_.contains(marker.ids, id)) {
        exposed = marker;
        return false;
      }
    });
    if (exposed) {
      self.exposeMarker(exposed);
    }

  };


  Maps.exposeMarker = function (marker) {
    var self = this;
    if (self.exposed) {
      if (self.exposed === marker) {
        return;
      } else {
        self.unexposeMarker(self.exposed);
      }
    }
    self.addMarkerClass(marker, 'active');
    self.exposed = marker;
  };


  Maps.unexposeMarker = function (marker) {
    var self = this;
    self.removeMarkerClass(marker, 'active');
    self.exposed = null;
  };


  // add class to marker
  Maps.addMarkerClass = function (marker, classes) {
    var labelClass = marker.get('labelClass');
    if (labelClass.indexOf(classes) === -1) {
      marker.set('labelClass', _.string.clean(labelClass + ' ' + classes));
    }
  };


  // remove class from marker
  Maps.removeMarkerClass = function (marker, classes) {
    var labelClass = marker.get('labelClass');
    labelClass = labelClass.replace(classes, '');
    marker.set('labelClass', _.string.clean(labelClass));
  };


  // add or remove markers & polygons, set animations
  Maps.aggregate = function (data) {
    var self = this
      , markers = [] // new markers
      , polygons = [] // new polygons
      , processed = [] // keep track of proccessed ids
      , key
      , index
      , existing
      ;

    self.queue = {};

    $.each(data, function (index, model) {
      if (model.id) {
        // new hood or city marker & polygon
        if (!_.contains(_.pluck(self.markers, 'id'), model.id)) {
          $.when(self.addMarker(model)).then(function (marker) {
            markers.push(marker); // keep the new marker
          });
        } else {
          var existingMarker = _.findWhere(self.markers, {id: model.id});
          existingMarker.setOptions({
            labelContent: existingMarker.template({
              label: model.labelContent
            })
          });
          markers.push(existingMarker);
        }
        if (!_.contains(_.pluck(self.polygons, 'id'), model.id)) {
          $.when(self.addPolygon(model)).then(function (polygon) {
            polygons.push(polygon); // keep the new polygon
          });
        } else {
          polygons = _.union(polygons, _.where(self.polygons, {id: model.id}));
        }
      } else {
        // animating markers and clusters joining together or breaking apart
        $.each(model.ids, function (index, id) {
          if (_.contains(processed, id)) {
            return;
          }
          existing = self.getMarkerById(id);
          if (existing) {
            // found existing marker or cluster for this id
            if (existing.ids.length > model.ids.length) {
              // zoomed in, existing cluster has broken into smaller clusters or markers
              processed = processed.concat(model.ids);
              // override marker's initial position and animate it
              model.position = existing.getPosition();
              $.when(self.addMarker(model)).then(function (marker) {
                markers.push(marker); // keep the new marker
                marker.animateTo(new google.maps.LatLng(parseFloat(model.lat), parseFloat(model.lng)), {
                  easing: 'easeOutCubic',
                  duration: TheRedPin.time.medium
                });
              });
              return false;
            } else if (existing.ids.length < model.ids.length) {
              // zoomed out, existing markers or clusters have joined into larger cluster
              processed = processed.concat(existing.ids);
              // just keep existing alive for the animation
              if (!_.contains(markers, existing)) {
                markers.push(existing);
                // animate the existing one
                existing.animateTo(new google.maps.LatLng(parseFloat(model.lat), parseFloat(model.lng)), {
                  easing: 'easeInCubic',
                  duration: TheRedPin.time.medium,
                  complete: function () {
                    self.execute(model.ids.join('.'));
                  }
                });
              }
              key = model.ids.join('.');
              if (!self.queue[key]) {
                self.queue[key] = {add: model, remove: [existing]};
              } else {
                self.queue[key].remove.push(existing);
              }
            } else {
              // no changes, no need to check other ids
              processed = processed.concat(model.ids);
              markers.push(existing);
              return false;
            }
          } else {
            // there's no existing marker or cluster
            processed = processed.concat(model.ids);
            $.when(self.addMarker(model)).then(function (marker) {
              markers.push(marker);
            });
            // no need to check other ids
            return false;
          }
        });
      }
    });

    $.publish('map.markerscalculated');

    // remove extra markers
    for (index = self.markers.length - 1; index >= 0; index--) {
      if (!_.contains(markers, self.markers[index])) {
        self.removeMarker(self.markers[index]);
      }
    }
    self.markers = markers;

    // remove extra polygons
    for (index = self.polygons.length - 1; index >= 0; index--) {
      if (!_.contains(polygons, self.polygons[index])) {
        self.removePolygon(self.polygons[index]);
      }
    }
    self.polygons = polygons;
  };


  // queue to keep animation finish actions
  Maps.queue = {};
  // execute an enqueued actions
  Maps.execute = function (key) {
    var self = this;
    if (self.queue[key]) {
      _.each(self.queue[key].remove, function (remove) {
        self.removeMarker(remove);
      });
      $.when(self.addMarker(self.queue[key].add)).then(function (added) {
        self.markers.push(added);
      });
      delete self.queue[key];
    } else {
      // TODO: zoomed out too fast, figure out a way to cleanup zombie markers!
    }
  };

  Maps.loadingBar = function () {
    var prog = 0;

    $.subscribe('map.bounds_changed', function () {
      prog = 31;
      $('#map-progress-bar').show();
      updateLoadingBar(prog);
    });
    $.subscribe('hybrid.ajax', function () {
      prog = prog + 24;
      updateLoadingBar(prog);
    });
    $.subscribe('map.markerscalculated', function () {
      prog = 85;
      updateLoadingBar(prog);
      setTimeout(function () {
        updateLoadingBar(100);
        prog = 0;
        setTimeout(function () {
          $('#map-progress-bar').hide();
        }, 400);
      }, 200);
    });

    function updateLoadingBar(prog) {
      $('#map-progress-bar .loading').html(prog + '%');
      $('#map-progress-bar .loading').css({width: prog.toString() + '%'});
    }
  };

  Maps.addLoadingBar = function (map) {
    var $progressBar = $(TheRedPin.template('map-progress-bar-template'));
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push($progressBar.get(0));
  };

  Maps.backToHybrid = function () {
    var self = this;
    var $backToHybrid = $(TheRedPin.template('map-back-to-hybrid-template'));
    self.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear();
    self.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push($backToHybrid.get(0));
    self.addLoadingBar(self.map);
  };


  return Map;


});
