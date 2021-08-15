//Models

define('login', [ 'main' ], function () {
  var Login = Backbone.Model.extend({
    url: TheRedPin.url + 'sessions',
    defaults: {
      client_id: 'trpweb'
      , client_secret: 'theredpin'
      , grant_type: 'password'
      , headerMessage: null
      , finePrint: null
      , subscriptionCheckbox: true
    }
  });

  return Login;
});

define('registration', [ 'main' ], function () {
  var Registration = Backbone.Model.extend({
    url: TheRedPin.url + 'users',
    defaults: {
      subscription_source: 'registration',
      headerMessage: null,
      finePrint: null,
      subscriptionCheckbox: true
    }
  });
  return Registration;
});

define('emailcheck', [ 'main' ], function () {
  var EmailCheck = Backbone.Model.extend({
    urlRoot: TheRedPin.url + 'users/'
  });

  return EmailCheck;
});

define('activate', [ 'main' ], function () {
  var Activate = Backbone.Model.extend({
    urlRoot: TheRedPin.url + 'users/'
  });

  return Activate;
});

define('changepassword', [ 'main' ], function () {
  var ChangePassword = Backbone.Model.extend({
    urlRoot: TheRedPin.url + 'users/'
  });

  return ChangePassword;
});

define('forgotpassword', [ 'main' ], function () {
  var ForgotPassword = Backbone.Model.extend({
    urlRoot: TheRedPin.url + 'events/?type=forgot-password'
  });

  return ForgotPassword;
});

define('resetpassword', [ 'main' ], function () {
  var ResetPassword = Backbone.Model.extend({
    urlRoot: TheRedPin.url + 'users/'
  });

  return ResetPassword;
});

//Views

define('activateview', [ 'main' ], function () {
  var ActivateView = Backbone.View.extend({
    startTemplate: null,
    successTemplate: null,
    failTemplate: null,
    template: null,
    state: null,
    states: {
      activating: 'activating',
      success: 'success',
      failure: 'failure'
    },
    messages: {
      ACTIVATED: 'Awesome! Your account has been activated successfully.',
      NOT_FOUND: 'The link you used is no longer valid'
    },

    events: {
      'click button': 'logIn'
    },

    initialize: function (options) {
      this.startTemplate = _.template($('#account-email-activate-template').html());
      this.successTemplate = _.template($('#account-email-activated-template').html());
      this.failTemplate = _.template($('#account-email-activate-failure-template').html());
      this.setState(this.states.activating, false);
    },

    activate: function () {
      var self = this;
      this.model.set('id', $.getQueryStringParameter('code'));
      this.model.url = this.model.url() + '?type=validation&role=3';
      this.model.save({}, {
        success: function (model, response) {
          self.setState(self.states.success, true);
        },
        error: function (model, response) {
          var message = response.responseJSON.message;
          if (message === 'ACTIVATED' || message === 'NOT_FOUND') {
            self.model.set('error', self.messages[response.responseJSON.result.message]);
          } else {
            self.model.set('error', 'Oops! A server error occured.');
          }
          self.setState(self.states.failure, true);
        }
      });
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template(this.model.toJSON()));

      return this;
    },

    setState: function (state, render) {
      this.state = state;
      switch (this.state) {
        case this.states.activating:
          this.template = this.startTemplate;
          this.activate();
          break;
        case this.states.success:
          this.template = this.successTemplate;
          break;
        case this.states.failure:
          this.template = this.failTemplate;
          break;
      }

      if (render) {
        this.render();
      }
    },

    logIn: function () {
      window.location.hash = 'login';
    }

  });

  return ActivateView;
});

define('emailfieldview', [ 'main' ], function () {
  var LiveEmailFieldView = Backbone.View.extend({
    template: null,
    options: null,
    input: null,

    events: {
      'keyup input': 'clearLiveEmailCheck',
      'blur input': 'liveEmailCheck'
    },

    initialize: function (options) {
      this.template = _.template($('#account-email-field-template').html());
      this.options = options;
    },

    liveEmailCheck: function () {
      var self = this;
      if (!this.input.is('[data-invalid]') && !this.input.is('[data-email-exists]')) {
        this.model.set('id', _.string.trim(this.input.val()));
        this.model.fetch({
          data: {
            role: 3
          },
          success: function (model, response) {
            self.input.attr('data-email-exists', response.result);
            self.input.trigger('blur');
          }
        });
      }
    },

    clearLiveEmailCheck: function () {
      this.input.removeAttr('data-email-exists');
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template(this.options));
      this.input = $el.find('input');

      return this;
    }

  });

  return LiveEmailFieldView;
});

define('loginview', [ 'main', 'emailfieldview', 'emailcheck' ]
, function (main, EmailField, EmailCheckModel) {
  var LoginView = Backbone.View.extend({
    template: null,
    id: 'account-login',
    tagName: 'div',
    emailContainerSelector: '.emailContainer',
    emailFieldView: null,
    emailID: 'account-name-1',
    emailName: 'username',
    emailShouldMatch: true,
    initMessages: {
      t: 'Your session has timed out; please login again.',
      base: '<p>Login to your account now.</p>',
      p: '<p>Login to your account now.' +
         '<br/><br/>' +
         'You may also <a href="@@">search for public properties in the same area</a></p>',
      b: '<a href="@@" class="right back-to-map">See other results</a>',
      fav: '<p>You must login in order to add to your Favourites.</p>',
      partner: '<p>Login to your account now.</p>'
    },

    events: {
      submit: 'submit',
      'click a[href="#register"]': 'gaSendLoginToRegister'
    },

    initialize: function (options) {
      this.template = _.template($('#account-login-template').html());
      var self = this;
      this.accountOptions = options.accountOptions || {};
      var finePrintTemplate = this.accountOptions.finePrint || 'default';
      this.finePrintTemplate = _.template($('#account-fine-print-' + finePrintTemplate + '-template').html());
      var initMessage = _.has(this.accountOptions, 'message') ?
                          this.accountOptions.message : $.getQueryStringParameter('m');
      this.autoRefresh = _.has(this.accountOptions, 'autoRefresh') ?
                          this.accountOptions.autoRefresh : true;
      if (initMessage != null) {
        this.model.set('initMessage',
          this.initMessages[initMessage].replace('@@', $('#property-profile').data('map-link')));
        if (initMessage != 'fav' && !this.accountOptions.hideMapButton) {
          this.model.set('initButton',
            this.initMessages.b.replace('@@', $('#property-profile').data('map-link')));
        }
      } else {
        this.model.set('initMessage', this.initMessages.base);
      }
      if (this.accountOptions.hasOwnProperty('headerMessage')) {
        this.model.set('headerMessage', this.accountOptions.headerMessage);
      }
      $.publish('oauth.logout');
    },

    gaSendLoginToRegister: function () {
      var self = this;
      var ga   = self.accountOptions.ga;
      if (ga) {
        window.ga('send', 'event', 'Soft', ga.logToReg, 'Authentication');
      } else {
        window.ga('send', 'event', 'Soft', 'LoginToRegister', 'Authentication');
      }
    },

    getEmailFieldView: function () {
      this.emailFieldView = new EmailField({
        model: new EmailCheckModel(),
        emailID: this.emailID,
        emailName: this.emailName,
        emailShouldMatch: this.emailShouldMatch
      });
      this.emailFieldView.render();
      return this.emailFieldView;
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template(this.model.toJSON()));
      $el.find(this.emailContainerSelector).html(this.getEmailFieldView().$el);
      $el.foundation();

      return this;
    },

    submit: function () {
      this.model.set('initMessage', '');
      this.model.set('initButton', '');
      var $form = this.$el.find('form').addClass('loading');
      var $serverError = this.$el.find('.server-error').removeClass('server-error-active');
      this.$el.find('.server-error.onload').remove();
      var self = this;
      var ga = self.accountOptions.ga;
      this.model.save(
        {
          username: _.string.trim($('input[name="username"]', this.$el).val())
          , password: _.string.trim($('input[name="password"]', this.$el).val())
        }, {
          success: function (model, response) {
            var controller = $('[data-controller]').data('controller');
            if (ga) {
              window.ga('send', 'event', 'Soft', ga.logSub, 'Authentication');
            } else {
              window.ga('send', 'event', 'Soft', 'Login - Submit', 'Authentication');
            }

            $.publish('oauth.login', response);

            if (self.autoRefresh && (controller == 'listview' || controller == 'account')) {
              window.location.reload();
            } else if (self.accountOptions.redirect) {
              self.redirect();
            } else {
              $.publish('oauth.login-close-modal');
              window.location.hash = 'logged';
              $form.removeClass('loading');
            }
          },
          error: function (model, response) {
            if (response.responseJSON.message === 'Invalid resource owner credentials') {
              $serverError.addClass('server-error-active');
            } else {
              window.location.hash = 'activate';
            }
            $form.removeClass('loading');
          }
        }
      );

      return false;
    },

    redirect: function () {
      var self = this;
      var redirect = self.accountOptions.redirect;
      redirect += self.accountOptions.keepSearch ? window.location.search : '';
      window.location.href = redirect;
    }

  });

  return LoginView;
});

define('registrationview', [ 'main', 'emailfieldview', 'emailcheck', 'login' ]
, function (main, EmailField, EmailCheckModel, LoginModel) {
  var RegistrationView = Backbone.View.extend({
    template: null,
    id: 'account-register',
    tagName: 'div',
    emailContainerSelector: '.emailContainer',
    emailFieldView: null,
    emailID: 'account-name-2',
    emailName: 'email',
    emailShouldMatch: false,
    initMessages: {
      t: 'Your session has timed out; please login again.',
      base: '<p>The local MLS&reg; board requires a free,' +
            ' no-obligation account before viewing certain properties.</p>',
      p: '<p>The local MLS&reg; board requires a free, no-obligation account before viewing certain properties.' +
         '<br/><br/>' +
         'You may also <a href="@@">search for public properties in the same area</a></p>',
      b: '<a href="@@" class="right back-to-map">See other results</a>',
      fav: '<p>In less than 30 seconds, you can save an unlimited number of Favourites!' +
        ' Simply fill out the form below.  No one from TheRedPin will contact you. </p>',
      partner: '<p>Sadly, the local real estate board has rules! We need your name and email' +
      ' address to show you the listings. TheRedPin promises not to put you on any third party marketing lists!</p>'
    },

    events: {
      submit: 'submit',
      'click a[href="#login"]': 'gaSendRegisterToLogin'
    },

    initialize: function (options) {
      this.accountOptions = options.accountOptions || {};
      var finePrintTemplate = this.accountOptions.finePrint || 'default';
      this.finePrintTemplate = _.template($('#account-fine-print-' + finePrintTemplate + '-template').html());
      var initMessage = this.accountOptions.message ? this.accountOptions.message : $.getQueryStringParameter('m');
      this.autoRefresh = this.accountOptions.autoRefresh ? this.accountOptions.autoRefresh : true;
      if (initMessage != null) {
        this.accountOptions.initMessage =
          this.initMessages[initMessage].replace('@@', $('#property-profile').data('map-link'));
        if (initMessage != 'fav' && !this.accountOptions.hideMapButton) {
          this.accountOptions.initButton =
            this.initMessages.b.replace('@@', $('#property-profile').data('map-link'));
        }
      } else {
        this.accountOptions.initMessage = this.initMessages.base;
      }
      this.template = _.template($('#account-registration-template').html());
    },

    gaSendRegisterToLogin: function () {
      var self = this;
      var ga   = self.accountOptions.ga;
      if (ga) {
        window.ga('send', 'event', 'Soft', ga.regToLog, 'Authentication');
      } else {
        window.ga('send', 'event', 'Soft', 'RegisterToLogin', 'Authentication');
      }
    },

    getEmailFieldView: function () {
      this.emailFieldView = new EmailField({
        model: new EmailCheckModel(),
        emailID: this.emailID,
        emailName: this.emailName,
        emailShouldMatch: this.emailShouldMatch
      });
      this.emailFieldView.render();
      return this.emailFieldView;
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template(_.extend(this.model.toJSON(), this.accountOptions)));
      $el.find(this.emailContainerSelector).html(this.getEmailFieldView().$el);
      $el.find('.terms-of-use-footer').html(this.finePrintTemplate());
      $el.foundation();

      return this;
    },

    submit: function () {
      var self = this;
      var ga = self.accountOptions.ga;
      var $form = this.$el.find('form').addClass('loading');
      var $serverError = this.$el.find('.server-error').removeClass('server-error-active');
      var landingPage = window.TheRedPin.Reporting.get('landing-page')
        , trackPageUrl = window.location.href
        , httpReferrer = window.TheRedPin.Reporting.get('referrer')
        , ip = window.TheRedPin.Reporting.get('ip')
        , contactBrowser = window.TheRedPin.Reporting.get('browser')
        , contactBrowserVer = window.TheRedPin.Reporting.get('browser-ver')
        , contactOs = window.TheRedPin.Reporting.get('os')
        , contactOsVer = window.TheRedPin.Reporting.get('os-ver')
        , trackMarketoCookie = $.cookie('_mkto_trk');
      this.model.save(
        {
          full_name: _.string.trim($('input[name="full_name"]', this.$el).val())
          , email: _.string.trim($('input[name="email"]', this.$el).val())
          , password: _.string.trim($('input[name="password"]', this.$el).val())
          , phone: _.string.trim($('input[name="phone"]', this.$el).val())
          , subscribe: $('#newsletter-subscription').is(':checked')
          , track_landing_url: landingPage
          , track_page_url: trackPageUrl
          , track_http_referrer: httpReferrer
          , track_ip: ip
          , track_browser: contactBrowser
          , track_browser_version: contactBrowserVer
          , track_os: contactOs
          , track_os_version: contactOsVer
          , track_marketo_cookie: trackMarketoCookie
        }, {
          success: function (model, response) {
            if (ga) {
              window.ga('send', 'event', 'Soft', ga.regSub, 'Authentication', 25);
            } else {
              window.ga('send', 'event', 'Soft', 'Register - Submit', 'Authentication', 25);
            }
            self.autoLogin();
          },
          error: function (model, response) {
            $serverError.addClass('server-error-active');
            _.each(response.responseJSON.errors, function (ele) {
              var $el = $form.find('[name=' + ele.field + ']');
              $el.attr('data-invalid', true);
              var $parent = $el.parent();
              $parent.addClass('error');
              $parent.find('small').html(ele.message);
            });
            $form.removeClass('loading');
          }
        }
      );

      return false;
    },

    autoLogin: function () {
      var self = this;
      var $form = this.$el.find('form').addClass('loading');
      var loginModel = new LoginModel();
      loginModel.save(
        {
          username: self.model.get('email')
          , password: self.model.get('password')
        }, {
          success: function (model, response) {
            $.publish('oauth.login', response);
            if (self.accountOptions.redirect) {
              self.redirect();
            } else {
              window.location.hash = 'autologged';
            }
            setTimeout(function () {
              $.publish('oauth.login-close-modal');
            }, 1000);
            $form.removeClass('loading');
          },
          error: function (model, response) {
            if (response.responseJSON.message === 'Invalid resource owner credentials') {
              window.location.hash = 'login';
            } else {
              window.location.hash = 'activate';
            }
            $form.removeClass('loading');
          }
        }
      );

      return false;
    },

    redirect: function () {
      var self = this;
      var redirect = self.accountOptions.redirect;
      redirect += self.accountOptions.keepSearch ? window.location.search : '';
      window.location.href = redirect;
    }
  });

  return RegistrationView;
});

define('activationview', [ 'main' ], function () {
  var LoginView = Backbone.View.extend({
    template: null,
    id: 'account-activate',
    tagName: 'div',

    events: {
    },

    initialize: function (options) {
      this.template = _.template($('#account-activate-template').html());
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template());

      return this;
    }

  });

  return LoginView;
});

define('activateemailresentview', [ 'main' ], function () {
  var LoginView = Backbone.View.extend({
    template: null,
    id: 'account-resent',
    tagName: 'div',

    events: {
    },

    initialize: function (options) {
      this.template = _.template($('#account-activate-email-resent-template').html());
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template());

      return this;
    }

  });

  return LoginView;
});

define('loggedview', [ 'main' ], function () {
  var LoginView = Backbone.View.extend({
    template: null,
    id: 'account-logged',
    tagName: 'div',
    destination: null,

    events: {
    },

    initialize: function (options) {
      this.destination = $.getQueryStringParameter('destination'); //$.cookie('destination');
      if (this.destination) {
        this.template = _.template($('#account-logged-destination-template').html());
      } else {
        this.template = _.template($('#account-logged-template').html());
      }
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template({ destination: this.destination }));
      if (this.destination) {
        window.location.href = this.destination;
      }

      // need to ensure the modal closes and remove auth-required attribute so the user can navigate
      setTimeout(function () {
        $.publish('oauth.login-close-modal');
        $.publish('oauth.login-complete');
      }, 1000);

      return this;
    }

  });

  return LoginView;
});

define('logoutview', [ 'main' ], function () {
  var LogoutView = Backbone.View.extend({
    template: null,
    id: 'account-logout',
    tagName: 'div',

    events: {
      'auth.showing': 'logout'
    },

    initialize: function (options) {
      this.template = _.template($('#account-logout-template').html());
    },

    logout: function () {
      $.publish('oauth.logout');
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template());

      return this;
    }

  });

  return LogoutView;
});

define('autologinview', [ 'main' ], function () {
  var AutoLoginView = Backbone.View.extend({
    template: null,
    id: 'account-autologin',
    tagName: 'div',

    events: {
    },

    initialize: function (options) {
      this.template = _.template($('#account-autologin-template').html());
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template());

      return this;
    }

  });

  return AutoLoginView;
});

define('changepasswordview', [ 'main' ], function () {
  var ChangePasswordView = Backbone.View.extend({
    template: null,
    id: 'account-changepassword',
    tagName: 'div',
    state: null,
    states: {
      changePassword: 'changepassword',
      error: 'error',
      passwordChanged: 'passwordchanged'
    },

    events: {
      submit: 'submit',
      'click #change-password': 'renderChangePass',
      'click #changepassword-submit': 'removeServerError'
    },
    initialize: function (options) {
      var self = this;
      $('a.changepassword').click(function () { self.renderChangePass(); });
      this.changePasswordTemplate = _.template($('#account-changepassword-template').html());
      this.errorTemplate = _.template($('#account-changepassword-error-template').html());
      this.passwordChangedTemplate = _.template($('#account-changepassword-success-template').html());
      this.template = this.changePasswordTemplate;
    },

    submit: function (e) {
      e.preventDefault();
      var self = this
        , $form = self.$el.find('form').addClass('loading')
        , $serverError = self.$el.find('.server-error').removeClass('server-error-active')
        , userEmail = $.cookie('trp_user_email')
        ;

      self.model.url = self.model.urlRoot + userEmail + '?role=3&type=changepassword';
      var data = {
                  password: _.string.trim($('input[name="oldpassword"]', this.$el).val()),
                  new_password: _.string.trim($('input[name="newpassword"]', this.$el).val())
                };
      $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: self.model.url,
        data: JSON.stringify(data),
        success: function (response) {
          $form.removeClass('loading');
          if (response.result === 'Invalid password') {
            $serverError.addClass('server-error-active');
          } else {
            self.gaChangePassword();
            $form.trigger('reset');
            self.setState(self.states.passwordChanged, true);
          }
        },
        error: function () {
          $form.removeClass('loading');
          self.setState(self.states.error, true);
        }
      });
    },

    removeServerError: function () {
      this.$el.find('.server-error').removeClass('server-error-active');
    },

    renderChangePass: function () {
      this.setState(this.states.changePassword, true);
    },

    gaChangePassword: function () {
      window.ga('send', 'event', 'Soft', 'ChangePassword', 'Authentication');
    },

    destroyView: function () {
      this.undelegateEvents();
      this.$el.removeData().unbind();
      this.remove();
      Backbone.View.prototype.remove.call(this);
    },

    setState: function (state, render) {
      this.state = state;
      switch (this.state) {
        case this.states.changePassword:
          this.template = this.changePasswordTemplate;
          break;
        case this.states.passwordChanged:
          this.template = this.passwordChangedTemplate;
          break;
        case this.states.error:
          this.template = this.errorTemplate;
          break;
      }

      if (render) {
        this.render();
      }
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template());
      $el.foundation();

      return this;
    }

  });

  return ChangePasswordView;
});

define('forgotpasswordview', [ 'main', 'emailfieldview', 'emailcheck' ], function (main, EmailField, EmailCheckModel) {
  var ForgotPasswordView = Backbone.View.extend({
    template: null,
    id: 'account-forgotpassword',
    tagName: 'div',
    emailContainerSelector: '.emailContainer',
    emailFieldView: null,
    emailID: 'account-name-2',
    emailName: 'email',
    emailShouldMatch: true,
    state: null,
    states: {
      forgotPassword: 'forgotPassword',
      recoverySent: 'recoverySent',
      error: 'error'
    },
    events: {
      submit: 'submit',
      'click a.forgot-password': 'setForgotPasswordTemplate'
    },

    initialize: function (options) {
      this.recoverySentTemplate = _.template($('#account-recoverysent-template').html());
      this.errorTemplate = _.template($('#account-forgotpassword-error-template').html());
      this.template = _.template($('#account-forgotpassword-template').html());
    },

    submit: function (e) {
      e.preventDefault();
      var self = this;
      var $form = self.$el.find('form').addClass('loading')
        , sysTime = new Date($('[data-sys-date-time]').data('sys-date-time'))
        , elapsedSeconds = window.TheRedPin.OAuth.elapsedTime() / 1000
        ;

      // get current server time by adding elapsed seconds since page load
      sysTime.setSeconds(sysTime.getSeconds() + elapsedSeconds);
      var formatedSysTimeOnSubmit = TheRedPin.helpers.formatTime(sysTime);

      self.model.save(
        {
          email: _.string.trim($('input[name="email"]', this.$el).val())
          , track_http_referrer: window.TheRedPin.Reporting.get('referrer')
          , track_landing_url: window.TheRedPin.Reporting.get('landing-page').toLowerCase()
          , track_ip: window.TheRedPin.Reporting.get('ip')
          , track_browser: window.TheRedPin.Reporting.get('browser')
          , track_browser_version: window.TheRedPin.Reporting.get('browser-ver')
          , track_os: window.TheRedPin.Reporting.get('os')
          , track_os_version: window.TheRedPin.Reporting.get('os-ver')
          , track_marketo_cookie: $.cookie('_mkto_trk')
          , track_page_url: window.location.href
          // , contact_conversion_url: window.location.href
          // , contact_type: 'buyer'
          // , contact_source: 'website-form'
        }, {
          success: function (model, response) {
            self.gaForgotPassword();
            $form.removeClass('loading');
            self.setState('recoverySent', true);
          },
          error: function (model, response) {
            $form.removeClass('loading');
            self.setState('error', true);
          }
        }
      );
    },

    setForgotPasswordTemplate: function () {
      this.setState('forgotPassword', true);
    },

    getEmailFieldView: function () {
      this.emailFieldView = new EmailField({
        model: new EmailCheckModel(),
        emailID: this.emailID,
        emailName: this.emailName,
        emailShouldMatch: this.emailShouldMatch
      });
      this.emailFieldView.render();
      return this.emailFieldView;
    },

    gaForgotPassword: function () {
      window.ga('send', 'event', 'Soft', 'ForgotPassword', 'Authentication');
    },

    setState: function (state, render) {
      this.state = state;
      switch (this.state) {
        case this.states.recoverySent:
          this.template = this.recoverySentTemplate;
          break;
        case this.states.error:
          this.template = this.errorTemplate;
          break;
      }

      if (render) {
        this.render();
      }
    },

    destroyView: function () {
      this.undelegateEvents();
      this.$el.removeData().unbind();
      this.remove();
      Backbone.View.prototype.remove.call(this);
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template());
      $el.find(this.emailContainerSelector).html(this.getEmailFieldView().$el);
      $el.foundation();
      return this;
    }
  });

  return ForgotPasswordView;
});

define('resetpasswordview', [ 'main', 'emailfieldview', 'emailcheck' ], function (main, EmailField, EmailCheckModel) {
  var ResetPasswordView = Backbone.View.extend({
    template: null,
    id: 'account-resetpassword',
    tagName: 'div',
    states: {
      resetPassword: 'resetPassword',
      invalidToken: 'invalidToken',
      success: 'success',
      error: 'error'
    },
    valid_token: false,
    events: {
      submit: 'submit',
      'click a.forgot-password': 'setForgotPasswordTemplate'
    },

    initialize: function (options) {
      this.resetPasswordTemplate = _.template($('#account-resetpassword-template').html());
      this.invalidTokenTemplate  = _.template($('#account-resetpassword-invalidtoken-template').html());
      this.errorTemplate         = _.template($('#account-resetpassword-error-template').html());
      this.successTemplate       = _.template($('#account-resetpassword-success-template').html());

      this.model.set('email', '');
      this.getAccessToken();
      this.tempate = this.resetPasswordTemplate;
    },

    getAccessToken: function () {
      var queryParameters = TheRedPin.helpers.queryParameters(window.location.search);
      var accessToken = queryParameters['?token'];
      this.model.set('access_token', accessToken);
    },

    setTemplateFromToken: function () {
      var deferred = new $.Deferred();
      var self = this;
      var accessToken = self.model.get('access_token');
      // call to backend to verify token and get user info
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: TheRedPin.url + 'users/' + accessToken + '?response=token-check&role=3',
        success: function (response) {
          if (response.result === false) {
            self.template = self.invalidTokenTemplate;
            deferred.resolve();
          } else {
            self.model.set('email', response.result.username);
            self.template = self.resetPasswordTemplate;
            deferred.resolve();
          }
        },
        error: function (response) {
          self.template = self.errorTemplate;
          deferred.resolve();
        }
      });
      return deferred;
    },

    submit: function (e) {
      e.preventDefault();
      var self = this;
      var $form = self.$el.find('form').addClass('loading');
      var data = {
            password: _.string.trim($('input[name="newpassword"]', this.$el).val())
          };
      $.ajax({
        type: 'PUT',
        dataType: 'json',
        processData: false,
        url: self.model.urlRoot + self.model.get('access_token') + '?role=3&type=forgotpassword',
        data: JSON.stringify(data),
        success: function (response) {
          self.gaResetPassword();
          $form.removeClass('loading');
          self.setState('success', true);
        },
        error: function (response) {
          $form.removeClass('loading');
          self.setState('error', true);
        }
      });
    },
    setState: function (state, render) {
      this.state = state;
      switch (this.state) {
        case this.states.resetPassword:
          this.template = this.resetPasswordTemplate;
          break;
        case this.states.success:
          this.template = this.successTemplate;
          break;
        case this.states.error:
          this.template = this.errorTemplate;
          break;
        case this.states.invalidToken:
          this.template = this.invalidTokenTemplate;
          break;
      }

      if (render) {
        this.render();
      }
    },

    setForgotPasswordTemplate: function () {
      window.location.hash = '#forgotpassword';
    },

    gaResetPassword: function () {
      window.ga('send', 'event', 'Soft', 'ResetPassword', 'Authentication');
    },

    getEmailFieldView: function () {
      this.emailFieldView = new EmailField({
        model: new EmailCheckModel(),
        emailID: this.emailID,
        emailName: this.emailName,
        emailShouldMatch: this.emailShouldMatch
      });
      this.emailFieldView.render();
      return this.emailFieldView;
    },

    destroyView: function () {
      this.undelegateEvents();
      this.$el.removeData().unbind();
      this.remove();
      Backbone.View.prototype.remove.call(this);
    },

    render: function () {
      var self = this;
      if (self.template !== self.successTemplate && self.template !== self.errorTemplate) {
        $.when(self.setTemplateFromToken()).then(function () {
          self.renderTemplate();
          return self;
        });
      } else {
        self.renderTemplate();
        return self;
      }
    },

    renderTemplate: function () {
      var $el = $(this.el);
      $el.html(this.template(this.model.toJSON()));
      $el.find(this.emailContainerSelector).html(this.getEmailFieldView().$el);
      $el.foundation();
    }
  });

  return ResetPasswordView;
});

define('panelview', [
  'main'
  , 'login'
  , 'loginview'
  , 'logoutview'
  , 'registration'
  , 'registrationview'
  , 'activationview'
  , 'activateemailresentview'
  , 'loggedview'
  , 'activate'
  , 'activateview'
  , 'autologinview'
  , 'changepassword'
  , 'changepasswordview'
  , 'forgotpasswordview'
  , 'forgotpassword'
  , 'resetpasswordview'
  , 'resetpassword'
],
function (
  Main
  , Login
  , LoginView
  , LogoutView
  , Registration
  , RegistrationView
  , ActivationView
  , ResentView
  , LoggedView
  , Activate
  , ActivateView
  , AutoLoginView
  , ChangePassword
  , ChangePasswordView
  , ForgotPasswordView
  , ForgotPassword
  , ResetPasswordView
  , ResetPassword
) {
  var PanelView = Backbone.View.extend({
    template: null,
    id: 'account-panel',
    tagName: 'div',
    states: {
      login: {
        key: 'login',
        view: LoginView,
        model: Login
      },
      register: {
        key: 'register',
        view: RegistrationView,
        model: Registration
      },
      activate: {
        key: 'activate',
        view: ActivationView
      },
      resent: {
        key: 'resent',
        view: ResentView
      },
      logged: {
        key: 'logged',
        view: LoggedView
      },
      logout: {
        key: 'logout',
        view: LogoutView
      },
      activating: {
        key: 'activating',
        view: ActivateView,
        model: Activate
      },
      autologged: {
        key: 'autologged',
        view: AutoLoginView
      },
      changepassword: {
        key: 'changepassword',
        view: ChangePasswordView,
        model: ChangePassword
      },
      forgotpassword: {
        key: 'forgotpassword',
        view: ForgotPasswordView,
        model: ForgotPassword
      },
      resetpassword: {
        key: 'resetpassword',
        view: ResetPasswordView,
        model: ResetPassword
      }
    },
    state: null,
    $content: null,
    contentSelector: '.account-panel-content',

    events: {
    },

    initialize: function (options) {
      this.template = _.template($('#account-panel-template').html());
      this.accountOptions = options.accountOptions || {};
      this.on('setState', this.setState);
      var destination = $.getQueryStringParameter('destination');
      if (destination !== null) {
        $.cookie('destination', destination, { expires: 3 });
      }
    },

    setState: function (state) {
      if (!state) {
        state = this.states.login;
      }
      var logged = window.TheRedPin.OAuth.isAuthenticated();
      if (logged && (state != this.states.logout &&
                     state != this.states.autologged &&
                     state != this.states.changepassword)) {
        if (this.accountOptions.redirect) {
          this.redirect();
        }
        state = this.states.logged;
      }
      if (!logged && state == this.states.changepassword) {
        state = this.states.login;
      }
      this.state = state;
      this.handleSubview();
    },

    redirect: function () {
      var self = this;
      var redirect = self.accountOptions.redirect;
      redirect += self.accountOptions.keepSearch ? window.location.search : '';
      window.location.href = redirect;
    },

    getView: function () {
      if (this.state) {
        // reset view for specific states or if not yet rendered
        if (!this.state.rendered) {
          this.setupView();
          this.state.rendered.render();
        } else if (this.state === this.states.forgotpassword ||
                   this.state === this.states.changepassword ||
                   this.state === this.state.resetpassword) {
          this.state.rendered.destroyView();
          this.setupView();
          this.state.rendered.render();
        }
        return this.state.rendered;
      } else {
        return null;
      }
    },

    setupView: function () {
      var model = null;
      if (this.state.model) {
        model = new this.state.model();
      }
      this.state.rendered = new this.state.view({
        model: model,
        accountOptions: this.accountOptions
      });
    },

    render: function () {
      var $el = $(this.el);
      $el.html(this.template());
      this.$content = $el.find(this.contentSelector);
      this.handleSubview();

      return this;
    },

    handleSubview: function () {
      var subView;
      var ga = this.accountOptions.ga;
      switch (this.state) {
        case this.states.register:
          subView = this.getView();
          if (ga) {
            window.ga('send', 'event', 'Soft', ga.regOpen, 'Authentication', 0);
          } else {
            window.ga('send', 'event', 'Soft', 'Register - Open', 'Authentication', 0);
          }
          break;
        case this.states.login:
          subView = this.getView();
          if (ga) {
            window.ga('send', 'event', 'Soft', ga.logOpen, 'Authentication', 0);
          } else {
            window.ga('send', 'event', 'Soft', 'Login - Open', 'Authentication');
          }
          break;
        default:
          subView = this.getView();
          break;
      }
      this.$content.find('> div').css({ display: 'none' });
      if (subView) {
        this.$content.append(subView.el);
        var sEl = $(subView.el);
        subView.$el.css({ display: 'block' });
        subView.$el.trigger('auth.showing');
      }
    }
  });
  return PanelView;
});


//Routes

define('authrouter', [], function () {
  return Backbone.Router.extend({
    panel: null,

    routes: {
      '*all': 'map'
    },

    initialize: function (options) {
      this.panel = options.panel;
      this.on('route:map', function (route) {
        if (this.panel.states[route]) {
          this.panel.trigger('setState', this.panel.states[route]);
        } else if (route === null) {
          this.panel.trigger('setState', this.panel.states.login);
        }
      });
    }
  });
});

//App

define('account', [ 'main', 'authrouter', 'panelview' ],
function (Main, Router, PanelView) {
  /*
  models
  - login
  - register
  - password
  - emailCheck
  views
  - accountView
    - loginView
    - registerView
    - passwordView
  */
  var inited = false;
  var panel = null;

  var init = function (accountOptions) {
    panel = new PanelView({ accountOptions: accountOptions });
    panel.render();
    var router = new Router({ panel: panel });
    Backbone.history.start();
    inited = true;

    // listen for account modal close and set hash to something that the router will not match
    $(document).on('closed.fndtn.reveal', '.account-modal', function () {
      window.location.hash = 'c';
    });
  };

  var place = function (el, accountOptions) {
    accountOptions = accountOptions || {};
    if (!inited) {
      init(accountOptions);
    } else {
      // If we're launching the account modal more than once we need to re-initialize and re-render all views
      panel.accountOptions = accountOptions;
      _.each(panel.states, function (state) {
        if (panel.state == state) {
          return;
        }
        state.rendered = null;
      });
      panel.state.rendered.initialize({ accountOptions: accountOptions });
      panel.state.rendered.render();
    }
    $(el).html(panel.$el);
  };

  return place;

});