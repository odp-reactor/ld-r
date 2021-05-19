import { GraphQueryBuilder } from './GraphQueryBuilder'

export class GraphRepository {

    constructor(dbClient, queryBuilder) {
        this.dbClient = dbClient 
        this.queryBuilder = queryBuilder || new GraphQueryBuilder()   
    }

    async create(uri) {
        return this.dbClient.updateQuery(this.queryBuilder.create(uri))
    }
    async delete(uri) {
        return this.dbClient.updateQuery(this.queryBuilder.delete(uri))
    }
}