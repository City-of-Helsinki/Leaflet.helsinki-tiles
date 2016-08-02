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
    servicemap: {
        protocol: 'wmts',
        crs: 'tm35',
        url: "http://geoserver.hel.fi/mapproxy/wmts/osm-sm/etrs_tm35fin/{z}/{x}/{y}.png",
        attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        zoomLevels: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125],
        minZoom: 3,
        defaultZoom: 11
    },
    series: {
        protocol: 'tms',
        crs: 'gk25',
        url: "http://kartta.hel.fi/ws/geoserver/gwc/service/tms/1.0.0/kanslia_palvelukartta:Karttasarja@ETRS-GK25@gif/{z}/{x}/{y}.gif",
        attribution: 'Map data &copy; <a href="http://www.hel.fi/www/kv/fi/organisaatio/kaupunkimittausosasto/">Helsingin Kaupunki, Kaupunkimittausosasto</a>',
        zoomLevels: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625],
        minZoom: 3,
        defaultZoom: 6
    },
    ortho: {
        protocol: 'tms',
        crs: 'gk25',
        url: "http://kartta.hel.fi/ws/geoserver/gwc/service/tms/1.0.0/kanslia_palvelukartta:Ortoilmakuva_2013_PKS@ETRS-GK25@jpeg/{z}/{x}/{y}.jpeg",
        attribution: 'Map data &copy; <a href="http://www.hel.fi/www/kv/fi/organisaatio/kaupunkimittausosasto/">Helsingin Kaupunki, Kaupunkimittausosasto</a>',
        zoomLevels: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625],
        minZoom: 3,
        defaultZoom: 6
    }
};

function getCRS(gridName) {
    var grids = {'tm35':
        function () {
            var bounds, crsName, crsOpts, originNw, projDef, zoomLevels;
            zoomLevels = [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
            crsName = 'EPSG:3067';
            projDef = '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
            bounds = L.bounds(L.point(-548576, 6291456), L.point(1548576, 8388608));
            originNw = L.point(bounds.min.x, bounds.max.y);
            crsOpts = {
                resolutions: zoomLevels,
                bounds: bounds,
                transformation: new L.Transformation(1, -originNw.x, -1, originNw.y)
            };
            return new L.Proj.CRS(crsName, projDef, crsOpts);
        },
        'gk25':
        function () {
            var bounds, crsName, crsOpts, projDef, originSw, zoomLevels;
            zoomLevels = [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125];
            crsName = 'EPSG:3879';
            projDef = '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
            bounds = L.bounds(L.point(25440000, 6761072), L.point(25571072, 6630000));
            originSw = L.point(bounds.min.x, bounds.min.y);
            crsOpts = {
                resolutions: zoomLevels,
                bounds: bounds,
                transformation: new L.Transformation(1, -originSw.x, -1, originSw.y)
            };
            return new L.Proj.CRS(crsName, projDef, crsOpts);
        }
    }
    return grids[gridName]()
}

function createTileLayer(name) {
    return L.tileLayer(mapLayers[name].url, {
        attribution: mapLayers[name].attribution,
        continuousWorld: true,
        tms: mapLayers[name].protocol !== 'wmts',
        maxZoom: mapLayers[name].zoomLevels.length - 1,
        minZoom: mapLayers[name].minZoom
    });
}

function makeMap(elem, options) {
    var map;
    var defaultOpts = {
        center: [HelsinkiCoord.lat, HelsinkiCoord.lng],
    }

    // merge defaults with user given options object
    opts = Object.assign({}, defaultOpts, options);

    // To initialize the map, we need to know the CRS, which can be
    // inferred from the background name or the crs name.

    // If user passed a CRS _name_, we replace it with the proper CRS object.
    // if it's not a name, just assume we got a valid CRS object
    if (opts.crs != null && typeof(opts.crs) == "string") {
        opts.crs = getCRS(opts.crs);
    }

    // User can also pass only the name of the background, ...
    if (opts.background != null) {
        // in which case we need to infer the CRS if they left it out, ...
        if (opts.crs == null) {
            opts.crs = getCRS(mapLayers[opts.background].crs);
        }
        opts.zoom = mapLayers[opts.background].defaultZoom;
        map = L.map(elem, opts);
        // as well as create the tile layer and add it to the map.
        var backgroundLayer = createTileLayer(opts.background);
        backgroundLayer.addTo(map);

    // If they didn't pass a background option, just create the map object,
    // no need to worry about the background layers.
    } else {
        opts.zoom = 6; //arbitrary probably-sensible value
        map = L.map(elem, opts);
    }

    return map;
}

L.CRS.Helsinki = getCRS;
L.map.Helsinki = makeMap;
L.tileLayer.Helsinki = createTileLayer;

module.exports = L;
