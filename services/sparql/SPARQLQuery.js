export default class SPARQLQuery {
    constructor() {
        this.prefixes = `
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX void: <http://rdfs.org/ns/void#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX DBpedia: <http://dbpedia.org/ontology/>
        PREFIX Schema: <http://schema.org/>
        `;
        this.query = '';
    }
    getPrefixes() {
        return this.prefixes;
    }
    prepareGraphName(graphName) {
        let gStart = 'GRAPH <' + graphName + '> { ';
        let gEnd = ' } ';
        if (!graphName || graphName === 'default') {
            gStart = ' ';
            gEnd = ' ';
        }
        return { gStart: gStart, gEnd: gEnd };
    }
    prepareQueryBody(resourceURI, resourcePlaceholder, queryBody) {
        // replace all occurences of a placeholder with resourceURI
        var re = new RegExp(resourcePlaceholder, 'g');
        let cleanQueryBody = queryBody.replace(re, `<${resourceURI}>`);
        return cleanQueryBody;
    }
}
