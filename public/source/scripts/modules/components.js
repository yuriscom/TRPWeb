define('components', [ 'vendor', 'jquery-ui-tooltip', 'jquery-nouislider' ], function () {




  var TheRedPin  = window.TheRedPin
    , Components = TheRedPin.Components = {}
    ;




  Components.revealTemplate = function (options) {
    var id               = options.id
      , classes          = options.classes
      , data             = options.data || { data: {} }
      , contentsTemplate = _.template($('#' + options.template).html())
      , revealTemplate   = _.template(_.string.trim($('#reveal-template').html()))
      ;

    data.ga           = options.analytics;
    data.custom       = options.custom;
    data.contactData  = options.contactData;
    data.profileInfo  = options.profileInfo;

    if ($('#' + id).size() === 0) {
      if (options.modal) {
        classes = (classes ? classes : '') + ' modal';
      }
      var contents = contentsTemplate(data)
        , $reveal  = $(revealTemplate({ id: id, classes: classes, contents: contents }))
                      .appendTo('body')
                      .initialize(data);

      // re-create it every time
      $reveal.on('closed', function () {
        if (options.leaveEventBindings === true) {
          $reveal.detach();
        } else {
          $reveal.remove();
        }
      });

      var revealOptions = {
        close_on_background_click: !options.modal,
        close_on_esc: !options.modal
      };
      $reveal.foundation('reveal', 'open', revealOptions);
    }
  };

  Components.toTitleCase = function (type) {
    var i, j, str, lowers, uppers, regHandler;
    str = type.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = [ 'A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With' ];
    regHandler = function (txt) {
      return txt.toLowerCase();
    };
    for (i = 0, j = lowers.length; i < j; i++) {
      str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), regHandler);
    }
    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = [ 'Id', 'Tv' ];
    for (i = 0, j = uppers.length; i < j; i++) {
      str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
         uppers[i].toUpperCase());
    }
    return str;
  };

  Components.imagesBuilder = function () {
    var imagesBuilder = {};

    imagesBuilder.buildImages = function (images, defaultUrl) {
      var self = this;
      defaultUrl = defaultUrl || '';
      var processedImages = [];
      _.each(images, function (image) {
        var urls = self.buildImage(image, defaultUrl);
        processedImages.push(urls);
      });
      return processedImages;
    };
    imagesBuilder.buildImage = function (image, defaultUrl) {
      defaultUrl = defaultUrl || '';

      var sizes     = [ 'small', 'medium', 'large', 'standard' ];
      var imageUrl  = defaultUrl;
      var alt       = '';
      if (image) {
        imageUrl  = image.path ? image.path : image;
        alt       = image.alt_tag ? image.alt_tag : '';
      }

      /*
        On iOS, when img has src="", grabbing the src attribute will return the current
        url making the browser fetch the html page. Therefore ImageBuilder returns 'ib-break.jpg'
        to flag a broken/missing image rather than returning an empty string "".
      */
      var destUrl = imageUrl ? imageUrl : 'ib-break.jpg';
      var images = {};
      images.alt = alt;

      _.each(sizes, function (size) {
        images[size] = destUrl.replace(/-(original)\//, '-' + size + '/');
      });
      return images;
    };

    return imagesBuilder;
  };

  /* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
   * http://benalman.com/
   * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */
  (function ($) {
    var o = $({});

    $.subscribe = function () {
      o.on.apply(o, arguments);
    };

    $.subscribeOnce = function () {
      o.one.apply(o, arguments);
    };

    $.unsubscribe = function () {
      o.off.apply(o, arguments);
    };

    $.publish = function () {
      o.trigger.apply(o, arguments);
    };

  }(jQuery));


  // disable blank links
  $(document).on('click', 'a[href="#"]', function (event) { event.preventDefault(); });

  $.widget('custom.flyout', $.ui.tooltip, {
    options: {
      autoShow: true,
      autoHide: true
    },

    _create: function () {
      var self = this;
      self._super();
      if (!self.options.autoShow) {
        self.element.on('mouseenter.flyout mouseover.flyout focusin.flyout touchstart.flyout MSPointerDown.flyout',
          function (event) {
            event.stopImmediatePropagation();
            event.preventDefault();
          });
      }
    },

    _open: function (event, target, content) {
      var self = this;
      self._superApply(arguments);
      if (!self.options.autoHide) {
        self._off(target, 'mouseleave mouseout focusout touchend MSPointerUp');
      }
    }
  });




  // TODO: refactor this to Components.revealIframe(options), just like Components.revealTemplate(options)
  // wrapping iframe content in Foundation modal and passing external form values as URL parameters
  $('[data-reveal-iframe], button[data-reveal-iframe]').on('click', function (event) {

    var self           = this
      , href           = $(self).attr('href') || $(self).data('reveal-url')
      , id             = $(self).data('reveal-id')
      , classes        = $(self).data('reveal-classes')
      , height         = $(self).data('reveal-height') || 600
      , include        = $(self).data('reveal-include-form')
      , iframeTemplate = _.template(_.string.trim($('#iframe-template').html()))
      , revealTemplate = _.template(_.string.trim($('#reveal-template').html()))
      ;

    if ($('#' + id).size() === 0) {
      event.stopImmediatePropagation();
      event.preventDefault();

      if ($(self).is('[data-reveal-include-form]')) {
        if (!include) { include = $(self).closest('form'); }
        if ($(include).is('form')) {
          if (href.indexOf('?') == -1) {
            href += '?' + $(include).serialize();
          } else {
            href += '&' + $(include).serialize();
          }
        }
      }

      // TODO: find a way to remove explicit height
      var iframe  = iframeTemplate({ name: id, width: '100%', height: height + 'px', source: href })
        , $reveal = $(revealTemplate({ id: id, classes: classes, contents: iframe }))
                      .appendTo('body')
                      .foundation();

      $(frames[id]).load(function () {
        $('body', frames[id].document).css({ overflow: 'hidden' });
      });

      // re-create it every time
      $reveal.on('closed', function () {
        $reveal.remove();
      });

      $(self).trigger('click');
    }
  });


  // render template content in Foundation modal
  $('body').on('click', '[data-reveal-template]', function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    var self             = this
      , options          = {
        id:           $(self).data('reveal-id'),
        classes:      $(self).data('reveal-classes'),
        data:         $(self).data('reveal-data'),
        analytics:    $(self).data('reveal-analytics'),
        custom:       $(self).data('reveal-custom'),
        contactData:  $(self).data('reveal-contact-data'),
        profileInfo:  $('[data-profile-info]').data('profile-info') || $(event.target).data('profile-info'),
        template:     $(self).data('reveal-template')
      }
      ;

    Components.revealTemplate(options);
  });


  // collapsible content
  $(document).on('click', '[data-collapsible-toggle]', function (event) {
    var $container = $(this).closest('[data-collapsible-container]');
    $container
      .toggleClass('open')
      .find('.icon.toggle:first')
        .toggleClass('open')
        .end()
      .children('[data-collapsible]')
        .slideToggle(TheRedPin.time.fast, function () {
          var $target = $(this).closest('[data-collapsible-container]');
          if ($target.is('.open')) {
            $target.trigger('open.components');
          } else {
            $target.trigger('close.components');
          }
        })
    ;
    if ($container.is('.open')) {
      $container.trigger('open.components');
    } else {
      $container.trigger('close.components');
    }
  });


  // icon change on hover
  $('[data-hover-icon]')
    .on('mouseenter touchstart MSPointerDown', function (event) {
      var self      = this
        , $icon     = $(self).find('.icon:first')
        , hoverIcon = $(self).data('hover-icon')
        , icon      = $(self).data('icon')
        ;
      if (!icon) {
        icon = $icon.attr('class').match(/icon-[a-z-]*/)[0];
        $(self).data('icon', icon);
      }
      if (!hoverIcon) {
        hoverIcon = icon.split('-');
        hoverIcon.splice(hoverIcon.length - 1, 0, 'hover');
        hoverIcon = hoverIcon.join('-');
        $(self).data('hover-icon', hoverIcon);
      }
      if (!$(self).is('.disable-hover-icon')) { $icon.removeClass(icon).addClass(hoverIcon); }
    })
    .on('mouseleave touchend MSPointerUp touchcancel MSPointerCancel', function (event) {
      var self      = this
        , $icon     = $(self).find('.icon:first')
        , icon      = $(self).data('icon')
        , hoverIcon = $(self).data('hover-icon')
        ;

      if ((icon && hoverIcon) && !$(self).is('.disable-hover-icon')) {
        $icon.removeClass(hoverIcon).addClass(icon);
      }
    });




  $.fn.initialize = function (options) {
    return $(this).each(function () {
      $(this).foundation();
      // if this is a content which should be initialized by a different module, call their initializer
      if ($(this).is('.contact-tool') && TheRedPin.ContactTools) {
        TheRedPin.ContactTools.initialize(this);
      } else if ($(this).is('.search') && TheRedPin.Search) {
        TheRedPin.Search.initialize(this);
      } else if ($(this).is('.prospect-match') && TheRedPin.ProspectMatch) {
        TheRedPin.ProspectMatch.initialize(this, options);
      }
      // if there are SVG graphics to be initialized
      $(this).find('[data-graphic]').each(function () {
        var name = $(this).data('graphic') + '-graphic-template';
        $(this)
          .prepend(TheRedPin.template(name, { width: $(this).width(), height: $(this).height() }))
          .addClass('in')
          ;
      });
      // if any fix or hack plugin is defined for a specific browser or content
      if ($.fn.fix) { $(this).fix(); }
    });
  };

  //add function for ie9, ie10
  if (!window.location.origin) {
    window.location.origin =
    window.location.protocol + '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '');
  }

  //add query string retrieval to jQuery object
  // jscs: disable
  $.getQueryStringParameter = function (key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, '\\$&'); // escape RegEx meta chars
    var match = window.location.search.match(new RegExp('[?&]'+key+'=([^&]+)(&|$)'));
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  };
  // jscs: enable

  /**
   * jQuery Unveil
   * A very lightweight jQuery plugin to lazy load images
   * http://luis-almeida.github.com/unveil
   *
   * Licensed under the MIT license.
   * Copyright 2013 Luís Almeida
   * https://github.com/luis-almeida
   */
  //this jquery-unveil.js vendor script is modified for lazy loading with both img tags and section background-images
  ;(function ($) {

    $.fn.unveilDynamic = function (threshold, callback) {

      var $w = $(window),
          th = threshold || 0,
          retina = window.devicePixelRatio > 1,
          attrib = retina ? 'data-src-retina' : 'data-src',
          self = this,
          images = self,
          loaded;

      self.one('unveilDynamic', function () {
        var source = this.getAttribute(attrib);
        var srcset = this.getAttribute('data-srcset');
        source = source || this.getAttribute('data-src');
        if ($(this).is('section')) {
          // lazy loads background images for section tags
          if (source) {
            $(this).addClass(source);
            if (typeof callback === 'function') {callback.call(this);}
          }
        } else if ($(this).is('img')) {
          // lazy loads images
          if (source) {
            this.setAttribute('src', source);
            if (typeof callback === 'function') {callback.call(this);}
          }
          if (srcset) {
            this.setAttribute('srcset', srcset);
            if (typeof callback === 'function') {callback.call(this);}
          }
        }
      });

      function unveilDynamic () {
        var inview = images.filter(function () {
          var $e = $(this);
          if ($e.is(':hidden')) {return;}

          var wt = $w.scrollTop(),
              wb = wt + $w.height(),
              et = $e.offset().top,
              eb = et + $e.height();

          return eb >= wt - th && et <= wb + th;
        });

        loaded = inview.trigger('unveilDynamic');
        images = images.not(loaded);
      }

      $w.on('scroll.unveilDynamic resize.unveilDynamic lookup.unveilDynamic', unveilDynamic);

      unveilDynamic();

      return this;

    };

  })(window.jQuery);

  $(document).ready(function () {
    $('img').unveilDynamic(200, function () {});
    $('section').unveilDynamic(200);
    $(document).on('opened.fndtn.reveal', '[data-reveal]', function () {
      $('img').unveilDynamic();
      $('section').unveilDynamic();
    });
  });

/*!
 * Adapted from SwipeMe
 * SwipeMe
 * Author: Loz Calver
 *
 * Copyright 2013, MIT License
 */
  (function SwipeMe () {
    'use strict';

    var actions = {
      swipe: function (dir) {
        var access = (dir === 'left') ? 'right' : 'left';
        if (events.swipeTarget === 'menu' && $('#search-modal').length < 1) {
          toggleMenu(events, dir, access);
        } else {
          $(events.swipeTarget).trigger('swipe', [ { access: access } ]);
        }
      }
    },
    events = {
      start: {},
      differences: {},
      swipeTarget: 'menu',
      openTargetMenu: null,
      isHorizontal: null,
      invalidTarget: false,
      handleEvent: function (event) {
        switch (event.type) {
          case 'touchstart':
            this.touchstart(event);
            break;
          case 'touchmove':
            this.touchmove(event);
            break;
          case 'touchend':
            this.touchend(event);
            break;
          case 'mousedown':
            this.mousedown(event);
            break;
          case 'mouseup':
            this.mouseup(event);
            break;
        }
      },
      mousedown: function (event) {
        var mousedown = event;

        events.start = {
          x: mousedown.pageX,
          y: mousedown.pageY
        };

        events.differences = {
          x: 0,
          y: 0
        };

        if ($(event.target).is('img')) {
          events.swipeTarget = event.target;
        } else {
          events.swipeTarget = 'menu';
        }

      },
      mouseup: function (event) {
        var mousemove = event;

        events.differences = {
          x: mousemove.pageX - events.start.x,
          y: mousemove.pageY - events.start.y
        };

        events.isHorizontal = (Math.abs(events.differences.x) > Math.abs(events.differences.y));

        if (events.isHorizontal && !events.invalidTarget) {
          event.preventDefault();
        }

        if ((targetVerticalEnabled(events.swipeTarget) || events.isHorizontal) && !events.invalidTarget) {
          var swipeDir = (events.differences.x > 0) ? 'right' : 'left';

          if (events.differences.x > 25 || events.differences.x < -25) {
            actions.swipe(swipeDir);
          }
        }

        events.isHorizontal = null;
        events.invalidTarget = false;
        events.openTargetMenu = null;
        events.differences = {};
      },
      touchstart: function (event) {
        var touch = event.touches[0];

        events.start = {
          x: touch.pageX,
          y: touch.pageY
        };

        if (events.start.x <= $(window).width() * 0.10) {
          events.openTargetMenu = 'left';
        } else if (events.start.x >= $(window).width() * 0.90) {
          events.openTargetMenu = 'right';
        }
        if ($(event.target).is('img')) {
          events.swipeTarget = event.target;
        } else if ($(event.target).parents().is('.map-container')) {
          events.swipeTarget = null;
        } else {
          events.swipeTarget = 'menu';
        }

      },
      touchmove: function (event) {
        var touch = event.touches[0];

        events.differences = {
          x: touch.pageX - events.start.x,
          y: touch.pageY - events.start.y
        };

        if (events.isHorizontal === null) {
          events.isHorizontal = (Math.abs(events.differences.x) > Math.abs(events.differences.y));
        }

        if (events.isHorizontal && !events.invalidTarget) {
          event.preventDefault();
        }
      },
      touchend: function () {
        if (events.isHorizontal && !events.invalidTarget) {
          var swipeDir = (events.differences.x > 0) ? 'right' : 'left';

          actions.swipe(swipeDir);
        }

        events.isHorizontal = null;
        events.invalidTarget = false;
        events.openTargetMenu = null;
        events.differences = {};
      }
    };

    if (window.addEventListener) {
      document.addEventListener('touchstart', events);
      document.addEventListener('touchmove', events);
      document.addEventListener('touchend', events);
      document.addEventListener('mousedown', events);
      document.addEventListener('mouseup', events);
    }

    function toggleMenu (events, dir, access) {
      if ($('#header .top-bar').hasClass('active-' + dir + '-menu')) {
        $('.off-canvas-wrap').foundation('offcanvas', 'hide', 'move-' + access);
      } else if (!$('#header .top-bar').hasClass('active-' + access + '-menu') && events.openTargetMenu == access) {
      // If the side we're trying to expose isn't already open and if we're allowed to expose the panel
        $('.off-canvas-wrap').foundation('offcanvas', 'show', 'move-' + dir);
        $('#header .top-bar').addClass('active-' + access + '-menu');
      }
    }

    function targetVerticalEnabled (target) {
      // if ($(target).is('img')) {
      //   return true;
      // } else {
      // }
      return false;
    }

  })();

  /*
  Simple data read from markup
  ----------------------------

  allows SEO friendly delivery of data through markup to the client, avoids branching maintenance
  of SEO delivered data and client-utilized data by using the SEO data as a conduit

  - data-node-suffix attribute should be specified in the element passed
  - for each default attribute in the passed model, data-node=[data-node-suffix + attribute_name] will be sought
  - for arrays, data-node=[data-node-suffix + attribute_name + "-array"] will be sought
    - each child element of that node matching data-node=[data-node-suffix + attribute_name] will
      have its .html() added to an array
  - for other data, the .html() value of the element matching data-node=[data-node-suffix + attribute_name] will
    be used to set the value
  */
  TheRedPin.fetchMarkupData = function ($ele, model) {
    var pre = $ele.attr('data-node-suffix');
    _.each(model.attributes, function (value, key) {
      var nodeName = '[data-node=' + pre + key + ']';
      if (_.isArray(value)) {
        var array = [];
        var nodes = $ele.find('[data-node=' + pre + key + '-array]').find(nodeName);
        nodes.each(function () {
          array.push($(this).html());
        });
        model.set(key, array);
      } else {
        model.set(key, $ele.find(nodeName).html());
      }
    });
  };

  TheRedPin.sendGa = function (data) {
    window.ga(data.ga_call, data.ga_event, data.ga_category, data.ga_action, data.ga_label, data.ga_value);
  };

  window.Selectize.defaults.inputClass = 'selectize-input needsclick';

  console.log('Components & Plugins Loaded');
});
