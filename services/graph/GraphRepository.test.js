import { GraphRepository} from './GraphRepository'
import  DbClient  from '../base/DbClient'


describe('GraphRepository create and drops graphs', () => {
    const configEndpoint = process.env.TEST_SPARQL_ENDPOINT_URI
    const graphRepo = new GraphRepository(new DbClient(configEndpoint))
    const testGraph = 'http://example.com/graph1'
    test('it should create a new graph', async ()=> {
        await graphRepo.create(testGraph)
    })
    test('it should drop an existing graph', async () => {
        await graphRepo.delete(testGraph)
    })
})
