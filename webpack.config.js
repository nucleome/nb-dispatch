//var webpack = require("webpack");
module.exports = {
    entry: "./src/index.js",
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,

        }]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    output: {
        filename: 'nb-dispatch.js',
        libraryTarget: 'umd',
        library: 'nb',
    },
    optimization: {},
    plugins: [
        /*
         new webpack.ProvidePlugin({
             $: 'jquery',
             jQuery: 'jquery',
             'window.jQuery': 'jquery',
             'window.$': 'jquery'
         })
        */
    ]

}
