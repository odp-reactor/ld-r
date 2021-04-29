/*
IDataMapper {
    parseResults() {
        parse fetched results from a get query into domain object
        for example a 
        ClassDataMapper implements IDataMapper {
            parseResults() {
                parse results from query
                return results as classes

                // tomorrow you can inject here dbContext
                // or better some DBAdapater to handle multiple data source
                // this is not stuff aout the domain logic
            }
        }
    }
}
*/
