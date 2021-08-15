define('carousel', [ 'main', 'jquery-slick', 'components', 'share' ], function () {


  var TheRedPin  = window.TheRedPin
    , screenSize = TheRedPin.environment.screen.size
    ;


  $('[data-carousel]').each(function () {
    var $self = $(this)
      , $photos = $self.find('.photos')
      , $slick = $self.find('.slick')
      , $counter = $self.find('[data-carousel-counter]')
      , count = $photos.find('.photo').size()
      , slidesToShow = screenSize == 'small' ? 1 : screenSize == 'medium' ? 2 : 3
      ;

    $self.data('count', count);

    $slick.slick({
      infinite: true,
      lazyload: 'progressive',
      slidesToShow: slidesToShow,
      onInit: function () {
        $counter.text('1/' + $self.data('count'));
        $photos.removeClass('initializing-slick');
      },
      onAfterChange: function () {
        $counter.text(
          $slick.slickCurrentSlide() + 1
          + '/'
          + $self.data('count')
        );
      }
    });
    $slick.css({ height: TheRedPin.environment.screen.width / slidesToShow * 9 / 16 });

    if (count == 1) {
      $slick.find('.slick-track').css({ margin: '0 auto' });
    }

    if (count > 0) {
      $photos
        .find('.photo img')
          .one('load', function () {
            if (this.width < this.height) {
              $(this).addClass('portrait');
            } else {
              $(this).addClass('landscape');
            }
          }).one('error', function () {
            $(this).replaceWith(TheRedPin.template('photos-error-template', { classes: '' }));
          }).each(function () {
            // if the image was cached, it's already been loaded
            if (this.complete) {
              $(this).load();
            }
          });
    } else {
      $photos
        .removeClass('loading')
        .append(TheRedPin.template('photos-unavailable-template', { classes: '' }));
    }


    $self.on('click', '[data-carousel-button]', function (event) {
      var images = $photos.find('img').map(function () {
          return { src: $(this).data('carousel-image'), alt: $(this).attr('alt') };
        })
        , title = $self.data('carousel-title') ? $self.data('carousel-title')
                : $('[data-carousel-title]').length ? $('[data-carousel-title]').data('carousel-title')
                                                    ? $('[data-carousel-title]').data('carousel-title')
                                                    : $('[data-carousel-title]').text()
                : ''
        , subtitle = $self.data('carousel-subtitle') ? $self.data('carousel-subtitle')
                   : $('[data-carousel-subtitle]').length ? $('[data-carousel-subtitle]').data('carousel-subtitle')
                                                          ? $('[data-carousel-subtitle]').data('carousel-subtitle')
                                                          : $('[data-carousel-subtitle]').text()
                   : ''
        , rebateAmount = $('a[data-carousel-button]').data('rebate')
        , $carousel = $(TheRedPin.template('carousel-template', {
          images: images,
          title: title,
          subtitle: subtitle,
          rebateAmount: rebateAmount
        })).appendTo('body')
        , initialSlide = $('[data-carousel] .slick-track .slick-active').size() === 3 ?
                          $($('[data-carousel] .slick-track .slick-active')[1]).index()
                          : $($('[data-carousel] .slick-track .slick-active')[0]).index()
        , self = this
        ;

      if (clickedIsPhoto(self)) {
        initialSlide = $(self).parent('.photo').index();
      }

      $('body').css ('overflow: hidden');

      $('#main-carousel').slick({
        infinite: true,
        lazyload: 'progressive',
        slidesToShow: 1,
        asNavFor: '#thumbnails-carousel',
        adaptiveHeight: false,
        onInit: function () {
          $('#main-carousel .slick-list').focus();
        },
        onAfterChange: function () {
        }
      });

      $('#thumbnails-carousel').slick({
        infinite: true,
        lazyload: 'progressive',
        slidesToShow: thumbnailSlidesToShow(screenSize),
        centerMode: true,
        focusOnSelect: true,
        centerPadding: '16px',
        asNavFor: '#main-carousel'
      });

      stWidget.addEntry({
        service: 'facebook',
        element: $('#carousel .share-facebook').get(0),
        url: window.location.href,
        title: title,
        type: 'large',
        image: images[ 0 ],
        summary: subtitle
      });

      stWidget.addEntry({
        service: 'twitter',
        element: $('#carousel .share-twitter').get(0),
        url: window.location.href,
        title: title,
        type: 'large',
        image: images[ 0 ],
        summary: subtitle
      });

      stWidget.addEntry({
        service: 'pinterest',
        element: $('#carousel .share-pinterest').get(0),
        url: window.location.href,
        title: title,
        type: 'large',
        image: images[ 0 ],
        summary: subtitle
      });


      $carousel.find('.close-carousel').on('click', function (event) {
        closeGallery();
      });

      $('#left-off-canvas-toggle').click(function () {
        closeGallery();
      });

      $('#right-off-canvas-toggle').click(function () {
        closeGallery();
      });

      if (count == 1) {
        $('#carousel').attr('data-carousel-count', 1);
      }

      if (thumbnailSlidesToShow(screenSize) === 2) {
        $('#thumbnails-carousel')
                .slickSetOption('slidesToShow', thumbnailSlidesToShow(screenSize), true);
      }

      $('#main-carousel').slickGoTo(initialSlide, false);

      var ga = function (label, gaAction, extraTag) {
        window.TheRedPin.sendGa({
          ga_call: 'send',
          ga_event: 'event',
          ga_category: 'Soft',
          ga_action: gaAction,
          ga_label: extraTag + label,
          ga_value: 0
        });
      };

      var layer = window.TheRedPin.getLayerLabel();

      var gaAction = 'SocialSharing';
      var label = '';

      var extraTag = '';
      if (layer === 'VIP') {
        extraTag = 'VIP';
      }

      $('.share-facebook .stButton').one('click', 'span', function () {
        label = 'GalleryFacebook';
        ga(label, gaAction, extraTag);
      });

      $('.share-twitter .stButton').one('click', 'span', function () {
        label = 'GalleryTwitter';
        ga(label, gaAction, extraTag);
      });

      $('.share-pinterest .stButton').one('click', 'span', function () {
        label = 'GalleryPinterest';
        ga(label, gaAction, extraTag);
      });

      setGalleryScrolling();

    });

    $.subscribe('main.window_size_changed', function (event, data) {
      slidesToShow = data.size == 'small' ? 1 : data.size == 'medium' ? 2 : 3;
      $slick.slickSetOption('slidesToShow', slidesToShow, true);
      $slick.css({ height: data.width / slidesToShow * 9 / 16 });
      $('#thumbnails-carousel')
        .slickSetOption('slidesToShow', thumbnailSlidesToShow(data.size), true);
    });


  });

  window.addEventListener('keydown', function (e) {
    // escape key
    if (e.keyCode == 27) {
      closeGallery();
    }
    // right arrow
    if (e.keyCode == 39 && galleryCTAClosed()) {
      $('#main-carousel').slickNext();
    }
    // left arrow
    if (e.keyCode == 37 && galleryCTAClosed()) {
      $('#main-carousel').slickPrev();
    }

  });

  function galleryCTAClosed () {
    return ($('.gallery-book-a-tour-modal').length > 0 ? false : true);
  }

  function setGalleryScrolling () {
    $('body').css({ overflow: 'hidden' });
    $('#carousel').css({ 'overflow-y': 'auto', 'overflow-x': 'hidden' });
  }

  function enableBodyScroll () {
    $('body').css({ overflow: 'auto' });
  }

  function closeGallery () {
    $('#main-carousel').unslick();
    $('#thumbnails-carousel').unslick();
    $('#carousel').remove();
    $('body').css({ overflow: 'auto' });
    $(document).off('keydown');
    $('html, body').off('touchstart touchmove');
    enableBodyScroll();
  }

  function clickedIsPhoto (button) {
    return ($(button).parent('.photo').length > 0);
  }

  var photoCount = $('[data-carousel]').data('count');
  function thumbnailSlidesToShow (screenSize) {
    if (screenSize === 'large') {
      return (photoCount >= 5 ? 5 : photoCount);
    } else {
      return (photoCount >= 3 ? 3 : photoCount);
    }
  }

});
