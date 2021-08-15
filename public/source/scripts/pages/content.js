//Views

define('content-search-view', [ 'main', 'search', 'prospect-match' ], function (rMain, Search, prospectMatch) {

  var TheRedPin = window.TheRedPin
    , geocoder
    ;

  $.when(TheRedPin.geoLocateUserLoaded).then(function () {
    geocoder = new google.maps.Geocoder();
    if (TheRedPin.Storage.get('lat') === null || TheRedPin.Storage.get('lng') === null) {
      TheRedPin.geolocateUser();
    }
  });

  var ContentSearchView = Backbone.View.extend({
    form: null,
    search: null,
    layerSelectSelector: '[name=layer]',
    layerSelect: null,
    queryRestore: {},
    searchInput: null,
    searchInputSelector: '#search-keywords + .selectize-control input',
    searchButton: null,
    divThrobber: null,

    events: {
      keyup: 'handleKey'
    },

    initialize: function () {
      var self = this;

      self.userInteracted = false;
      $.subscribe('main.geolocateUser', function () {
        var selectizeInputHtml = $($('.selectize-input .item')[1]).html()
          , defaultCity = TheRedPin.Storage.get('default-city')
          ;

        if (!self.userInteracted && typeof selectizeInputHtml === 'undefined') {
          $('form [name=keywords]').siblings('.selectize-control').find('input').val(defaultCity).trigger('keyup');
        }
      });

      self.form = self.$el.find('form');
      self.search = Search.getNewViewInstance(self.form);
      self.searchInput = self.$el.find(self.searchInputSelector);
      self.events['change ' + self.layerSelectSelector] = 'setLayerFromInterface';
      self.layerSelect = self.$el.find(self.layerSelectSelector);

      self.layerSelect.selectize();
      self.setLayerFromInterface();
      self.search.on('loaded', _.bind(self.autocompleteLoaded, self));

      var lastSearch = TheRedPin.Storage.get('last-search');
      var defaultCity = TheRedPin.Storage.get('default-city');

      if (TheRedPin.Storage.get('last-search')) {
        $('form [name=keywords]').siblings('.selectize-control').find('input').val(lastSearch).trigger('keyup');
      } else {
        $('form [name=keywords]').siblings('.selectize-control').find('input').val(defaultCity).trigger('keyup');
      }
      this.search.forceSelection(0);

      self.interactionHandler();

      this.searchButton = this.form.find('.button');
      this.searchButton.removeAttr('onclick');
      this.divThrobber = this.form.find('.throbber');
      this.divThrobber.removeClass('throbber');

      //watch for search field initialization race
      self.search.$el.addClass('initialized');
      self.search.addSubmitHandler(_.bind(self.submit, self));
    },

    interactionHandler: function () {
      var self = this;
      $($('input[placeholder*="City, neighbourhood, address"]')[1]).focus(function () {
        self.userInteracted = true;
      });
    },

    submit: function () {
      var deferred = new $.Deferred();
      if (this.search.singleQuickLinkOption(0)) {
        this.search.openQuickLink();
      } else {
        if (this.search.getLastQuery()[0]) {
          var self = this;
          $.when(this.search.forceSelection(0)).then(function (response) {
            if (!response) {
              self.$el.addClass('error');
              self.searchInput.attr('aria-describedby', 'search-error');
              self.searchInput.attr('aria-invalid', 'true');
              self.search.purgeLastQuery(0);
            }
            deferred.resolve(response);
          });
        } else {
          deferred.resolve(true);
        }
        return deferred;
      }
    },

    handleKey: function (e) {
      this.clearError();
      if (e.keyCode === 13) {
        this.search.delayedSubmit(0);
      }
    },

    clearError: function () {
      this.$el.removeClass('error');
      this.searchInput.attr('aria-describedby', '');
      this.searchInput.attr('aria-invalid', 'false');
    },

    autocompleteLoaded: function (activeSelectize) {
      if (this.queryRestore.selectAfterLoad) {
        this.queryRestore.selectAfterLoad = false;
        activeSelectize.setValue(this.queryRestore.selected[0]);
      }
    },

    setLayerFromInterface: function (e) {
      this.queryRestore.query = this.search.getLastQuery();
      this.queryRestore.selected = this.search.getKeywordSelections();
      this.search.setLayer(this.layerSelect[0].selectize.getValue(), true);
      if (this.queryRestore.selected[0] !== '') {
        this.queryRestore.selectAfterLoad = true;
        this.$el.find('.selectize-input input').val(this.queryRestore.query[0]).trigger('keyup');
      }
    }
  });

  return ContentSearchView;

});

define('content-quotes-view', [ 'main', 'jquery-slick' ], function (rMain) {

  var ContentQuotesView = Backbone.View.extend({
    carouselSelector: '.quotes-carousel',
    carousel: null,

    events: {
    },

    initialize: function () {
      this.carousel = this.$el.find(this.carouselSelector).slick({
        dots: true,
        autoplay: false,
        autoplaySpeed: 3500
      });
      $('img').unveilDynamic();
    }
  });

  return ContentQuotesView;

});

define('scale-font-view', [ 'main' ], function (rMain) {

  var ScaleFontView = Backbone.View.extend({
    originalFontSize: 0,
    originalSize: 0,

    events: {
    },

    initialize: function () {
      this.originalFontSize = parseInt(this.$el.css('font-size'));
      this.originalSize = this.$el.attr('data-scale-font-base');
      $.subscribe('main.window_size_changed', _.bind(this.windowSizeChanged, this));
      this.windowSizeChanged();
    },

    windowSizeChanged: function () {
      var currentSize = this.$el.width();
      this.$el.css('font-size', this.originalFontSize * (currentSize / this.originalSize));
    }
  });

  return ScaleFontView;

});

define('marketing-tabs-view', [ 'main' ], function () {

  var MarketingTabsView = Backbone.View.extend({
    initialize: function () {
      var self = this;
      var $el = $(self.el);
      $el.find('.tab-title').each(function (index, tabTitle) {
        var $tabTitle = $(tabTitle);
        $tabTitle.on('click', function (e) {
          if ($tabTitle.offset().top - $(window).scrollTop() < 100) {
            return;
          }
          TheRedPin.throttledScroll($tabTitle.offset().top - ($('nav').height() + 20), 400);
        });
      });
    }
  });

  return MarketingTabsView;

});

define('marketing-slider-view', [ 'main' ], function () {

  var MarketingSliderView = Backbone.View.extend({

    initialize: function (options) {
      var self = this;
      self.slideHandler = options.slideHandler;
      self.initCallback = options.inited;
      self.hasSliderRail = options.hasSliderRail;
      self.sliderLabelText = options.sliderLabelText;
      self.maxVal = options.max || 2000000;
      self.minVal = options.min || 0;
      self.initialPrice = options.initialPrice || self.minVal;

      self.slider = self.$el.find('.price-range').noUiSlider({
        start: [ self.initialPrice ],
        connect: 'lower',
        behaviour: 'snap',
        range: {
          min: [ self.minVal, 50000 ],
          '50%': [ 1000000, 100000 ],
          max: self.maxVal
        },
        format: {
          to: function (value) {
            if (value === self.maxVal) {
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
      self.$el.find('.min-max-price .min-price').html('$' + _.string.numberFormat(self.minVal));
      self.$el.find('.min-max-price .max-price').html('$' + _.string.numberFormat(self.maxVal) + '+');
      if (self.slideHandler) {
        self.slider.on('slide', function (e, val) {
          self.slideHandler(e, val);
        });
      }
      if (self.hasSliderRail) {
        self.$el.find('.slider-label-rail')
          .html(
            '<div class="slider-label">' + self.sliderLabelText + '<br><span class="price"></span></div>'
          );
        setTimeout(function () {
          self.$el.find('.price-range').Link('lower').to(self.$el.find('.slider-label .price'), 'html');
          self.calculateSliderLabelPos();
        }, 0);
        self.slider.on('slide', function (e, val) {
          self.calculateSliderLabelPos();
        });
        var throttledSliderLabePos = _.throttle(function () {
          self.calculateSliderLabelPos();
        }, 300, { leading: false });
        $(window).on('resize', function () {
          throttledSliderLabePos();
        });
      }
      if (self.initCallback) {
        self.initCallback(self.slider);
      }
      self.inited = true;
    },
    calculateSliderLabelPos: function () {
      var self = this;
      var sliderLabelRailWidth  = self.$el.find('.slider-label-rail').width();
      var sliderLabelWidth      = self.$el.find('.slider-label').width();
      var sliderLeftPos         = parseInt(self.$el.find('.noUi-origin').attr('style').match(/\d+/)[0]);
      var sliderLeftPx          = parseInt(self.$el.find('.noUi-origin').css('left').match(/\d+/)[0]);
      var maxLeft               = (sliderLabelRailWidth - sliderLabelWidth) / sliderLabelRailWidth * 100;
      var left;
      if (sliderLeftPx < sliderLabelWidth / 2) {
        left = 0 + '%';
      } else if (sliderLeftPx > sliderLabelRailWidth - sliderLabelWidth / 2) {
        left = maxLeft + '%';
      } else {
        left = 'calc(' + sliderLeftPos + '% - ' + sliderLabelWidth / 2 + 'px)';
      }
      self.$el.find('.slider-label').css('margin-left', left);
    },
    setBubbleVal: function (rawSliderVal, calculation) {
      var self = this;
      var parsedBubbleVal = TheRedPin.helpers.parsePrice(rawSliderVal);
      var bubbleVal = calculation(parsedBubbleVal);
      var bubblePrice = '$' + _.string.numberFormat(bubbleVal) + (parsedBubbleVal >= self.maxVal ? '+' : '');
      self.$el.find('.slider-bubble .slider-price').html(bubblePrice);
    }
  });

  return MarketingSliderView;

});

define('marketing-section', [ 'marketing-slider-view', 'marketing-tabs-view' ],
function (MarketingSliderView, MarketingTabsView) {
  var MarketingSection =  {
    initialize: function (el) {
      var $el = $(el);
      if ($el.find('.tab-title').length) {
        var marketingTabs = new MarketingTabsView({
          el: $el.find('.tabs[data-tab]')
        });
      }
      if ($el.find('.marketing-tabs-link').length) {
        $('.marketing-tabs-link').on('click', function (e) {
          if ($el.find('.marketing-tabs-link').offset().top - $(window).scrollTop() < 100) {
            return;
          }
          TheRedPin.throttledScroll($el.find('.tab-title.active').offset().top - ($('nav').height() + 10), 400);
        });
      }

      var getBuySliderOptions = function ($el) {
        return {
          el: $el,
          hasSliderRail: true,
          sliderLabelText: 'Your Next Home',
          initialPrice: 500000,
          inited: function (slider) {
            var self = this;
            var rawSliderVal = slider.val();
            self.setBubbleVal(rawSliderVal, TheRedPin.helpers.calculateRebate);
          },
          slideHandler: function (e, val) {
            var self = this;
            self.setBubbleVal(val, TheRedPin.helpers.calculateRebate);
          }
        };
      };
      var getBuySellSliderOptions = function ($el) {
        return {
          el: $el,
          hasSliderRail: true,
          sliderLabelText: 'Your Home\'s Value',
          initialPrice: 500000,
          inited: function (slider) {
            var self = this;
            var rawSliderVal = slider.val();
            self.setBubbleVal(rawSliderVal, TheRedPin.helpers.calculateTRPOneCommission);
          },
          slideHandler: function (e, val) {
            var self = this;
            self.setBubbleVal(val, TheRedPin.helpers.calculateTRPOneCommission);
          }
        };
      };
      var getSellSliderOptions = function ($el) {
        return {
          el: $el,
          hasSliderRail: true,
          sliderLabelText: 'Your Home\'s Value',
          initialPrice: 500000,
          inited: function (slider) {
            var self = this;
            var rawSliderVal = slider.val();
            self.setBubbleVal(rawSliderVal, TheRedPin.helpers.calculateSellSavings);
          },
          slideHandler: function (e, val) {
            var self = this;
            self.setBubbleVal(val, TheRedPin.helpers.calculateSellSavings);
          }
        };
      };

      // Initialize active slider
      $el.find('.marketing-props').each(function (index, el) {
        var $el = $(el);
        if ($el.hasClass('active')) {
          var $sliderWrapper = $el.find('.marketing-slider-wrapper');
          var marketingSlider;
          if ($el.hasClass('marketing-props-buy')) {
            marketingSlider = new MarketingSliderView(getBuySliderOptions($el));
          } else if ($el.hasClass('marketing-props-buy')) {
            marketingSlider = new MarketingSliderView(getSellSliderOptions($el));
          } else {
            marketingSlider = new MarketingSliderView(getBuySellSliderOptions($el));
          }
        }
      });

      // Initialize other sliders as tabs become active
      $el.find('[data-tab]').on('toggled', function (e, tab) {
        if (tab.find('.noUi-target').length) {
          return;
        }
        var $el = tab.find('.marketing-slider-wrapper');
        var marketingSlider;
        if (tab.hasClass('marketing-props-buy')) {
          marketingSlider = new MarketingSliderView(getBuySliderOptions($el));
        } else if (tab.hasClass('marketing-props-sell')) {
          marketingSlider = new MarketingSliderView(getSellSliderOptions($el));
        } else if (tab.hasClass('marketing-props-buy-sell')) {
          marketingSlider = new MarketingSliderView(getBuySellSliderOptions($el));
        }
      });
    }
  };

  return MarketingSection;

});

//App

require([ 'main', 'content-search-view', 'content-quotes-view', 'scale-font-view',
'foundation-equalizer', 'contact-tools', 'mortgage-tool', 'mortgage-tool-model', 'marketing-section' ],
function (rMain, ContentSearchView, ContentQuotesView, ScaleFontView,
  f, c, MortgageToolView, MortgageToolModel, MarketingSection) {
  $(document).foundation();
  var searchViews = [];
  $('.content-search').each(function () {
    var $el = $(this);
    var view = new ContentSearchView({
      el: $el
    });
    searchViews.push(view);
  });

  var quoteViews = [];
  $('.content-quotes').each(function () {
    var $el = $(this);
    var view = new ContentQuotesView({
      el: $el
    });
    quoteViews.push(view);
  });

  if ($('#mortgage-tool').length) {
    var mortageTool = new MortgageToolView({
      el: $('#mortgage-tool'),
      model: new MortgageToolModel({})
    });
    mortageTool.render();
  }

  var scaleFontViews = [];
  $('[data-scale-font]').each(function () {
    var $el = $(this);
    var view = new ScaleFontView({
      el: $el
    });
    scaleFontViews.push(view);
  });
  //resize Video
  if (document.getElementById ('youtube-video')) {
    window.onload = window.onresize = function resizeVideo () {
      var videoWindow = document.getElementById ('youtube-video');
      var windowWidth = window.innerWidth;
      if (window.innerWidth > 639) {
        videoWindow.style.width = '474px';
      } else {
        if (Modernizr.touch) {
          videoWindow.style.width = windowWidth + 'px';
        } else {
          videoWindow.style.width = windowWidth - 14 + 'px';
        }
      }
    };
  }

  MarketingSection.initialize($('.content-marketing-tabs'));

  //use geolocation for main page featured locations
  var location = TheRedPin.Storage.get('default-city') || 'Toronto, ON, Canada';

  if (location === 'Toronto, ON, Canada') {
    $('[data-location=on]').show();
    $('[data-location=bc]').hide();
  } else {
    $('[data-location=on]').hide();
    $('[data-location=bc]').show();
  }

  // Tagline Cycler
  var $tagSpans = $('.content-tagline h1 span');
  setTimeout(function () {
    var i = 1;
    $tagSpans.eq(0).fadeOut(400, cycle);
    function cycle () {
      var delayTime = i === 0 ? 3000 : 1500;
      $tagSpans.eq(i).fadeIn(400)
        .delay(delayTime)
        .fadeOut(400, cycle);

      i = ++i % $tagSpans.length;

    }
  }, 3000);

  console.log('Content Page Inited');

  return {
  };
});


