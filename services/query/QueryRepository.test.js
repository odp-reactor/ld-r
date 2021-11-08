import {QueryRepository} from './QueryRepository'



describe('QueryRepository return query for pattern uri:', () => {
    const exampleUri = 'http://example.com/example-pattern'

    const exampleQuerySelect = 'SELECT ?example WHERE'
    const exampleQueryTriple = '?example a <http://example.com/Example>'

    const queryRepo = new QueryRepository()


    // reading files is delegated to webpack during build time 
    // reading file from node and in the browser is different
    // at the moment we cannot test jest on node and have different behaviour on browser
    // Solution would be implement an adapter in front of webpack but to expensive
    test.skip(`It should return stringified example sparql query for ${exampleUri}`, () => {
        const query = queryRepo.getQuery(exampleUri)
        expect(query).toBeDefined()
        expect(query).toContain(exampleQuerySelect)
        expect(query).toContain(exampleQueryTriple)
    })    
})