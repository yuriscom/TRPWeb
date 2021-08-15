//Model
define('floorplan-model', [ 'main' ], function () {
  var FloorplanModel = Backbone.Model.extend({
    defaults: {
      name: 'default'
      , listing: null
      , floors: null
      , price: null
      , beds: null
      , baths: null
      , sqft: null
      , exposure: null
      , taxes: null
      , maintenance: null
      , image: []
      , img: []
      , amenity: []
      , state: false
    },
    buildResponsiveImages: function () {
      var images = this.get('image');
      var parsedImages = images.map(function (img) { return JSON.parse(img); });
      var imagesBuilder = TheRedPin.Components.imagesBuilder();
      var responsiveImages = imagesBuilder.buildImages(parsedImages);
      this.set('responsiveImages', responsiveImages);
    }
  });

  return FloorplanModel;
});

//Collection
define('floorplan-collection', [ 'floorplan-model' ], function (FloorplanModel) {
  var FloorplanCollection = Backbone.Collection.extend({
    model: FloorplanModel,
    $markupDataContainer: $('#floor-plans'),
    markupDataNodeSelector: '.floorplan-listing',
    comparator: function (floorplan) {
      return floorplan.get('beds');
    },

    fetch: function () {
      var self = this;
      this.$markupDataContainer.find(this.markupDataNodeSelector).each(function () {
        var model = new FloorplanModel();
        window.TheRedPin.fetchMarkupData($(this), model);
        model.buildResponsiveImages();
        self.add(model);
      });
    }
  });

  return FloorplanCollection;
});

//Views

define('floorplan-item-view', [ 'main' ], function (main) {
  var FloorplanView = Backbone.View.extend({
    template: null,

    events: {
      'open.components': 'open',
      'close.components': 'close',
      'click img': 'openImgModal'
    },

    open: function (e) {
      this.model.set('state', true);
      this.trigger('open');
    },

    close: function (e) {
      this.model.set('state', false);
    },

    openImgModal: function (e) {
      $(e.target).siblings('a').trigger('click');
    },

    initialize: function (options) {
      _.bindAll(this, 'initSlick');
      var self = this;
      this.template = _.template($('#floorplans-item-template').html());
      this.once('open', function () {
        if (!this.$el.find('.slick-initialized').length) {
          this.initSlick();
        }
      });
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template(this.model.toJSON()));
      if ($el.find('.floor-plan').hasClass('open')) {
        setTimeout(this.initSlick, 0);
      }
      return this;
    },

    toggleState: function () {
      console.log('toggle');
      this.model.state = !this.model.state;
    },

    initSlick: function () {
      this.$el.find('.slick').slick({
        infinite: true,
        autoplay: false,
        lazyLoad: 'ondemand',
        slidesToShow: 1,
        slidesToScroll: 1
      });
    }

  });

  return FloorplanView;
});

define('floorplan-view', [ 'main', 'floorplan-item-view', 'jquery-slick' ], function (main, ItemView, slick) {
  var FloorplanView = Backbone.View.extend({
    template: null,
    groupTemplate: null,
    noResultsTemplate: null,
    noPlansTemplate: null,
    itemListSelector: '.floorplan-items',
    groups: {},
    groupingKey: 'beds',
    inited: false,

    events: {
      'floorplan.filter': 'filterChange',
      'keyup input': 'filterChange',
      'open.components': 'open',
      'close.components': 'close',
      'click #show-all-floor-plans-label': 'reset'
    },

    open: function (e) {
      this.changeGroupState($(e.target), true);
    },

    close: function (e) {
      this.changeGroupState($(e.target), false);
    },

    changeGroupState: function (ele, state) {
      if (ele.parent().is(this.$el.find(this.itemListSelector))) {
        var group = _.filter(this.groups, function (val, key) {
          return ele.is(val.el);
        })[0];
        group.state = state;
      }
    },

    initialize: function (options) {
      var self = this;
      this.template = _.template($('#floorplans-template').html());
      this.groupTemplate = _.template($('#floorplans-container-template').html());
      this.noPlansTemplate = _.template($('#floorplans-none-available-template').html());
      this.noResultsTemplate = _.template($('#floorplans-no-results-template').html());
      this.groups = _.countBy(this.collection.models, function (model) {
        var grouping = model.get(self.groupingKey);
        if (!grouping) {
          grouping = '0';
        }
        return grouping;
      });
      _.each(this.groups, function (value, key) {
        self.groups[key] = {
          group: key,
          matches: value,
          state: false
        };
      });
      this.initView();
      if (this.collection.length > 0) {
        this.parseUrl();
        this.render();
      }
    },

    initView: function () {
      var self = this;
      var $el = $(this.el);
      if (this.collection.length > 0) {
        $el.html(this.template());
        this.$el.find('.select').selectize({
          allowEmptyOption: true,
          readOnly: true,
          onDelete: function () {
            return false;
          },
          onChange: function (value) {
            self.$el.trigger('floorplan.filter');
          },
          render: {
            item: function (data, escape) {
              return TheRedPin.template(
                'selectize-item-template',
                { graphics: null,
                  contents: data.text + ' ',
                  classes: ''
                }
              );
            }
          }
        });
        $('#show-all-floor-plans-label').css({ display: 'none' });
      } else {
        $el.html(this.noPlansTemplate());
      }
    },

    filterChange: function () {
      $('#show-all-floor-plans-label').css({ display: 'block' });
      this.render();
    },

    render: function () {
      var self = this;
      var $el = $(this.el);
      var $itemList = $el.find(this.itemListSelector);
      $itemList.html('');
      var $currentGroup = null;
      var currentGroupIndex = -1;
      var filtered = _.filter(this.collection.models, this.applyFilters, this);
      if (filtered.length > 0) {
        var groups = _.countBy(filtered, function (model) {
          var grouping = model.get(self.groupingKey);
          if (!grouping) {
            grouping = '0';
          }
          return grouping;
        });
        _.each(groups, function (value, key) {
          _.extend(self.groups[key], { matches: value });
        });
        _.each(filtered, function (model) {
          var view = new ItemView({
            model: model
          });
          view.render();
          var grouping = model.get(self.groupingKey);
          if (!grouping) {
            grouping = '0';
          }
          if (grouping != currentGroupIndex) {
            if (!$currentGroup && currentGroupIndex === -1) {
              self.groups[grouping].state = true;
            }
            currentGroupIndex = grouping;
            $currentGroup = $(self.groupTemplate(self.groups[grouping]));
            $itemList.append($currentGroup);
            self.groups[grouping].el = $currentGroup;
          }
          $currentGroup.find('> [data-collapsible]').append(view.$el);
        });
      } else {
        $itemList.append(this.noResultsTemplate());
      }
      self.inited = true;

      this.updateUrl();
      return this;
    },

    renderSubviews: function () {
      var self = this;
    },

    applyFilters: function (model) {
      var valid = true;
      _.each(this.$el.find('input, select'), function (ele) {
        var field = $(ele).attr('name');
        var val = model.get(field);
        var valLimiter = field ?
          (ele.selectize ? ele.selectize.getValue() : $(ele).val())
          : '';
        switch (field) {
          case 'beds':
          case 'baths':
          case 'sqft':
            val = parseInt(val);
            valLimiter = valLimiter = parseInt(valLimiter);
            valid = valid && (_.isNaN(valLimiter) ? true :
              (valLimiter === 0 ?
                (field === 'sqft' ? val < 500 : val === 0) || !val : val >= valLimiter));
            break;
          case 'exposure':
            valid = valid && (valLimiter === 'all' || val.toLowerCase().indexOf(valLimiter) >= 0);
            break;
          case 'min_price':
            val = parseInt(model.get('price'));
            valid = valid && (valLimiter === '' || parseInt(valLimiter) <= val);
            break;
          case 'max_price':
            val = parseInt(model.get('price'));
            valid = valid && (valLimiter === '' || parseInt(valLimiter) >= val);
        }
      });
      return valid;
    },

    updateUrl: function () {
      var filters = {
          min_price: $('#unit-min-price').val(),
          max_price: $('#unit-max-price').val(),
          beds: $('#unit-beds').val(),
          baths: $('#unit-baths').val(),
          sqft: $('#unit-sqft').val(),
          exposure: $('#unit-exposure').val()
        }
        , parameters = $.param(filters)
        ;

      if (_.isFunction(window.history.pushState)) {
        window.history.replaceState(
          null, window.location.pathname + '?' + parameters, window.location.pathname + '?' + parameters
        );
      } else {
        window.location.hash = '#' + parameters;
      }
    },

    parseUrl: function () {
      var parameters = {}
        , filters
        , $field
        ;

      if (window.location.search) {
        parameters = TheRedPin.helpers.queryParameters(window.location.search.substring(1));
        // in case a user with old browser got the link from another user with nice browser!
        if (!_.isFunction(window.history.pushState)) {
          window.location.search = '';
        }
      } else if (window.location.hash) {
        parameters = TheRedPin.helpers.queryParameters(window.location.hash.substring(1));
        // in case a user with nice browser got the link from another user with old browser!
        if (_.isFunction(window.history.pushState)) {
          window.location.hash = '';
        }
      }

      filters = _.pick(parameters, 'min_price', 'max_price', 'beds', 'baths', 'exposure', 'sqft');

      // Check for initial filters
      var initialFilters = false;
      _.each(filters, function (value, key) {
        if (value !== '' || value !== 'all') {
          initialFilters = true;
        }
      });

      if (initialFilters) {
        $('#show-all-floor-plans-label').css({ display: 'block' });
      }

      this.undelegateEvents();
      _.each(filters, function (value, name) {
        $field = $('#floor-plan-filters').find('[name=' + name + ']');
        if ($field[ 0 ].selectize) {
          $field[ 0 ].selectize.setValue(value);
        } else {
          $field.val(value);
        }
      });
      this.delegateEvents();
    },

    reset: function () {
      $('#unit-min-price, #unit-max-price').val('');
      $('#floor-plan-filters .select').each(function () {
        if ($(this)[ 0 ].selectize) {
          $(this)[ 0 ].selectize.setValue('all');
        }
      });
      $('#show-all-floor-plans-label').css({ display: 'none' });
    }
  });

  return FloorplanView;
});

//App
define('floor-plans', [
  'main'
  , 'floorplan-view'
  , 'floorplan-collection'
], function (
  main
  , FloorplanView
  , FloorplanCollection
) {
  if ($('#floor-plans').length > 0) {
    var collection = new FloorplanCollection();
    collection.fetch();
    var view = new FloorplanView({
      collection: collection,
      el: $('#floor-plans > div.content')
    });
  }
});