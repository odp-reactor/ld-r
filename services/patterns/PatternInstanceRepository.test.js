import {PatternInstanceRepository} from './PatternInstanceRepository'
import DbClient from '../base/DbClient'
import {GraphRepository} from '../graph/GraphRepository'
import { PatternInstance } from './PatternInstance'

const testEndpoint = process.env.TEST_SPARQL_ENDPOINT_URI
const graphRepo = new GraphRepository(new DbClient(testEndpoint))


class MockPatternInstanceQueryBuilder {
    getPatternInstanceDataQuery(patternInstanceUri) {
        return `
        PREFIX opla: <http://ontologydesignpatterns.org/opla/> 

        SELECT * WHERE {
            ?data opla:belongsToPatternInstance <${patternInstanceUri}> .
        }
        `
    }
    getPatternWithLabel(patternInstanceUri) {   
        return `
        PREFIX opla: <http://ontologydesignpatterns.org/opla/>

        SELECT DISTINCT ?uri (SAMPLE(?label) as ?label) WHERE {
            <${patternInstanceUri}> opla:isPatternInstanceOf ?uri .
            ?uri rdfs:label ?label .
         }
        `;    }
    getPatternInstancesResourceBelongsTo(resourceUri) {
        return `
        PREFIX opla: <http://ontologydesignpatterns.org/opla/>
        
        SELECT DISTINCT ?uri WHERE
              {
                <${resourceUri}> opla:belongsToPatternInstance ?uri .
              }            
       `
    }
}


const examplePattern = 'http://example.com/example-pattern'
const patternInstanceUri = 'ex:pattern_instance_1'
const patternInstanceUri2 = 'ex:pattern_instance_2'
const examplePattern2 = 'http://example.com/example-pattern-2'
const examplePatternLabel = 'Example Pattern'
const examplePattern2Label = 'Example Pattern 2'
const resource1Uri = 'ex:data1'
const resource2Uri = 'ex:data2'

const oplaPrefix = 'http://ontologydesignpatterns.org/opla/'

const mockTriples = [
    `<${patternInstanceUri}> <${oplaPrefix}isPatternInstanceOf> <${examplePattern}>`,
    `<${examplePattern}> rdfs:label "${examplePatternLabel}"`,
    `<${examplePattern}> rdf:type <${oplaPrefix}Pattern>`,
    `<${patternInstanceUri2}> <${oplaPrefix}isPatternInstanceOf> <${examplePattern2}>`,
    `<${examplePattern2}> rdfs:label "${examplePattern2Label}"`,
    `<${examplePattern2}> rdf:type <${oplaPrefix}Pattern>`,
    `<${resource1Uri}> <${oplaPrefix}belongsToPatternInstance> <${patternInstanceUri}>`,
    `<${resource2Uri}> <${oplaPrefix}belongsToPatternInstance> <${patternInstanceUri}>`,
    `<${resource1Uri}> <${oplaPrefix}belongsToPatternInstance> <${patternInstanceUri2}>`,
]


const checkGraph = async (graph) => {
    const hasGraph = await graphRepo.exists(graph)
    expect(hasGraph).toBeTruthy()
}

const createGraph = async (testGraph) => {
    await graphRepo.delete(testGraph)
    await graphRepo.create(testGraph)
}
const cleanGraph = async (graph) => {
    await graphRepo.delete(graph)
}
const insertTriples = async (testGraph, triples) => {
    for(var i=0; i<mockTriples.length; i++){
        await graphRepo.insertTriple(testGraph, mockTriples[i]);
    }
}


describe('It should return PatternInstance with pattern instance type, visualframe, data', () => {

    test(`It should return pattern type ${examplePatternLabel} with label ${examplePatternLabel} for instance ${patternInstanceUri}`, async() => {  

        const testGraph = 'http://example.com/graph1'
        const patternInstanceRepo = new PatternInstanceRepository(new DbClient(testEndpoint, testGraph))


        await createGraph(testGraph)
        await insertTriples(testGraph, mockTriples)
        await checkGraph(testGraph)

        const pattern = await patternInstanceRepo.getPatternInstanceType(patternInstanceUri)

        expect(pattern).toBeDefined()
        expect(pattern.uri).toBe(examplePattern)
        expect(pattern.label).toBe(examplePatternLabel)

        await cleanGraph(testGraph)

    })
    test(`It should return data for ${patternInstanceUri}`, async () => {    

        const testGraph2 = 'http://example.com/graph2'
        const patternInstanceRepoWithMockedQueryBuilder = new PatternInstanceRepository(new DbClient(testEndpoint, testGraph2), null, null, new MockPatternInstanceQueryBuilder())


        await createGraph(testGraph2)
        await insertTriples(testGraph2, mockTriples)
        await checkGraph(testGraph2)

        const patternInstance = PatternInstance.create({ uri: patternInstanceUri, pattern: {
            uri: examplePattern,
            label: examplePatternLabel
        } })

        const data = await patternInstanceRepoWithMockedQueryBuilder.getPatternInstanceData(patternInstance)        
   
        expect(data).toBeDefined()

        const data1 = { data: 'ex:data1' }
        const data2 = { data: 'ex:data2' }

        expect(data).toContainEqual(data1)
        expect(data).toContainEqual(data2)

        await cleanGraph(testGraph2)
    })
    test('It should return PatternInstance with pattern instance type, visualframe, data', async () => {

        const testGraph3 = 'http://example.com/graph3'
        const patternInstanceRepoWithMockedQueryBuilder = new PatternInstanceRepository(new DbClient(testEndpoint, testGraph3), null, null, new MockPatternInstanceQueryBuilder())

        await createGraph(testGraph3)
        await insertTriples(testGraph3, mockTriples)
        await checkGraph(testGraph3)

        const patternInstance = await patternInstanceRepoWithMockedQueryBuilder.getPatternInstanceWithTypeVisualFrameAndData(patternInstanceUri)

        const pData = patternInstance.data
        const data1 = { data: 'ex:data1' }

        expect(pData).toContainEqual(data1)

        const patternType = patternInstance.pattern

        expect(patternType).toBeDefined()
        expect(patternType.uri).toBe(examplePattern)
        expect(patternType.label).toBe(examplePatternLabel)

        const visualFrame = patternInstance.visualFrame

        expect(visualFrame.name).toBe('ExampleVisualFrame')

        await cleanGraph(testGraph3)
    })
    test('It should return pattern instances uris by resource partecipating in', async () => {
        const testGraph4 = 'http://example.com/graph4'
        const patternInstanceRepo = new PatternInstanceRepository(new DbClient(testEndpoint, testGraph4), null, null, new MockPatternInstanceQueryBuilder())

        await createGraph(testGraph4)
        await insertTriples(testGraph4, mockTriples)
        await checkGraph(testGraph4)

        const patternInstancesUris = await patternInstanceRepo.getPatternInstancesUrisByResource(resource1Uri)

        expect(patternInstancesUris).toBeDefined()
        expect(patternInstancesUris).toHaveLength(2)
        expect(patternInstancesUris).toContainEqual(
            {
                uri: patternInstanceUri
            }
        )
        expect(patternInstancesUris).toContainEqual(
            {
                uri: patternInstanceUri2
            }
        )

        const patternInstances = await patternInstanceRepo.getPatternInstancesByResourceParticipatingInPattern(resource1Uri)

        expect(patternInstances).toBeDefined()
        expect(patternInstances).toHaveLength(2)     
    })
})

