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
    async insertTriple(graph, triple) {
        return this.dbClient.updateQuery(this.queryBuilder.insert(graph, triple))
    }
    async exists(graph) {
        return this.dbClient.askQuery(this.queryBuilder.askGraphHasTriple(graph))
    }
    async getAllTriples(graph) {
        return this.dbClient.executeQuery(this.queryBuilder.getAllTriples(graph))
    }
}