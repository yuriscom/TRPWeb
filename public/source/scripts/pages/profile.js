require([
  'grid-list-view'
  , 'main'
  , 'summary'
  , 'map'
  , 'share'
  , 'carousel'
  , 'contact-tools'
  , 'floor-plans'
  , 'search'
  , 'prospect-match'
  , 'mortgage-tool'
  , 'mortgage-tool-model'
], function (GridListView, rMain, rSummary, rMap,
    rShare, rCar, rContact, rFloor, s, pm, MortgageToolView, MortgageToolModel) {

  var TheRedPin = window.TheRedPin
    , Profile = TheRedPin.Profile = {}
    , Favorites = TheRedPin.Favorites
    ;


  var ProfileModel = Backbone.Model.extend({
    defaults: {
      uniqueLandmarkList: null
    },
    property: {},
    url: TheRedPin.url,
    walkscore: {},

    initialize: function () {
      var self = this;
      if ($('[data-inactive=true]').length === 0) {
        this.property.city = $('#descriptions').data('city').toLowerCase();
        this.property.lat = $('#descriptions').data('lat');
        this.property.lng = $('#descriptions').data('lng');
        self.fetchLandmarks();
        self.fetchScoreItems();
        self.toggleRoomDimensions();
      }
      // exclude exclusive profiles
      if (!$('#exclusive-profile').length) {
        var profileInfo = $('[data-profile-info]').data('profile-info');
        var favID = profileInfo.favorite_id;
        self.set('favorite_id', favID);
      }
    },

    fetchScoreItems: function (type) {
      var self = this
      , propertyId = $('#property-profile').length > 0 ? $('[data-profile-info]').data('profile-info').property_id
                                            : $('[data-profile-info]').data('profile-info').precon_id
      , propertyTypeEndPoint = $('#property-profile').length > 0 ? 'properties/' : 'projects/';

      var walkscore = $('.amenity-box-result').data('walkscore')
        , transitScore = $('.amenity-box-result').data('transitscore')
        ;
      if (walkscore && transitScore) {
        var scores = {
          walkScore: walkscore,
          transitScore: transitScore
        };
        self.setScores(scores);
      } else {
        $.ajax({
          url: self.url + propertyTypeEndPoint + propertyId + '/scores'
        }).success(function (response) {
          // process current request
          var scores = {
            walkScore: response.result.walkscore,
            transitScore: response.result.transit_score
          };
          self.setScores(scores);
        }).error(function (response) {
          $('#walk-score-number').closest('li').remove();
          $('#transit-score-number').closest('li').remove();
          self.walkscore.walkscore = 0;
          self.walkscore.transit_score = 0;
        });
      }

    },

    setScores: function (scores) {
      var self = this;
      _.each(scores, function (value, key) {
        var score = key === 'walkScore' ? 'walk' : 'transit'
          , $score = $('#' + score + '-score-number');

        if (value === 'Not Available') {
          $score.closest('li').remove();
          self.walkscore[ key ] = 0;
        } else {
          $score.html(value);
          self.walkscore[ key ] = value;

          var imageBlock = $score.closest('li').find('.image')
            , iconName = 'image-score-' + score + '-'
            , imageColor = self.walkscoreIconColor(value)
            ;
          iconName += imageColor + '-large';
          $score.addClass(imageColor);
          imageBlock.addClass(iconName);
        }
      });
    },

    walkscoreIconColor: function (element) {
      var iconName = '';
      if (element >= 0 && element < 31) {
        iconName = 'red';
      } else if (element >= 31 && element < 61) {
        iconName = 'yellow';
      } else if (element >= 61) {
        iconName = 'green';
      }
      return iconName;
    },

    fetchLandmarks: function () {
      var self = this
      , request = $.ajax({
        url: self.url + '/landmarks?bounds=' + self.property.lat +
        ',' + self.property.lng
      }).done(function (response) {
        if (response.code === 'ok') {
          var landmarks = response.result;
          self.set('uniqueLandmarkList', self.filterLandmarks(landmarks));
        }
      });
    },

    filterLandmarks: function (landmarks) {
      var self = this
      , uniqueLandmarkList = {};
      landmarks.forEach(function (landmark) {
        for (var landmarkType in landmark) {
          var landmarkTypeResult = landmark[landmarkType];

          uniqueLandmarkList[landmarkType] = landmarkTypeResult.results;
        }
      });
      return uniqueLandmarkList;
    },

    toggleRoomDimensions: function () {
      var self = this;
      $('.room-dimensions-button').click(function () {
        var $self = $(this);
        if ($self.hasClass('active-units') === false) {
          $('.active-units').removeClass('active-units');
          $self.addClass('active-units');
          $.each($('span[data-alt-val]'), function (i, val) {
            var dataVal = $(val).attr('data-alt-val');
            var textVal = $(val).text();
            $(val).text(dataVal);
            $(val).attr('data-alt-val', textVal);
          });
        }
      });
    }

  });

  var ProfileView = Backbone.View.extend({
    el: '#profile-page',
    mapContainer: {},
    mapItem: {},
    mapStreetItem: {},
    landmarkTemplate: _.template(_.string.trim($('#landmark-modal-template').html())),


    initialize: function () {
      var self = this;
      $('#favourite-id').tooltip();

      $('.scroll-to').on('click', self.scrollTo);

      if ($('[data-inactive=true]').length === 0) {
        self.showWalkScore();
        self.mapContainer = $('.map-container');
        self.mapStreetContainer = $('.street-view-container');
        try {
          self.drawMap();
        } catch (error) {
          console.debug(error);
        }
        try {
          self.streetView();
        } catch (error) {
          console.debug(error);
        }

        $('#property-form-inline').one('focus', 'input, textarea', function () {
          var gaData = JSON.parse($('#property-form-inline').find('input[name=ga]').val());
          gaData.ga_label = 'Property';
          gaData.ga_value = 0;
          TheRedPin.sendGa(gaData);
        });

        $('#project-form-inline').one('focus', 'input, textarea', function () {
          var gaData = JSON.parse($('#project-form-inline').find('input[name=ga]').val());
          gaData.ga_label = 'Project';
          gaData.ga_value = 0;
          TheRedPin.sendGa(gaData);
        });


        self.mapContainer.closest('[data-collapsible-container]').on('open.components', function () {
          self.drawMap();
          self.streetView();
        });

        self.listenTo(self.model, 'change:uniqueLandmarkList', _.bind(self.parseLandmarks, self));

        try {
          self.initializeMortgage();
        } catch (error) {
          console.debug(error);
        }
      }

      $('.sticky-container .favorite-icon').on('click', function (event) {
        self.favoriteProperty(event);
      });

      if (!Modernizr.touch) {
        $('section > div.content[data-collapsible-container] > [data-collapsible-toggle]').trigger('click');
      } else {
        $('section.touch-open > div.content[data-collapsible-container] > [data-collapsible-toggle]').trigger('click');
      }

      var similarListingsGallery = new GridListView({
        collection: Profile.similarPropertyCollection,
        el: $('#results-list'),
        layer: $('#property-profile').length > 0 ? 'properties' : 'projects'
      });
      similarListingsGallery.resize();
      $.subscribe('main.window_size_changed', function () {
        similarListingsGallery.resize();
      });
    },

    favoriteProperty: function (e) {
      e.preventDefault();
      e.stopPropagation();
      var self = this;
      var profileInfo = $('#property-profile, #project-profile').data('profile-info');

      // return if there is an active request to prevent abuse
      if (self.activeRequest && self.activeRequest.state() == 'pending' && self.activeRequest.success) {
        return;
      }
      var type  = $('#property-profile').length ? 'property' : 'project';
      var id    = $('#property-profile').length ? profileInfo.property_id : profileInfo.precon_id;

      var gaLabel, gaAction;
      if (type == 'property') {
        gaLabel = 'Property';
        gaAction = 'PropertyFavourite';
      } else {
        gaAction = profileInfo.is_vip_active ? 'VIPFavourite' : 'ProjectFavourite';
        gaLabel = profileInfo.is_vip_active ? 'VIP' : 'Project';
      }

      // Check for favorite ID to determine if property is an active favorite
      if (self.model.get('favorite_id')) {
        self.activeRequest = Favorites.removeFavorite(self.model.get('favorite_id'));
      } else {
        self.activeRequest = Favorites.addFavorite(type, id);
      }
      self.activeRequest.done(function (response) {
        if (response && response.code == 'ok') {
          var res = response.result;
          // Remove favorite id when fav is deleted to ensure a POST on subsequent favoriting
          var newFavID = res.is_deleted === true ? null : res.id;
          self.model.set('favorite_id', newFavID);
          $('.sticky-container .favorite-icon').toggleClass('favorited');

          // GA event for Favoriting only
          if (newFavID) {
            window.ga('send', 'event', 'Soft', gaAction, gaLabel, 0);
            $('.sticky-container .favorite-icon').attr('title', 'Remove favourite');
          } else {
            $('.sticky-container .favorite-icon').attr('title', 'Add favourite');
          }
        }
      });
    },

    initializeMortgage: function () {
      var profileInfo = $('#property-profile, #project-profile').data('profile-info');
      var price;
      var mortgageListingType;
      var taxPercent;
      var model = {};

      model.showTitle = false;
      if ($('#property-profile').length) {
        model.mortgage_listing_type = 'property';
        model.mortgage_price = TheRedPin.helpers.parsePrice(profileInfo.listing_price);
        model.mortgage_tax_percent = TheRedPin.helpers.parsePrice(profileInfo.listing_taxes) /
                                     model.mortgage_price * 100;
      } else {
        model.mortgage_is_vip_active = TheRedPin.helpers.parsePrice(profileInfo.is_vip_active);
        model.mortgage_listing_type = 'project';
        model.mortgage_price = TheRedPin.helpers.parsePrice(profileInfo.property_price);
      }
      model.mortgage_rebate_amount = TheRedPin.helpers.parsePrice(profileInfo.rebate_amount);
      model.mortgage_maintenance = TheRedPin.helpers.parsePrice(profileInfo.monthly_maintenance) || 0;

      _.each(model, function (value, key) {
        if ((key !== 'mortgage_listing_type' && key !== 'mortgage_is_vip_active')
          && (value === 0 || isNaN(value))) {
          delete model[key];
        }
      });

      var mortgageModel = new MortgageToolModel(model);
      var mortgageView = new MortgageToolView({
        el: $('#mortgage-tool'),
        model: mortgageModel
      });
      mortgageView.render();
    },

    parseLandmarks: function () {
      var self = this
      , landmarkList = self.model.get('uniqueLandmarkList')
      ;

      if (landmarkList.stops.length !== 0) {
        $('.landmarks-stops').each(function (index, element) {
          var landmarkTypeArr = self.stringIntoArray(element);

          for (var landmarkType = 0; landmarkType < landmarkTypeArr.length; landmarkType++) {
            var landmarkName = landmarkTypeArr[landmarkType]
                , places = landmarkList[landmarkName]
                ;

            if (places !== undefined) {
              for (var placesCounter = 0; placesCounter < places.length; placesCounter++) {
                self.addItemToLandmark.apply(self, [ places[placesCounter], element, landmarkName ]);
              }
            }
          }
        });

      } else {
        $('.landmarks-stops').html('We were not able to locate a transit service nearby.');
      }

      if (landmarkList.stores.length !== 0) {
        $('.landmarks-stores').each(function (index, element) {
          var landmarkTypeArr = self.stringIntoArray(element);

          for (var landmarkType = 0; landmarkType < landmarkTypeArr.length; landmarkType++) {
            var landmarkName = landmarkTypeArr[landmarkType]
                    , places = landmarkList[landmarkName]
                    ;

            if (places !== undefined) {
              for (var placesCounter = 0; placesCounter < places.length; placesCounter++) {
                self.addItemToLandmark.apply(self, [ places[placesCounter], element, landmarkName ]);
              }
            }
          }
        });

      } else {
        $('.landmarks-stores').html('We were not able to locate a grocery store nearby.');
      }

    },

    addItemToLandmark: function (landmarkObj, landmarkElement, landmarkType) {
      var self = this
      , type = (landmarkObj.hasOwnProperty('types')) ? landmarkObj.types[0].replace(/_/g, ' ') : landmarkType;
      if (landmarkType === 'schools' && type === 'hospital') {
        landmarkObj.types.forEach(function (element) {
          if (element === 'school') {
            type = element;
          }
        });
      }
      var landmarkTemplateParams = {
        type: TheRedPin.Components.toTitleCase(type),
        name: landmarkObj.name,
        distance: landmarkObj.distance
      }
      , newLandmarkItem = self.landmarkTemplate(landmarkTemplateParams);

      $(landmarkElement).append(newLandmarkItem);
    },

    stringIntoArray: function (element) {
      return _.string.trim($(element).data('type')).split(', ');
    },

    drawMap: function () {
      var self = this;

      var mapOptions = {
        container: self.mapContainer,
        lat: self.model.property.lat,
        lng: self.model.property.lng,
        zoomControl: true,
        draggable: false,
        scrollwheel: false,
        type: 'theredpin'
      };
      self.mapItem = new TheRedPin.Map(mapOptions);

      $.when(self.mapItem).then(function (item) {
        //when the map is ready, add a marker to it
        $.subscribe('map.bounds_changed', function () {
          item.addMarker(mapOptions);
          // when the window is resized, center map on a marker
          $.subscribe('main.window_size_changed', function () {
            item.setLocation(mapOptions);
          });
        });
      });
    },

    streetView: function () {
      var self = this;

      var mapOptions = {
        container: self.mapStreetContainer,
        lat: self.model.property.lat,
        lng: self.model.property.lng,
        zoomControl: true,
        scrollwheel: false,
        type: 'theredpin'
      };
      if (TheRedPin.environment.isMobile === true) {
        $('.street-view-disable').addClass('active');
        mapOptions.zoomControl = false;
      }

      self.mapStreetItem = new TheRedPin.Map(mapOptions);

      $.when(self.mapStreetItem).then(function (item) {
        item.createStreetView(mapOptions);
      });
    },

    showWalkScore: function () {
      $('.walkscore-class').on('click', function () {
        var testW = _.template(_.string.trim($('#walkscore-modal-template').html()));

        var walkscoreWidth = 300;
        if (window.outerWidth > 399 && window.outerWidth < 750) {
          walkscoreWidth = 400;
        } else if (window.outerWidth >= 750) {
          walkscoreWidth = 750;
        }

        var address = $('#descriptions').data('address') + ', ' + $('#descriptions').data('city');
        TheRedPin.Components.revealTemplate({
          template: 'walkscore-modal-template',
          id: 'walkscore-modal',
          data: {
            script: 'script',
            ws_wsid: 'd5696400d12a4160fb5585c7a85c56d2',
            ws_address: address,
            ws_width: walkscoreWidth,
            ws_height: '400',
            ws_layout: (window.outerWidth < 750) ? 'vertical' : 'horizontal',
            ws_commute: 'true',
            ws_transit_score: 'true',
            ws_map_modules: 'all'
          },
          classes: (window.outerWidth < 750) ? 'walkscore small no-padding' : 'walkscore no-padding'
        });
      });
    },

    scrollTo: function (event) {
      var scrollSpace = $('.top-bar').height()
      , stickySubHeader = $('.sticky-summary-container').height()
      , $scrollTarget
      , nodeName = event.target.nodeName.toLowerCase()
      ;

      if (nodeName === 'span') {
        $scrollTarget = $('.' + $(event.target).closest('.scroll-to').data('scroll'));
      } else {
        $scrollTarget = $('.' + $(event.target).data('scroll'));
      }

      if ($scrollTarget.length > 0) {
        stickySubHeader = (stickySubHeader === 0) ? 50 : stickySubHeader;
        scrollSpace += stickySubHeader;
        $('html, body').animate({
          scrollTop: $scrollTarget.offset().top - scrollSpace
        });
        var $scrollContainer = $scrollTarget.find('.content');
        if (!$scrollContainer.hasClass('open')) {
          $scrollContainer.find('[data-collapsible-toggle]').trigger('click');
        }
      }
    }
  });

  var SimilarPropertyCollection = Backbone.Collection.extend({
    model: SimilarProperty,
    totalCount: null,
    increment: function () {
      this.totalCount = this.length;
    },
    fetch: function (options) {
      var $similarPropertiesList =  $('.similar-properties-list').find('li');
      _.each($similarPropertiesList, function (similarProperty, index) {
        var propertyData = $(similarProperty).data('similar');
        if (typeof propertyData.images === 'string') {
          propertyData.images = $.parseJSON(propertyData.images);
        }

        //common data
        var propertyHood = propertyData.hood
        , propertyCity = propertyData.city
        ;

        propertyData.hood = {};
        propertyData.hood.name = propertyHood;

        propertyData.city = {};
        propertyData.city.name = propertyCity;

        propertyData.PropertyTrpType = { name: propertyData.PropertyTrpType };
        propertyData.price_min = parseInt(propertyData.price_min);

        propertyData.address = TheRedPin.Components.toTitleCase(propertyData.address);

        var similarPropertyModel = new SimilarProperty(propertyData);
        Profile.similarPropertyCollection.add(similarPropertyModel);
        Profile.similarPropertyCollection.increment();
        similarPropertyModel.set('index', Profile.similarPropertyCollection.totalCount - 1);
      });
      Profile.similarPropertyCollection.trigger('processed');
    }

  });
  var SimilarProperty = Backbone.Model.extend();

  Profile.similarPropertyCollection = new SimilarPropertyCollection();

  Profile.model = new ProfileModel();
  Profile.view = new ProfileView({ model: Profile.model });

  return Profile;

});
