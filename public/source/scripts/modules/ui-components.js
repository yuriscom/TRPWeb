define('ui-components', [ 'main', 'vendor' ], function () {
  var BuilderSelectize = Backbone.View.extend({
    initialize: function () {
      this.template = _.template($('#builder-selectize-template').html());
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template());
      this.initBuilderSelectize();
      return this;
    },

    initBuilderSelectize: function () {
      var self = this;
      self.$el.find('input').selectize({
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
        onInitialize: function () {
          self.$el.data('builder-filter', {});
        },
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
          // self.builderAutocomplete = autocomplete(query);

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
    }
  });

  var OccupancySelectize = Backbone.View.extend({
    initialize: function () {
      this.template = _.template($('#occupancy-selectize-template').html());
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template());
      this.initOccupancySelectize();
      return this;
    },

    initOccupancySelectize: function () {
      this.$el.find('select').selectize();
    },

    getValue: function () {
      this.$el.find('select')[0].selectize.getValue();
    },

    setValue: function (val) {
      this.$el.find('select')[0].selectize.setValue(val);
    }

  });
  return {
    BuilderSelectize: BuilderSelectize,
    OccupancySelectize: OccupancySelectize
  };
});