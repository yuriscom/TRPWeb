window.onload = function () {
  require([ 'map', 'contact-tools', 'main' ],
  function () {
    var mapOptions = {
      container: $('.map-container'),
      zoomControl: true,
      draggable: false,
      scrollwheel: false,
      type: 'theredpin',
      lat: '43.647483',
      lng: '-79.373374'
    };
    var mapItem = new TheRedPin.Map(mapOptions);
    $.when(mapItem).then(function (item) {
      $.subscribe('map.bounds_changed', function () {
        item.addMarker(mapOptions);
        $.subscribe('main.window_size_changed', function () {
          item.setLocation(mapOptions);
        });
      });
    });
  });
};