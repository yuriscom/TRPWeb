define('exclusives-collection', [ 'main' ], function (m) {

  var ProjectUnit = Backbone.Model.extend();

  var ExclusiveCollection = Backbone.Collection.extend({
    totalCount: null,
    increment: function () {
      this.totalCount = this.length;
    },
    fetch: function (options) {
      var self = this;
      _.each(self.models, function (model, index) {
        model.set('index', index);
        model.set('id', index);
      });
      self.totalCount = self.length;
      self.trigger('processed');
    }

  });

  return ExclusiveCollection;
});

// App

require([ 'main', 'search', 'vendor', 'grid-list-view', 'exclusives-collection', 'contact-tools' ],
function (m, s, v, GridListView, ExclusiveCollection, ct) {

  $(document).foundation();

  $('.exclusive-project').each(function () {
    var $el = $('.list-items', this);
    var unitsData = $('.list-items-data', this).data('project-units');
    var collection = new ExclusiveCollection(unitsData);
    collection.fetch();
    console.log(collection);
    var view = new GridListView({
      el: $el,
      layer: 'exclusives',
      collection: collection
    });
    view.resize();
    $.subscribe('main.window_size_changed', function () {
      view.resize();
    });
  });
});