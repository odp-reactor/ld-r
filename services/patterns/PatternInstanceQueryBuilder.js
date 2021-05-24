import { QueryRepository } from '../query/QueryRepository';

export default class PatternInstanceQueryBuilder {

    constructor(patternQueryRepository) {
        this.patternQueryRepository = patternQueryRepository || new QueryRepository()
    }

    prefixes() {
        return `
        PREFIX opla: <http://ontologydesignpatterns.org/opla/>
        PREFIX a-loc: <https://w3id.org/arco/ontology/location/>
        PREFIX cis: <http://dati.beniculturali.it/cis/>
        PREFIX tiapit: <https://w3id.org/italia/onto/TI/>
        PREFIX arco: <https://w3id.org/arco/ontology/arco/>
        PREFIX clvapit: <https://w3id.org/italia/onto/CLV/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX a-dd: <https://w3id.org/arco/ontology/denotative-description/>
        `;
    }
    getPatternWithLabel(patternInstanceUri) {
        return `
        PREFIX opla: <http://ontologydesignpatterns.org/opla/>

        SELECT DISTINCT ?uri (SAMPLE(?label) as ?label) WHERE {
            <${patternInstanceUri}> opla:isPatternInstanceOf ?uri .
            ?uri rdfs:label ?label .
         }
        `;
    }
    getPatternInstanceDataQuery(patternInstanceURI, patternURI) {
        let patternQuery =  this.patternQueryRepository.getQuery(patternURI)
        return this.bindPatternInstanceVariable(patternQuery, patternInstanceURI)
    }
    bindVariable(query, variable, binding) {
        return query.replace(variable, `<${binding}>`)
    }
    bindPatternInstanceVariable(patternQuery, patternInstanceUri) {
        const patternVariable = process.env.PATTERN_INSTANCE_URI_VARIABLE || '?patternInstanceUri'
        return this.bindVariable(patternQuery, patternVariable, patternInstanceUri)
    }
}
