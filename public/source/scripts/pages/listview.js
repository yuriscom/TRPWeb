require([ 'main', 'search', 'map', 'contact-tools', 'favorites' ], function () {
  console.log('List View Started');

  $('.listview-card-wrapper').each(function () {
    var self = this;
    var $card = $(this);
    var Favorites = TheRedPin.Favorites;
    self.favorite = $card.data('fav-id');

    $('.favorite-icon', this).on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      // return if there is an active request to prevent abuse
      if (self.activeRequest && self.activeRequest.state() == 'pending' && self.activeRequest.success) {
        return;
      }
      var type = $card.is('.property-card') ? 'property' : 'project';
      var listingType = $card.data('listing-type');
      var id   = $card.data('id');
      var gaLabel, gaAction;
      if (listingType == 'property') {
        gaLabel = 'Property List';
        gaAction = 'ListPropertyCardFavourite';
      } else {
        gaAction = listingType == 'vip' ? 'ListVIPCardFavourite' : 'ListProjectCardFavourite';
        gaLabel = 'Project List';
      }

      // Check for favorite ID to determine if property is an active favorite
      if (self.favorite) {
        self.activeRequest = Favorites.removeFavorite(self.favorite);
      } else {
        self.activeRequest = Favorites.addFavorite(type, id);
      }
      self.activeRequest.done(function (response) {
        if (response && response.code == 'ok') {
          var res = response.result;
          // Remove favorite id when fav is deleted to ensure a POST on subsequent favoriting
          self.favorite = res.is_deleted === true ? null : res.id;
          $('.favorite-icon', $card).toggleClass('favorited');

          // GA event for Favoriting only
          if (self.favorite) {
            window.ga('send', 'event', 'Soft', gaAction, gaLabel, 0);
            $('.favorite-icon', $card).attr('title', 'Remove favourite');
          } else {
            $('.favorite-icon', $card).attr('title', 'Add favourite');
          }
        }
      });
    });
  });

  // Sort selectize
  $('.sort-select').selectize({
    readOnly: true,
    onDelete: function () {
      return false;
    },
    onChange: function (value) {
      var queryString = window.location.search;

      queryString = queryString.substr(0, 1) === '?' ? queryString.slice(1) : queryString;

      if (queryString.search('order_by') > -1) {
        queryString = queryString.replace(/order_by=\w+[%2C|,]\w+/, 'order_by=' + value);
      } else {
        queryString = queryString ? queryString + '&' : '';
        queryString += 'order_by=' + value;
      }
      window.location.href = window.location.pathname  + '?' + queryString;
    }
  });

  if (!Modernizr.touch && !TheRedPin.Reporting.get('private-safari')) {
    $('.listview-card-wrapper a').attr('target', '_blank');
  }

  $('.description-teaser-toggle').on('click', function () {
    $('.location-description').toggleClass('description-teaser');
  });

  var maps = {};

  $('.map-toggle').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $cardWrapper        = $(this).parents('.listview-card-wrapper');
    var $imageMapContainer  = $('.listview-image-map-container', $cardWrapper);
    var $mapContainer       = $('.map-container', $cardWrapper);
    var mapID               = $mapContainer.data('map-id');
    var $photoContainer     = $('.photo-container', $cardWrapper);
    var $photoOverlay       = $('.overlay', $cardWrapper);

    if (!$mapContainer.data('map-inited')) {
      drawMap($mapContainer);
    }
    $cardWrapper.toggleClass('map-active');
    $cardWrapper.toggleClass('image-active');
  });

  var drawMap = function (mapContainer) {
    var $mapContainer = $(mapContainer);
    var parentHeight = $mapContainer.parent().height();
    var mapID = $mapContainer.data('map-id');
    $mapContainer.height(parentHeight);
    var mapOptions = {
      container: $mapContainer,
      lat: $mapContainer.data('lat'),
      lng: $mapContainer.data('lng'),
      zoomControl: true,
      draggable: false,
      scrollwheel: false,
      type: 'theredpin'
    };

    var mapItem = new TheRedPin.Map(mapOptions);

    $.when(mapItem).then(function (item) {
      $mapContainer.attr('data-map-inited', 1);
      maps[mapID] = { map: item, options: mapOptions };

      // This is needed to give execution precedence to some other function
      setTimeout(function () {
        var map = maps[mapID].map;
        var options = maps[mapID].options;
        map.refresh();
        map.setLocation(options);
        map.addMarker(options);
      }, 0);
    });
  };
});