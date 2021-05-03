import { newEngine } from '@comunica/actor-init-sparql';

export default class DbClient {
    //db is SPARQL Endpoint in this case
    constructor(dbName, options) {
        this.dbName = dbName;
        this.options = options;
        this.sparqlQueryingEngine = newEngine();
    }
    async executeQuery(query) {
        console.log('[*] LD-R query: ',query);
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
}
