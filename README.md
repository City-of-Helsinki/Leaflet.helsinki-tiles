# Leaflet.helsinki-tiles

**NB!:** Leaflet 1.0.0 has a [compatibility problem with Webpack's css-loader](https://github.com/Leaflet/Leaflet/issues/4849) caused by the non-url placeholder `url(images/)` on line 379 of node_modules/leaflet/dist/leaflet.css. Until Leaflet 1.0.1 is released, a workaround is to modify it to point to an existing file: `url(images/marker-icon.png)` before running `npm run build`. **NB!**

Uses webpack to create a bundled javascript library which enables easy creation of Leaflet maps with Helsinki background tiles.

Bundle includes Leaflet v1.0-rc.1, Proj4.js and Proj4Leaflet, plus the incantations needed to enable the Finnish national coordinate systems (click for details in Finnish):
 - [ETRS-TM35FIN (EPSG::3067)](http://www.maanmittauslaitos.fi/ammattilaisille/maastotiedot/koordinaatti-korkeusjarjestelmat/karttaprojektiot-tasokoordinaatistot/tasokoordinaatistot/etrs)
 - [ETRS-GK25 (EPSG::3879)](http://www.maanmittauslaitos.fi/ammattilaisille/maastotiedot/koordinaatti-korkeusjarjestelmat/karttaprojektiot-tasokoordinaatistot/tasokoordinaatistot/etrs-gkn)

Build the bundle with:
```
npm install
npm run build
```

If you just want to make a map on your web page, the prebuilt library should be available at **TODO** (a cdn? dev.hel.fi/assets/Leaflet.helsinki-tiles.js??).

At the moment, supported background map tile sources are:
 - "servicemap" tiles: OSM based tiles in TM35 coordinates. Usage: `L.map.Helsinki('map-element-name', {background: 'servicemap'})`
 - Latest available orthographic aerial images in GK25 coordinates. Usage: `L.map.Helsinki('map-element-name', {background: 'ortho'})`
 - "map series" tiles from the City of Helsinki in GK25 coordinates. Usage: `L.map.Helsinki('map-element-name', {background: 'series'})`

The API also exposes functions to explicitly create the CRS and TileLayer objects that can be passed to leaflet. Read more in the [examples](example.html).
