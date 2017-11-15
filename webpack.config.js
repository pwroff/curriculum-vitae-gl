const {resolve} = require('path');
const webpack = require('webpack');
const isDevelopment = process.env.NODE_ENV === "development";

// if (!isDevelopment) {
//     plugins.push(new webpack.optimize.UglifyJsPlugin);
// }


module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, '/public')
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/
            }
        ],
    },
    devtool: '#source-map'
};
