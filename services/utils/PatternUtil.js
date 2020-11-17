import { patternConfig } from '../../configs/pattern';
import { config } from '../../configs/reactor';

const configPath = '(projectRoot)/configs/pattern.js';
const reactorConfigPath = '(projectRoot)/configs/reactor.js';
const queryKey = 'query';
const selectKey = 'select';
const bodyKey = 'body';
const argumentsKey = 'arguments';
const viewKey = 'patternIViewer';
const patternURIKey = 'pattern';
const patternStateKey = 'stateKey';

/**
 * @description An helper for pattern service. It do stuff such as access pattern config file
 * @author Christian Colonna
 * @date 15-11-2020
 * @export
 * @class PatternUtil
 */
class PatternUtil {
    /**
     * @description Search in the pattern config file the query for a given patern
     * @author Christian Colonna
     * @date 15-11-2020
     * @param {string} patternURI pattern uri
     * @returns {Object} query for given pattern { statement, body, ?aggregates }
     * @memberof PatternUtil
     */
    getQuery(patternURI) {
        this.checkConfigForPattern(patternURI);
        if (!patternConfig[patternURI][queryKey]) {
            throw Error(
                `[!] no query found for ${patternURI} in ${configPath}`
            );
        }
        if (!patternConfig[patternURI][queryKey][selectKey]) {
            throw Error(
                `[!] no SELECT query statement found for ${patternURI} in ${configPath}`
            );
        }
        if (!patternConfig[patternURI][queryKey][bodyKey]) {
            throw Error(
                `[!] no query body found for ${patternURI} in ${configPath}`
            );
        } else return patternConfig[patternURI][queryKey];
    }

    /**
     * @description Search in the pattern config file the types for a given pattern
     *              Types are used to map and bind a node of type type on a query variable
     * @author Christian Colonna
     * @date 15-11-2020
     * @param {string} patternURI
     * @returns {string[]} the array of types to be mapped
     * @memberof PatternUtil
     */
    getArguments(patternURI) {
        this.checkConfigForPattern(patternURI);
        if (!patternConfig[patternURI][argumentsKey]) {
            throw Error(
                `[!] no types to map resources on query found for ${patternURI} in ${configPath}`
            );
        } else return patternConfig[patternURI][argumentsKey];
    }

    /**
     * @description Search in the pattern config file the view for the given pattern
     * @author Christian Colonna
     * @date 15-11-2020
     * @param {string} patternURI
     * @returns {string} view name
     * @memberof PatternUtil
     */
    getView(patternURI) {
        this.checkConfigForPattern(patternURI);
        if (!patternConfig[patternURI][viewKey]) {
            throw Error(`[!] no view found for ${patternURI} in ${configPath}`);
        } else return patternConfig[patternURI][viewKey];
    }

    /**
     * @description Search in the pattern config file the state key for given pattern. All the data
     *              for the pattern instance are saved under this key. This is necessary to have a
     *              single central store to keep several pattern data.
     * @author Christian Colonna
     * @date 17-11-2020
     * @param {string} patternURI
     * @returns {string} state key for given pattern in PatternInstanceStore
     * @memberof PatternUtil
     */
    getStateKey(patternURI) {
        this.checkConfigForPattern(patternURI);
        if (!patternConfig[patternURI][patternStateKey]) {
            throw Error(
                `[!] no pattern state key found for ${patternURI} in ${configPath}. Specify one or ask developer for a default one`
            );
        } else return patternConfig[patternURI][patternStateKey];
    }

    /**
     * @description Returns the pattern uri a resource with given property nelongs to
     *              Example: cultural_property_1 hasTimeIndexedTypedLocation time_i_t_l_1
     *              in the config file there should be an entry
     *              patternURI: "ns:time-indexed-typed-location"
     *              for the property "hasTimeIndexedTypedLocation"
     * @author Christian Colonna
     * @date 15-11-2020
     * @param {string} propertyURI
     * @returns {string} the patter a resource with property propertyURI belongs to
     * @memberof PatternUtil
     */
    getPatternURI(propertyURI) {
        if (!config[propertyURI]) {
            throw Error(
                `[!] no config found for ${propertyURI} in ${reactorConfigPath}`
            );
        }
        if (!config[propertyURI][patternURIKey]) {
            throw Error(
                `[!] no pattern uri found for ${propertyURI} in ${reactorConfigPath}. Specify a uri pointing to a uri in the pattern config file at ${configPath}`
            );
        } else return config[propertyURI][patternURIKey];
    }

    /**
     * @description read getPatternURI, it catch the view for given pattern
     * @author Christian Colonna
     * @date 15-11-2020
     * @param {string} propertyURI
     * @returns {string} view name
     * @memberof PatternUtil
     */
    getViewByProperty(propertyURI) {
        const patternURI = this.getPatternURI(propertyURI);
        return this.getView(patternURI);
    }

    /**
     * @description Check if there's a config entry for pattern
     * @author Christian Colonna
     * @date 15-11-2020
     * @param {string} patternURI
     * @memberof PatternUtil
     */
    checkConfigForPattern(patternURI) {
        if (!patternConfig[patternURI]) {
            throw Error(
                `[!] no config found for ${patternURI} in ${configPath}`
            );
        }
    }

    /**
     * The function is used to parse data received by a custom query, they are returned .
     *
     * @param {Object} body Data returned by fluxible service after querying SPARQL endpoint
     * @param {Function} callback Function to call after action succeeds
     */
    parsePatternInstanceData(patternKey, body, callback) {
        const receivedData = JSON.parse(body);
        const sparqlRows = receivedData['results']['bindings'];
        let dataToReturn = [];
        // iterate over the returned rows
        for (let i = 0; i < sparqlRows.length; i++) {
            let objectToReturn = {};
            // iterate over the fields (the ?x, ?y ... of the SELECT statement)
            for (let j = 0; j < receivedData['head']['vars'].length; j++) {
                let sparqlVariable = receivedData['head']['vars'][j];
                objectToReturn[sparqlVariable] =
                    sparqlRows[i][sparqlVariable].value;
            }
            dataToReturn[i] = objectToReturn;
        }
        let patternToReturn = {};
        patternToReturn[patternKey] = dataToReturn;
        patternToReturn['key'] = patternKey;
        // when Store receive data do: data = res[res.key]
        callback(null, patternToReturn);
    }
}

export default PatternUtil;
