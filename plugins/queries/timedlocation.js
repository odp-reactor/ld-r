const timedlocation = `PREFIX opla: <http://ontologydesignpatterns.org/opla/>
PREFIX a-loc: <https://w3id.org/arco/ontology/location/>
PREFIX cis: <http://dati.beniculturali.it/cis/>
PREFIX tiapit: <https://w3id.org/italia/onto/TI/>
PREFIX arco: <https://w3id.org/arco/ontology/arco/>
PREFIX clvapit: <https://w3id.org/italia/onto/CLV/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX a-dd: <https://w3id.org/arco/ontology/denotative-description/>


SELECT DISTINCT 
    ?culturalProperty 
    ?titl
    (SAMPLE(?tITLLabel) as ?tITLLabel) 
    ?locationType 
    (SAMPLE(?locationTypeLabel) as ?locationTypeLabel)
    ?lat ?long ?addressLabel ?startTime ?endTime
    (SAMPLE(?cPropLabel) as ?cPropLabel) 
WHERE { GRAPH ?graph {
    ?culturalProperty opla:belongsToPatternInstance ?patternInstanceUri .
    ?titl opla:belongsToPatternInstance ?patternInstanceUri .
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
} } LIMIT 1`

export {timedlocation}