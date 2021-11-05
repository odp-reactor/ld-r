export class DatasetIdService {
    constructor(serverConfigRepo) {
        this.serverConfigRepo = serverConfigRepo
    }
    async getDatasetIdFromSparqlEndpointAndGraph({sparqlEndpoint, graph}) {
        return this.serverConfigRepo.getDatasetIdBySparqlEndpointAndGraph(sparqlEndpoint, graph)
    }
}