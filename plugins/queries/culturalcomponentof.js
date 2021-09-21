const culturalcomponentof = `PREFIX opla: <http://ontologydesignpatterns.org/opla/>
PREFIX a-loc: <https://w3id.org/arco/ontology/location/>
PREFIX cis: <http://dati.beniculturali.it/cis/>
PREFIX tiapit: <https://w3id.org/italia/onto/TI/>
PREFIX arco: <https://w3id.org/arco/ontology/arco/>
PREFIX clvapit: <https://w3id.org/italia/onto/CLV/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX a-dd: <https://w3id.org/arco/ontology/denotative-description/>

SELECT DISTINCT ?complexCProp ?cPropComponent WHERE {
GRAPH ?graph {
    ?complexCProp opla:belongsToPatternInstance ?patternInstanceUri .
    ?cPropComponent arco:isCulturalPropertyComponentOf ?complexCProp .
    }
}`

export {culturalcomponentof}