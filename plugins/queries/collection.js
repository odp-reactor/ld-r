const collection = `PREFIX opla: <http://ontologydesignpatterns.org/opla/>
PREFIX a-loc: <https://w3id.org/arco/ontology/location/>
PREFIX cis: <http://dati.beniculturali.it/cis/>
PREFIX tiapit: <https://w3id.org/italia/onto/TI/>
PREFIX arco: <https://w3id.org/arco/ontology/arco/>
PREFIX clvapit: <https://w3id.org/italia/onto/CLV/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX a-dd: <https://w3id.org/arco/ontology/denotative-description/>

SELECT DISTINCT 
      ?meas ?value ?unit ?cProp ?cPropLabel 
WHERE { GRAPH ?graph
{ 
 ?measurementCollection opla:belongsToPatternInstance ?patternInstanceUri .
 ?measurementCollection a-dd:hasMeasurement ?meas .
 OPTIONAL { ?meas foaf:depiction ?depiction2B . }
     { SELECT ?meas ?value ?unit 
        {
            ?meas <https://w3id.org/arco/ontology/denotative-description/hasValue> ?val .
            ?val <https://w3id.org/italia/onto/MU/value> ?value .
            ?val <https://w3id.org/italia/onto/MU/hasMeasurementUnit> ?u .
            ?u rdfs:label ?unit .   
        }
     }
 ?cProp a-dd:hasMeasurementCollection ?measurementCollection .
 ?cProp rdfs:label ?cPropLabel .
 FILTER langMatches(lang(?cPropLabel), "it")
 BIND ( IF (BOUND ( ?depiction2B ),   ?depiction2B,   "" )  as ?depiction   )
}
}
`
export {collection}