import { newEngine } from '@comunica/actor-init-sparql';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';

export default class DbClient {
    //db is SPARQL Endpoint in this case
    constructor(dbName, graph, options) {
        this.dbName = dbName;
        this.graph = graph
        this.options = options;
        this.sparqlQueryingEngine = newEngine();
        this.updateQueryingEngine = new SparqlEndpointFetcher()
    }
    async executeQuery(query) {
        let bindings;
        try {
            const result = await this.sparqlQueryingEngine.query(query, {
                sources: [{ type: 'sparql', value: this.dbName }]
            });
            bindings = await result.bindings();
        } catch (e) {
            console.log('[!] DbContext.executeQuery error:', e);
            bindings = undefined;
        }
        return bindings;
    }
    // this is needed as comunica doesn't support update yet
    async updateQuery(query) {
        // console.log('[*] Sparql endpoint: ', this.dbName)
        // console.log('[*] Update query: ', query)
        return this.updateQueryingEngine.fetchUpdate(this.dbName, query);
    }
    async askQuery(query) {
        return this.updateQueryingEngine.fetchAsk(this.dbName, query)
    }
}
