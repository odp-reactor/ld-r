import ResourceDataMapper from './ResourceDataMapper';

export default class GenericRepository {
    constructor(dbClient, dataMapper = new ResourceDataMapper()) {
        this.dbClient = dbClient;
        this.dataMapper = dataMapper;
    }
    async fetchByQueryObject(queryString) {
        const results = this.dbClient.executeQuery(queryString);
        return this.dataMapper.parseResults(results); // parse can be a sql results parser
    }
    upsert() {}
    save() {}
    remove() {}
}
