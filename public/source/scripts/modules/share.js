define('share', [ 'vendor', '//ws.sharethis.com/button/buttons.js' ], function () {


  console.log('Share Module Started.');


  stLight.options({
    // TODO: change this to TheRedPin account's key
    publisher: 'cc83200f-329b-4324-b341-393006d953da',
    doNotHash: false,
    doNotCopy: false,
    hashAddressBar: false
  });

  var $share = $('.share');

  $share.each(function (key, value) {
    var $value = $(value)
    , $flyout = $($value.data('flyout'))
    ;

    $value.on('click', function (event) {
      event.stopImmediatePropagation();
      event.preventDefault();

      if ($value.data('ui-tooltip')) {
        $value.tooltip('close');
      }

      var topShift = $value.offset().top
      , leftShift = $value.offset().left + 20
      ;

      $value
        .flyout({
          autoShow: false,
          autoHide: false,
          content: 'adsa',
          tooltipClass: 'light',
          position: {
            my: 'left+10 center',
            at: 'right center',
            using: function (position, feedback) {
              $(this)
                .css(position)
                .removeClass('left right top bottom')
                .addClass(feedback.horizontal);
            }
          },
          open: function (event, ui) {
            ui.tooltip.html($flyout.removeClass('hidden'));
          }
        })
        .flyout('open')
        .addClass('open')
        ;


      $.subscribe('main.window_size_changed main.window_scrolled', function () {
        if ($value.is('.open')) {
          $value
            .flyout('destroy')
            .removeClass('open');
        }
      });


      $(document).one('click.share', function (event) {
        if ($value.is('.open')) {
          $value
            .flyout('destroy')
            .removeClass('open');
        }
      });

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

      $('.chicklets.facebook').parent().one('click', 'span', function () {
        label = 'StickyFooterFacebook';
        gaAction = 'SocialSharing';
        ga(label, gaAction, extraTag);
      });
      $('.chicklets.twitter').parent().one('click', 'span', function () {
        label = 'StickyFooterTwitter';
        gaAction = 'SocialSharing';
        ga(label, gaAction, extraTag);
      });
      $('.chicklets.linkedin').parent().one('click', 'span', function () {
        label = 'StickyFooterLinkedIn';
        gaAction = 'SocialSharing';
        ga(label, gaAction, extraTag);
      });
      $('.chicklets.pinterest').parent().one('click', 'span', function () {
        label = 'StickyFooterPinterest';
        gaAction = 'SocialSharing';
        ga(label, gaAction, extraTag);
      });
      $('.chicklets.email').parent().one('mouseover', 'span', function () {
        label = 'StickyFooterShareEmail';
        gaAction = 'PersonalSharing';
        ga(label, gaAction, extraTag);
      });

    });

  });

});