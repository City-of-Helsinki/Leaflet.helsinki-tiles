module.exports = {
    entry:  __dirname + "/src/app.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js",
        library: "L"
    },
    resolve: {
        root: __dirname,
        modulesDirectories: ['node_modules'],
        alias: {
            leaflet_css: __dirname + "/node_modules/leaflet/dist/leaflet.css",
            leaflet_marker: __dirname + "/node_modules/leaflet/dist/images/marker-icon.png",
            leaflet_marker_2x: __dirname + "/node_modules/leaflet/dist/images/marker-icon-2x.png",
            leaflet_marker_shadow: __dirname + "/node_modules/leaflet/dist/images/marker-shadow.png"
        }
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.(png|jpg)$/, loader: "file-loader?name=images/[name].[ext]" }
        ]
    }
};
