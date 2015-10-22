define(function() {

    var FENIX_CDN = '//fenixrepo.fao.org/cdn',
        SUBMODULES_CHARTS = '../submodule/fenix-ui-chart-creator/src/js/';

    var config = {


            //Set the config for the i18n
            i18n: {
                locale: 'en'
            },

            // The path where your JavaScripts are located
            baseUrl: 'js/',

            // Specify the paths of vendor libraries
            paths: {
                jquery: FENIX_CDN + "/js/jquery/2.1.1/jquery.min",
                domReady: FENIX_CDN + "/js/requirejs/plugins/domready/2.0.1/domReady",
                i18n: FENIX_CDN + "/js/requirejs/plugins/i18n/2.0.4/i18n",
                text: FENIX_CDN + "/js/requirejs/plugins/text/2.0.12/text",
                bootstrap: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",
                chosen:  FENIX_CDN + "/js/chosen/1.2.0/chosen.jquery.min",

                csvjson: FENIX_CDN + "/js/csvjson/1.0/csvjson",
                underscore: FENIX_CDN + "/js/underscore/1.7.0/underscore.min",
                handlebars: FENIX_CDN + "/js/handlebars/2.0.0/handlebars",
                q : FENIX_CDN + '/js/q/1.1.2/q',

                'sweetAlert': FENIX_CDN + '/js/sweet-alert/0.4.2/sweet-alert',

                // fenix-map-js
                'import-dependencies': FENIX_CDN + '/js/FENIX/utils/import-dependencies-1.0',
                'leaflet': FENIX_CDN + '/js/leaflet/0.7.3/leaflet',
                'jquery.power.tip': FENIX_CDN + '/js/jquery.power.tip/1.2.0/jquery.powertip.min',
                'jquery-ui':   FENIX_CDN + '/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
                'jquery.i18n.properties': FENIX_CDN + '/js/jquery/1.0.9/jquery.i18n.properties-min',
                'jquery.hoverIntent': FENIX_CDN + '/js/jquery.hoverIntent/1.8.0/jquery.hoverIntent.min',
                'select2': FENIX_CDN + '/js/select2/3.5.2/js/select2.min',
                'bootstrap-toggle': 'https://gitcdn.github.io/bootstrap-toggle/2.2.0/js/bootstrap-toggle.min',

                'fenix-ui-map': FENIX_CDN + '/js/fenix-ui-map/0.0.1-fullscreen-fixed/fenix-ui-map.min',
                'fenix-ui-map-config': FENIX_CDN + '/js/fenix-ui-map/0.0.1-fullscreen-fixed/fenix-ui-map-config',

                'fx-wsp-ui/start' : './start',
                'fx-wsp-ui/html'  : '../html',
                'fx-wsp-ui/config': '../config',
                'fx-wsp-ui/nls'   : '../nls',

                 // zonalsum
                'fx-wsp-ui/zonalsum'   : './zonalsum',
                'fx-wsp-ui/zonalsum_test'   : './zonalsum_test',
                'fx-wsp-ui/zonalsumTable'   : './zonalsumTable',

                // Chart Creator
                'fx-c-c/start'  :  SUBMODULES_CHARTS + 'start',
                'fx-c-c/html'   :  SUBMODULES_CHARTS + '../html',
                'fx-c-c/config' :  SUBMODULES_CHARTS + '../../config',
                'fx-c-c/adapters'  :  SUBMODULES_CHARTS + './adapters',
                'fx-c-c/templates' :  SUBMODULES_CHARTS + './templates',
                'fx-c-c/creators'  :  SUBMODULES_CHARTS + './creators',

                // Charts third party libs
                text: '//fenixapps.fao.org/repository/js/requirejs/plugins/text/2.0.12/text',
                jquery: "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
                highcharts : "//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts", //'//code.highcharts.com/highcharts',
                underscore: "//fenixapps.fao.org/repository/js/underscore/1.7.0/underscore.min",
                amplify: "//fenixapps.fao.org/repository/js/amplify/1.1.2/amplify.min",
                handlebars: "//fenixapps.fao.org/repository/js/handlebars/2.0.0/handlebars",

                // highcharts plugins
                'highcharts-export': 'http://code.highcharts.com/modules/exporting',
                'highcharts-export-csv': 'http://highslide-software.github.io/export-csv/export-csv'
            },

            // Underscore and Backbone are not AMD-capable per default,
            // so we need to use the AMD wrapping of RequireJS
            shim: {
                bootstrap: ["jquery"],
                'bootstrap-toggle': ["bootstrap"],
                highcharts: ['jquery'],
                chosen: ['jquery'],
                amplify: ['jquery'],

                underscore: {
                    exports: '_'
                },
                handlebars: {
                    exports: 'Handlebars'
                },

                'jquery-ui': ['jquery'],
                'jquery.hoverIntent': ['jquery'],
                'jquery.power.tip': ['jquery'],
                'jquery.i18n.properties': ['jquery'],
                'jquery.hoverIntent': ['jquery'],
                'select2': ['jquery'],
                'fenix-ui-map': {
                    deps: [
                        'jquery',
                        'jquery-ui',
                        'leaflet',
                        'fenix-ui-map-config',
                        'jquery.power.tip',
                        'jquery.i18n.properties',
                        'import-dependencies',
                        'jquery.hoverIntent',
                        'chosen'
                    ]
                }
            }
    };

    return config;

});