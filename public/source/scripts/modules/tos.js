define('ddfModel', [ 'main' ], function () {
  var DDFModel = Backbone.Model.extend({
    defaults: {
      title: '<div class="h4">No obligations - the local real estate board ' +
      'requires this to view property details</div>',
      p1: '<p>REALTOR®, REALTORS®, and the REALTOR® logo are certification marks that are owned by ' +
      'REALTOR® Canada Inc. and licensed exclusively to The Canadian Real Estate Association (CREA). ' +
      'These certification marks identify ' +
      'real estate professionals who are members of CREA and who must abide by CREA\'s By-Laws, Rules, ' +
      'and the REALTOR® Code. The MLS® trademark and the MLS® logo are owned by CREA and ' +
      'identify the quality of services provided by real estate professionals who are members of CREA.</p>',
      p2: '<p>The information contained on this site is based in whole or in part on information ' +
      'that is provided by members of The Canadian Real Estate Association, who are responsible for its accuracy. ' +
      'CREA reproduces and distributes this information as a service for its members ' +
      'and assumes no responsibility for its accuracy.</p>',
      p3: '<p>This website is operated by TheRedPin, Brokerage - a member of The Canadian Real Estate Association.</p>',
      p4: '<p>The listing content on this website is protected by copyright and other laws, ' +
          'and is intended solely for the private, ' +
          'non-commercial use by individuals. Any other reproduction, distribution or use of the content, ' +
          'in whole or in part, is specifically forbidden. ' +
          'The prohibited uses include commercial use, "screen scraping", "database scraping", ' +
          'and any other activity intended to collect, store, reorganize ' +
          'or manipulate data on the pages produced by or displayed on this website.</p>'
    }
  });

  return DDFModel;
});

define('tosView', [ 'main', 'ddfModel' ], function (Main, DDFModel) {
  var TOSView = Backbone.View.extend({
    template: null,
    id: 'tos-modal',
    tagName: 'div',
    events: {
      'click .accept': 'acceptTOS'
    },
    buttons: {
      notAgree: '<a href="@@" class="back-to-map">I do not agree.</a>',
      agree: '<button class="button radius right accept">I agree. Now show me this home.</button>'
    },

    initialize: function () {
      this.getTOSModel();
      this.model.set('notAgree', this.buttons.notAgree.replace('@@', $('#property-profile').data('map-link')));
      this.model.set('agree', this.buttons.agree);
      this.template = _.template($('#tos-modal-template').html());
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template(this.model.toJSON()));
      return this;
    },

    getTOSModel: function () {
      var tos = $('#property-profile').data('tos');
      switch (tos) {
        case 'ddf':
          this.model = new DDFModel();
          console.log(this.model);
          break;
        default:
          this.model = new DDFModel();
      }
    },

    acceptTOS: function () {
      window.TheRedPin.Storage.set('ddf-tos', 1);
      $.publish('tos.ddf-accept');
    }

  });

  return TOSView;
});

//App

define('tos', [ 'main', 'tosView' ],
function (Main, TOSView) {

  var inited = false;
  var tosModal = null;
  var init = function () {
    tosModal = new TOSView();
    tosModal.render();
    inited = true;
  };

  var place = function (el) {
    if (!inited) {
      init();
    }
    $(el).html(tosModal.$el);
  };

  return place;

});