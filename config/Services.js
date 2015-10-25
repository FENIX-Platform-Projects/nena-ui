/*global define*/
define(['i18n!fx-wsp-ui/nls/translate'], function (i18n) {

    'use strict';

    var layerPrefix = 'eco_',
    	country_codes = [
        "4",     //Algeria
        "6",     //Sudan
        "21",    //Bahrain
        "74",    //South Sudan
        "91",    //Gaza Strip
        "117",   //Iran (Islamic Republic of)
        "118",   //Iraq
        "121",   //Israel
        "130",   //Jordan
        "137",   //Kuwait
        "141",   //Lebanon
        "145",   //Libya
        "159",   //Mauritania
        "169",   //Morocco
        "187",   //Oman
        "201",   //Qatar
        "215",   //Saudi Arabia
        "238",   //Syrian Arab Republic
        "248",   //Tunisia
        "255",   //United Arab Emirates
        "267",   //West Bank
        "268",   //Western Sahara
        "269",   //Yemen
        "40766",
        "40765",
        "117" // Iran
    ];

    return {

        "url_geoserver_wms": "http://fenix.fao.org/geoserver",
        "url_geoserver_wms_demo": "http://fenix.fao.org/demo/fenix/geoserver",
        "url_d3s_metadata_resource": "http://fenix.fao.org/d3s/msd/resources/uid/{{UID}}",
        "url_d3s_resources_find": "http://fenix.fao.org/d3s/msd/resources/find",
        "url_d3s_resources_find_order_by_date_parameters": "order=meContent.seCoverage.coverageTime.from:desc&logic=StandardFilter&dsd=true&full=true",
        //"url_d3s_resources_find_order_by_date_parameters": "order=meContent.seCoverage.coverageTime.from:desc&logic=StandardFilter",

        "url_geostatistics_rasters_pixel": "http://fenix.fao.org/demo/fenix/geo/geostatistics/rasters/pixel/",

        //"url_d3s_resources_find_headers": { "full": true,  "dsd": true }

        "url_spatial_query": "http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/query/",
        "url_models_hostspot_crops": "http://fenix.fao.org/demo/fenix/geo/models/hotspot/crops/",

        "country_codes": country_codes,
        "boxes": [
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
            },
            {
                id: 'myd11c3',
                title: i18n.temperature,
                coverageSectorCode: 'myd11c3',
                cachedLayers: [],
                selectedLayer: null,
                addZscore: true,
                anomalyLayerPrefix: 'eco_myd11c3_anomaly:lst_anomaly_6km_myd11c3',
                anomalyDPYLayerPrefix: 'eco_myd11c3_anomaly_dpy:lst_anomaly_dpy_6km_myd11c3',
                zscoreLayerPrefix: 'eco_myd11c3_zscore:lst_zscore_6km_myd11c3',
                averageLayerPrefix: {
                    workspace: 'eco_myd11c3_avg',
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
                id: 'mod13a3',
                title: i18n.ndvi_label,
                coverageSectorCode: 'nena_mod13a3',
                cachedLayers: [],
                addZscore: false,
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
            }
        ],
        "layers": {
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
                enabled: true
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
                cql_filter: 'adm0_code IN ('+ country_codes.join(',') +')',
                style: 'gaul1_highlight_polygon',
                openlegend: false,
                enabled: true,                    
                zindex: 4500
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
        }
    };
});