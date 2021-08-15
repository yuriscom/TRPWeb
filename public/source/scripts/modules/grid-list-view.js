define([ 'main', 'jquery-slick', 'favorites' ], function () {
  var Favorites = TheRedPin.Favorites;
  var GridListView = Backbone.View.extend({
    $list: null,
    $listWrapper: null,
    $spinner: null,
    $endMessage: null,
    $unavailableMessage: null,
    $listItemPlaceholder: null,
    layer: null,

    // template for wrapper content: status messages and list wrapper
    listWrapperTemplate: null,
    // placeholder for items without details
    listItemWrapperTemplate: null,
    // content for items with details, which should be added into wrapper
    listItemContentTemplate: null,

    // Variables for List Items
    listItemMinWidth: 298,
    listItemAspectRatio: 1.509,

    listPadding: 7.5, // Depends on static list-container padding
    itemFootHeight: 78, // Depends on static card foot-note height

    from: 0,
    to: 0,
    scrolled: 0,
    itemsPerRow: 0,
    rowsPerPage: 0,
    //number of pages to load before and after index position
    bufferPages: 5,

    initialize: function (options) {
      var self = this;
      self.displayingEndMessage = false;
      //populate template pointers
      self.layer = options.layer;
      self.listWrapperTemplate = (self.$el.selector == '#selected-list-container')
                             ? _.template(_.string.trim($('#selected-list-wrapper-template').html()))
                             : _.template(_.string.trim($('#list-wrapper-template').html()));
      self.listItemWrapperTemplate = _.template(_.string.trim($('#list-item-wrapper-template').html()));
      self.listItemContentTemplate = (self.layer == 'properties')
                             ? _.template(_.string.trim($('#list-item-property-template').html()))
                             : _.template(_.string.trim($('#list-item-project-template').html()));
      self.listItemContentPrivateListingTemplate =
        _.template(_.string.trim($('#list-item-private-property-template').html()));
      self.listItemContentExclusiveUnitListingTemplate =
        _.template(_.string.trim($('#list-item-exclusive-unit-template').html()));
      self.listItemImageTemplate = self.getImageTemplate();
      self.emptyImageTemplate = _.template(_.string.trim($('#empty-image-template').html()));
      //populate wrapper content, set status/display element pointers
      self.$el.html(self.listWrapperTemplate());
      self.$listWrapper = self.$el.find('.list-wrapper');
      self.$list = self.$listWrapper.find('.list:first');
      self.$spinner = self.$el.find('.list-items-spinner');
      self.$endMessage = self.$el.find('.list-items-end');
      self.$unavailableMessage = self.$el.find('.list-items-unavailable');
      self.$listItemPlaceholder = self.$el.find('.list-item-placeholder');
      self.collection.bind('processed', self.updateList, self);
      // event bindings
      self.$listWrapper
        .on('scroll', _.bind(_.debounce(self.updateList, TheRedPin.time.medium), self))
        .on('touchstart MSPointerDown', function (event) { self.scrolled = 0; })
        .on('touchmove MSPointerMove', function (event) { self.scrolled++; })
        .on('touchend MSPointerUp', function (event) {if (self.scrolled > 20) { event.preventDefault();}});

      $.subscribe('hybrid.search_filters_changed', function () {
        self.$endMessage.find('.seo-description').addClass('hidden');
      });
    },

    getImageTemplate: function () {
      var self = this;
      var template;
      if (self.layer == 'properties') {
        template = TheRedPin.Hybrid
          ? _.template(_.string.trim($('#li-property-hybrid-image-template').html()))
          : _.template(_.string.trim($('#li-property-similar-image-template').html()));
      } else if (self.layer == 'exclusives') {
        template = TheRedPin.Hybrid
          ? _.template(_.string.trim($('#li-exclusive-hybrid-image-template').html()))
          : _.template(_.string.trim($('#li-exclusive-nearby-image-template').html()));
      } else {
        template = TheRedPin.Hybrid
          ? _.template(_.string.trim($('#li-project-hybrid-image-template').html()))
          : _.template(_.string.trim($('#li-project-nearby-image-template').html()));
      }
      return template;
    },

    // after resize, find out item height, how many images per item and items per page we have
    // explicitly call scroll to add / remove missing / additional items
    // then set the slick carousel for remaining items
    resize: function (update) {
      var self   = this
        , height = Math.max((self.listItemMinWidth * self.listItemAspectRatio), self.$el.height())
        , width  = Math.max(self.listItemMinWidth, self.$el.width())
        , itemsPerRow = self.itemsPerRow
        , rowsPerPage = self.rowsPerPage
        , $listItems = self.$el.find('.list-item')
        ;
      var widthForItems = width - (self.listPadding * 2);

      self.itemsPerRow = $('#panel.full-screen').length ? Math.max(1, Math.floor(widthForItems / self.listItemMinWidth))
        : Math.min(Math.max(1, Math.floor(widthForItems / self.listItemMinWidth)), 2);
      self.itemHeight = widthForItems / ((self.listItemAspectRatio) * self.itemsPerRow) + self.itemFootHeight;
      self.rowsPerPage = Math.max(1, Math.ceil(height / self.itemHeight));
      self.itemsPerPage = self.itemsPerRow * self.rowsPerPage;
      self.height = height;
      self.width = width;

      // if items per page has changed
      if (itemsPerRow != self.itemsPerRow || rowsPerPage != self.rowsPerPage) {
        $listItems.each(function () {
          $(this)
            .css({
              height: self.itemHeight,
              width: (100 / self.itemsPerRow) + '%'
            });
          $('.photo img', this).css({
            width: '100%',
            'min-width': self.listImageMinWidth + 'px'
          });
        });
      }

      if (typeof update === 'undefined' || update) {
        self.updateList();
      }
    },

    refresh: function () {
      this.clear();
      this.from = 0;
      this.to = 0;
      this.updateList();
    },

    clear: function (subset) {
      var self = this;
      var toClear = subset ? subset : this.$list.children('.list-item');
      toClear.each(function () {
        $(this).remove();
      });
    },

    updateList: function () {
      var self = this
        , $listItems = self.$list.children('.list-item')
        , $listItem
        , from
        , to
        , index
        , model
        ;


      self.$spinner.addClass('hidden');
      self.$unavailableMessage.addClass('hidden');

      // find the index of first visible item on list
      if (!self.itemHeight) {
        self.resize(false);
      }
      index = Math.max(0, Math.floor(self.$listWrapper.scrollTop() / self.itemHeight) * self.itemsPerRow);
      from = Math.max(0, index - self.itemsPerPage * self.bufferPages);
      to = Math.min(self.collection.totalCount, index + self.itemsPerPage * self.bufferPages);
      var pagingState = {
        index: index,
        itemsPerPage: self.itemsPerPage
      };

      self.clear(
        $listItems
          .filter(function () {
            index = $(this).data('index');
            return index < from || index >= to;
          })
      );

      self.$listItemPlaceholder.css({ height: (from / self.itemsPerRow) * self.itemHeight });

      for (index = from; index < to; index++) {
        model = self.collection.findWhere({ index: index });
        if (model) {
          model = model.toJSON();
          if (typeof model.is_public === 'undefined' || model.is_public) {
            model.follow = true;
          } else {
            model.follow = false;
          }
          if (model.Changelog && model.Changelog.length) {
            model = self.setUpdateMessage(model);
          }

          model = self.setDOMMessage(model);

          $listItem = $listItems.filter('[data-index=' + model.index + ']');
          if (!$listItem.length) {
            $listItem = $(self.listItemWrapperTemplate(model))
              .removeClass('loading')
              ;
            if (self.layer === 'properties' &&
                !TheRedPin.OAuth.isAuthenticated() &&
                typeof model.is_public !== 'undefined' && !model.is_public) {
              $listItem.html(self.listItemContentPrivateListingTemplate(model));
            } else if (self.layer === 'exclusives') {
              $listItem.html(self.listItemContentExclusiveUnitListingTemplate(model));
            } else {
              $listItem.html(self.listItemContentTemplate(model));
            }
            if (model.images[0]) {
              $listItem.find('.photo').html(self.listItemImageTemplate({ image: model.images[0] }));
            } else {
              $listItem.find('.photo').html(self.emptyImageTemplate());
            }

            if (index == from) {
              $listItem.insertAfter(self.$listItemPlaceholder);
            } else {
              $listItem.insertAfter(self.$list.children('.list-item[data-index=' + (index - 1) + ']'));
            }

            self.initializeListItem($listItem);
            self.from = self.from !== undefined ? Math.min(self.from, model.index) : model.index;
            self.to = self.to !== undefined ? Math.max(self.to, model.index) : model.index;
          }
        }
      }

      if (self.collection.totalCount === null && self.itemsPerPage) {
        self.$spinner.removeClass('hidden next');
        self.toggleEndMessage('hidden');
        // fetch first batch
        self.collection.fetch({
          from: 0,
          to: self.itemsPerPage * self.bufferPages,
          layer: self.layer
        });
      } else if (self.$list.height() - self.$listWrapper.scrollTop() <= self.height) {
        if (self.to < self.collection.totalCount - 1) {
          self.$spinner.addClass('next').removeClass('hidden');
          self.toggleEndMessage('hidden');
          // fetch more
          self.collection.fetch({
            from: self.to,
            to: Math.min(self.collection.totalCount, self.to + self.itemsPerPage * self.bufferPages),
            layer: self.layer
          });
        } else {
          if (self.collection.totalCount === 0) {
            self.displayUnavailableMessage();
          } else {
            self.toggleEndMessage('visible');
          }
        }
      }

      //alert parent view of update and provide paging info for potential display
      self.trigger('list.updated', pagingState);
    },

    setDOMMessage: function (model) {
      var dom = parseInt(model.dom) || 0;
      model.dom_message = dom + ' ' + (dom === 1 ? 'Day Old' : 'Days Old');
      return model;
    },

    setUpdateMessage: function (model) {
      var changelog = _.last(model.Changelog);
      var prevValue;
      if (changelog.event == 'PRICE UP') {
        model.update_main = 'Price Increase';
        prevValue = TheRedPin.helpers.parsePrice(changelog.prev_value);
        model.update_sub = 'Formerly ' +
          '$' + _.string.numberFormat(prevValue);
      } else if (changelog.event == 'PRICE DOWN') {
        model.update_main = 'Price Drop!';
        prevValue = TheRedPin.helpers.parsePrice(changelog.prev_value);
        model.update_sub = 'Formerly ' +
          '$' + _.string.numberFormat(prevValue);
      } else {
        model.update_main = TheRedPin.Components.toTitleCase(changelog.event) + '!';
        model.update_sub = null;
      }
      return model;
    },

    //TD|SA: this should be moved to a general function/library, not exclusive to GridListView
    //TD|PS: This needs to be reviewed and then either refactored or removed.
    monitorImageCollection: [],
    monitorImageThread: null,
    monitorImageLoadFunction: function () {
      var self = this;
      if (self.monitorImageCollection.length > 0) {
        _.each(self.monitorImageCollection, function (ele) {
          if (ele && (ele.img.complete || ele.complete)) {
            if (ele.img.src && typeof ele.img.naturalWidth !== 'undefined' && ele.img.naturalWidth === 0) {
              $(ele.img).replaceWith(TheRedPin.template('photos-error-template', { classes: 'photo' }));
            }
            if (ele.col !== null) {
              ele.col.removeClass('loading');
            }
            var index = self.monitorImageCollection.indexOf(ele);
            if (index > -1) {
              self.monitorImageCollection.splice(index, 1);
            }
            ele.proxy = null;
          } else if (ele && !ele.proxy) {
            ele.proxy = new window.Image();
            ele.proxy.onload = function () {ele.complete = true;};
            ele.proxy.onerror = function () {ele.complete = true;};
            if (!ele.proxy.srcset) {
              ele.proxy.src = ele.img.src;
            }
          }
        });
      } else {
        window.clearInterval(this.monitorImageThread);
        this.monitorImageThread = null;
      }
    },
    monitorImage: function (img, col) {
      this.monitorImageCollection.push({ img: img, col: col });
      if (this.monitorImageThread === null) {
        this.monitorImageThread = setInterval(_.bind(this.monitorImageLoadFunction, this), 150);
      }
    },

    // initialize components & event bindings on newly created list items
    initializeListItem: function ($listItem) {
      var self = this;
      var $slickContainer = $('.container', $listItem);

      $listItem
        .initialize()
        .css({
          height: 'auto',
          width: (100 / self.itemsPerRow) + '%'
        });

      var $photos = $listItem.find('.item-photos:first')
        , photosCount = $photos.find('.photo').size()
        ;

      if (photosCount > 0) {
        $photos
          .find('.photo img')
            .each(function () {
              self.monitorImage(this, --photosCount === 0 ? $photos : null);
              // if the image was cached, it's already been loaded
              if (this.complete) { $(this).load(); }
            });
      } else {
        $photos
          .removeClass('loading')
          .prepend(TheRedPin.template('photos-unavailable-template', { classes: 'photo' }));
      }

      // set favorites listener on listItem fav icon
      $('.favorite-icon', $listItem).on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var listItem = self.collection.get($listItem.data('id'));

        // return if there is an active request to prevent abuse
        if (self.activeRequest && self.activeRequest.state() == 'pending' && self.activeRequest.success) {
          return;
        }

        var type  = self.layer == 'properties' ? 'property' : 'project';
        var favID = listItem.get('favorite_id');
        var isHybrid = TheRedPin.Hybrid;
        var gaLabel, gaAction;
        if (self.layer == 'properties') {
          gaLabel = isHybrid ? 'Property Map' : 'Property';
          gaAction = isHybrid ? 'MapPropertyCardFavourite' : 'PropertySimilarCardFavourite';
        } else {
          if (isHybrid) {
            gaLabel = 'Project Map';
            gaAction = listItem.get('is_vip') ? 'MapVIPCardFavourite' : 'MapProjectCardFavourite';
          } else {
            var profileInfo = $('[data-profile-info]').data('profile-info');
            gaLabel = profileInfo.is_vip_active ? 'VIP' : 'Project';
            gaAction = listItem.get('is_vip') ? 'VIPSimilarCardFavourite' : 'ProjectSimilarCardFavourite';
          }
        }

        if (favID) {
          listItem.activeRequest = Favorites.removeFavorite(favID);
        } else {
          listItem.activeRequest = Favorites.addFavorite(type, listItem.get('id'));
        }
        listItem.activeRequest.done(function (response) {
          if (response && response.code == 'ok') {
            var res = response.result;
            // Remove favorite id when fav is deleted to ensure a POST on subsequent favoriting
            var newFavID = res.is_deleted === true ? null : res.id;
            listItem.set('favorite_id', newFavID);
            $('.favorite-icon', $listItem).toggleClass('favorited');

            // GA event for Favoriting only
            if (newFavID) {
              window.ga('send', 'event', 'Soft', gaAction, gaLabel, 0);
              $('.favorite-icon', $listItem).attr('title', 'Remove favourite');
            } else {
              $('.favorite-icon', $listItem).attr('title', 'Add favourite');
            }
          }
        });
      });
    },

    scrollToListItem: function (index) {
      var self = this
        , $listItem = self.$list.children('[data-index=' + index + ']:first')
        ;

      if ($listItem.length) {
        self.$listWrapper.animate({ scrollTop: $listItem[ 0 ].offsetTop + 35 }, TheRedPin.time.medium);
      }
    },

    // TODO: maybe its a good idea to generalize this in future, to pass in any custom message
    // and display it
    displayUnavailableMessage: function () {
      var self = this;
      self.clear();
      self.$spinner.addClass('hidden');
      self.$unavailableMessage.removeClass('hidden');
    },

    toggleEndMessage: function (state) {
      var self = this;
      if (state === 'visible' && self.displayingEndMessage === false) {
        self.$endMessage.removeClass('hidden');
        self.displayingEndMessage = true;
      } else if (state === 'hidden' && self.displayingEndMessage === true) {
        self.$endMessage.addClass('hidden');
        self.displayingEndMessage = false;
      }
    }

  });

  return GridListView;
});
