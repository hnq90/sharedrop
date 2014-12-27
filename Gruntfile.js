'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Load local grunt tasks
  grunt.loadTasks('./tasks');

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.config.init({
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      emberTemplates: {
        files: 'app/scripts/app/templates/**/*.{hbs,hjs,handlebars}',
        tasks: ['emberTemplates:dev']
      },

      sass: {
        files: 'app/styles/**/*.{sass,scss}',
        tasks: ['sass:dev', 'autoprefixer:dev']
      },

      html: {
        files: 'app/index.html',
        tasks: ['preprocess:dev']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
          '.tmp',
          'dist/*',
          '!dist/.git*'
          ]
        }]
      },
      dev: '.tmp'
    },

    sass: {
      options: {
        includePaths: ['app/styles/**/*.sass'],
        sourceMap: true
      },
      dev: {
        files: {
          '.tmp/styles/app.css': 'app/styles/app.sass'
        },
        options: {
          outputStyle: 'nested'
        }
      },
      dist: {
        files: {
          '.tmp/styles/app.css': 'app/styles/app.sass'
        },
        options: {
          outputStyle: 'compressed'
        }
      }
    },

    autoprefixer: {
      dev: {
        src: '.tmp/styles/app.css',
        dest: '.tmp/styles/app.css'
      },
      dist: {
        src: '.tmp/styles/app.css',
        dest: '.tmp/styles/app.css'
      }
    },

    // Compiles Handlebar templates to a single JS file
    emberTemplates: {
      options: {
        templateBasePath: 'app/scripts/app/templates'
      },
      dev: {
        src: 'app/scripts/app/templates/**/*.{hbs,hjs,handlebars}',
        dest: '.tmp/scripts/app/compiled_templates.js'
      },
      dist: {
        src: 'app/scripts/app/templates/**/*.{hbs,hjs,handlebars}',
        dest: '.tmp/scripts/app/compiled_templates.js'
      }
    },

    preprocess: {
      dev: {
        src : 'app/index.html',
        dest : '.tmp/index.html',
        options: { context: { dist: false } }
      },
      dist: {
        src : 'app/index.html',
        dest : '.tmp/index.html',
        options: { context: { dist: true } }
      }
    },

    rev: {
      files: {
        src: [
          'dist/scripts/**/*.js',
          'dist/styles/**/*.css',
          'dist/fonts/**/*.{eot,svg,ttf,woff}',
          'dist/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '.tmp/index.html',
      options: {
        dest: 'dist'
      }
    },

    // Performs rewrites based on the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: ['dist', 'dist/images']
      },
      html: 'dist/index.html',
      css: 'dist/styles/*.css'
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app',
          dest: 'dist',
          src: [
            'server.js',
            'fonts/**/*.{eot,svg,ttf,woff}',
            'images/**/*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }, {
          expand: true,
          cwd: '.tmp',
          dest: 'dist',
          src: [
            'index.html'
          ]
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      dev: [
        'sass:dev',
        'emberTemplates:dev'
      ],

      dist: [
        'sass:dist',
        'emberTemplates:dist'
      ]
    },

    env: {
      dev: {
        src : ".env"
      }
    },

    server: {
      dev: {
        options: {
          dir: 'app',
          base: [
            '.tmp',
            'app'
          ]
        }
      },

      dist: {
        options: {
          dir: 'dist',
          base: [
            'dist'
          ]
        }
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'server:dist:keepalive']);
    }

    grunt.task.run([
      'clean:dev',
      'env:dev',
      'preprocess:dev',
      'concurrent:dev',
      'autoprefixer:dev',
      'server:dev',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'preprocess:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer:dist',
    'concat',
    'copy:dist',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
