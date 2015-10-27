define(function() {

    var FX_CDN = '//fenixrepo.fao.org/cdn',
        SUB_CHARTS = '../submodule/fenix-ui-chart-creator/src/js/';

    var config = {
            i18n: {
                locale: 'en'
            },
            baseUrl: 'js/',
            paths: {
                jquery:       FX_CDN + "/js/jquery/2.1.1/jquery.min",
                domReady:     FX_CDN + "/js/requirejs/plugins/domready/2.0.1/domReady",
                i18n:         FX_CDN + "/js/requirejs/plugins/i18n/2.0.4/i18n",
                text:         FX_CDN + "/js/requirejs/plugins/text/2.0.12/text",
                bootstrap:    FX_CDN + "/js/bootstrap/3.3.4/js/bootstrap.min",
                chosen:       FX_CDN + "/js/chosen/1.2.0/chosen.jquery.min",
                csvjson:      FX_CDN + "/js/csvjson/1.0/csvjson",
                underscore:   FX_CDN + "/js/underscore/1.7.0/underscore.min",
                handlebars:   FX_CDN + "/js/handlebars/2.0.0/handlebars",
                sweetAlert:   FX_CDN + '/js/sweet-alert/0.4.2/sweet-alert',
                q:            FX_CDN + '/js/q/1.1.2/q',                                
                amplify:      FX_CDN + "/js/amplify/1.1.2/amplify.min",                
                highcharts:   FX_CDN + "/js/highcharts/4.0.4/js/highcharts", //'//code.highcharts.com/highcharts',
                'highcharts-export':     FX_CDN+ '/js/highcharts/4.0.4/js/modules/exporting',
                'highcharts-export-csv': 'http://highslide-software.github.io/export-csv/export-csv',

                // fenix-map-js
                'leaflet':                FX_CDN + '/js/leaflet/0.7.3/leaflet',
                'jquery.power.tip':       FX_CDN + '/js/jquery.power.tip/1.2.0/jquery.powertip.min',
                'jquery-ui':              FX_CDN + '/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
                'jquery.i18n.properties': FX_CDN + '/js/jquery/1.0.9/jquery.i18n.properties-min',
                'jquery.hoverIntent':     FX_CDN + '/js/jquery.hoverIntent/1.8.0/jquery.hoverIntent.min',
                'select2':                FX_CDN + '/js/select2/3.5.2/js/select2.min',
                'bootstrap-toggle':       FX_CDN + '/js/bootstrap-toggle/2.2.0/js/bootstrap-toggle.min',
                'moment':                 FX_CDN + '/js/moment/2.9.0/moment.min',

                'import-dependencies':    FX_CDN + '/js/FENIX/utils/import-dependencies-1.0',                
                'fenix-ui-map':           FX_CDN + '/js/fenix-ui-map/0.0.1-fullscreen-fixed/fenix-ui-map.min',
                'fenix-ui-map-config':    FX_CDN + '/js/fenix-ui-map/0.0.1-fullscreen-fixed/fenix-ui-map-config',

                'fx-wsp-ui/start':  './start',
                'fx-wsp-ui/html':   '../html',
                'fx-wsp-ui/config': '../config',
                'fx-wsp-ui/nls':    '../nls',

                 // zonalsum
                'fx-wsp-ui/zonalsum':      './zonalsum',
                'fx-wsp-ui/zonalsum_test': './zonalsum_test',
                'fx-wsp-ui/zonalsumTable': './zonalsumTable',

                // Chart Creator
                'fx-c-c/start':     SUB_CHARTS + 'start',
                'fx-c-c/html':      SUB_CHARTS + '../html',
                'fx-c-c/config':    SUB_CHARTS + '../../config',
                'fx-c-c/adapters':  SUB_CHARTS + './adapters',
                'fx-c-c/templates': SUB_CHARTS + './templates',
                'fx-c-c/creators':  SUB_CHARTS + './creators',
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