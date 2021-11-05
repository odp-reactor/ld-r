import GenericRepository from '../base/GenericRepository';
import { ServerConfigQueryBuilder } from './ServerConfigQueryBuilder';

import { UrlParser } from './UrlParser';

import { DbContext } from './DbContext'

export class ServerConfigRepository {
    constructor(dbClient) {
        //classesDataMapper
        this.genericRepository = new GenericRepository(
            dbClient
            // new ClassDataMapper()
        );
        this.serverConfigQueryBuilder = new ServerConfigQueryBuilder();
        this.urlParser = new UrlParser();
    }
    async getSparqlEndpointAndGraphByDatasetId(datasetId) {
        const configRes = await this.genericRepository.fetchByQueryObject(
            this.serverConfigQueryBuilder.getConfigByDatasetId(datasetId)
        );
        const config = configRes[0];

        const sparqlEndpoint = `${config.protocol}://${config.host}${
            config.port != '' ? `:${config.port}` : ''
        }${config.path}`

        const graph = config.graph

        return new DbContext(datasetId, sparqlEndpoint, graph)
    }
    async getDatasetIdBySparqlEndpointAndGraph(sparqlEndpoint, graph) {
        const { host, sparqlPath } = this.getHostAndPathBySparqlEndpoint(sparqlEndpoint)
        const configRes = await this.genericRepository.fetchByQueryObject(
            this.serverConfigQueryBuilder.getConfigBySparqlEndpointHostAndPathAndGraph(
                {
                    host: host,
                    sparqlPath: sparqlPath,
                    graph: graph
                }
            )
        );
        const config = configRes[0];

        return config ? config.datasetId : undefined;
    }
    getHostAndPathBySparqlEndpoint(sparqlEndpoint) {
        const host = this.urlParser.getHost(sparqlEndpoint);
        const sparqlPath = this.urlParser.getPath(sparqlEndpoint);
        return {
            host: host,
            sparqlPath: sparqlPath
        }
    }
}
