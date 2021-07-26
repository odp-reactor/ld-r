let webpack = require('webpack');
let path = require('path');

require('dotenv').config();

const host = process.env.HOST ? process.env.HOST : 'localhost';
const mainPort = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const devPort = process.env.PORT ? parseInt(process.env.PORT) + 1 : 3001;

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';

const PUBLIC_DIR = `${PUBLIC_URL}/public/js`;

let webpackConfig = {
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            react: path.resolve('./node_modules/react')
        }
    },
    entry: {
        main: [
            'webpack-dev-server/client?http://' + host + ':' + mainPort,
            'webpack/hot/only-dev-server',
            './client.js'
        ]
    },
    output: {
        path: path.resolve('./build/js'),
        publicPath: PUBLIC_DIR,
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.sparql$/i,
                use: [{
                    loader: 'raw-loader',
                    // options: {
                    // esModule: false
                    // }
                }]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            // {
            //     test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
            //     loader: "url-loader?limit=10000"
            // },
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
        ]
    },
    node: {
        setImmediate: false,
        console: true,
        fs: 'empty'
        // //net: 'empty',
        // tls: 'empty'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('dev'),
                BROWSER: JSON.stringify('true'),
                PUBLIC_URL: JSON.stringify(process.env.PUBLIC_URL),
                HOST: JSON.stringify(process.env.HOST),
                PORT: JSON.stringify(process.env.PORT),
                CONFIG_SPARQL_ENDPOINT_URI: JSON.stringify(process.env.CONFIG_SPARQL_ENDPOINT_URI),
                CONFIG_SPARQL_ENDPOINT_HOST: JSON.stringify(process.env.CONFIG_SPARQL_ENDPOINT_HOST),
                CONFIG_SPARQL_ENDPOINT_PATH: JSON.stringify(process.env.CONFIG_SPARQL_ENDPOINT_PATH),
                CONFIG_SPARQL_ENDPOINT_PORT: JSON.stringify(process.env.CONFIG_SPARQL_ENDPOINT_PORT),
                CONFIG_SPARQL_ENDPOINT_TYPE: JSON.stringify(process.env.CONFIG_SPARQL_ENDPOINT_TYPE),
                CONFIG_SPARQL_ENDPOINT_PROTOCOL: JSON.stringify(process.env.CONFIG_SPARQL_ENDPOINT_PROTOCOL),
                CONFIG_GRAPH: JSON.stringify(process.env.CONFIG_GRAPH),
                ODP_REACTOR_GRAPH_HOST: JSON.stringify(process.env.ODP_REACTOR_GRAPH_HOST),
                ODP_REACTOR_GRAPH_PORT: JSON.stringify(process.env.ODP_REACTOR_GRAPH_PORT),
                TEST_SPARQL_ENDPOINT_URI: JSON.stringify(process.env.TEST_SPARQL_ENDPOINT_URI),            
                ALLOWED_ORIGINS: JSON.stringify(process.env.ALLOWED_ORIGINS)
            }
        })
    ],
    devtool: 'cheap-module-source-map'
};

module.exports = webpackConfig;
