export class GraphQueryBuilder {
    create(graphUri) {
        return `
            CREATE GRAPH <${graphUri}>
        `
    }   
    delete(graphUri) {
        return `
            DROP GRAPH <${graphUri}>
        `
    }
}