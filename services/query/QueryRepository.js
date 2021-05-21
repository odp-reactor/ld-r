import defaultMap from '../../plugins/queries/queries.json'

export class QueryRepository {

    constructor(queryMap) {
        this.queryMap = queryMap || defaultMap
    }

    getQueryFile(patternURI) {
        if (this.queryMap[patternURI]) {
            return this.queryMap[patternURI]
        } else {
            return undefined
        }
    }
    getQuery(patternURI){
        // we need some chunk of static path to implicitly tell webpack how to resolve this path at runtime 
        try {
            const queryModule = require('../../plugins/queries/' + this.getQueryFile(patternURI))
            if (queryModule) {
                return queryModule.default
            } else {
                return undefined
            }
        } catch(err) {
            console.log('[!] Error: ',err)
            return undefined
        }
    }
}