/** global console **/

define([
    'jquery',
    'underscore',
    'q',    
    'handlebars',
    'moment',    
    //'text!fx-wsp-ui/html/structure.hbs',
    'text!fx-wsp-ui/html/templates_tabs.html',
    'i18n!fx-wsp-ui/nls/translate',
    'fx-c-c/start',
    'fx-wsp-ui/config/Services',
    'text!fx-wsp-ui/config/gaul1_ndvi_afg.json',
    'fx-wsp-ui/config/highcharts_template',
    'zonalsum',
    'zonalsumTable',
    'fenix-ui-map',
    'select2',
    'bootstrap',
    'bootstrap-toggle'
], function (
    $,
    _,
    Q,    
    Handlebars,
    moment,
    templates,
    i18n,
    ChartCreator,
    Services,
    ZonalStats,
    HighchartsTemplate,
    ZonalSumSelectors,
    ZonalSumTable
) {
    'use strict';

    function WSP() {

        this.o = {
            lang: 'EN',
            prefix: 'wsp_ui_',
            s: {
                placeholder: '#content'
            },
            box: Services.boxes,

            // Global layers to load for each map
            layers: Services.layers,

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

    var s = {
        ZONALSUM_WRAP: '#zonalsum_wrap',
        ZONALSUM_SELECTORS: '#zonalsum_selectors',
        ZONALSUM_TABLE: '#zonalsum_table',
        BUTTON: '#button_zonalstat'
    }

    WSP.prototype.init = function(config) {

        this.o = $.extend(true, {}, this.o, config);

        this.$placeholder = $(this.o.s.placeholder);

        // render
        this.render(this.o.data);

        // ZONALSUM
        this.$zonasum_wrap = this.$placeholder.find(s.ZONALSUM_WRAP);
        this.$zonasum_selectors = this.$placeholder.find(s.ZONALSUM_SELECTORS);
        this.$zonasum_table = this.$placeholder.find(s.ZONALSUM_TABLE);
        this.$button = this.$placeholder.find(s.BUTTON);

        var zonalsum_selectors = new ZonalSumSelectors();
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
            obj.layerName = 'ndvi_anomaly_1km_mod13a3_200911_3857';

            table.createTable(obj);

        });


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
        
        this.$placeholder.html( template(dynamic_data) );

        this.o.$ss = this.$placeholder.find('[data-role="ss"]');

        for(var i = 0; i < this.o.box.length; i++) {
            var selected = ( i == 0 )? " selected='selected'": '';
            this.o.$ss.append("<option value='" + this.o.box[i].id + selected +"'>" + this.o.box[i].title + "</option>");
        }

        $('.select2').select2();

        var _this = this;
        this.o.$ss.on('change', function(e) {
            
            var id = $(e.target).find("option:selected").val();

            //ONLY NDVI
            if(id==="mod13a3")
                _this.$zonasum_wrap.show();
            else
                _this.$zonasum_wrap.hide();

            console.log( _this.$placeholder.find('.boxes') );

            _.each(_this.o.box, function(box) {
                box.m.map.invalidateSize();
            });
        });
        
        var _this = this;
        for (var i = 0; i < this.o.box.length; i++)
        {
            this.o.box[i].$box = this.$placeholder.find('#' + this.o.box[i].id);
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

            // create charts on map selection
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

            // logic for the external layers
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
                    //console.log(response[i].title[_this.o.lang])
                    var title = response[i].title[_this.o.lang],
                        name = title.split(' '),
                        ym = name.pop(),
                        /*year = ym.substr(0, 4),
                        month = ym.substr(-2),*/
                        //tit = name.join(' ')+'&nbsp; - &nbsp;'+ month +' '+ year;
                        tit = moment(ym,'YYYYMM').format('YYYY MMMM');

                    //console.log(year,month,tit)
                    html += "<option value='" + response[i].dsd.layerName + "'>" + tit + "</option>";
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

        $chart.html('<div style="height:200px;"><i class="fa fa-spinner fa-spin fa-2x"></i><span> Loading '+ box.title +' Pixel Timeseries</span></div>');

        //$chart.slideDown('slow');

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

        m.zoomTo("country", "adm0_code", Services.country_codes);

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