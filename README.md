# Leaflet.helsinki-tiles

Uses webpack to create a bundled javascript library that enables easy creation of Leaflet maps with Helsinki background tiles.

Bundle includes Leaflet v1.0-rc.1, Proj4.js and Proj4Leaflet, plus the incantations needed to enable weird, Helsinki specific CRS's (EPSGs 3067 (aka TM35) and 3879 (aka GK25)).

Build the bundle with:
```
npm install
npm run build
```

If you just want to make a map on your web page, the build library should be available at ??? (a cdn? dev.hel.fi/assets/helmaps.js??).

At the moment, supported background map tile sources are:
 - "servicemap" tiles: OSM based tiles in GK25. Usage: `L.map.Helsinki('map-element-name', 'servicemap')`
 - 2013 orthographic aerial images in TM35. Usage: `L.map.Helsinki('map-element-name', 'ortho')`
 - "map series" tiles from the City of Helsinki in TM35. Usage: `L.map.Helsinki('map-element-name', 'series')`
