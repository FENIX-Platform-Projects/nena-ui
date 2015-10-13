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
    };
});