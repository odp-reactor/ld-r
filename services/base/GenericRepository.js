import ResourceDataMapper from './ResourceDataMapper';

export default class GenericRepository {
    constructor(dbContext, dataMapper = new ResourceDataMapper()) {
        this.dbContext = dbContext;
        this.dataMapper = dataMapper;
    }
    async fetchByQueryObject(queryString) {
        const results = this.dbContext.executeQuery(queryString);
        return this.dataMapper.parseResults(results); // parse can be a sql results parser
    }
    upsert() {}
    save() {}
    remove() {}
}
