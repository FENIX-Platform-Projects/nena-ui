/*global define*/
define(function ( ) {

    'use strict';

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

        "country_codes": [
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
        ]      
    };
});