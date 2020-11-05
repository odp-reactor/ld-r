/* Problem: callback is passed down to async function and called by then.
 *
 * fun_1(params, callback) {
 *        fun_2(params, callback) {
 *                ...
 *                     fun_n(params, callback) {
 *                          asyncFunction.then(callback).catch(callback)
 *                                }
 *
 * It should change to this:
 *
 * fun_1(params).then(callback())
 *
 * This is unreadable call, and you cannot control how to send back data wtf wtf shit
 * SHIIIIIIIT
 *
 * */
export default {
    getDynamicEndpointParameters: function(user, datasetURI) {
        let d = datasetURI,
            g = datasetURI,
            options = {};
        //try default graph if no datasetURI is given
        if (String(defaultDatasetURI[0]) !== '') {
            if (!d) {
                d = defaultDatasetURI[0];
            }
        }
        let config = { sparqlEndpoint: {} };
        //the following graphs should be only locally reachable
        let exceptions = [configDatasetURI[0], authDatasetURI[0]];
        //do not config if disabled or exceptions
        if (!enableDynamicServerConfiguration) {
            throw '[!] Dynamic Server Configuration not enabled: Check the parameter enableDynamicServerConfig in server.js';
        }
        if (exceptions.indexOf(datasetURI) !== -1) {
            throw `[*] Exceptions occured: ${exceptions}`;
        }

        prepareDGFunc(user, datasetURI, config => {
            let httpOptions;
            let d = config.d;
            let g = config.g;

            httpOptions = {
                host: config.options.host,
                port: config.options.port,
                path: config.options.path,
                protocol: config.options.protocol,
                username: config.options.username,
                password: config.options.password
            };
            let useReasoning = 0;
            if (config.options.useReasoning) {
                useReasoning = 1;
            }
            let etype = config.options.endpointType
                ? config.options.endpointType
                : 'virtuoso';
            callback({
                httpOptions: httpOptions,
                type: etype.toLowerCase(),
                graphName: g,
                useReasoning: useReasoning
            });
        });
    },

    prepareDynamicServerConfig: function(user, datasetURI) {
        let config = { sparqlEndpoint: {} };
        //the following graphs should be only locally reachable
        let exceptions = [configDatasetURI[0], authDatasetURI[0]];
        //do not config if disabled or exceptions
        if (
            !enableDynamicServerConfiguration ||
            exceptions.indexOf(datasetURI) !== -1
        ) {
            callback(config);
        } else {
            let userSt = '';
            if (
                user &&
                user.accountName !== 'open' &&
                !Number(user.isSuperUser)
            ) {
                userSt = ` ldr:createdBy <${user.id}> ;`;
            }
            //start config
            const endpointParameters = getStaticEndpointParameters(
                configDatasetURI[0]
            );
            const graphName = endpointParameters.graphName;
            const headers = { Accept: 'application/sparql-results+json' };
            const outputFormat = 'application/sparql-results+json';
            //query the triple store for server configs
            const prefixes = `
                PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#>
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                PREFIX owl: <http://www.w3.org/2002/07/owl#>

            `;
            let graph = ' GRAPH <' + graphName + '> {';
            let graphEnd = ' }';
            if (!graphName || graphName === 'default') {
                graph = '';
                graphEnd = '';
            }
            const noAuthQuery = `
            SELECT DISTINCT ?config ?label ?host ?port ?path ?protocol ?username ?password ?endpointType ?setting ?settingValue WHERE {
                ${graph}
                    ?config a ldr:ServerConfig ;
                            ldr:dataset <${datasetURI}> ;
                            ldr:host ?host ;
                            ldr:port ?port ;
                            ldr:path ?path ;
                            ldr:endpointType ?endpointType ;
                            ?setting ?settingValue .
                            OPTIONAL { ?config ldr:protocol ?protocol . }
                            OPTIONAL { ?config ldr:username ?username . }
                            OPTIONAL { ?config ldr:password ?password . }
                            OPTIONAL { ?config rdfs:label ?label . }
                            FILTER (?setting !=rdf:type && ?setting !=ldr:dataset && ?setting !=ldr:host && ?setting !=ldr:protocol && ?setting !=ldr:port && ?setting !=ldr:path && ?setting !=ldr:endpointType && ?setting !=ldr:username && ?setting !=ldr:password)
                ${graphEnd}
            }
            `;
            let query;
            if (userSt) {
                query = `
                SELECT DISTINCT ?config ?label ?host ?port ?path ?protocol ?username ?password ?endpointType ?setting ?settingValue WHERE {
                    ${graph}
                    {
                        ?config a ldr:ServerConfig ;
                                ${userSt}
                                ldr:dataset <${datasetURI}> ;
                                ldr:host ?host ;
                                ldr:port ?port ;
                                ldr:path ?path ;
                                ldr:endpointType ?endpointType ;
                                ?setting ?settingValue .
                                OPTIONAL { ?config ldr:protocol ?protocol . }
                                OPTIONAL { ?config ldr:username ?username . }
                                OPTIONAL { ?config ldr:password ?password . }
                                OPTIONAL { ?config rdfs:label ?label . }
                                FILTER (?setting !=rdf:type && ?setting !=ldr:dataset && ?setting !=ldr:host && ?setting !=ldr:protocol && ?setting !=ldr:port && ?setting !=ldr:path && ?setting !=ldr:endpointType && ?setting !=ldr:username && ?setting !=ldr:password)
                    }
                    UNION
                    {
                        ?config a ldr:ServerConfig ;
                                ldr:dataset <${datasetURI}> ;
                                ldr:host ?host ;
                                ldr:port ?port ;
                                ldr:path ?path ;
                                ldr:endpointType ?endpointType ;
                                ?setting ?settingValue .
                                OPTIONAL { ?config ldr:protocol ?protocol . }
                                OPTIONAL { ?config ldr:username ?username . }
                                OPTIONAL { ?config ldr:password ?password . }
                                OPTIONAL { ?config rdfs:label ?label . }
                                FILTER (?setting !=rdf:type && ?setting !=ldr:dataset && ?setting !=ldr:host && ?setting !=ldr:protocol && ?setting !=ldr:port && ?setting !=ldr:path && ?setting !=ldr:endpointType && ?setting !=ldr:username && ?setting !=ldr:password)
                                filter not exists {
                                    ?config ldr:createdBy ?user.
                                }
                    }
                    ${graphEnd}
                }
                `;
            } else {
                query = noAuthQuery;
            }
            //send request
            let self = this;
            rp.get({
                uri: getHTTPGetURL(
                    getHTTPQuery(
                        'read',
                        prefixes + query,
                        endpointParameters,
                        outputFormat
                    )
                ),
                headers: headers
            });
        }
    }
};
