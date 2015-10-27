define([
    'jquery',
    'underscore',
    'q',
    'handlebars',
    'fx-wsp-ui/config/Services',
    'text!fx-wsp-ui/html/templates.html',
    'amplify'
], function (
    $,
    _,
    Q,
    Handlebars,
    Services,
    templates
) {
    'use strict';

    var query = {

        hotspot: {
            // this is to be passed
            'raster': [
                {
                    'datasource': ['geoserver'],
                    'workspace': '{{workspace}}',
                    'layerName': '{{layerName}}',
                    //'workspace': 'eco_mod13a3_anomaly',
                    // 'layerName': 'ndvi_anomaly_1km_mod13a3_200803_3857'
                },
                {
                    'datasource': ['storage'],
                    'layerName': 'wheat_area_4326'
                }
            ],
            'vector': {
                'datasource': 'storage',
                'type': 'shapefile',
                'layerName': 'gaul1_nena_4326',

                'filter': {
                    'column': 'adm1_code',
                    'codes': '{{codes}}',

                    //'output': ['adm1_name', 'adm1_code']
                },
            },
            'stats': {
                'zonalsum': {
                    'weight': 1
                }
            },

            'model_options': {
                'threshold': {
                    //'min': null,
                    'max': '{{threshold}}'
                    //'max': -30
                },
                'resampling': 'near'
            }

        }
    };

    var s = {

        TABLE_CONTENT: '#table_content'

    };

    function ZONALSUMTABLE() {

    };

    ZONALSUMTABLE.prototype.init = function(config) {

        this.o = config;

        this.$table = $(this.o.container);

        this.o.templateTable = $(templates).filter('#zonalsum_table').html();
        this.o.templateRow = $(templates).filter('#zonalsum_table_row').html();

    };

    ZONALSUMTABLE.prototype.createTable = function(obj) {

        //this.$table.empty();
        var t = Handlebars.compile(this.o.templateTable);
        this.$table.html(t({}));

        this.$table_content = this.$table.find(s.TABLE_CONTENT);

        var labels = obj.labels.data,
            workspace = obj.workspace,
            layerName = obj.layerName,
            threshold = obj.threshold;


        // get gaul1 codes
        var codes = [],
            request = query.hotspot,
            self = this;

        _.forEach(obj.codes, function(c) {

            _.forEach(c.split(","), function(code) {

                request.raster[0].workspace = workspace;
                request.raster[0].layerName = layerName;
                request.vector.filter.codes = [parseInt(code)];
                request.model_options.threshold.max = parseFloat(threshold);

                $.ajax({
                    type: 'POST',
                    url: Services.url_models_hostspot_crops,
                    contentType: "application/json",
                    dataType: 'json',
                    data: JSON.stringify(request),
                    crossDomain: true,
                    success: function (response) {

                        var rows = [];

                        // TODO: merge label with the codes
                        for (var i=0; i < response.length; i++) {
                            response[i].label = self.getLabelByCode(labels, response[i].code);
                        }

                        var data = {
                            rows: response
                        };

                        /* Load main structure. */
                        var t = Handlebars.compile(self.o.templateRow);
                        self.$table_content.append(t(data));

                    },
                    error: function (err, b, c) {
                    }
                });
            });
        });

    };


    ZONALSUMTABLE.prototype.createTableBK = function(obj) {

        var labels = obj.labels.data,
            workspace = obj.workspace,
            layerName = obj.layerName,
            threshold = obj.threshold;

        this.$table.empty();

        // get gaul1 codes
        var codes = [],
            request = query.hotspot,
            self = this;


        _.forEach(obj.codes, function(code) {
            codes.push(parseInt(code));
        });

        request.raster[0].workspace = workspace;
        request.raster[0].layerName = layerName;
        request.vector.filter.codes = codes;
        request.model_options.threshold.max = parseFloat(threshold);

        // call the zonalsum service
        $.ajax({
            type: 'POST',
            url: Services.url_models_hostspot_crops,
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(request),
            crossDomain: true,
            success: function (response) {

                var rows = [];

                // TODO: merge label with the codes
                for (var i=0; i < response.length; i++) {
                    response[i].label = self.getLabelByCode(labels, response[i].code);
                }

                var data = {
                    rows: response
                };

                /* Load main structure. */
                var t = Handlebars.compile(self.o.templateTable);
                self.$table.html(t(data));

            },
            error: function (err, b, c) {
            }
        });

    };

    ZONALSUMTABLE.prototype.getLabelByCode = function(labels, code) {
        for(var i=0; i < labels.length; i++) {
            if (labels[i].code == code) {
                return labels[i].label;
            }
        }
        return "n.a."
    };



    return ZONALSUMTABLE;
});
