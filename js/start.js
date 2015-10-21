/** global console **/

define([
    'jquery',
    'underscore',
    'q',    
    'handlebars',
    //'text!fx-wsp-ui/html/structure.hbs',
    'text!fx-wsp-ui/html/templates_tabs.html',
    'i18n!fx-wsp-ui/nls/translate',
    'fx-c-c/start',
    'fx-wsp-ui/config/Services',
    'text!fx-wsp-ui/config/gaul1_ndvi_afg.json',
    'fx-wsp-ui/config/highcharts_template',
    'fenix-ui-map',
    'select2',
    'bootstrap',
    'bootstrap-toggle'
], function (
    $,
    _,
    Q,    
    Handlebars,
    templates,
    i18n,
    ChartCreator,
    Services,
    ZonalStats,
    HighchartsTemplate
) {
    'use strict';

    function WSP() {

        var layerPrefix = 'eco_',
            countriesGaul0 = [
                '4',     //Algeria
                '6',     //Sudan
                '21',    //Bahrain
                '74',    //South Sudan
                '91',    //Gaza Strip
                '102',   //Abyei
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
                '40760', //Hala'ib triangle
                '40762', //Ma'tan al-Sarra
                '40766', //Egypt
                '61013'  //Ilemi triangle
            ];

        this.o = {
            lang: 'EN',
            prefix: 'wsp_ui_',
            s: {
                placeholder: '#content',
                tool: "#wsp-tool",
                landing: "#wsp-landing"
            },
            landing: {
                init: false
            },
            tool: {
                init: false
            },
            countriesGaul0: countriesGaul0,
            box: [
                {
                    id: 'mod13a3',
                    title: i18n.ndvi_label,
                    coverageSectorCode: 'nena_mod13a3',
                    cachedLayers: [],
                    addZscore: true,
                    addHotspot: true,
                    addWheatAreaAFG: true,
                    addGaul1: true,
                    addZonalStats: true,
                    anomalyLayerPrefix: 'nena_mod13a3_anomaly:ndvi_anomaly_1km_mod13a3',
                    anomalyDPYLayerPrefix: 'nena_mod13a3_anomaly_dpy:ndvi_anomaly_dpy_1km_mod13a3',
                    zscoreLayerPrefix: 'nena_mod13a3_zscore:ndvi_zscore_1km_mod13a3',
                    averageLayerPrefix: {
                        workspace: 'nena_mod13a3_avg',
                        layerName: 'ndvi_average_1km_mod13a3'
                    },
                    chart: {
                        formula: '{{x}} / 10000',
                        chartObj: {
                            yAxis: {
                                title: {
                                    text: 'NDVI'
                                }
                            },
                            tooltip: {
                                valueDecimals: 4
                            }
                        }
                    }
                },            
                {
                    id: 'myd11c3',
                    title: i18n.temperature,
                    coverageSectorCode: 'myd11c3',
                    cachedLayers: [],
                    selectedLayer: null,
                    addZscore: true,
                    anomalyLayerPrefix: layerPrefix+'myd11c3_anomaly:lst_anomaly_6km_myd11c3',
                    anomalyDPYLayerPrefix: layerPrefix+'myd11c3_anomaly_dpy:lst_anomaly_dpy_6km_myd11c3',
                    zscoreLayerPrefix: layerPrefix+'myd11c3_zscore:lst_zscore_6km_myd11c3',
                    averageLayerPrefix: {
                        workspace: layerPrefix+'myd11c3_avg',
                        layerName: 'lst_average_6km_myd11c3'
                    },
                    chart: {
                        formula: '({{x}} * 0.02) - 273.15',
                        chartObj: {
                            yAxis: {
                                title: {
                                    text: 'Temperature (°C)'
                                }
                            }
                        }
                    }
                },
                {
                    id: 'et',
                    title: i18n.evapotranspiration,
                    coverageSectorCode: 'et',
                    cachedLayers: [],
                    addZscore: true,
                    anomalyLayerPrefix: layerPrefix+'et_anomaly:et_anomaly_6km_mod16a2',
                    anomalyDPYLayerPrefix: layerPrefix+'et_anomaly_dpy:et_anomaly_dpy_6km_mod16a2',
                    zscoreLayerPrefix: layerPrefix+'et_zscore:et_zscore_6km_mod16a2',
                    averageLayerPrefix: {
                        workspace: layerPrefix+'et_avg',
                        layerName: 'et_average_6km_mod16a2'
                    },
                    chart: {
                        formula: '{{x}} / 0.01',
                        chartObj: {
                            yAxis: {
                                title: {
                                    text: 'Evapotranspiration (mm)'
                                }
                            }
                        }
                    }
                },
                {
                    id: 'chirps',
                    title: i18n.chirps,
                    coverageSectorCode: 'chirps',
                    cachedLayers: [],
                    addZscore: true,
                    anomalyLayerPrefix: 'chirps_anomaly:rainfall_anomaly_6km_chirps',
                    anomalyDPYLayerPrefix: 'chirps_anomaly_dpy:rainfall_anomaly_dpy_6km_chirps',
                    zscoreLayerPrefix: 'chirps_zscore:rainfall_zscore_6km_chirps',
                    averageLayerPrefix: {
                        workspace: 'chirps_avg',
                        layerName: 'rainfall_average_6km_chirps'
                    },
                    chart: {
                        chartObj: {
                            yAxis: {
                                title: {
                                    text: 'Rainfall (mm)'
                                }
                            }
                        }
                    }
                }
            ],

            // Global layers to load for each map
            layers: {
                population_landscan: {
                    workspace: 'wsp',
                    layerName: 'population_1km_landscan_2012_3857',
                    openlegend: true,
                    enabled: false
                },
                cultivated_land_gaez_2010: {
                    workspace: 'wsp',
                    layerName: 'cultivated_land_10km_gaez_2010_3857',
                    openlegend: true,
                    enabled: false
                },
                irrigated_areas_solaw_2012: {
                    workspace: 'wsp',
                    layerName: 'irrigated_areas_10km_solaw_2012_3857',
                    openlegend: true,
                    enabled: false
                },
                rainfed_land_gaez: {
                    workspace: 'wsp',
                    layerName: 'rainfed_land_10km_gaez_2010_3857',
                    openlegend: true,
                    enabled: false
                },
                wheat: {
                    workspace: 'earthstat',
                    layerName: 'wheat_area_3857',
                    openlegend: true,
                    //style: 'Wheat_SAGE_harvested_area',
                    enabled: false
                },
                eco_region: {
                    workspace: 'fenix',
                    layerName: 'nena_region_3857',
                    openlegend: false,
                    enabled: true,                    
                    zindex: 4000,
                    startup: true
                },
                gaul1: {
                    workspace: 'fenix',
                    layerName: 'gaul1_3857',
                    cql_filter: 'adm0_code IN ('+ countriesGaul0.join(',') +')',
                    style: 'gaul1_highlight_polygon',
                    openlegend: false,
                    enabled: false,                    
                    zindex:450
                },
                hotspot: {
                    workspace: 'eco',
                    layerName: 'drought_hotspot_afg_200803_3857',
                    openlegend: false,
                    enabled: false                    
                },
                wheat_area: {
                    workspace: 'eco',
                    layerName: 'wheat_area_afg_3857',
                    openlegend: true,
                    enabled: false                    
                }
            },

            // query raster timeserie
            pixel_query : {
                "raster": [
                    //{
                    //    "workspace": "eco_et",
                    //    "layerName": "et_6km_mod16a2_200101_3857",
                    //    "datasource": "geoserver"
                    // }
                ],
                "stats": {
                    "pixel": {
                        //"lat": 44.460250,
                        //"lon": 66.774902
                    }
                }
            },

            // template of the chart
            chart_template: {
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                tooltip: {
                    valueDecimals: 1
                },
                yAxis: {
                    title: {
                        enabled: true,
                    }
                },
                series: [],

            }
        }
    };

    WSP.prototype.init = function(config) {
        this.o = $.extend(true, {}, this.o, config);
        //this.o.data = $.parseJSON(data);
        //this.o.cl.indicators = $.parseJSON(indicators);
        this.$placeholder = $(this.o.s.placeholder);

        // render
        this.render(this.o.data);
    };

    WSP.prototype.render = function(data) {

        /* Fix the language, if needed. */
        this.o.lang = this.o.lang !== null ? this.o.lang : 'EN';

        /* Load template. */
        var source = $(templates).filter('#wsp_ui_structure').html(),
            template = Handlebars.compile(source),
            boxes = [];

        for (var i = 0; i < this.o.box.length; i++) {
            this.o.box[i] = $.extend(true, {}, this.o.box[i],
                {
                    box_title: this.o.box[i].title,
                    add_new_line: i % 2 == 1,
                    z_score: i18n.z_score,
                    anomaly: i18n.anomaly,
                    anomaly_dpy: i18n.anomaly_dpy,
                    footer_text: i18n.copyright,
                    please_select: i18n.please_select,

                    // ids
                    box_id: this.o.box[i].id,

                    wheat: i18n.wheat,
                    population_landscan: i18n.population_landscan,
                    rainfed_land_gaez:  i18n.rainfed_land_gaez,
                    irrigated_areas_solaw_2012:  i18n.irrigated_areas_solaw_2012,
                    cultivated_land_gaez_2010:  i18n.cultivated_land_gaez_2010,
                    selectable_layers: i18n.selectable_layers,
                    eco_region: i18n.eco_region,
                    gaul1: i18n.gaul1,
                    hotspot: i18n.hotspot,
                    wheat_area: i18n.wheat_area,
                    zonalstats_gaul1: i18n.zonalstats_gaul1
                }
            );
        }

        var dynamic_data = {
            box: this.o.box,
            wsp: i18n.wsp,
            //wheat: i18n.wheat,
            //population_landscan: i18n.population_landscan,
            //rainfed_land_gaez:  i18n.rainfed_land_gaez,
            //irrigated_areas_solaw_2012:  i18n.irrigated_areas_solaw_2012,
            //cultivated_land_gaez_2010:  i18n.cultivated_land_gaez_2010,
            //selectable_layers: i18n.selectable_layers
        };
        dynamic_data = $.extend(true, {}, dynamic_data, i18n);
        var html = template(dynamic_data);
        this.$placeholder.html(html);

        this.o.$ss = this.$placeholder.find('[data-role="ss"]');

        for (var i = 0; i < this.o.box.length; i++) {
            var selected = ( i == 0 )? " selected='selected'": '';
            this.o.$ss.append("<option value='" + this.o.box[i].id + selected +"'>" + this.o.box[i].title + "</option>");
        }
        this.$placeholder.find('.select2').select2();

        this.o.$ss.on('change', function(e) {
            var id = $(this).find(":selected").val();
            $('.boxes').hide();
            $('#'+id).show();
        })

        this.$tool =  this.$placeholder.find(this.o.s.tool);
        this.$landing =  this.$placeholder.find(this.o.s.landing);

        this.renderTool();
    };

    WSP.prototype.renderTool = function() {

        if (this.o.tool.init === false) {
            var _this = this;

            for (var i = 0; i < this.o.box.length; i++)
            {
                this.o.box[i].$box = this.$tool.find('#' + this.o.box[i].id);
                this.o.box[i].$dd = this.o.box[i].$box.find('[data-role="dd"]');
                this.o.box[i].$map = this.o.box[i].$box.find('[data-role="map"]');
                this.o.box[i].$chart = this.o.box[i].$box.find('[data-role="chart"]');
                
                if(i===0)
                    this.o.box[i].$box.show();

                // init dropdown
                this.o.box[i].$dd = this.o.box[i].$box.find('[data-role="dd"]');
                this.fillDD(this.o.box[i]);

                // init map
                this.o.box[i].m = this.initMap(this.o.box[i].$map);

                // create charts on smap selection
                this.o.box[i].m.map.on('click', function (e) {
                    _this.createCharts(e.latlng.lat, e.latlng.lng);
                }, {box: this.o.box[i]});

                // anomaly
                this.o.box[i].$box.find('[data-role="anomaly"]').on('click', {box: this.o.box[i]}, function (e) {
                    _this.toggleLayerDate(e.data.box, 'anomalyLayer', e.data.box.anomalyLayerPrefix, "Anomaly");
                });

                // anomaly dpy
                this.o.box[i].$box.find('[data-role="anomaly_dpy"]').on('click', {box: this.o.box[i]}, function (e) {
                    _this.toggleLayerDate(e.data.box, 'anomalyDPYLayer', e.data.box.anomalyDPYLayerPrefix, "Anomaly DPY");
                });

                // zscore
                this.o.box[i].$box.find('[data-role="zscore"]').on('click', {box: this.o.box[i]}, function (e) {
                    _this.toggleLayerDate(e.data.box, 'zscoreLayer', e.data.box.zscoreLayerPrefix, "Z-Score");
                });

                // zonalstats_gaul1
                this.o.box[i].$zonalStatsTable = this.o.box[i].$box.find('[data-role="zonalstats_gaul1_table"]');
                this.o.box[i].$box.find('[data-role="zonalstats_gaul1"]').on('click', {box: this.o.box[i]}, function (e) {

                    var box = e.data.box,
                        $zonalStatsTable = box.$zonalStatsTable;

                    if ( box.zonalStatVisible == false || box.zonalStatVisible === undefined) {

                        box.zonalStatVisible = true;

                        $zonalStatsTable.html('<div style="height:400px;"><i class="fa fa-spinner fa-spin fa-2x"></i><span> Loading ZonalStats</span></div>');

                        setTimeout(function() {

                            var table = $.parseJSON(ZonalStats),
                                headers = Object.keys(table[0]);

                            var div = '';
                            div += '<h3>'+ i18n.zonalStatisticsTitle +'</h3>';
                            div += '<table class="table table-striped table-hover">';
                            div += '<thead><tr>';
                            for (var i = 0; i < headers.length; i++) {
                                div += "<th>" + i18n[headers[i]] + "</th>";
                            }
                            div += '</tr></thead>';

                            div += '<tbody>';
                            for (var i = 0; i < table.length; i++) {
                                div += '<tr>';
                                for (var j = 0; j < headers.length; j++) {
                                    div += "<td>" + table[i][headers[j]] + "</td>";
                                }
                                div += '</tr>';
                            }
                            div += '</tbody>';
                            div += '</table>';

                            // load json and show table
                            $zonalStatsTable.html(div);

                        }, 2500);
                    }

                    else {
                        box.zonalStatVisible = false;
                        // hide table
                        $zonalStatsTable.empty();
                    }
                });

                // zoomTo
                this.o.box[i].m.zoomTo("country", "adm0_code", this.o.countriesGaul0);

                _.keys(this.o.layers).forEach(_.bind(function (key) {

                    var $chk = this.o.box[i].$box.find('[data-role="' + key + '"]');

                    $chk.on('click', {
                        box: this.o.box[i],
                        layers: this.o.layers[key]
                    }, function (e) {
                        var box = e.data.box,
                            layers = e.data.layers;

                        _this.toggleLayer(box, key, layers, i18n[key]);
                    });

                    if(_this.o.layers[key].startup)
                        $chk.trigger('click');

                }, this));
            }

            // sync maps
            this.syncMaps(this.o.box);

            this.o.tool.init = true;
        }
        else {
            for (var i = 0; i < this.o.box.length; i++) {
                this.o.box[i].m.invalidateSize();
            }
        }

    };


    WSP.prototype.toggleLayerDate = function(box, layerType, layerTypePrefix, layerTitle) {
        var layerName = box.$dd.find(":selected").val(),
            layer = this.getLayerByLayerName(layerName, box.cachedLayers),
            date = this.getYearMonthByLayer(layer);

        if (box[layerType] !== null && box[layerType] !== undefined) {
            box.m.removeLayer(box[layerType]);
            box[layerType] = null;
        }else {
            box[layerType] = new FM.layer({
                layers: layerTypePrefix + "_" + date + "_3857",
                layertitle: layerTitle + " " + date,
                urlWMS: Services.url_geoserver_wms_demo,
                opacity: '1',
                lang: 'EN',
                openlegend: true,
                //defaultgfi: true
            });
            box.m.addLayer(box[layerType]);
        }
    };

    WSP.prototype.toggleLayer = function(box, layerType, layer, layerTitle, openlegend, defaultgfi) {
        var layerType = 'layer-' + layerType;
        if (box[layerType] !== null && box[layerType] !== undefined) {
            box.m.removeLayer(box[layerType]);
            box[layerType] = null;
        }else {
            var l = {
                layers: layer.workspace + ":" + layer.layerName,
                layertitle: layerTitle,
                urlWMS: Services.url_geoserver_wms_demo,
                opacity:(layer.opacity !== null && layer.opacity !== undefined)? layer.opacity: '1',
                lang: 'EN',
                openlegend: (openlegend !== null && openlegend !== undefined)? openlegend: false,
                defaultgfi: (defaultgfi !== null && defaultgfi !== undefined)? defaultgfi: false,
            };

            if (layer.style !== null && layer.style !== undefined) {
                l.style = layer.style;
            }

            if (layer.cql_filter !== null && layer.cql_filter !== undefined) {
                l.cql_filter = layer.cql_filter;
            }

            if (layer.zindex !== null && layer.zindex !== undefined) {
                l.zindex = layer.zindex;
            }

            if (layer.openlegend !== null && layer.openlegend !== undefined) {
                l.openlegend = layer.openlegend;
            }

            box[layerType] = new FM.layer(l);
            box.m.addLayer(box[layerType]);
        }
    };

    // create listbox for the layers by coveragesector of the d3s
    WSP.prototype.fillDD = function(box) {

        var coverageSectorCode = box.coverageSectorCode,
            $dd = box.$dd;

        var request_filter = {
            "meContent.resourceRepresentationType" : {
                "enumeration" : ["geographic"]
            },
            "meContent.seCoverage.coverageSectors" : {
                "codes" : [
                    {
                        "uid" : "layers_products",
                        "version" : "1.0",
                        "codes": [coverageSectorCode]
                    }
                ]
            }
        };

        var url = Services.url_d3s_resources_find + "?" + Services.url_d3s_resources_find_order_by_date_parameters;
        var _this = this;
        $.ajax({
            type: 'POST',
            url: url,
            contentType: "application/json",
            dataType: 'json',
            //headers: Services.url_d3s_resources_find_headers,
            data: JSON.stringify(request_filter),
            crossDomain: true,
            success : function(response) {
                // TODO build dropdown or display:none
                var html = '';
                for (var i=0; i < response.length; i++) {
                    //var selected = ( i == 0 )? "selected='selected'": "";
                    html += "<option value='" + response[i].dsd.layerName + "'>" + response[i].title[_this.o.lang] + "</option>";
                }
                box.cachedLayers = response;
                $dd.append(html);

                // load layer
                $dd.on('change',{box: box}, function(e) {
                    _this.onDDSelection(e.data.box, $(this).find(":selected").val());
                });

                //console.log($dd.select2().select2('val', $('.select2 option:eq(0)').val()));
                $dd.select2().select2('val', $dd.find('option:eq(0)').val(), true);
            },
            error : function(err, b, c) {
                console.log("ERROR D3s");
            }
        });

    };

    WSP.prototype.onDDSelection = function(box, layerName) {
        var m = box.m,
            cachedLayers = box.cachedLayers,
            selectedLayer = box.selectedLayer,
            l = this.getLayerByLayerName(layerName, cachedLayers);

        box.selectedLayer = this.loadLayer(m, selectedLayer, l.dsd.workspace, l.dsd.layerName, l.title[this.o.lang], box);
    };

    WSP.prototype.getLayerByLayerName = function(layerName, cachedLayers) {
        for(var i=0; i < cachedLayers.length; i++) {
            if (cachedLayers[i].dsd.layerName == layerName) {
                return cachedLayers[i];
            }
        }
    };

    WSP.prototype.getLayersByYear = function(cachedLayers, year) {
        var layers = [];
        for (var i = 0; i< 12; i++) {
            layers.push(null);
        }
        for (var i = 0; i < cachedLayers.length; i++) {
            try {
                var fromDate = cachedLayers[i].meContent.seCoverage.coverageTime.from;
                var d = new Date(fromDate);
                if (d.getFullYear() == year) {
                    //console.log(d.getMonth());
                    layers[d.getMonth()] = cachedLayers[i]
                }
            }
            catch (e) {
                console.warn("Couldn't be possible to parse the date", e);
            }
        }
        return layers;
    };

    WSP.prototype.getYearMonthByLayer = function(layer) {
        console.log(layer);
        var fromDate = layer.meContent.seCoverage.coverageTime.from,
            d = new Date(fromDate),
            month = d.getMonth() + 1,
            year = d.getFullYear();

        return (month > 9)? year.toString() + month.toString(): year.toString() + '0' + month.toString();
    };

    WSP.prototype.handlePixelSelection = function(e) {
        console.log('callback click', e)

    };

    WSP.prototype.loadLayer = function(m, selectedLayer, workspace, layerName, layerTitle, box) {

        // remove selected layer
        if (selectedLayer !== null && selectedLayer !== undefined) {
            m.removeLayer(selectedLayer);
        }

        // create layer
        selectedLayer = new FM.layer({
            layers: workspace + ":" + layerName,
            layertitle: layerTitle,
            urlWMS: Services.url_geoserver_wms_demo,
            opacity: '1',
            lang: 'EN',
            openlegend: true,
            defaultgfi: true,
            customgfi: {
                content: {
                    EN: "{{GRAY_INDEX}}"
                },
                showpopup: true,
                callback: _.bind(this.handlePixelSelection, this, box)
            }
        });

        m.addLayer(selectedLayer);

        return selectedLayer;
    };

    WSP.prototype.createCharts = function(lat, lon) {
        var requestKey = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
        this.o.requestKey = requestKey;
        for(var i=0; i < this.o.box.length; i++) {
            this.createChart(this.o.box[i], lat, lon, requestKey);
        }
    };

    WSP.prototype.createChart = function(box, lat, lon, requestKey) {
        var cachedLayers = box.cachedLayers,
            $chart = box.$chart;

        //$chart.empty();
        $chart.html('<div style="height:400px;"><i class="fa fa-spinner fa-spin fa-2x"></i><span> Loading '+ box.title +' Pixel Timeseries</span></div>');

        box.chartObj = null;

        // chart template
        var c = $.extend(true, {}, HighchartsTemplate, this.o.chart_template, box.chart.chartObj);

        var formula = (box.chart.formula)? box.chart.formula: null;
        var _this = this;
        for(var year=2015; year >= 2007; year--) {
            this.getChartData(this.getLayersByYear(cachedLayers, year), lat, lon, year.toString(), formula, requestKey).then(function(v) {

                if (requestKey === _this.o.requestKey) {
                    if (box.chartObj === null) {
                        $chart.highcharts(c);
                        box.chartObj = Highcharts.charts[Highcharts.charts.length - 1];
                    }

                    // check response
                    for (var i = 0; i < v.data.length; i++) {
                        if (v.data[i] != null) {
                            box.chartObj.addSeries(v);
                            break;
                        }
                    }
                }
            });
        }

        // add Avg
        var avgLayers = [];
        for (var i=1; i <= 12; i++) {
            var month = (i < 10)? '0' + i: i;
            var l = {
                dsd: $.extend(true, {}, box.averageLayerPrefix)
            }

            l.dsd.layerName = l.dsd.layerName + "_" + month + "_3857";
            avgLayers.push(l);
        }
        this.getChartData(avgLayers, lat, lon, 'AVG', formula, requestKey).then(function(v) {
            if (requestKey === _this.o.requestKey) {
                for (var i = 0; i < v.data.length; i++) {
                    if (v.data[i] != null) {
                        v.dashStyle = 'longdash';
                        v.dashStyle = 'shortdot';
                        v.color = 'red';
                        v.lineWidth = 4;
                        v.states = {
                            hover: {
                                lineWidth: 4
                            }
                        };
                        box.chartObj.addSeries(v);
                        break;
                    }
                }
            }
        });

    };

    WSP.prototype.addSerieToChart = function(chartObj, serie) {
        for(var i=0; i< chartObj.series.length; i++) {
            if ( chartObj.series[i].name == serie.name) {
                console.log(chartObj.series[i].name);
                chartObj.series[i].data = serie.data;
                console.log(serie.data);
                console.log(chartObj.series[i]);
                break;
            }
        }
        chartObj.redraw();
    };

    WSP.prototype.getDataTest = function() {
        var deferred = Q.defer();
        $.get("http://faostat3.fao.org/wds/rest/procedures/usp_GetListBox/faostatdb/MK/4/1/E").done(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    WSP.prototype.getChartData = function(layers, lat, lon, serieName, formula, requestKey) {
        var deferred = Q.defer();

        var data = $.extend(true, {}, this.o.pixel_query);
        for(var i=0; i < layers.length; i++) {

            var layer = null;
            if (layers[i] != null) {
                layer = { workspace: layers[i].dsd.workspace, layerName: layers[i].dsd.layerName, datasource: "geoserver"}
            }
            else {
                layer = { workspace: "", layerName: "", datasource: "geoserver"}
            }
            data.raster.push(layer);
        }

        data.stats.pixel = {
            lat: lat,
            lon: lon
        }


        var _this = this;
        //console.log(requestKey, this.o.requestKey);
        if (requestKey === this.o.requestKey) {
            $.ajax({
                type: 'POST',
                url: Services.url_geostatistics_rasters_pixel,
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify(data),
                crossDomain: true,
                success: function (response) {
                    var d = {
                        name: serieName,
                        data: []
                        // data: response
                    }
                    if (formula !== null && formula !== undefined) {
                        for (var i = 0; i < response.length; i++) {
                            var v = response[i]
                            if (response[i] !== null && response[i] !== undefined) {
                                d.data.push(_this.mathEval(formula.replace('{{x}}', response[i])));
                            }
                            else {
                                d.data.push(response[i]);
                            }
                        }
                    } else {
                        d.data = response;
                    }

                    deferred.resolve(d);
                },
                error: function (err, b, c) {
                }
            });
        }
        else{
             //TODO: is not right the resolve here
            deferred.resolve({
                name: serieName,
                data: []
                // data: response
            })
        }

        return deferred.promise;
    };



    WSP.prototype.initMap = function(c, fullscreenID) {
    /*
    TODO: new map is not working in fullscreen mode
    var m = new FM.Map(c, {
            plugins: {
                zoomcontrol: 'bottomright',
                disclaimerfao: true,
                fullscreen: true,
                geosearch: true,
                mouseposition: false,
                controlloading : true,
                zoomResetControl: true
            },
            guiController: {
                overlay: true,
                baselayer: true,
                wmsLoader: true
            }
        });*/

        var m = new FM.Map(c, {
            plugins: {
                geosearch: false,
                mouseposition: false,
                controlloading : false,
                zoomControl: 'bottomright'
            },
            guiController: {
                overlay: true,
                baselayer: true,
                wmsLoader: true
            },
            gui: {
                disclaimerfao: true
            }
        }, {
            zoomControl: false,
            attributionControl: false
        });
        m.createMap();

        m.addLayer(new FM.layer({
            layers: 'fenix:uncs_lakes_3857',
            layertitle: '',
            urlWMS: Services.url_geoserver_wms_demo,
            opacity: '1',
            zindex: '400',
            lang: 'en',
            hideLayerInControllerList: true
        }));

        m.addLayer(new FM.layer({
            layers: 'fenix:gaul0_line_3857',
            layertitle: i18n.country_coundaries,
            urlWMS: Services.url_geoserver_wms,
            opacity: '1',
            zindex: '500',
            lang: 'en',
            hideLayerInControllerList: true
        }));


        return m;
    };

    WSP.prototype.syncMaps = function(maps) {
        for (var i = 0 ; i < maps.length ; i++) {
            for (var j = 0 ; j < maps.length ; j++) {
                if (i !== j) {
                    if (maps[i].m !== null && maps[i].m !== undefined && maps[j].m !== null && maps[j].m !== undefined) {
                        maps[i].m.syncOnMove(maps[j].m);
                    }
                }
            }
        }
    };

    WSP.prototype.mathEval = function (exp) {
        var reg = /(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>^\\?:])/ig,
            valid = true;

        // Detect valid JS identifier names and replace them
        exp = exp.replace(reg, function ($0) {
            // If the name is a direct member of Math, allow
            if (Math.hasOwnProperty($0))
                return "Math."+$0;
            else if (Math.hasOwnProperty($0.toUpperCase()))
                return "Math."+$0.toUpperCase();
            // Otherwise the expression is invalid
            else
                valid = false;
        });

        // Don't eval if our replace function flagged as invalid
        if (!valid) {
            alert("Invalid arithmetic expression");
        }
        else {
            try {
               return eval(exp);
            } catch (e) {
                alert("Invalid arithmetic expression");
            }
        }
    }

    return WSP;
});