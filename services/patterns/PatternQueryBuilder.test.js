import PatternQueryBuilder from './PatternQueryBuilder'

describe('Pattern query builder creates query for pattern instances', () => {
    const variable = '?subject'
    const subjectBinding = 'http://example.com/subject_1'
    const qBuilder = new PatternQueryBuilder()
    test(`it should bind variable ${variable} with <${subjectBinding}>`, () => {
        const query = `
            SELECT ?object WHERE {
                ?subject ?predicate ?object
            }
        `
        const expectedQuery = `
            SELECT ?object WHERE {
                <${subjectBinding}> ?predicate ?object
            }
        `
        const boundQuery = qBuilder.bindVariable(query, variable, subjectBinding)
        expect(boundQuery).toBeDefined()
        expect(boundQuery).toContain(`<${subjectBinding}>`)
        expect(boundQuery).toBe(expectedQuery)
    })
    const pInstURI = 'http://example.com/p_instance_1'
    test(`it should bind ?patternInstanceUriVariable with <${pInstURI}>`, ()=>{
        const query = `
            SELECT ?object WHERE {
                ?patternInstanceUri ?predicate ?object
            }
        `
        const expectedQuery = `
            SELECT ?object WHERE {
                <${pInstURI}> ?predicate ?object
            }
        `
        const boundQuery = qBuilder.bindPatternInstanceVariable(query,pInstURI)
        expect(boundQuery).toBeDefined()
        expect(boundQuery).toContain(`<${pInstURI}>`)
        expect(boundQuery).toBe(expectedQuery)
    })
})