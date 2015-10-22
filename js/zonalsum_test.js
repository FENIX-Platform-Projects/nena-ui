define([
    'jquery',
    'underscore',
    'q',
    'handlebars',
    'zonalsum',
    'zonalsumTable',
    'text!fx-wsp-ui/html/test.hbs'
], function (
    $,
    _,
    Q,
    Handlebars,
    ZonalSum,
    ZonalSumTable,
    template
) {
    'use strict';

    var s = {

        ZONALSUM_SELECTORS: '#zonalsum_selectors',
        ZONALSUM_TABLE: '#zonalsum_table',
        BUTTON: '#button_zonalstat'

    };

    function ZONALSUMTEST() {

    };

    ZONALSUMTEST.prototype.init = function(config) {

        this.o = config;
        this.o.template = template;

        this.initVariables();

    };

    ZONALSUMTEST.prototype.initVariables = function () {

        var source = $(this.o.template).html(),
            template = Handlebars.compile(source),
            html = template({});


        this.$container = $(this.o.container);
        this.$container.html(html);

        this.$zonasum_selectors = this.$container.find(s.ZONALSUM_SELECTORS);
        this.$zonasum_table = this.$container.find(s.ZONALSUM_TABLE);
        this.$button = this.$container.find(s.BUTTON);

        var zonalsum_selectors = new ZonalSum();
        zonalsum_selectors.init({
            'container': this.$zonasum_selectors
        });

        var table = new ZonalSumTable();
        table.init({
            'container': this.$zonasum_table
        });


        this.$button.on('click',function() {

            var obj = zonalsum_selectors.getFilter();

            obj.workspace = 'nena_mod13a3_anomaly';
            obj.layerName = 'ndvi_anomaly_1km_mod13a3_200903_3857';

            table.createTable(obj)
        });

    };

    return ZONALSUMTEST;
});
