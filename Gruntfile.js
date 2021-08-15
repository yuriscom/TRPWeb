module.exports = function(grunt) {
  "use strict";

  /* used for cache busting */
  var timestamp = parseInt(new Date() / 1000);

  /* for finding out local IP address */
  var os = require('os');
  var ifaces = os.networkInterfaces();
  var lookupIpAddress = null;
  for (var device in ifaces) {
    if (device != 'en1' && device != 'en0') {
      continue;
    }
    ifaces[device].forEach(function(details) {
      if (details.family == 'IPv4') {
        lookupIpAddress = details.address;
      }
    });
  }

  var trpJsFileList = [
    {
      /* application main & commonly used shared modules */
      'public/assets/scripts/main.js': [
        'public/source/scripts/modules/components.js',
        'public/source/scripts/modules/search.js',
        'public/source/scripts/modules/prospect-match.js',
        'public/source/scripts/modules/mortgage-tool.js',
        'public/source/scripts/modules/favorites.js',
        'public/source/scripts/modules/ui-components.js',
        'public/source/scripts/main.js'
      ],

      /* shared modules */
      'public/assets/scripts/modules/carousel.js':      'public/source/scripts/modules/carousel.js',
      'public/assets/scripts/modules/map.js':           'public/source/scripts/modules/map.js',
      'public/assets/scripts/modules/share.js':         'public/source/scripts/modules/share.js',
      'public/assets/scripts/modules/summary.js':       'public/source/scripts/modules/summary.js',
      'public/assets/scripts/modules/contact-tools.js': 'public/source/scripts/modules/contact-tools.js',
      'public/assets/scripts/modules/floor-plans.js':   'public/source/scripts/modules/floor-plans.js',
      'public/assets/scripts/modules/grid-list-view.js':'public/source/scripts/modules/grid-list-view.js',
      'public/assets/scripts/modules/account.js':       'public/source/scripts/modules/account.js',
      'public/assets/scripts/modules/tos.js':           'public/source/scripts/modules/tos.js',
      'public/assets/scripts/modules/contact-page.js':  'public/source/scripts/modules/contact-page.js',
      'public/assets/scripts/modules/marketo-tools.js': 'public/source/scripts/modules/marketo-tools.js',

      /* pages */
      'public/assets/scripts/pages/profile.js':             'public/source/scripts/pages/profile.js',
      'public/assets/scripts/pages/exclusive-profile.js':   'public/source/scripts/pages/exclusive-profile.js',
      'public/assets/scripts/pages/hybrid.js':              'public/source/scripts/pages/hybrid.js',
      'public/assets/scripts/pages/authentication.js':      'public/source/scripts/pages/authentication.js',
      'public/assets/scripts/pages/partners-search.js':     'public/source/scripts/pages/partners-search.js',
      'public/assets/scripts/pages/content.js':             'public/source/scripts/pages/content.js',
      'public/assets/scripts/pages/exclusive-landing.js':   'public/source/scripts/pages/exclusive-landing.js',
      'public/assets/scripts/pages/education-centre.js':    'public/source/scripts/pages/education-centre.js',
      'public/assets/scripts/pages/listview.js':            'public/source/scripts/pages/listview.js',
      'public/assets/scripts/pages/account-management.js':  'public/source/scripts/pages/account-management.js',
      'public/assets/scripts/pages/agent-profile.js':       'public/source/scripts/pages/agent-profile.js',

      /* IE fixes */
      'public/assets/scripts/fix/ie.js':                'public/source/scripts/fix/ie.js'
    },

    { expand: true,
      cwd:    'public/source/scripts/ng-modules',
      src:    ['**/*.js'],
      dest:   'public/assets/scripts/ng-modules'
    },
  ];

  var dependencyJsFileList = [
    /* separate vendor libraries */
    { 'public/assets/scripts/vendor/hammer.js':                 'public/source/scripts/vendor/hammer.js' },
    { 'public/assets/scripts/vendor/google/markerwithlabel.js': 'public/source/scripts/vendor/google/markerwithlabel.js' },
    { 'public/assets/scripts/vendor/google/markeranimate.js':   'public/source/scripts/vendor/google/markeranimate.js' },
    /* Foundation components */
    { expand: true,
      cwd:    'public/source/scripts/vendor/foundation',
      src:    ['**/*.js', '!foundation.js'],
      dest:   'public/assets/scripts/vendor/foundation'
    },
    /* jQuery UI widgets & plugins */
    { expand: true,
      cwd:    'public/source/scripts/vendor/jquery/ui',
      src:    ['**/*.js', '!jquery.js'],
      dest:   'public/assets/scripts/vendor/jquery'
    },
    /* RequireJS plugins */
    { expand: true,
      cwd:    'public/source/scripts/vendor/require',
      src:    ['**/*.js', '!require.js'],
      dest:   'public/assets/scripts/vendor/require'
    },
    /* 3rd party jQuery widgets and plugins */
    { 'public/assets/scripts/vendor/jquery/jquery.slick.js':        'public/source/scripts/vendor/jquery/jquery.slick.js' },
    { 'public/assets/scripts/vendor/jquery/jquery.nouislider.all.js':        'public/source/scripts/vendor/jquery/jquery.nouislider.all.js' },
    { 'public/assets/scripts/vendor/text.js':        'public/source/scripts/vendor/text' },
    { 'public/assets/scripts/vendor/jquery/jquery.selectize.js':    'public/source/scripts/vendor/jquery/jquery.selectize.js' },
    { 'public/assets/scripts/vendor/jquery/jquery.nanoscroller.js': 'public/source/scripts/vendor/jquery/jquery.nanoscroller.js' }
  ];

  var vendorJsFileList = [
    /* concatenated common vendor libraries */
    { 'public/assets/scripts/vendor/vendor.js': [
      'public/source/scripts/initial.js',
      'public/source/scripts/vendor/fastclick.js',
      'public/source/scripts/vendor/microplugin.js',
      'public/source/scripts/vendor/sifter.js',
      'public/source/scripts/vendor/jquery/jquery.js',
      'public/source/scripts/vendor/jquery/jquery.cookie.js',
      'public/source/scripts/vendor/jquery/jquery.placeholder.js',
      'public/source/scripts/vendor/jquery/jquery.selectize.js',
      'public/source/scripts/vendor/jquery/ui/jquery.ui.core.js',
      'public/source/scripts/vendor/jquery/ui/jquery.ui.widget.js',
      'public/source/scripts/vendor/jquery/ui/jquery.ui.mouse.js',
      'public/source/scripts/vendor/jquery/ui/jquery.ui.effect.js',
      'public/source/scripts/vendor/underscore.js',
      'public/source/scripts/vendor/underscore.string.js',
      'public/source/scripts/vendor/backbone.js',
      'public/source/scripts/vendor/angular.js',
      'public/source/scripts/vendor/angular-route.js',
      'public/source/scripts/vendor/foundation/foundation.js',
      'public/source/scripts/vendor/foundation/foundation.topbar.js',
      'public/source/scripts/vendor/foundation/foundation.offcanvas.js',
      'public/source/scripts/vendor/foundation/foundation.abide.js',
      'public/source/scripts/vendor/foundation/foundation.alert.js',
      'public/source/scripts/vendor/foundation/foundation.reveal.js',
      'public/source/scripts/vendor/foundation/foundation.tab.js',
      'public/source/scripts/vendor/require/require.js',
      'public/source/scripts/final.js'
    ]
    },
  ];

  var uglifyProductionOptions = {
    preserveComments: 'some',
    compress: {drop_console: true}
  };

  var uglifyDevOptions = {
    beautify:       true,
    mangle:         false,
    sourceMap:      false,
    compress:       false,
    sourceMapName:  function(path) { return path + '.map'; }
  };

  var taskConfig = {
    pkg: grunt.file.readJSON('package.json'),

    /* minimize & concatenate JavaScript Files */
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> - ©<%= grunt.template.today("yyyy") %> TheRedPin Inc. */\n',
        report: 'gzip'
      },

      vendorWork: {
        options: uglifyDevOptions,
        files: vendorJsFileList
      },

      vendor: {
        options: uglifyProductionOptions,
        files: vendorJsFileList
      },

      dependencies: {
        options: {
          preserveComments: 'some'
        },
        files: dependencyJsFileList
      },
      /* dependencies target compiled for local environment */
      depWork: {
        options: {
          preserveComments: 'some',
          mangle: false,
          beautify: true
        },
        files: dependencyJsFileList
      },

      development: {
        options: uglifyDevOptions,
        files: trpJsFileList
      },
      /* development target compiled for local environment */
      devWork : {
        options: uglifyDevOptions,
        files: trpJsFileList
      },

      production: {
        options: uglifyProductionOptions,
        files: trpJsFileList
      },
      /* production target compiled for local environment */
      prodWork: {
        options: uglifyDevOptions,
        files: trpJsFileList
      }
    },


    /* SASS, Compass & Foundation */
    compass: {
      options: {
        importPath:     'public/source/styles/vendor/foundation',
        specify:        ['public/source/styles/**/*.scss', '!public/source/styles/vendor/**/*.scss'],
        banner:         '/*! <%= pkg.name %> - <%= pkg.version %> - ©<%= grunt.template.today("yyyy") %> TheRedPin Inc. */\n',
        basePath:       'public',
        sassDir:        'source/styles',
        cssDir:         'assets/styles',
        relativeAssets: true,
        httpPath:       '/',
        imagesDir:      'assets/graphics',
        javascriptsDir: 'assets/scripts',
        fontsDir:       'assets/fonts',
      },
      development: {
        options: {
          outputStyle: 'expanded',
          environment: 'development'
        }
      },
      production: {
        options: {
          outputStyle: 'compressed',
          environment: 'production'
        }
      }
    },


    /* watch for source file changes and run related tasks */
    watch: {
      styles: {
        files: ['public/source/styles/**/*.scss'],
        tasks: ['compass:development']
      },
      scripts: {
        files: ['public/source/scripts/**/*.js', '!public/source/scripts/initial.js', '!public/source/scripts/final.js'],
        tasks: ['jshint', 'jscs', 'uglify:devWork']
      },
      vendor: {
        files: ['public/source/scripts/initial.js', 'public/source/scripts/final.js'],
        tasks: ['uglify:vendor']
      },
      layout: {
        files: ['public/source/index.volt'],
        tasks: ['copy:layout']
      },
      views: {
        files: ['app/views/**/*.volt', 'app/views/**/*.phtml'],
        tasks: ['clean:cache']
      },
      ngViews: {
        files: ['public/source/scripts/ng-modules/**/*.tpl.html'],
        tasks: ['copy:ngTemplates']
      }
    },





    /* minimize & optimize SVG files, store them in a temporary folder */
    svgmin: {
      options: {
        plugins: [{ convertPathData: { floatPrecision: 2 } }]
      },
      all: {
        files: [
          /* these are going to become sprites */
          { expand: true,
            cwd:  'public/source/graphics/vector',
            src:  ['**/*.svg'],
            dest: 'public/source/graphics/temporary',
            ext:  '.svg'
          },
          /* not going to be a sprite, or already a sprite */
          { expand: true,
            cwd:  'public/source/graphics/vendor',
            src:  ['**/*.svg'],
            dest: 'public/assets/graphics',
            ext:  '.svg'
          }
        ]
      }
    },


    /* generate SVG and PNG sprites out of the optimized SVGs in temporary folder */
    'svg-sprites': {
      options: {
        spritePath: 'public/assets/graphics',
        // cssPath:    'public/source/styles/sprites',
        // cssSuffix:  'scss',
        layout:     'packed',
        unit:       1
      },
      logos: {
        options: {
          spriteElementPath: 'public/source/graphics/temporary/logos',
          cssPath: 'public/source/styles/sprites/_logos-sprite.scss',
          sizes: {
            large:  150,
            medium: 60,
            small:  30
          },
          refSize: 'large'
        }
      },
      // icons: {
      //   options: {
      //     spriteElementPath: 'public/source/graphics/temporary/icons',
      //     cssPath: 'public/source/styles/sprites/_icons-sprite.scss',
      //     sizes: {
      //       large: 24,
      //       small: 16
      //     },
      //     refSize: 32
      //   }
      // },
      images: {
        options: {
          spriteElementPath: 'public/source/graphics/temporary/images',
          cssPath: 'public/source/styles/sprites/_images-sprite.scss',
          sizes: {
            large: 100,
            small: 50
          },
          refSize: 50
        }
      },
      //   'horizontal-backgrounds': {
      //     options: {
      //       unit: 0,
      //       layout: 'horizontal',
      //       spriteElementPath: 'public/source/graphics/temporary/backgrounds/horizontal',
      //       cssPath: 'public/source/styles/sprites/_backgrounds-sprite.scss',
      //       sizes: {
      //         large: 256,
      //         small: 128
      //       },
      //       refSize: 100
      //     }
      //   },
    },


    /* minimize PNG, JPG & GIF graphic files */
    imagemin: {
      graphics: {
        options: {
          optimizationLevel: 7,
          pngquant:          true
        },
        files: [
          /* PNG*/
          { expand: true,
            cwd:    'public/source/graphics/raster',
            src:    ['**/*.png', '!sprites/**/*'],
            dest:   'public/assets/graphics',
            ext:    '.png'
          },
          /* JPG */
          { expand: true,
            cwd:    'public/source/graphics/raster',
            src:    ['**/*.jpg', '**/*.jpeg', '!sprites/**/*'],
            dest:   'public/assets/graphics',
            ext:    '.jpg'
          },
          /* GIF */
          { expand: true,
            cwd:    'public/source/graphics/raster',
            src:    ['**/*.gif', '!sprites/**/*'],
            dest:   'public/assets/graphics',
            ext:    '.gif'
          },
          /* temporary sprites */
          { expand: true,
            cwd:    'public/source/graphics/temporary',
            src:    ['**/*.png'],
            dest:   'public/assets/graphics',
            ext:    '.png'
          }
        ]
      }
    },


    /* generate PNG sprites out of the source PNG files */
    sprite:{
      markers: {
        src: 'public/source/graphics/raster/sprites/markers/*.png',
        destImg: 'public/source/graphics/temporary/markers-sprite.png',
        destCSS: 'public/source/styles/sprites/_markers-sprite.scss',
        algorithm: 'binary-tree',
        imgPath: '../../../assets/graphics/markers-sprite.png',
        cssVarMap: function (sprite) {
          sprite.name = sprite.name.replace(/-/g, '.');
        },
        cssTemplate: function (params) {
          // custom template to support high density displays
          var rules = '';
          params.items.forEach(function(item) {
            rules += '.' + item.name + ' {\n';
            rules += '  background-image: url(' + item.image + ');\n';
            rules += '  background-position: ' + item.offset_x / 2 + 'px ' + item.offset_y / 2 + 'px;\n';
            rules += '  background-size: ' + item.total_width / 2 + 'px ' + item.total_height / 2 + 'px;\n';
            rules += '  width: ' + item.width / 2 + 'px;\n';
            rules += '  height: ' + item.height / 2 + 'px;\n';
            rules += '}\n';
          });
          return rules;
        }
      }
    },


    /* rewrite url paths for generates sprite styles */
    cssUrlRewrite: {
      options: {
        baseDir: '../../public/assets/',
        skipExternal: true
      },
      sprites: {
        files: [{
          expand: true,
          cwd:  'public/source/styles/sprites',
          src:  ['**/*.scss'],
          dest: 'public/source/styles/sprites',
          ext:  '.scss'
        }],
        options: {
          rewriteUrl: function(url, options, dataURI) {
            return url.replace(/^public/, '') + '?v=' + timestamp;
          }
        }
      }
    },


    /* copy and rename (sanitize) vendor dependencies from bower to source path */
    copy: {
      vendor: {
        files: [
          /* scripts */
          // Foundation dependencies: jquery.cookie & fastclick
          // Selectize dependencies: sifter & microplugin
          { 'public/source/scripts/vendor/angular.js':                    'bower_components/angular/angular.js' },
          { 'public/source/scripts/vendor/angular-route.js':              'bower_components/angular-route/angular-route.js' },
          { 'public/source/scripts/vendor/backbone.js':                   'bower_components/backbone/backbone.js' },
          { 'public/source/scripts/vendor/fastclick.js':                  'bower_components/fastclick/lib/fastclick.js' },
          // font awesome
          { expand: true,
            cwd:    'bower_components/foundation/js/foundation',
            src:    ['**'],
            dest:   'public/source/scripts/vendor/foundation'
          },
          { 'public/source/scripts/vendor/google/markerwithlabel.js':     'bower_components/google-maps-utilities/markerwithlabel/src/markerwithlabel.js' },
          { 'public/source/scripts/vendor/hammer.js':                     'bower_components/hammer/hammer.js' },
          { 'public/source/scripts/vendor/jquery/jquery.js':              'bower_components/jquery/dist/jquery.js' },
          { 'public/source/scripts/vendor/jquery/jquery-cookie.js':       'bower_components/jquery-cookie/jquery.cookie.js' },
          { 'public/source/scripts/vendor/jquery/jquery.nanoscroller.js': 'bower_components/jquery-nanoscroller/bin/javascripts/jquery.nanoscroller.js' },
          { 'public/source/scripts/vendor/jquery/jquery.placeholder.js':  'bower_components/jquery-placeholder/jquery.placeholder.js' },
          { 'public/source/scripts/vendor/jquery/jquery.slick.js':        'bower_components/jquery-slick/slick/slick.js' },
          { expand: true,
            cwd:    'bower_components/jquery-ui/ui',
            src:    ['jquery.ui.*.js'],
            dest:   'public/source/scripts/vendor/jquery/ui'
          },
          { 'public/source/scripts/vendor/google/markeranimate.js':       'bower_components/marker-animate/markerAnimate.js' },
          { 'public/source/scripts/vendor/microplugin.js':                'bower_components/microplugin/src/microplugin.js' },
          //modernizr
          { 'public/source/scripts/vendor/require/require.js':            'bower_components/requirejs/require.js' },
          { expand: true,
            cwd:    'bower_components/requirejs-plugins/src',
            src:    ['**'],
            dest:   'public/source/scripts/vendor/require'
          },
          { 'public/source/scripts/vendor/jquery/jquery.selectize.js':    'bower_components/selectize/dist/js/selectize.js' },
          { 'public/source/scripts/vendor/sifter.js':                     'bower_components/sifter/sifter.js' },
          { 'public/source/scripts/vendor/underscore.js':                 'bower_components/underscore/underscore.js' },
          { 'public/source/scripts/vendor/underscore.string.js':          'bower_components/underscore-string/lib/underscore.string.js' },



          /* styles */
          { expand: true,
            cwd:    'bower_components/font-awesome/scss',
            src:    ['**'],
            dest:   'public/source/styles/vendor/font-awesome'
          },
          { expand: true,
            cwd:    'bower_components/foundation/scss',
            src:    ['**'],
            dest:   'public/source/styles/vendor/foundation'
          },
          { 'public/source/styles/vendor/jquery-nanoscroller.scss': 'bower_components/jquery-nanoscroller/bin/css/nanoscroller.scss' },
          { 'public/source/styles/vendor/jquery-slick.scss':        'bower_components/jquery-slick/slick/slick.scss' },
          { 'public/source/styles/vendor/jquery-ui.scss':           'bower_components/jquery-ui/themes/base/jquery-ui.css' },
          { 'public/source/styles/vendor/jquery-selectize.scss':    'bower_components/selectize/dist/css/selectize.css' },

          /* fonts */
          { expand: true,
            cwd:    'bower_components/font-awesome/fonts',
            src:    ['**'],
            dest:   'public/source/fonts'
          }
        ]
      },

      layout: {
        files: {
          'app/views/index.volt': 'public/source/index.volt'
        }
      },

      ngTemplates: {
        files:[
          {
            expand: true,
            cwd:    'public/source/scripts/ng-modules',
            src:    ['**/*.tpl.html'],
            dest:   'public/assets/scripts/ng-modules'
          }
        ]
      },

      fonts: {
        files: [
          { expand: true,
            cwd:    'public/source/fonts',
            src:    ['**'],
            dest:   'public/assets/fonts'
          }
        ]
      }

    },


    /* cleanup temporary files & folders */
    clean: {
      graphics: ['public/source/graphics/temporary'],
      cache: ['app/cache/**/*', '!app/cache/.gitignore'],
      dev: ['public/assets/styles/**/*', 'public/assets/scripts/**/*'],
      all: ['public/assets/**/*']
    },


    /* inject development script into destination HTML */
    inject: {
      development: {
        scriptSrc: 'public/source/scripts/development.js',
        files: {
          'app/views/index.volt': 'public/source/index.volt'
        }
      }
    },


    /* replace string */
    replace: {
      timestamp: {
        src: ['app/views/index.volt'],
        dest: 'app/views/index.volt',
        replacements: [{
          from: '_timestamp_',
          to: timestamp
        }]
      }
    },


    /* run Weinre (Web Inspector Remote) server for mobile development */
    weinre: {
      development: {
        options: {
          httpPort: 8082,
          boundHost: '-all-'
        }
      }
    },


    /* run weinre & watch tasks concurrently, for mobile development */
    concurrent: {
      development: {
        tasks: ['weinre', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },


    /* JavaScript linter */
    jshint: {
      files: [
        'public/source/scripts/**/*.js',
        '!public/source/scripts/development.js',
        '!public/source/scripts/vendor/**'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },


    /* JavaScript code style checker */
    jscs: {
      files: [
        'public/source/scripts/**/*.js',
        '!public/source/scripts/development.js',
        '!public/source/scripts/vendor/**'
      ],
      options: {
        config: '.jscsrc'
      }
    }
  };

  grunt.initConfig(taskConfig);

  /* load modules and tasks */
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-css-url-rewrite');
  grunt.loadNpmTasks('grunt-dr-svg-sprites');
  grunt.loadNpmTasks('grunt-inject');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-weinre');


  /* register tasks */
  // NOTE: disabled copy:vendor because there's a small local change to selectize.js source, until they fix it
  grunt.registerTask('check',       ['jshint', 'jscs']);

  grunt.registerTask('development', ['clean:cache', 'copy:layout', 'copy:ngTemplates', 'replace:timestamp', 'watch']);
  grunt.registerTask('remote',      ['inject', 'replace:timestamp', 'concurrent']);


  grunt.registerTask('build-dev',       ['clean:dev', 'vendor-dev', 'production-dev'])
  grunt.registerTask('vendor-dev',      ['copy:vendor', 'copy:fonts', 'uglify:vendorWork', 'uglify:depWork']);
  grunt.registerTask('production-dev',  ['clean:cache', 'copy:layout', 'copy:ngTemplates', 'replace:timestamp', 'check', 'compass:development', 'uglify:prodWork']);


  grunt.registerTask('build',       ['graphics', 'vendor', 'production']);
  grunt.registerTask('graphics',    ['svgmin', 'svg-sprites', 'sprite', 'imagemin:graphics', 'clean:graphics', 'cssUrlRewrite:sprites']);
  grunt.registerTask('vendor',      ['copy:vendor', 'copy:fonts', 'uglify:vendor', 'uglify:dependencies']);
  grunt.registerTask('production',  ['clean:cache', 'copy:layout', 'copy:ngTemplates', 'replace:timestamp', 'check', 'compass:production', 'uglify:production']);

};
