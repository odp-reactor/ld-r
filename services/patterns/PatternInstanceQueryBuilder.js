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
    getCulturalPropertyWithTimeIndexedTypedLocation(patternURI) {
        return `
            ${this.prefixes()}

                SELECT DISTINCT 
                ?culturalProperty 
                ?titl
                (SAMPLE(?tITLLabel) as ?tITLLabel) 
                ?locationType 
                (SAMPLE(?locationTypeLabel) as ?locationTypeLabel)
                ?lat ?long ?addressLabel ?startTime ?endTime
                (SAMPLE(?cPropLabel) as ?cPropLabel) 
                WHERE {
    
                    ?culturalProperty opla:belongsToPatternInstance <${patternURI}> .
                    ?titl opla:belongsToPatternInstance <${patternURI}> .
                    ?culturalProperty a-loc:hasTimeIndexedTypedLocation ?titl .
                    ?titl a-loc:hasLocationType ?locationType .
                    ?locationType rdfs:label ?locationTypeLabel .
                    FILTER langMatches(lang(?locationTypeLabel), "it")
    
                    OPTIONAL { ?titl a-loc:atSite ?site .
                               ?site cis:siteAddress ?siteAddress .
                               ?siteAddress rdfs:label ?addressLabel2B . 
                              }
                    OPTIONAL { ?titl tiapit:atTime ?timeInterval . 
                                ?timeInterval arco:startTime ?startTime2B .
                                ?timeInterval arco:endTime ?endTime2B . 
                              }
                    OPTIONAL { ?titl a-loc:atSite ?site .
                               ?site clvapit:hasGeometry ?geometry .
                               ?geometry clvapit:lat ?lat2B .
                               ?geometry clvapit:long ?long2B . 
                              }
                    OPTIONAL { ?culturalProperty rdfs:label ?cPropLabel2B . 
                                FILTER langMatches(lang(?cPropLabel2B), "it")
                              }
                    OPTIONAL { ?titl rdfs:label ?tITLLabel2B . 
                                FILTER langMatches(lang(?tITLLabel2B), "it")  
                              }
                    OPTIONAL { ?culturalProperty foaf:depiction ?depiction2B . 
                              } .                
                    BIND ( IF (BOUND (?depiction2B), ?depiction2B, '')  as ?depiction) . 
                    BIND ( IF (BOUND (?tITLLabel2B), ?tITLLabel2B, '')  as ?tITLLabel) . 
                    BIND ( IF (BOUND (?cPropLabel2B), ?cPropLabel2B, '')  as ?cPropLabel) .
                    BIND ( IF (BOUND (?lat2B),  ?lat2B,  '')  as ?lat) . 
                    BIND ( IF (BOUND (?long2B), ?long2B, '')  as ?long) . 
                    BIND ( IF (BOUND (?addressLabel2B),?addressLabel2B,'')  as ?addressLabel ) .  
                    BIND ( IF (BOUND (?startTime2B),?startTime2B,'')  as ?startTime) .         
                    BIND ( IF (BOUND (?endTime2B),  ?endTime2B,'')  as ?endTime) .
                } LIMIT 1       
        `;
    }
    getCulturalPropertyWithMeasurements(patternURI) {
        return `
            ${this.prefixes()}

            SELECT DISTINCT ?meas ?value ?unit ?cProp ?cPropLabel WHERE 
            { 
             ?measurementCollection opla:belongsToPatternInstance <${patternURI}> .
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
            `;
    }
    getCulturalPropertyWithParts(patternURI) {
        return `
            ${this.prefixes()}

            SELECT DISTINCT ?complexCProp ?cPropComponent WHERE 
            {
                ?complexCProp opla:belongsToPatternInstance <${patternURI}> .
                ?cPropComponent arco:isCulturalPropertyComponentOf ?complexCProp .
            }
            `;
    }
}
