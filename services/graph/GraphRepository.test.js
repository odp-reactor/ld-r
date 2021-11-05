import { GraphRepository} from './GraphRepository'
import  DbClient  from '../base/DbClient'



describe('GraphRepository create and drops graphs', () => {
    const testEndpoint = process.env.TEST_SPARQL_ENDPOINT_URI
    const graphRepo = new GraphRepository(new DbClient(testEndpoint))
    const testGraph = 'http://example.com/graph0'

    test('it should not have graph to be created', async ()=> {
        await graphRepo.delete(testGraph)
        const hasGraph = await graphRepo.exists(testGraph)
        expect(hasGraph).toBeFalsy()
        await graphRepo.delete(testGraph)
    })
    test('it should create a new graph', async ()=> {
        await graphRepo.delete(testGraph)
        await graphRepo.create(testGraph)
        await graphRepo.delete(testGraph)
    })
    test('it should insert triple in a graph', async () => {
        await graphRepo.delete(testGraph)
        await graphRepo.create(testGraph)
        await graphRepo.insertTriple(testGraph, '<ex:s> <ex:p> <ex:o>')
        const hasGraph = await graphRepo.exists(testGraph)
        expect(hasGraph).toBeTruthy()
        await graphRepo.delete(testGraph)
    })
    test('it should drop an existing graph', async () => {
        await graphRepo.delete(testGraph)
        await graphRepo.create(testGraph)
        await graphRepo.delete(testGraph)
    })
    test('it should silently drop a non existing graph', async () => {
        await graphRepo.delete(testGraph)
        await graphRepo.delete(testGraph)
    })
    test('it should not have graph after deletion', async ()=> {
        await graphRepo.delete(testGraph)
        const hasGraph = await graphRepo.exists(testGraph)
        expect(hasGraph).toBeFalsy()
        await graphRepo.delete(testGraph)
    })
    test('it should silently ignore creating two times the same graph', async ()=> {
        await graphRepo.delete(testGraph)
        await graphRepo.create(testGraph)
        await graphRepo.create(testGraph)
        await graphRepo.delete(testGraph)
    })
})

