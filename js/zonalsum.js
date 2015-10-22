define([
    'jquery',
    'underscore',
    'q',
    'handlebars',
    'fx-wsp-ui/config/Services',
    'text!fx-wsp-ui/html/zonalsum.hbs',
    'text!fx-wsp-ui/html/dropdown.hbs',
    'select2',
    'amplify'
], function (
    $,
    _,
    Q,
    Handlebars,
    Services,
    template,
    templateDropdown
) {
    'use strict';

    var s = {

        COUNTRY_DD: '#country_dd',
        REGION_DD: '#region_dd',
        BUTTON: '#button_zonalsum',
        TABLE: '#table_zonalsum',
        THRESHOLD_DD: '#threshold_dd',
        SELECT_ALL: '#select_all',
        DESELECT_ALL: '#deselect_all'

    };


    var country_codes = [
        '4',     //Algeria
        '6',     //Sudan
        '21',    //Bahrain
        '74',    //South Sudan
        '91',    //Gaza Strip
        '117',   //Iran (Islamic Republic of)
        '118',   //Iraq
        '121',   //Israel
        '130',   //Jordan
        '137',   //Kuwait
        '141',   //Lebanon
        '145',   //Libya
        '159',   //Mauritania
        '169',   //Morocco
        '187',   //Oman
        '201',   //Qatar
        '215',   //Saudi Arabia
        '238',   //Syrian Arab Republic
        '248',   //Tunisia
        '255',   //United Arab Emirates
        '267',   //West Bank
        '268',   //Western Sahara
        '269',   //Yemen
        '40766',
        '40765',
        '117' // Iran
    ];

    var query = {
        countries : "select adm0_code, adm0_name from spatial.gaul0_3857 where adm0_code IN (" + country_codes.join(',') + ") order by adm0_name",
        regions : "select adm1_code, adm1_name from spatial.gaul1_3857 where adm0_code IN ({{codes}}) order by adm1_name",
    };


    function ZONALSUM() {

    };

    ZONALSUM.prototype.init = function(config) {

        this.o = config;

        this.o.template = template;
        this.o.templateDropdown = templateDropdown;

        this.initVariables(template, templateDropdown);

        this.initComponents();

        this.bindEventListeners();

    };

    ZONALSUM.prototype.initVariables = function () {

        var source = $(this.o.template).html(),
            template = Handlebars.compile(source),
            html = template({});

        this.$container = $(this.o.container);
        this.$container.html(html);

        this.$country_dd = this.$container.find(s.COUNTRY_DD);
        this.$region_dd = this.$container.find(s.REGION_DD);
        this.$button = this.$container.find(s.BUTTON);
        this.$table = this.$container.find(s.TABLE);
        this.$threshold_dd = this.$container.find(s.THRESHOLD_DD);
        this.$select_all = this.$container.find(s.SELECT_ALL);
        this.$deselect_all = this.$container.find(s.DESELECT_ALL);

        this.$country_dd.select2();
        this.$region_dd.select2();
        this.$threshold_dd.select2();

        this.createCountry_DD();
    };

    ZONALSUM.prototype.initComponents = function () {

        // initialize the componets

    };

    ZONALSUM.prototype.bindEventListeners = function () {

        var self = this;

        this.$country_dd.change(function(e) {

            self.createRegion_DD(e.val);

        });

/*        this.$select_all.on('click', function() {

            console.log("here");

            self.$region_dd.find('option').prop('selected', true);

        });

        this.$deselect_all.on('click', function() {

            self.$region_dd.find('option').prop('selected', false);

        });*/

    };

    ZONALSUM.prototype.createCountry_DD = function() {

        var self = this;

        this.$country_dd.empty();

        $.ajax({url: Services.url_spatial_query + query.countries,
            success: function(result){

                self.$country_dd.html(self.createDropdown(self.formatDropDownJson(result)));

            }});
    };

    ZONALSUM.prototype.createRegion_DD = function(codes) {

        var self = this;

        this.$region_dd.empty();

        // resetting dd selections
        this.$region_dd.select2('data', null);

        $.ajax({url: Services.url_spatial_query + query.regions.replace('{{codes}}', codes),
            success: function(result){

                self.o.cached_regions = self.formatDropDownJson(result);

                var c = [];
                for(var i=0; i < self.o.cached_regions.data.length; i++) {
                    c.push(self.o.cached_regions.data[i].code)
                }

                console.log(c);

                self.$region_dd.html(self.createDropdown(self.o.cached_regions));

                self.$region_dd.prepend("<option value='"+ c.join(',') +"'>All</option>");

                self.$region_dd.change(function(e) {

                    var codes = self.$region_dd.val();

                    // amplify the selected codes
                    amplify.publish('nena.zonalsums.gaul1_selection', {
                        codes: codes
                    });

                });

            }});
    };

    ZONALSUM.prototype.formatDropDownJson = function(json) {

        var data = [];

        _.forEach(json, function(v) {
            data.push({
                code: v[0],
                label: v[1]
            })
        });

        return {data: data}

    };

    ZONALSUM.prototype.getFilter = function () {

        var data = {
            labels: this.o.cached_regions,
            codes: this.$region_dd.val(),
            threshold: this.$threshold_dd.val()
        };

        return data;
    };

    ZONALSUM.prototype.initComponents = function () {


    };

    ZONALSUM.prototype.createDropdown = function (data) {
        var template = Handlebars.compile(this.o.templateDropdown);
        return template(data);
    };

    ZONALSUM.prototype.setInputRaster = function (workspace, layerName) {
        this.o.workspace = workspace;
        this.o.layerName = layerName;
    };

    return ZONALSUM;
});
