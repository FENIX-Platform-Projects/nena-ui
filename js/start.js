/** global console **/

define([
    'jquery',
    'underscore',
    'q',    
    'handlebars',
    'moment',
    'text!fx-wsp-ui/html/templates.html',
    'i18n!fx-wsp-ui/nls/translate',
    'fx-c-c/start',
    'fx-wsp-ui/config/config',
    'fx-wsp-ui/config/highcharts',
    'zonalsum',
    'zonalsumTable',
    'fenix-ui-map',
    'select2',
    'bootstrap'
], function (
    $,
    _,
    Q,    
    Handlebars,
    moment,
    templates,
    i18n,
    ChartCreator,
    Config,
    //ZonalStats,
    ConfigHighcharts,
    ZonalSumSelectors,
    ZonalSumTable
) {
    'use strict';

    function WSP() {

        this.o = {
            lang: 'EN',
            prefix: Config.layerPrefix,
            s: {
                placeholder: '#content'
            },
            box: Config.boxes,

            // Global layers to load for each map
            layers: Config.layers,

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
                    categories: Config.charts_months
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
        ZONALSUM_WRAP_OPEN: '#zonalsum_wrap_open',
        ZONALSUM_SELECTORS: '#zonalsum_selectors',
        ZONALSUM_TABLE: '#zonalsum_table',
        CHART_WRAP: '#charts_wrap',
        CHART_YEARS: '.charts_years'
    }

    WSP.prototype.init = function(config) {

        var _this = this;

        this.o = $.extend(true,{},this.o, config);

        this.$placeholder = $(this.o.s.placeholder);

        // render
        this.render(this.o.data);

        // ZONALSUM
        this.$zonasum_wrap = this.$placeholder.find(s.ZONALSUM_WRAP);
        this.$zonasum_selectors = this.$placeholder.find(s.ZONALSUM_SELECTORS);
        this.$zonasum_table = this.$placeholder.find(s.ZONALSUM_TABLE);
        this.$zonasum_wrap_open = this.$placeholder.find(s.ZONALSUM_WRAP_OPEN);
        this.$chart_wrap = this.$placeholder.find(s.CHART_WRAP);
        this.$chart_years = this.$chart_wrap.find(s.CHART_YEARS);

        var zonalsum_selectors = new ZonalSumSelectors();

        zonalsum_selectors.init({
            container: this.$zonasum_selectors
        });

        var table = new ZonalSumTable();

        table.init({
            container: this.$zonasum_table
        });

        //NDVI BOX

        //only for NDVI map
        var ndvibox = _.last(_this.o.box);

        amplify.subscribe('nena.zonalsums.selection_gaul0', function(codes) {
            ndvibox.m.zoomTo("country", "adm0_code", codes);
        });

        amplify.subscribe('nena.zonalsums.submit', function(selection) {

            // selection.workspace = 'nena_mod13a3_anomaly';
            // selection.layerName = 'ndvi_anomaly_1km_mod13a3_200911_3857';

            var layerName = ndvibox.$dd.find(":selected").val();

            var layer = _this.getLayerByLayerName(layerName, ndvibox.cachedLayers);
            var date = _this.getYearMonthByLayer(layer);

            var layer_to_query = "nena_mod13a3_anomaly_dpy:ndvi_anomaly_dpy_1km_mod13a3_" + date + "_3857";

            var workspace = layer_to_query.split(":")[0];
            var layerName = layer_to_query.split(":")[1];
			
			selection.layerName = layerName;
            selection.workspace = workspace;

            table.createTable(selection);
        });

        this.$zonasum_wrap_open.on('click', function(e) {
            _this.$zonasum_wrap.slideDown();
        });

        this.$chart_wrap.on('click','.close', function(e) {
            $(e.currentTarget).parent().toggleClass('collapsed');
            $(e.currentTarget).find('.fa').toggleClass('fa-caret-down fa-caret-up')
        });

        this.$chart_years.on('change','input[type=checkbox]', function(e) {
            
            var year = $(e.target).val(),
            	sel = $(e.target).is(':checked'),
            	boxes = _this.o.box;

            for (var i=0; i < boxes.length; i++)
            {
            	if(boxes[i].chartObj) {
	            	for (var s=0; s < boxes[i].chartObj.series.length; s++) {
	            		
	            		var serie = boxes[i].chartObj.series[s];

	            		if(serie.name === year)
	            			serie.setVisible(sel, true);
	            	}
	            }
            }
        });

        //colorize chart legend
		this.$chart_years.find('label').each(function() {
			
			var year = $(this).data('year'),
				color = ConfigHighcharts.colors[ Config.charts_years.indexOf(year) ];

			$(this).css({color: color });
		});


        this.$zonasum_wrap.on('click','.close', function(e) {
            _this.$zonasum_wrap.slideUp()
        });        
    };

    WSP.prototype.render = function(data) {

        /* Fix the language, if needed. */
        this.o.lang = this.o.lang !== null ? this.o.lang : 'EN';

        /* Load template. */
        var template = Handlebars.compile( $(templates).filter('#structure').html() ),
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
            charts_years: Config.charts_years,
            wsp: i18n.wsp
        };

        dynamic_data = $.extend(true, {}, dynamic_data, i18n);
        
        this.$placeholder.html( template(dynamic_data) );

        this.o.$ss = this.$placeholder.find('[data-role="ss"]');

        for(var i = 0; i < this.o.box.length; i++) {
            var sel = (i===0)?"checked":'',
            	id = this.o.box[i].id,
            	tit = this.o.box[i].title;
            this.o.$ss.append('<input type="radio" name="ss" id="ss'+id+'" value="'+id+'" '+sel+' /><label for="ss'+id+'"> '+tit+'</label><br />');
        }

        var _this = this;
        this.o.$ss.on('change','input[type=radio]', function(e) {
            
            var id = $(e.target).val();

            //ONLY NDVI
            if(id==="mod13a3")
                _this.$zonasum_wrap_open.show();
            else {
                _this.$zonasum_wrap.slideUp();
                _this.$zonasum_wrap_open.hide();
            }


            _.each(_this.o.box, function(box) {
            	$('#box'+box.id).hide();
            });
            $('#box'+id).show(0, function() {
            	var bmap = _.findWhere(_this.o.box,{id: id}).m.map;
            	bmap.invalidateSize();
            });
            //$('#box'+id).prependTo(_this.$placeholder.find('#boxes_wrap'))
        });

        var _this = this;
        for (var i = 0; i < this.o.box.length; i++)
        {
            this.o.box[i].$box = this.$placeholder.find('#box' + this.o.box[i].id);
            this.o.box[i].$dd = this.o.box[i].$box.find('[data-role="dd"]');
            this.o.box[i].$map = this.o.box[i].$box.find('[data-role="map"]');
            
            //this.o.box[i].$chart = this.o.box[i].$box.find('[data-role="chart"]');
            this.o.box[i].$chart = this.$placeholder.find('#chart' + this.o.box[i].id);

            if(i > 0)
				this.o.box[i].$box.hide();

            this.fillDD(this.o.box[i]);

            // init map
            this.o.box[i].m = this.initMap(this.o.box[i].$map);

            this.o.box[i].mapCursor = L.marker([42,12], {
	        	icon: L.divIcon({
	        		html: '<img src="images/cursor.svg" /><i></i>',
	        		iconSize: L.point(54, 54)
	        	})
	        });

            // create charts on map selection
            this.o.box[i].m.map.on('click', function (e) {
                
                _this.$chart_wrap.show();
                _this.$chart_wrap.removeClass('collapsed');
            	_this.$chart_wrap.find('.close').find('.fa').addClass('fa-caret-down').removeClass('fa-caret-up')
				_this.$chart_years.find('input').not('#yearAvg').prop('checked', true);

                _this.createCharts({lat: e.latlng.lat, lon: e.latlng.lng});

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
                urlWMS: Config.services.url_geoserver_wms_demo,
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
                lang: 'EN',
                urlWMS: Config.services.url_geoserver_wms_demo,
                layers: layer.workspace + ':' + layer.layerName,
                layertitle: layerTitle,
                openlegend: (openlegend !== null && openlegend !== undefined)? openlegend: false,
                defaultgfi: (defaultgfi !== null && defaultgfi !== undefined)? defaultgfi: false,
                opacity:    (layer.opacity !== null && layer.opacity !== undefined)? layer.opacity: '1'                
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

        var url = Config.services.url_d3s_resources_find + "?" + Config.services.url_d3s_resources_find_order_by_date_parameters;
        var _this = this;
        $.ajax({
            type: 'POST',
            url: url,
            contentType: "application/json",
            dataType: 'json',
            //headers: Config.services.url_d3s_resources_find_headers,
            data: JSON.stringify(request_filter),
            crossDomain: true,
            success : function(response) {
                // TODO build dropdown or display:none
                for (var i=0; i < response.length; i++)
                {
                    var layerName = response[i].dsd.layerName,
                    	title = response[i].title[_this.o.lang],
                        name = title.split(' '),
                        ym = name.pop(),
                        tit = moment(ym,'YYYYMM').format('YYYY MMMM');

                    $dd.append("<option value='" + layerName + "'>" + tit + "</option>");
                }
                box.cachedLayers = response;

                // load layer
                $dd.on('change',{box: box}, function(e) {
                    _this.onDDSelection(e.data.box, $(this).find(":selected").val());
                });

                $dd.select2().select2('val', $dd.find('option:eq(0)').val(), true);
            },
            error : function(err, b, c) {
                console.warn("ERROR D3s");
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
        var fromDate = layer.meContent.seCoverage.coverageTime.from,
            d = new Date(fromDate),
            month = d.getMonth() + 1,
            year = d.getFullYear();

        return (month > 9)? year.toString() + month.toString(): year.toString() + '0' + month.toString();
    };

    WSP.prototype.handlePixelSelection = function(e, val) {

    	for(var i=0; i < this.o.box.length; i++) {
            var cur = this.o.box[i].mapCursor;
        	cur.setIcon( L.divIcon({
	        		html: '<img src="images/cursor.svg" /><i class="pixelval">'+parseFloat(val).toFixed(2)+'</i>',
	        		iconSize: L.point(54, 54)
	        	}) );
    	}
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
            urlWMS: Config.services.url_geoserver_wms_demo,
            opacity: '1',
            lang: 'EN',
            openlegend: true,
            defaultgfi: true,
            customgfi: {
                content: {
                    EN: "{{GRAY_INDEX}}"
                },
                showpopup: false,
                callback: _.bind(this.handlePixelSelection, this, box)
            }
        });

        m.addLayer(selectedLayer);

        return selectedLayer;
    };

    WSP.prototype.toggleCursor = function() {
        this.o.box[i].mapCursor.addTo(this.o.box[i].m.map)
    }

    WSP.prototype.createCharts = function(latlng) {

    	var _this = this;

        var requestKey = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
        
        this.o.requestKey = requestKey;

        for(var i=0; i < this.o.box.length; i++) {

        	this.o.box[i].mapCursor.setLatLng(latlng);

            this.createChart(this.o.box[i], latlng, requestKey);
        }
    };

    WSP.prototype.createChart = function(box, latlng, requestKey) {
        var cachedLayers = box.cachedLayers,
            $chart = box.$chart;

	    $chart.html('<div class="chart_loader"><i class="fa fa-spinner fa-spin fa-2x"></i><span> Loading </span></div>');

        box.chartObj = null;

        // chart template
        var confChart = $.extend(true, {}, ConfigHighcharts, this.o.chart_template, box.chart.chartObj);

        var formula = (box.chart.formula)? box.chart.formula: null;

        var _this = this;
        for(var i in Config.charts_years) {
        	
        	var year = Config.charts_years[i],
        		layers = _this.getLayersByYear(cachedLayers, year);

            _this.getChartData(layers, latlng, year.toString(), formula, requestKey)
            	.then(function(v) {

                if (requestKey === _this.o.requestKey) {
                    
                    if (box.chartObj === null) {

                        $chart.highcharts(confChart);

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
        _this.getChartData(avgLayers, latlng, 'AVG', formula, requestKey)
        	.then(function(v) {
	            if (requestKey === _this.o.requestKey) {
	                for (var i = 0; i < v.data.length; i++) {
	                    if (v.data[i] != null) {
	                        v = _.extend(Config.charts_avg_style, v);
	                        box.chartObj.addSeries(v);
	                        break;
	                    }
	                }
	            }
        });
    };

    WSP.prototype.addSerieToChart = function(chartObj, serie) {
        for(var i=0; i< chartObj.series.length; i++) {
            if (chartObj.series[i].name == serie.name) {
                chartObj.series[i].data = serie.data;
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

    WSP.prototype.getChartData = function(layers, latlng, serieName, formula, requestKey) {
    
        var deferred = Q.defer(),
        	data = $.extend(true, {}, this.o.pixel_query);

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
            lat: latlng.lat, 
            lon: latlng.lon
        }


        var _this = this;
        if (requestKey === this.o.requestKey) {
            $.ajax({
                type: 'POST',
                url: Config.services.url_geostatistics_rasters_pixel,
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

        m.createMap(Config.lat, Config.lng, Config.zoom);

        m.addLayer(new FM.layer({
            layers: 'fenix:uncs_lakes_3857',
            layertitle: '',
            urlWMS: Config.services.url_geoserver_wms_demo,
            opacity: '1',
            zindex: '400',
            lang: 'en',
            hideLayerInControllerList: true
        }));

        m.addLayer(new FM.layer({
            layers: 'fenix:gaul0_line_3857',
            layertitle: i18n.country_coundaries,
            urlWMS: Config.services.url_geoserver_wms,
            opacity: '1',
            zindex: '500',
            lang: 'en',
            hideLayerInControllerList: true
        }));

        var btn = new L.Control({position:'topright'});
        btn.onAdd = function(map) {
            var azoom = L.DomUtil.create('a','pick-position');
            azoom.innerHTML = '<i class="fa fa-map-marker"></i>';
            L.DomEvent
                .disableClickPropagation(azoom)
                .addListener(azoom, 'click', function() {
                    map.setView(map.options.center, map.options.zoom);
                },azoom);
            return azoom;
        };
        m.map.addControl(btn);

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
            console.warn("Invalid arithmetic expression");
        }
        else {
            try {
               return eval(exp);
            } catch (e) {
                console.warn("Invalid arithmetic expression");
            }
        }
    }

    return WSP;
});