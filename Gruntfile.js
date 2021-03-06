// For the usage of Grunt please refer to
// http://24ways.org/2013/grunt-is-not-weird-and-hard/

module.exports = function( grunt ) {
    "use strict";

    require( "time-grunt" )( grunt );

    var javascripts = [
            "Gruntfile.js",
            "js/bbcode.js",
            "tests/casperjs/**/*.js"
        ],
        templates = [
            "templates/*.html"
        ],
        phps = [
            "**/*.php",
            "!admin/admincenter.php",
            "!admin/languages/**/*.php",
            "!install/**/*.php",
            "!languages/**/*.php",
            "!index.php"
        ],
        releaseFiles = [
            "admin/**",
            "demos/index.php",
            "downloads/index.php",
            "images/*",
            "images/articles-pics/index.php",
            "images/avatars/index.php",
            "images/avatars/noavatar.gif",
            "images/banner/index.php",
            "images/bannerrotation/index.php",
            "images/clanwar-screens/index.php",
            "images/flags/*",
            "images/gallery/large/index.php",
            "images/gallery/thumb/index.php",
            "images/games/*",
            "images/flags/*",
            "images/icons/**",
            "images/languages/*",
            "images/links/1.gif",
            "images/links/index.php",
            "images/linkus/index.php",
            "images/news-pics/index.php",
            "images/news-rubrics/index.php",
            "images/partners/1.gif",
            "images/partners/index.php",
            "images/smileys/*",
            "images/sponsors/index.php",
            "images/squadicons/index.php",
            "images/userpics/nouserpic.gif",
            "images/userpics/index.php",
            "install/**",
            "js/**",
            "languages/**",
            "src/**",
            "templates/**",
            "tmp/index.php",
            "*",
            "!.gitignore",
            "!.scrutinizer*",
            "!.sensiolabs.yml",
            "!.travis.yml",
            "!.bowerrc",
            "!.htmllintrc",
            "!.htmlhintrc",
            "!.jshintrc",
            "!circle.yml",
            "!Gruntfile.js",
            "!karma.conf.js",
            "!nightwatch.json",
            "!composer.phar",
            "!grunt-log.txt",
            "!*.zip",
            "!*.sublime-*",
            "!vendor",
            "!components",
            "!node_modules",
            "!tests",
            "!development"
        ],
        specialReleaseFiles = [
            {
                expand: true,
                cwd: "components/bootstrap/dist/css/",
                src: [ "bootstrap.min.css" ],
                dest: "components"
            },
            {
                expand: true,
                cwd: "components/bootstrap/dist/js/",
                src: [ "bootstrap.min.js" ],
                dest: "components"
            },
            {
                expand: true,
                cwd: "components/jquery/dist/",
                src: [ "jquery.min.js" ],
                dest: "components"
            },
            {
                expand: true,
                cwd: "components/phpmailer/",
                src: [ "class.*", "LICENSE", "PHPMailerAutoload.php" ],
                dest: "components/PHPMailer/"
            },
            {
                expand: true,
                cwd: "components/webshim/js-webshim/minified/",
                src: [ "polyfiller.js", "shims/form-core.js", "shims/form-number-date-ui.js" ],
                dest: "components/webshim/"
            },
            {
                src: releaseFiles
            }
        ],
        csss = [ "**/*.css" ],
        excludes = [
            "!node_modules/**",
            "!codestyles/**",
            "!components/**",
            "!vendor/**",
            "!tmp/**",
            "!tests/**",
            "!development/**"
        ],
        bsFiles = [
            "_stylesheet.css",
            "templates/*.html",
            "js/*.js"

        ];

    require( "load-grunt-tasks" )( grunt, {
        pattern: [ "grunt-*" ],
        config: "package.json",
        scope: "devDependencies"
    } );

    require( "logfile-grunt" )( grunt, {
        filePath: "./grunt-log.txt",
        clearLogFile: true
    } );

    // Project configuration.
    grunt.initConfig( {
        pkg: grunt.file.readJSON( "package.json" ),

        scopeRegex: "\\b" +
        grunt.file.read( "development/scope.txt" ).trim().split( "\n" ).join( "\\b|\\b" ) +
        "\\b",

        typeRegex: grunt.file.read( "development/type.txt" ).trim().split( "\n" ).join( "|" ),

        versioncheck: {
            options: {
                hideUpToDate: true
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: [
                javascripts,
                excludes
            ]
        },

        jscs: {
            all: {
                options: {
                    "config": "node_modules/grunt-jscs/node_modules/jscs/presets/jquery.json"
                },
                files: {
                    src: [
                        javascripts,
                        excludes,
                        "!Gruntfile.js"
                    ]
                }
            }
        },

        phplint: {
            good: [
                phps,
                excludes
            ]
        },

        phpcs: {
            application: {
                src: [
                    phps,
                    csss,
                    excludes
                ]
            },
            options: {
                bin: "vendor/bin/phpcs",
                standard: "development/Ruleset.xml",
                tabWidth: "4",
                showSniffCodes: true
            }
        },

        htmllint: {
            options: {
                htmllintrc: true,
                force: true
            },
            src: templates
        },

        htmlhint: {
            options: {
                htmlhintrc: ".htmlhintrc", // https://github.com/yaniswang/HTMLHint/wiki/Rules
                force: true
            },
            html1: {
                src: [ "templates/*.html" ]
            }
        },

        bootlint: {
            options: {
                stoponerror: true,
                relaxerror: [
                    "E001", // Document is missing a DOCTYPE declaration
                    "E003", // .row that were not children of a grid column
                    "E041", // `.carousel-inner` must have exactly one `.item.active` child
                    "E042", // `.form-control` cannot be used on non-textual `<input>`s
                    "E047", // `.btn` should only be used on `<a>`, `<button>`, `<input>`
                    "W001", // <head> is missing UTF-8 charset
                    "W002", // <head> is missing X-UA-Compatible <meta> tag
                    "W003", // <head> is missing viewport <meta> tag that enables responsiveness
                    "W005", // Unable to locate jQuery
                    "W014" // Carousel controls and indicators should use `href` or `data-target`
                ]
            },
            files: templates
        },

        csslint: {
            options: {
                csslintrc: ".csslintrc"
            },
            strict: {
                options: {
                    import: 2
                },
                src: [ "_stylesheet.css" ]
            }
        },

        lintspaces: {
            all: {
                src: [
                    javascripts,
                    templates,
                    phps,
                    csss,
                    excludes,
                    "!admin/**"
                ],
                options: {
                    editorconfig: ".editorconfig",
                    ignores: [
                        "js-comments",
                        "xml-comments",
                        "html-comments"
                    ]
                }
            }
        },

        githooks: {
            all: {
                "pre-commit": "test"
            }
        },

        replace: {
            copyright: {
                src: [
                    "**/*.{css,html,js,md,php,txt}",
                    excludes,
                    "!Gruntfile.js"
                ],
                overwrite: true,
                replacements: [
                    {
                        from: /Copyright [0-9]{4}-[0-9]{4}/g,
                        to: "Copyright 2005-<%= grunt.template.today('yyyy') %>"
                    }
                ]
            },
            version: {
                src: [
                    "version.php"
                ],
                overwrite: true,
                replacements: [
                    {
                        from: /(\$version = ").+(";)/g,
                        to: "$version = \"<%= pkg.version %>\";"
                    }
                ]
            }
        },

        changelog: {
            release: {
                options: {
                    version: "<%= pkg.version %>",
                    labels: grunt.file.read( "development/type.txt" ).trim().split( "\n" ),
                    template: "grouped"
                }
            }
        },

        karma: {
            unit: {
                configFile: "karma.conf.js"
            },
            continuous: {
                configFile: "karma.conf.js",
                singleRun: true,
                browsers: [ "PhantomJS" ]
            }
        },

        casperjs: {
            options: {
                casperjsOptions: [
                    //"--engine=slimerjs",
                    "--includes=tests/casperjs/config.js," +
                    "tests/casperjs/functions/login.js"
                ]
            },
            files: [
                "tests/casperjs/login_as_admin.js"
            ]
        },

        watch: {
            options: {
                debounceDelay: 1000
            },
            all: {
                files: [
                    phps,
                    javascripts,
                    templates,
                    csss
                ],
                tasks: [
                    "codecheck_newer"
                ]
            },
            html: {
                files: [
                    templates
                ],
                tasks: [
                    "html"
                ]
            },
            js: {
                files: [
                    javascripts
                ],
                tasks: [
                    "js"
                ]
            }
        },

        exec: {
            quickcheck: {
                command: "sh ./development/qphpcs.sh",
                stdout: true,
                stderr: true
            },
            sortLanguageKeys: {
                command: "cd development/tools && php -f sort_translations.php"
            }
        },

        compress: {
            main: {
                options: {
                    archive: "webspell.zip"
                },
                files: specialReleaseFiles
            },
            release: {
                options: {
                    archive: "webSPELL-<%= pkg.version %>.zip"
                },
                files: specialReleaseFiles
            }
        },

        concurrent: {
            codecheck: [
                "js",
                "php",
                "html",
                "css"
            ],
            codecheckcircle: [
                "lintspaces",
                "jshint",
                "jscs",
                "phpcs",
                "htmlhint",
                "htmllint",
                "bootlint",
                "css"
            ],
            codechecktravis: [
                "lintspaces",
                "jshint",
                "jscs",
                "phplint",
                "phpcs",
                "htmlhint",
                "htmllint",
                "bootlint",
                "css"
            ]
        },

        browserSync: {
            wamp: {
                bsFiles: {
                    src: [
                        bsFiles
                    ]
                },
                options: {
                    proxy: "localhost/webSPELL/"
                }
            },
            mamp: {
                bsFiles: {
                    src: bsFiles
                },
                options: {
                    proxy: "localhost:8888/webSPELL/"
                }
            }
        },

        todo: {
            options: {
                usePackage: true
            },
            src: [
                phps,
                javascripts,
                csss,
                excludes
            ]
        },

        bump: {
            options: {
                files: [
                    "package.json",
                    "bower.json"
                ],
                updateConfigs: [
                    "pkg"
                ],
                commit: false,
                commitMessage: "Release v%VERSION%",
                commitFiles: releaseFiles,
                createTag: true,
                tagName: "v%VERSION%",
                tagMessage: "Version %VERSION%",
                push: false,
                pushTo: "upstream",
                gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d",
                globalReplace: false,
                regExp: false
            }
        },

        clean: {
            folder: ["node_modules", "components", "vendor"]
        }

    } );

    grunt.registerTask( "codecheck", [
        "concurrent:codecheck"
    ] );

    grunt.registerTask( "codecheck_newer", [
        "newer:js",
        "newer:phplint",
        "newer:phpcs",
        "newer:html"
    ] );

    grunt.registerTask( "codecheck_circle", [
        "concurrent:codecheckcircle"
    ] );

    grunt.registerTask( "codecheck_travis", [
        "concurrent:codechecktravis"
    ] );

    grunt.registerTask( "html", [
        "htmlhint",
        "htmllint",
        "bootlint"
    ] );

    grunt.registerTask( "js", [
        "jshint",
        "jscs",
        "karma:continuous"
    ] );

    grunt.registerTask( "php", [
        "phplint",
        "phpcs"
    ] );

    grunt.registerTask( "css", [
        "csslint"
    ] );

    grunt.registerTask( "git", [
        "grunt-commit-message-verify"
    ] );

    grunt.registerTask( "test", [
        "codecheck",
        "git"
    ] );

    grunt.registerTask( "quick", [
        "exec:quickcheck"
    ] );

    grunt.registerTask( "release", "Creating a new webSPELL Release", function( releaseLevel ) {
        if ( arguments.length === 0 || releaseLevel === "" ) {
            grunt.log.error( "Specefy the Release Level" );
        } else {
            grunt.task.run( [
                "bump-only:" + releaseLevel,
                "exec:sortLanguageKeys",
                "replace:copyright",
                "replace:version",
                "changelog",
                "compress:release"
            ] );
        }
    } );

    grunt.config.set( "grunt-commit-message-verify", {
        minLength: 0,
        maxLength: 3000,

        // first line should be both concise and informative
        minFirstLineLength: 20,
        maxFirstLineLength: 60,

        // this is a good default to prevent overflows in shell console and Github UI
        maxLineLength: 80,

        regexes: {
            "check type": {
                regex: new RegExp( "^(" + grunt.config.get( "typeRegex" ) + ")\\(", "i" ),
                explanation: "The commit should start with a type like fix, feat, or chore. " +
                "See development/type.txt for a full list."
            },
            "check scope": {
                regex: new RegExp( "\\((" + grunt.config.get( "scopeRegex" ) + ")\\)", "i" ),
                explanation: "The commit should include a scope like (forum), (news) or " +
                "(buildtools). See development/scope.txt for a full list."
            },
            // commented out for later use
            //"check close github issue": {
            //    regex: /((?=(((close|resolve)(s|d)?)|fix(es|ed)?))
            // ((((close|resolve)(s|d)?)|fix(es|ed)?) #\d+))/ig,
            //    explanation:
            //        "If closing an issue, the commit should include github issue no like " +
            //        "fix #123, closes #123 or resolves #123"
            //},
            "check subject format": {
                regex: /(: \w+.*)/ig,
                explanation: "The commit message subject should look like this ': <subject>'"
            }
        },
        skipCheckAfterIndent: false,
        forceSecondLineEmpty: true,
        messageOnError: "",
        shellCommand: "git log --format=%B --no-merges -n 1"
    } );
};
