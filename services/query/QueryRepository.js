import {queryMap} from '../../plugins/queries/queries.js'

export class QueryRepository {

    constructor(inputQueryMap) {
        this.queryMap = queryMap     
    }

    getQuery(patternURI){
        // we need some chunk of static path to implicitly tell webpack how to resolve this path at runtime 
        try {
            return queryMap[patternURI]
        } catch(err) {
            console.log('[!] Error: ',err)
            return undefined
        }
    }
}