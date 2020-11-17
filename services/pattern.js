'use strict';
import { getHTTPQuery, getHTTPGetURL, prepareDG } from './utils/helpers';
import { checkViewAccess, checkEditAccess } from './utils/accessManagement';
import { getDynamicEndpointParameters } from './utils/dynamicHelpers';
import { enableLogs, enableAuthentication } from '../configs/general';
import PatternQuery from './sparql/PatternQuery';
import ResourceUtil from './utils/ResourceUtil';
import Configurator from './utils/Configurator';
import rp from 'request-promise';
import fs from 'fs';
import log4js from 'log4js';
import PatternUtil from './utils/PatternUtil';
/*-------------log updates-------------*/
let log;
let user;
if (enableLogs) {
    let currentDate = new Date().toDateString().replace(/\s/g, '-');
    let logPath = './logs/' + currentDate + '.log';
    if (fs.existsSync(logPath)) {
        //create a new file when restarting the server
        logPath = './logs/' + currentDate + '_' + Date.now() + '.log';
    }
    log4js.configure({
        appenders: { ldr: { type: 'file', filename: logPath } },
        categories: { default: { appenders: ['ldr'], level: 'info' } }
    });
    log = log4js.getLogger('ldr');
}
/*-------------config-------------*/
const outputFormat = 'application/sparql-results+json';
const headers = { Accept: 'application/sparql-results+json' };
/*-----------------------------------*/
let endpointParameters,
    category,
    cGraphName,
    datasetURI,
    patternURI,
    patternInstanceURI,
    dg,
    graphName,
    propertyURI,
    resourceURI,
    objectURI,
    objectValue,
    query,
    queryObject,
    utilObject,
    patternUtil,
    configurator,
    propertyPath,
    HTTPQueryObject;
queryObject = new PatternQuery();
utilObject = new ResourceUtil();
patternUtil = new PatternUtil();
configurator = new Configurator();

export default {
    name: 'pattern',

    read: (req, resource, params, config, callback) => {
        if (resource === 'pattern.list') {
            datasetURI =
                params.dataset && params.dataset !== '0'
                    ? decodeURIComponent(params.dataset)
                    : 0;
            //control access on authentication
            if (enableAuthentication) {
                if (!req.user) {
                    callback(null, {
                        datasetURI: datasetURI,
                        graphName: graphName,
                        resourceURI: resourceURI,
                        resourceType: '',
                        currentCategory: 0,
                        propertyPath: [],
                        properties: [],
                        config: {}
                    });
                    return 0;
                } else {
                    user = req.user;
                }
            } else {
                user = { accountName: 'open' };
            }

            getDynamicEndpointParameters(
                user,
                datasetURI,
                endpointParameters => {
                    graphName = endpointParameters.graphName;
                    resourceURI = params.resourceURI;
                    propertyPath = decodeURIComponent(params.propertyPath);
                    if (propertyPath.length > 1) {
                        propertyPath = propertyPath.split(',');
                    } //for now only check the dataset access level
                    //todo: extend view access to resource and property level
                    configurator.prepareDatasetConfig(
                        user,
                        1,
                        datasetURI,
                        rconfig => {
                            if (
                                enableAuthentication &&
                                rconfig &&
                                rconfig.hasLimitedAccess &&
                                parseInt(rconfig.hasLimitedAccess)
                            ) {
                                //need to handle access to the dataset
                                //if user is the editor by default he already has view access
                                let editAccess = checkEditAccess(
                                    user,
                                    datasetURI,
                                    0,
                                    0,
                                    0
                                );
                                if (
                                    !editAccess.access ||
                                    editAccess.type === 'partial'
                                ) {
                                    let viewAccess = checkViewAccess(
                                        user,
                                        datasetURI,
                                        0,
                                        0,
                                        0
                                    );
                                    if (!viewAccess.access) {
                                        callback(null, {
                                            datasetURI: datasetURI,
                                            graphName: graphName,
                                            resourceURI: resourceURI,
                                            resourceType: '',
                                            currentCategory: 0,
                                            propertyPath: [],
                                            properties: [],
                                            config: {},
                                            error:
                                                'You do not have enough permision to access this dataset/resource!'
                                        });
                                        return 0;
                                    }
                                }
                            }

                            let query =
                                queryObject.getPrefixes() +
                                queryObject.getPatternList(graphName);
                            console.log(query);

                            rp.get({
                                uri: getHTTPGetURL(
                                    getHTTPQuery(
                                        'read',
                                        query,
                                        endpointParameters,
                                        outputFormat
                                    )
                                ),
                                headers: headers
                            })
                                .then(function(res) {
                                    // parse response and call callback
                                    utilObject.parsePatternData(res, callback);
                                })
                                .catch(function(err) {
                                    // what to do if error ?????
                                    console.log(err);
                                    if (enableLogs) {
                                        log.info(
                                            '\n User: ' +
                                                user.accountName +
                                                '\n Status Code: \n' +
                                                err.statusCode +
                                                '\n Error Msg: \n' +
                                                err.message
                                        );
                                    }
                                    callback(null, {
                                        datasetURI: datasetURI,
                                        graphName: graphName,
                                        resourceURI: resourceURI,
                                        resourceType: '',
                                        title: '',
                                        currentCategory: 0,
                                        propertyPath: [],
                                        properties: [],
                                        config: {}
                                    });
                                });
                        }
                    );
                }
            );
        } else if (resource === 'pattern.specializations') {
            datasetURI =
                params.dataset && params.dataset !== '0'
                    ? decodeURIComponent(params.dataset)
                    : 0;
            //control access on authentication
            if (enableAuthentication) {
                if (!req.user) {
                    callback(null, {
                        datasetURI: datasetURI,
                        graphName: graphName,
                        resourceURI: resourceURI,
                        resourceType: '',
                        currentCategory: 0,
                        propertyPath: [],
                        properties: [],
                        config: {}
                    });
                    return 0;
                } else {
                    user = req.user;
                }
            } else {
                user = { accountName: 'open' };
            }

            getDynamicEndpointParameters(
                user,
                datasetURI,
                endpointParameters => {
                    graphName = endpointParameters.graphName;
                    resourceURI = params.resourceURI;
                    propertyPath = decodeURIComponent(params.propertyPath);
                    if (propertyPath.length > 1) {
                        propertyPath = propertyPath.split(',');
                    } //for now only check the dataset access level
                    //todo: extend view access to resource and property level
                    configurator.prepareDatasetConfig(
                        user,
                        1,
                        datasetURI,
                        rconfig => {
                            if (
                                enableAuthentication &&
                                rconfig &&
                                rconfig.hasLimitedAccess &&
                                parseInt(rconfig.hasLimitedAccess)
                            ) {
                                //need to handle access to the dataset
                                //if user is the editor by default he already has view access
                                let editAccess = checkEditAccess(
                                    user,
                                    datasetURI,
                                    0,
                                    0,
                                    0
                                );
                                if (
                                    !editAccess.access ||
                                    editAccess.type === 'partial'
                                ) {
                                    let viewAccess = checkViewAccess(
                                        user,
                                        datasetURI,
                                        0,
                                        0,
                                        0
                                    );
                                    if (!viewAccess.access) {
                                        callback(null, {
                                            datasetURI: datasetURI,
                                            graphName: graphName,
                                            resourceURI: resourceURI,
                                            resourceType: '',
                                            currentCategory: 0,
                                            propertyPath: [],
                                            properties: [],
                                            config: {},
                                            error:
                                                'You do not have enough permision to access this dataset/resource!'
                                        });
                                        return 0;
                                    }
                                }
                            }

                            let query =
                                queryObject.getPrefixes() +
                                queryObject.getSpecializationList(graphName);
                            console.log(query);

                            rp.get({
                                uri: getHTTPGetURL(
                                    getHTTPQuery(
                                        'read',
                                        query,
                                        endpointParameters,
                                        outputFormat
                                    )
                                ),
                                headers: headers
                            })
                                .then(function(res) {
                                    // parse response and call callback
                                    utilObject.parsePatternData(res, callback);
                                })
                                .catch(function(err) {
                                    // what to do if error ?????
                                    console.log(err);
                                    if (enableLogs) {
                                        log.info(
                                            '\n User: ' +
                                                user.accountName +
                                                '\n Status Code: \n' +
                                                err.statusCode +
                                                '\n Error Msg: \n' +
                                                err.message
                                        );
                                    }
                                    callback(null, {
                                        datasetURI: datasetURI,
                                        graphName: graphName,
                                        resourceURI: resourceURI,
                                        resourceType: '',
                                        title: '',
                                        currentCategory: 0,
                                        propertyPath: [],
                                        properties: [],
                                        config: {}
                                    });
                                });
                        }
                    );
                }
            );
        } else if (resource === 'pattern.compositions') {
            datasetURI =
                params.dataset && params.dataset !== '0'
                    ? decodeURIComponent(params.dataset)
                    : 0;
            //control access on authentication
            if (enableAuthentication) {
                if (!req.user) {
                    callback(null, {
                        datasetURI: datasetURI,
                        graphName: graphName,
                        resourceURI: resourceURI,
                        resourceType: '',
                        currentCategory: 0,
                        propertyPath: [],
                        properties: [],
                        config: {}
                    });
                    return 0;
                } else {
                    user = req.user;
                }
            } else {
                user = { accountName: 'open' };
            }

            getDynamicEndpointParameters(
                user,
                datasetURI,
                endpointParameters => {
                    graphName = endpointParameters.graphName;
                    resourceURI = params.resourceURI;
                    propertyPath = decodeURIComponent(params.propertyPath);
                    if (propertyPath.length > 1) {
                        propertyPath = propertyPath.split(',');
                    } //for now only check the dataset access level
                    //todo: extend view access to resource and property level
                    configurator.prepareDatasetConfig(
                        user,
                        1,
                        datasetURI,
                        rconfig => {
                            if (
                                enableAuthentication &&
                                rconfig &&
                                rconfig.hasLimitedAccess &&
                                parseInt(rconfig.hasLimitedAccess)
                            ) {
                                //need to handle access to the dataset
                                //if user is the editor by default he already has view access
                                let editAccess = checkEditAccess(
                                    user,
                                    datasetURI,
                                    0,
                                    0,
                                    0
                                );
                                if (
                                    !editAccess.access ||
                                    editAccess.type === 'partial'
                                ) {
                                    let viewAccess = checkViewAccess(
                                        user,
                                        datasetURI,
                                        0,
                                        0,
                                        0
                                    );
                                    if (!viewAccess.access) {
                                        callback(null, {
                                            datasetURI: datasetURI,
                                            graphName: graphName,
                                            resourceURI: resourceURI,
                                            resourceType: '',
                                            currentCategory: 0,
                                            propertyPath: [],
                                            properties: [],
                                            config: {},
                                            error:
                                                'You do not have enough permision to access this dataset/resource!'
                                        });
                                        return 0;
                                    }
                                }
                            }

                            let query =
                                queryObject.getPrefixes() +
                                queryObject.getCompositionList(graphName);
                            console.log(query);

                            rp.get({
                                uri: getHTTPGetURL(
                                    getHTTPQuery(
                                        'read',
                                        query,
                                        endpointParameters,
                                        outputFormat
                                    )
                                ),
                                headers: headers
                            })
                                .then(function(res) {
                                    // parse response and call callback
                                    utilObject.parsePatternData(res, callback);
                                })
                                .catch(function(err) {
                                    // what to do if error ?????
                                    console.log(err);
                                    if (enableLogs) {
                                        log.info(
                                            '\n User: ' +
                                                user.accountName +
                                                '\n Status Code: \n' +
                                                err.statusCode +
                                                '\n Error Msg: \n' +
                                                err.message
                                        );
                                    }
                                    callback(null, {
                                        datasetURI: datasetURI,
                                        graphName: graphName,
                                        resourceURI: resourceURI,
                                        resourceType: '',
                                        title: '',
                                        currentCategory: 0,
                                        propertyPath: [],
                                        properties: [],
                                        config: {}
                                    });
                                });
                        }
                    );
                }
            );
        } else if (resource === 'pattern.specializationCount') {
            datasetURI =
                params.dataset && params.dataset !== '0'
                    ? decodeURIComponent(params.dataset)
                    : 0;
            //control access on authentication
            if (enableAuthentication) {
                if (!req.user) {
                    callback(null, {
                        datasetURI: datasetURI,
                        graphName: graphName,
                        resourceURI: resourceURI,
                        resourceType: '',
                        currentCategory: 0,
                        propertyPath: [],
                        properties: [],
                        config: {}
                    });
                    return 0;
                } else {
                    user = req.user;
                }
            } else {
                user = { accountName: 'open' };
            }

            getDynamicEndpointParameters(
                user,
                datasetURI,
                endpointParameters => {
                    graphName = endpointParameters.graphName;
                    resourceURI = params.resourceURI;
                    propertyPath = decodeURIComponent(params.propertyPath);
                    if (propertyPath.length > 1) {
                        propertyPath = propertyPath.split(',');
                    } //for now only check the dataset access level
                    //todo: extend view access to resource and property level
                    configurator.prepareDatasetConfig(
                        user,
                        1,
                        datasetURI,
                        rconfig => {
                            if (
                                enableAuthentication &&
                                rconfig &&
                                rconfig.hasLimitedAccess &&
                                parseInt(rconfig.hasLimitedAccess)
                            ) {
                                //need to handle access to the dataset
                                //if user is the editor by default he already has view access
                                let editAccess = checkEditAccess(
                                    user,
                                    datasetURI,
                                    0,
                                    0,
                                    0
                                );
                                if (
                                    !editAccess.access ||
                                    editAccess.type === 'partial'
                                ) {
                                    let viewAccess = checkViewAccess(
                                        user,
                                        datasetURI,
                                        0,
                                        0,
                                        0
                                    );
                                    if (!viewAccess.access) {
                                        callback(null, {
                                            datasetURI: datasetURI,
                                            graphName: graphName,
                                            resourceURI: resourceURI,
                                            resourceType: '',
                                            currentCategory: 0,
                                            propertyPath: [],
                                            properties: [],
                                            config: {},
                                            error:
                                                'You do not have enough permision to access this dataset/resource!'
                                        });
                                        return 0;
                                    }
                                }
                            }

                            let query =
                                queryObject.getPrefixes() +
                                queryObject.getSpecializationCountPerPattern(
                                    graphName
                                );
                            console.log(query);

                            rp.get({
                                uri: getHTTPGetURL(
                                    getHTTPQuery(
                                        'read',
                                        query,
                                        endpointParameters,
                                        outputFormat
                                    )
                                ),
                                headers: headers
                            })
                                .then(function(res) {
                                    // parse response and call callback
                                    utilObject.parsePatternData(res, callback);
                                })
                                .catch(function(err) {
                                    // what to do if error ?????
                                    console.log(err);
                                    if (enableLogs) {
                                        log.info(
                                            '\n User: ' +
                                                user.accountName +
                                                '\n Status Code: \n' +
                                                err.statusCode +
                                                '\n Error Msg: \n' +
                                                err.message
                                        );
                                    }
                                    callback(null, {
                                        datasetURI: datasetURI,
                                        graphName: graphName,
                                        resourceURI: resourceURI,
                                        resourceType: '',
                                        title: '',
                                        currentCategory: 0,
                                        propertyPath: [],
                                        properties: [],
                                        config: {}
                                    });
                                });
                        }
                    );
                }
            );
        } else if (resource === 'pattern.compositionCount') {
            console.log('compositionCount');
            datasetURI =
                params.dataset && params.dataset !== '0'
                    ? decodeURIComponent(params.dataset)
                    : 0;
            //control access on authentication
            if (enableAuthentication) {
                if (!req.user) {
                    callback(null, {
                        datasetURI: datasetURI,
                        graphName: graphName,
                        resourceURI: resourceURI,
                        resourceType: '',
                        currentCategory: 0,
                        propertyPath: [],
                        properties: [],
                        config: {}
                    });
                    return 0;
                } else {
                    user = req.user;
                }
            } else {
                user = { accountName: 'open' };
            }

            getDynamicEndpointParameters(
                user,
                datasetURI,
                endpointParameters => {
                    graphName = endpointParameters.graphName;
                    resourceURI = params.resourceURI;
                    propertyPath = decodeURIComponent(params.propertyPath);
                    if (propertyPath.length > 1) {
                        propertyPath = propertyPath.split(',');
                    } //for now only check the dataset access level
                    //todo: extend view access to resource and property level
                    configurator.prepareDatasetConfig(
                        user,
                        1,
                        datasetURI,
                        rconfig => {
                            if (
                                enableAuthentication &&
                                rconfig &&
                                rconfig.hasLimitedAccess &&
                                parseInt(rconfig.hasLimitedAccess)
                            ) {
                                //need to handle access to the dataset
                                //if user is the editor by default he already has view access
                                let editAccess = checkEditAccess(
                                    user,
                                    datasetURI,
                                    0,
                                    0,
                                    0
                                );
                                if (
                                    !editAccess.access ||
                                    editAccess.type === 'partial'
                                ) {
                                    let viewAccess = checkViewAccess(
                                        user,
                                        datasetURI,
                                        0,
                                        0,
                                        0
                                    );
                                    if (!viewAccess.access) {
                                        callback(null, {
                                            datasetURI: datasetURI,
                                            graphName: graphName,
                                            resourceURI: resourceURI,
                                            resourceType: '',
                                            currentCategory: 0,
                                            propertyPath: [],
                                            properties: [],
                                            config: {},
                                            error:
                                                'You do not have enough permision to access this dataset/resource!'
                                        });
                                        return 0;
                                    }
                                }
                            }

                            let query =
                                queryObject.getPrefixes() +
                                queryObject.getCompositionCountPerPattern(
                                    graphName
                                );
                            console.log(query);

                            rp.get({
                                uri: getHTTPGetURL(
                                    getHTTPQuery(
                                        'read',
                                        query,
                                        endpointParameters,
                                        outputFormat
                                    )
                                ),
                                headers: headers
                            })
                                .then(function(res) {
                                    // parse response and call callback
                                    utilObject.parsePatternData(res, callback);
                                })
                                .catch(function(err) {
                                    // what to do if error ?????
                                    console.log(err);
                                    if (enableLogs) {
                                        log.info(
                                            '\n User: ' +
                                                user.accountName +
                                                '\n Status Code: \n' +
                                                err.statusCode +
                                                '\n Error Msg: \n' +
                                                err.message
                                        );
                                    }
                                    callback(null, {
                                        datasetURI: datasetURI,
                                        graphName: graphName,
                                        resourceURI: resourceURI,
                                        resourceType: '',
                                        title: '',
                                        currentCategory: 0,
                                        propertyPath: [],
                                        properties: [],
                                        config: {}
                                    });
                                });
                        }
                    );
                }
            );
        } else if (resource === 'pattern.instances') {
            patternURI = params.pattern;

            datasetURI =
                params.dataset && params.dataset !== '0'
                    ? decodeURIComponent(params.dataset)
                    : 0;
            //control access on authentication
            if (enableAuthentication) {
                if (!req.user) {
                    callback(null, {
                        datasetURI: datasetURI,
                        graphName: graphName,
                        resourceURI: resourceURI,
                        resourceType: '',
                        currentCategory: 0,
                        propertyPath: [],
                        properties: [],
                        config: {}
                    });
                    return 0;
                } else {
                    user = req.user;
                }
            } else {
                user = { accountName: 'open' };
            }

            getDynamicEndpointParameters(
                user,
                datasetURI,
                endpointParameters => {
                    graphName = endpointParameters.graphName;
                    resourceURI = params.resourceURI;
                    propertyPath = decodeURIComponent(params.propertyPath);
                    if (propertyPath.length > 1) {
                        propertyPath = propertyPath.split(',');
                    } //for now only check the dataset access level
                    //todo: extend view access to resource and property level
                    configurator.prepareDatasetConfig(
                        user,
                        1,
                        datasetURI,
                        rconfig => {
                            if (
                                enableAuthentication &&
                                rconfig &&
                                rconfig.hasLimitedAccess &&
                                parseInt(rconfig.hasLimitedAccess)
                            ) {
                                //need to handle access to the dataset
                                //if user is the editor by default he already has view access
                                let editAccess = checkEditAccess(
                                    user,
                                    datasetURI,
                                    0,
                                    0,
                                    0
                                );
                                if (
                                    !editAccess.access ||
                                    editAccess.type === 'partial'
                                ) {
                                    let viewAccess = checkViewAccess(
                                        user,
                                        datasetURI,
                                        0,
                                        0,
                                        0
                                    );
                                    if (!viewAccess.access) {
                                        callback(null, {
                                            datasetURI: datasetURI,
                                            graphName: graphName,
                                            resourceURI: resourceURI,
                                            resourceType: '',
                                            currentCategory: 0,
                                            propertyPath: [],
                                            properties: [],
                                            config: {},
                                            error:
                                                'You do not have enough permision to access this dataset/resource!'
                                        });
                                        return 0;
                                    }
                                }
                            }

                            let query =
                                queryObject.getPrefixes() +
                                queryObject.getInstancesByPattern(
                                    graphName,
                                    patternURI
                                );
                            console.log(query);

                            rp.get({
                                uri: getHTTPGetURL(
                                    getHTTPQuery(
                                        'read',
                                        query,
                                        endpointParameters,
                                        outputFormat
                                    )
                                ),
                                headers: headers
                            })
                                .then(function(res) {
                                    // parse response and call callback
                                    utilObject.parsePatternData(res, callback);
                                })
                                .catch(function(err) {
                                    // what to do if error ?????
                                    console.log(err);
                                    if (enableLogs) {
                                        log.info(
                                            '\n User: ' +
                                                user.accountName +
                                                '\n Status Code: \n' +
                                                err.statusCode +
                                                '\n Error Msg: \n' +
                                                err.message
                                        );
                                        console.log('ERROR HERE');
                                    }
                                    callback(null, {
                                        datasetURI: datasetURI,
                                        graphName: graphName,
                                        resourceURI: resourceURI,
                                        resourceType: '',
                                        title: '',
                                        currentCategory: 0,
                                        propertyPath: [],
                                        properties: [],
                                        config: {}
                                    });
                                });
                        }
                    );
                }
            );
        } else if (resource === 'pattern.instanceResources') {
            patternInstanceURI = params.patternInstance;

            datasetURI =
                params.dataset && params.dataset !== '0'
                    ? decodeURIComponent(params.dataset)
                    : 0;
            //control access on authentication
            if (enableAuthentication) {
                if (!req.user) {
                    callback(null, {
                        datasetURI: datasetURI,
                        graphName: graphName,
                        resourceURI: resourceURI,
                        resourceType: '',
                        currentCategory: 0,
                        propertyPath: [],
                        properties: [],
                        config: {}
                    });
                    return 0;
                } else {
                    user = req.user;
                }
            } else {
                user = { accountName: 'open' };
            }

            getDynamicEndpointParameters(
                user,
                datasetURI,
                endpointParameters => {
                    graphName = endpointParameters.graphName;
                    resourceURI = params.resourceURI;
                    propertyPath = decodeURIComponent(params.propertyPath);
                    if (propertyPath.length > 1) {
                        propertyPath = propertyPath.split(',');
                    } //for now only check the dataset access level
                    //todo: extend view access to resource and property level
                    configurator.prepareDatasetConfig(
                        user,
                        1,
                        datasetURI,
                        rconfig => {
                            if (
                                enableAuthentication &&
                                rconfig &&
                                rconfig.hasLimitedAccess &&
                                parseInt(rconfig.hasLimitedAccess)
                            ) {
                                //need to handle access to the dataset
                                //if user is the editor by default he already has view access
                                let editAccess = checkEditAccess(
                                    user,
                                    datasetURI,
                                    0,
                                    0,
                                    0
                                );
                                if (
                                    !editAccess.access ||
                                    editAccess.type === 'partial'
                                ) {
                                    let viewAccess = checkViewAccess(
                                        user,
                                        datasetURI,
                                        0,
                                        0,
                                        0
                                    );
                                    if (!viewAccess.access) {
                                        callback(null, {
                                            datasetURI: datasetURI,
                                            graphName: graphName,
                                            resourceURI: resourceURI,
                                            resourceType: '',
                                            currentCategory: 0,
                                            propertyPath: [],
                                            properties: [],
                                            config: {},
                                            error:
                                                'You do not have enough permision to access this dataset/resource!'
                                        });
                                        return 0;
                                    }
                                }
                            }

                            let query =
                                queryObject.getPrefixes() +
                                queryObject.getInstanceResources(
                                    graphName,
                                    patternInstanceURI
                                );
                            console.log(query);

                            rp.get({
                                uri: getHTTPGetURL(
                                    getHTTPQuery(
                                        'read',
                                        query,
                                        endpointParameters,
                                        outputFormat
                                    )
                                ),
                                headers: headers
                            })
                                .then(function(res) {
                                    // parse response and call callback
                                    utilObject.parsePatternData(res, callback);
                                })
                                .catch(function(err) {
                                    // what to do if error ?????
                                    console.log(err);
                                    if (enableLogs) {
                                        log.info(
                                            '\n User: ' +
                                                user.accountName +
                                                '\n Status Code: \n' +
                                                err.statusCode +
                                                '\n Error Msg: \n' +
                                                err.message
                                        );
                                        console.log('ERROR HERE');
                                    }
                                    callback(null, {
                                        datasetURI: datasetURI,
                                        graphName: graphName,
                                        resourceURI: resourceURI,
                                        resourceType: '',
                                        title: '',
                                        currentCategory: 0,
                                        propertyPath: [],
                                        properties: [],
                                        config: {}
                                    });
                                });
                        }
                    );
                }
            );
        } else if (resource === 'pattern.instance') {
            console.log('[*] pattern.instance params');
            console.log(params);

            patternURI = params.pattern;
            datasetURI =
                params.dataset && params.dataset !== '0'
                    ? decodeURIComponent(params.dataset)
                    : 0;

            let instanceResources = params.instanceResources;
            let args = patternUtil.getArguments(patternURI);
            let patternQuery = patternUtil.getQuery(patternURI);

            //control access on authentication
            if (enableAuthentication) {
                if (!req.user) {
                    callback(null, {
                        datasetURI: datasetURI,
                        graphName: graphName,
                        resourceURI: resourceURI,
                        resourceType: '',
                        currentCategory: 0,
                        propertyPath: [],
                        properties: [],
                        config: {}
                    });
                    return 0;
                } else {
                    user = req.user;
                }
            } else {
                user = { accountName: 'open' };
            }

            getDynamicEndpointParameters(
                user,
                datasetURI,
                endpointParameters => {
                    graphName = endpointParameters.graphName;
                    resourceURI = params.resourceURI;
                    propertyPath = decodeURIComponent(params.propertyPath);
                    if (propertyPath.length > 1) {
                        propertyPath = propertyPath.split(',');
                    } //for now only check the dataset access level
                    //todo: extend view access to resource and property level
                    configurator.prepareDatasetConfig(
                        user,
                        1,
                        datasetURI,
                        rconfig => {
                            if (
                                enableAuthentication &&
                                rconfig &&
                                rconfig.hasLimitedAccess &&
                                parseInt(rconfig.hasLimitedAccess)
                            ) {
                                //need to handle access to the dataset
                                //if user is the editor by default he already has view access
                                let editAccess = checkEditAccess(
                                    user,
                                    datasetURI,
                                    0,
                                    0,
                                    0
                                );
                                if (
                                    !editAccess.access ||
                                    editAccess.type === 'partial'
                                ) {
                                    let viewAccess = checkViewAccess(
                                        user,
                                        datasetURI,
                                        0,
                                        0,
                                        0
                                    );
                                    if (!viewAccess.access) {
                                        callback(null, {
                                            datasetURI: datasetURI,
                                            graphName: graphName,
                                            resourceURI: resourceURI,
                                            resourceType: '',
                                            currentCategory: 0,
                                            propertyPath: [],
                                            properties: [],
                                            config: {},
                                            error:
                                                'You do not have enough permision to access this dataset/resource!'
                                        });
                                        return 0;
                                    }
                                }
                            }

                            let query =
                                queryObject.getPrefixes() +
                                queryObject.getInstanceDataByInstanceResources(
                                    graphName,
                                    instanceResources,
                                    args,
                                    patternQuery.select,
                                    patternQuery.body,
                                    patternQuery.aggregates
                                );
                            console.log(query);

                            rp.get({
                                uri: getHTTPGetURL(
                                    getHTTPQuery(
                                        'read',
                                        query,
                                        endpointParameters,
                                        outputFormat
                                    )
                                ),
                                headers: headers
                            })
                                .then(function(res) {
                                    // parse response and call callback
                                    utilObject.parsePatternData(res, callback);
                                })
                                .catch(function(err) {
                                    // what to do if error ?????
                                    console.log(err);
                                    if (enableLogs) {
                                        log.info(
                                            '\n User: ' +
                                                user.accountName +
                                                '\n Status Code: \n' +
                                                err.statusCode +
                                                '\n Error Msg: \n' +
                                                err.message
                                        );
                                        console.log('ERROR HERE');
                                    }
                                    callback(null, {
                                        datasetURI: datasetURI,
                                        graphName: graphName,
                                        resourceURI: resourceURI,
                                        resourceType: '',
                                        title: '',
                                        currentCategory: 0,
                                        propertyPath: [],
                                        properties: [],
                                        config: {}
                                    });
                                });
                        }
                    );
                }
            );
        }
    }
};
