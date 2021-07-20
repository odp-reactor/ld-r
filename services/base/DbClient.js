import { newEngine } from '@comunica/actor-init-sparql';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';

import { Bindings } from '@comunica/bus-query-operation';
import { DataFactory } from 'rdf-data-factory';

const factory = new DataFactory();

export default class DbClient {
    //db is SPARQL Endpoint in this case
    constructor(dbName, graph, options) {
        this.dbName = dbName;
        this.graph = graph || 'default'
        this.options = options;
        this.sparqlQueryingEngine = newEngine();
        this.updateQueryingEngine = new SparqlEndpointFetcher()
    }
    async executeQuery(query) {
        let bindings;
        try {

            const comunicaParams = Object.assign({
                sources: [{ type: 'sparql', value: this.dbName }],
            }, (this.graph && this.graph !== 'default') ? {initialBindings: Bindings({
                '?graph' : factory.namedNode(this.graph)
            })} : {})

            const result = await this.sparqlQueryingEngine.query(query, comunicaParams);
            bindings = await result.bindings();
        } catch (e) {
            console.log('[!] DbClient.executeQuery error:', e);
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
