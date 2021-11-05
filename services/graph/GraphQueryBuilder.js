export class GraphQueryBuilder {
    create(graphUri) {
        return `
            CREATE SILENT GRAPH <${graphUri}>
        `
    }   
    delete(graphUri) {
        return `
            CLEAR SILENT GRAPH <${graphUri}>
        `
    }
    insert(graphUri, triple) {
        return `
            INSERT DATA {
                GRAPH <${graphUri}> {
                    ${triple}
                }
            }
        `
    }
    askGraphHasTriple(graphUri) {
        return `ASK WHERE { GRAPH <${graphUri}> { ?s ?p ?o } }`
    }
    getAllTriples(graphUri) {
        return `
            SELECT ?s ?p ?o WHERE {
                GRAPH <${graphUri}> {
                    ?s ?p ?o .
                }
            }
        `
    }
}