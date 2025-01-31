require('dotenv').config();

/**
 * This leverages Express to create and run the http server.
 * A Fluxible context is created and executes the navigateAction
 * based on the URL. Once completed, the store state is dehydrated
 * and the application is rendered via React.
 */
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import path from 'path';
import serialize from 'serialize-javascript';
import { navigateAction } from 'fluxible-router';
import debugLib from 'debug';
import React from 'react';
import ReactDOM from 'react-dom/server';

import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
//required for authentication
import handleAuthentication from './plugins/authentication/handleAuth';
//required for file upload
import handleUpload from './plugins/import/handleUpload';
//required for export resources
import handleExport from './plugins/export/handleExport';
//required for generating docs
import handleDocumentation from './plugins/documentation/handleDocumentation';
import { enableAuthentication, uploadFolder } from './configs/general';
import cookieSession from 'cookie-session';
import hogan from 'hogan-express';
import serverConfig from './configs/server';
import app from './app';
import HtmlComponent from './components/DefaultHTMLLayout';
import { createElementWithContext } from 'fluxible-addons-react';
import {DatasetIdService} from './services/config/DatasetIdService'
import DbClient from './services/base/DbClient'
import {ServerConfigRepository} from './services/config/ServerConfigRepository'
const cors = require('cors')

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';

const env = process.env.NODE_ENV;
const htmlComponent = React.createFactory(HtmlComponent);
const debug = debugLib('linked-data-reactor');
const publicRoutes = ['/', '/about'];

const host = process.env.HOST ? process.env.HOST : 'localhost';
let port = 3000;
if (env === 'production') {
    port = process.env.PORT
        ? process.env.PORT
        : serverConfig.serverPort
            ? serverConfig.serverPort[0]
            : 3000;
} else {
    port = process.env.PORT ? parseInt(process.env.PORT) + 1 : 3001;
}

const server = express();


// cors middleware
let whitelist = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4000', 'http://localhost:3000', 'https://odp-reactor-ldr.herokuapp.com', 'https://odp-reactor-browser.vercel.app/'] //'http://abc.com']



server.use(cors({
    origin: function(origin, callback){
    // allow requests with no origin 
        if(!origin) return callback(null, true);
        if(whitelist.indexOf(origin) === -1){
            var message = '[!] The CORS policy for this origin doesn\'t ' +
                'allow access from the particular origin.';
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

// we need this because "cookie" is true in csrfProtection
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(
    cookieSession({
        name: 'LDR',
        keys: ['u1waegf234ss', 'u2wef23ed5325']
    })
);
// server.use(csrf({cookie: true}));
//for authentication: this part is external to the flux architecture
if (enableAuthentication) {
    handleAuthentication(server);
}
//handling file upload
handleUpload(server);
//handling content export
handleExport(server);
//handling docs
handleDocumentation(server);
server.set('state namespace', 'App');
server.use(favicon(path.join(__dirname, '/favicon.ico')));
//--------used for views external to fluxible
server.set('views', path.join(__dirname, '/external_views'));
server.set('view engine', 'html');
server.set('view options', { layout: false });
//server.enable('view cache');
server.engine('html', hogan);
//------------------
server.use(
    `${PUBLIC_URL}/public`,
    express.static(path.join(__dirname, '/build'))
);
//server.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
//add frontend npm modules here
server.use(
    `${PUBLIC_URL}/json3`,
    express.static(path.join(__dirname, '/node_modules/json3'))
);
server.use(
    `${PUBLIC_URL}/es5-shim`,
    express.static(path.join(__dirname, '/node_modules/es5-shim'))
);
server.use(
    `${PUBLIC_URL}/es6-shim`,
    express.static(path.join(__dirname, '/node_modules/es6-shim'))
);
server.use(
    `${PUBLIC_URL}/semantic-ui`,
    express.static(path.join(__dirname, '/node_modules/semantic-ui-css'))
);
server.use(
    `${PUBLIC_URL}/odp-reactor-visualframes`,
    express.static(path.join(__dirname, '/node_modules/odp-reactor-visualframes'))
);
server.use(
    `${PUBLIC_URL}/jquery`,
    express.static(path.join(__dirname, '/node_modules/jquery'))
);
server.use(
    `${PUBLIC_URL}/animate.css`,
    express.static(path.join(__dirname, '/node_modules/animate.css'))
);
server.use(
    `${PUBLIC_URL}/leaflet`,
    express.static(path.join(__dirname, '/node_modules/leaflet'))
);
server.use(
    `${PUBLIC_URL}/yasgui-yasqe`,
    express.static(path.join(__dirname, '/node_modules/yasgui-yasqe'))
);
server.use(
    `${PUBLIC_URL}/codemirror`,
    express.static(path.join(__dirname, '/node_modules/codemirror'))
);
server.use(
    `${PUBLIC_URL}/jqcloud2`,
    express.static(path.join(__dirname, '/node_modules/jqcloud2'))
);

server.use(
    `${PUBLIC_URL}/assets`,
    express.static(path.join(__dirname, '/assets'))
);
server.use(
    `${PUBLIC_URL}/uploaded`,
    express.static(path.join(__dirname, uploadFolder[0].replace('.', '')))
);

server.get(`${PUBLIC_URL}/datasetId`, async (req, res) => {
    const datasetIdService = new DatasetIdService(new ServerConfigRepository( new DbClient(process.env.CONFIG_SPARQL_ENDPOINT_URI)))

    const sparqlEndpoint = req.query.sparqlEndpoint
    const graph = req.query.graph

    console.log('Query params: ', sparqlEndpoint, graph)

    if (!sparqlEndpoint || !graph) {
        return res.status(422).json({
            error: '[!] Unprocessable request: missing either sparqlEndpoint or graph'
        })
    }

    const datasetId = await datasetIdService.getDatasetIdFromSparqlEndpointAndGraph({ 
        sparqlEndpoint: sparqlEndpoint, 
        graph : graph
    })
    if (datasetId) {
        return res.status(200).json({
            datasetId : datasetId
        })
    } else {
        return res.status(404).json({
            error: `[!] No datasetId found for endpoint: ${sparqlEndpoint}; graph: ${graph}`
        })
    }
})

// Get access to the fetchr plugin instance
let fetchrPlugin = app.getPlugin('FetchrPlugin');
// Register our services
fetchrPlugin.registerService(require('./services/dbpedia'));
fetchrPlugin.registerService(require('./services/dataset'));
fetchrPlugin.registerService(require('./services/resource'));
fetchrPlugin.registerService(require('./services/pattern'));
fetchrPlugin.registerService(require('./services/facet'));
fetchrPlugin.registerService(require('./services/admin'));
fetchrPlugin.registerService(require('./services/import'));
fetchrPlugin.registerService(require('./services/custom'));
fetchrPlugin.registerService(require('./services/class'));
// Set up the fetchr middleware

server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());
server.use(compression());
server.use(bodyParser.json());

/**
 * This middleware enters inside FLUX flow
 *
 * It creates a context per request
 */

server.use((req, res, next) => {
    //check user credentials
    //stop fluxible rendering if not authorized
    if (enableAuthentication) {
        if (!req.isAuthenticated() && publicRoutes.indexOf(req.url) === -1) {
            //store referrer in session
            req.session.redirectTo = req.url;
            return res.redirect(`${PUBLIC_URL}/login`);
        }
    }
    const context = app.createContext({
        req: req // The fetchr plugin depends on this
        // xhrContext: {
        //     _csrf: req.csrfToken() // Make sure all XHR requests have the CSRF token
        // }
    });

    debug('Executing navigate action');
    context.getActionContext().executeAction(
        navigateAction,
        {
            url: req.url
        },
        err => {
            if (err) {
                if (err.statusCode && err.statusCode === 404) {
                    next();
                } else {
                    next(err);
                }
                return;
            }

            debug('Exposing context state');
            const exposed =
                'window.App=' + serialize(app.dehydrate(context)) + ';';

            debug('Rendering Application component into html');
            const markup = ReactDOM.renderToString(
                createElementWithContext(context)
            );
            const htmlElement = React.createElement(HtmlComponent, {
                //clientFile: env === 'production' ? 'main.min.js' : 'main.js',
                //use main.js for both dev and prod modes
                clientFile: 'main.js',
                addAssets: env === 'production',
                context: context.getComponentContext(),
                state: exposed,
                markup: markup
            });
            const html = ReactDOM.renderToStaticMarkup(htmlElement);

            debug('Sending markup');
            res.type('html');
            res.write('<!DOCTYPE html>' + html);
            res.end();
        }
    );
});

server.listen(port);
if (env === 'production') {
    console.log(
        '[production environment] Check your application on http://%s:%s%s',
        host,
        port,
        PUBLIC_URL
    );
} else {
    console.log(
        '[development environment] Proxy server listening on port ' + port
    );
    console.log(
        '[development environment] Check your application on http://%s:%s%s',
        host,
        port - 1,
        PUBLIC_URL
    );
}

export default server;
