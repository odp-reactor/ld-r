import GenericRepository from '../base/GenericRepository';
import { ServerConfigQueryBuilder } from './ServerConfigQueryBuilder';
import { map } from 'lodash';

export class ServerConfigRepository {
    constructor(dbClient) {
        //classesDataMapper
        this.genericRepository = new GenericRepository(
            dbClient
            // new ClassDataMapper()
        );
        this.serverConfigQueryBuilder = new ServerConfigQueryBuilder();
    }
    async getSparqlEndpointAndGraphByDatasetId(datasetId) {
        const configRes = await this.genericRepository.fetchByQueryObject(
            this.serverConfigQueryBuilder.getConfigByDatasetId(datasetId)
        );
        const config = configRes[0];

        return {
            sparqlEndpoint: `${config.protocol}://${config.host}${
                config.port != '' ? `:${config.port}` : ''
            }/${config.path}`,
            graph: config.graph
        };
    }
}
