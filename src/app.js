/* js adapted from:
- https://github.com/hep7agon/city-feedback-hub
- https://github.com/City-of-Helsinki/democracy-preview

modified by hkotkanen
https://github.com/hkotkanen/Leaflet.helsinki-tiles*/

require("leaflet_css");
// requiring only the leaflet.css tries to import these images, which webpack struggles with.
// ...we solve it by requiring them explicitly (causes them to be loaded with file-loader) here.
// source: http://stackoverflow.com/questions/33732066/webpack-requirenode-modules-leaflet-leaflet-css
require("leaflet_marker");
require("leaflet_marker_2x");
require("leaflet_marker_shadow");

require("leaflet");
require("proj4");
require("proj4leaflet");

"use strict";

var HelsinkiCoord = {lat: 60.171944, lng: 24.941389};
var mapLayers = {
    servicemap:
        {protocol: 'wmts',
        url: "http://geoserver.hel.fi/mapproxy/wmts/osm-sm/etrs_tm35fin/{z}/{x}/{y}.png",
        attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        crs: 'tm35',
        resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125]},
    series:
        {protocol: 'tms',
        url: "http://kartta.hel.fi/ws/geoserver/gwc/service/tms/1.0.0/kanslia_palvelukartta:Karttasarja@ETRS-GK25@gif/{z}/{x}/{y}.gif",
        attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        crs: 'gk25',
        resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125]},
    ortho:
        {protocol: 'tms',
        url: "http://kartta.hel.fi/ws/geoserver/gwc/service/tms/1.0.0/kanslia_palvelukartta:Ortoilmakuva_2013_PKS@ETRS-GK25@jpeg/{z}/{x}/{y}.jpeg",
        attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        crs: 'gk25',
        resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125]}
};

function projections(protocol, resolutions) {
    return {'tm35':
        function () {
            var bounds, crsName, crsOpts, originNw, projDef;
            crsName = 'EPSG:3067';
            projDef = '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
            bounds = L.bounds(L.point(-548576, 6291456), L.point(1548576, 8388608));
            originNw = L.point(bounds.min.x, bounds.max.y);
            crsOpts = {
                resolutions: resolutions,
                bounds: bounds,
                transformation: new L.Transformation(1, -originNw.x, -1, originNw.y)
            };
            return new L.Proj.CRS(crsName, projDef, crsOpts);
        },
        'gk25':
        function () {
            var bounds, crsName, crsOpts, projDef, originSw;
            crsName = 'EPSG:3879';
            projDef = '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
            // bounds = [25440000, 6630000, 25571072, 6761072];
            bounds = L.bounds(L.point(25440000, 6761072), L.point(25571072, 6630000));
            originSw = L.point(bounds.min.x, bounds.min.y);
            crsOpts = {
                resolutions: resolutions,
                bounds: bounds,
                transformation: new L.Transformation(1, -originSw.x, -1, originSw.y)
            };
            return new L.Proj.CRS(crsName, projDef, crsOpts);
        }
    }
}

function createTileLayer(name) {
    return L.tileLayer(mapLayers[name].url, {
        attribution: mapLayers[name].attribution,
        maxZoom: 18,
        continuousWorld: false,
        tms: mapLayers[name].protocol !== 'wmts'
    });
}

function makeMap(elem, background) {
    var indexOfResolutionFour = mapLayers[background].resolutions.indexOf(4);
    var crs = projections(mapLayers[background].protocol, mapLayers[background].resolutions)[mapLayers[background].crs];
    var map = L.map(elem, {
        crs: crs(),
        zoomControl: false,
        maxZoom: 15
    }).setView([HelsinkiCoord.lat, HelsinkiCoord.lng], indexOfResolutionFour);
    map.addControl(L.control.zoom({position: 'topright'}));
    var backgroundLayer = createTileLayer(background);
    backgroundLayer.addTo(map);
    return map;
}

L.map.Helsinki = makeMap;

module.exports = L;
