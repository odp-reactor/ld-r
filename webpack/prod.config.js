let webpack = require('webpack');
let path = require('path');
//plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const Visualizer = require('webpack-visualizer-plugin');

require('dotenv').config();

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';

const PUBLIC_DIR = `${PUBLIC_URL}/public/js`;

let webpackConfig = {
    mode: 'production',
    devtool: '',
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            react: path.resolve('./node_modules/react')
        }
    },
    entry: {
        main: './client.js'
    },
    output: {
        path: path.resolve('./build/js'),
        publicPath: PUBLIC_DIR,
        filename: '[name].js'
    },
    optimization: {
        minimize: false,
        runtimeChunk: {
            name: 'vendor.bundle'
        },
        splitChunks: {
            cacheGroups: {
                default: false,
                commons: {
                    test: /node_modules/,
                    name: 'vendor.bundle',
                    chunks: 'initial',
                    minSize: 1
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules(?!(\/|\\)react-sigma)/,
                loader: 'babel-loader',
                options: {
                    babelrc: true
                }
            },
            {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
            // {
            //     test: /\.css$/,
            //     loader: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         use: 'css-loader',
            //         publicPath: '/public/css/'
            //     })
            // }
        ]
    },
    node: {
        setImmediate: false,
        console: true,
        fs: 'empty'

    },
    plugins: [
        // css files from the extract-text-plugin loader
        new ExtractTextPlugin({
            filename: '../css/vendor.bundle.css',
            disable: false,
            allChunks: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('dev'),
                BROWSER: JSON.stringify('true'),
                PUBLIC_URL: JSON.stringify(process.env.PUBLIC_URL),
                HOST: JSON.stringify(process.env.HOST),
                CONFIG_SPARQL_ENDPOINT_URI: JSON.stringify(process.env.CONFIG_SPARQL_ENDPOINT_URI),
                CONFIG_SPARQL_ENDPOINT_HOST: JSON.stringify(process.env.CONFIG_SPARQL_ENDPOINT_HOST),
                CONFIG_SPARQL_ENDPOINT_PATH: JSON.stringify(process.env.CONFIG_SPARQL_ENDPOINT_PATH),
                CONFIG_SPARQL_ENDPOINT_PORT: JSON.stringify(process.env.CONFIG_SPARQL_ENDPOINT_PORT),
                CONFIG_SPARQL_ENDPOINT_TYPE: JSON.stringify(process.env.CONFIG_SPARQL_ENDPOINT_TYPE),
                CONFIG_SPARQL_ENDPOINT_PROTOCOL: JSON.stringify(process.env.CONFIG_SPARQL_ENDPOINT_PROTOCOL),
                CONFIG_GRAPH: JSON.stringify(process.env.CONFIG_GRAPH),
                ODP_REACTOR_GRAPH_HOST: JSON.stringify(process.env.ODP_REACTOR_GRAPH_HOST),
                ODP_REACTOR_GRAPH_PORT: JSON.stringify(process.env.ODP_REACTOR_GRAPH_PORT),
                TEST_SPARQL_ENDPOINT_URI: JSON.stringify(process.env.TEST_SPARQL_ENDPOINT_URI)            }
        }),
        // Write out stats file to build directory.
        new StatsWriterPlugin({
            filename: 'webpack.stats.json', // Default
            fields: null,
            transform: function(data) {
                return JSON.stringify(data, null, 2);
            }
        }),
        new Visualizer()
    ],
    stats: {
        colors: true,
        children: false
    }
};

module.exports = webpackConfig;
