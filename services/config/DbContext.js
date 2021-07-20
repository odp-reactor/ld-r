export class DbContext {
    constructor(datasetId, sparqlEndpoint, graph) {
        this.datasetId = datasetId
        this.sparqlEndpoint = sparqlEndpoint
        this.graph = graph
    }
}