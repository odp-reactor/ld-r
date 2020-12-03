import { measurementURIs } from "./uris/collection";
import { tITLURIs } from "./uris/timeIndexedTypedLocation";
import { cPropComponentOfURIs } from "./uris/cPropComponentOf";

import { foaf, rdfs } from "./uris/prefixes";

export default {
    patternConfig: {
        "https://w3id.org/arco/ontology/denotative-description/measurement-collection": {
            patternIViewer: "CollectionView",
            query: {
                select: `SELECT DISTINCT ?entity ?entityLabel ?depiction WHERE`,
                body: `?MeasurementCollection <${measurementURIs.hasMember}> ?entity .
                       OPTIONAL { ?MeasurementCollection <${rdfs}label> ?collectionLabel .}.
                       OPTIONAL { ?entity <${rdfs}label> ?entityLabel2B .}.
                       OPTIONAL { ?entity <${foaf}depiction> ?depiction2B .}.

                       BIND ( IF (BOUND ( ?entityLabel2B ), ?entityLabel2B, "" )  as ?entityLabel )
                       BIND ( IF (BOUND ( ?depiction2B ),   ?depiction2B,   "" )  as ?depiction   )
                       `,
                aggregates: undefined
            },
            arguments: ["MeasurementCollection"],
            stateKey: "collection"
        },
        "https://w3id.org/arco/ontology/location/time-indexed-typed-location": {
            patternIViewer: "TimeIndexedTypedLocationView",
            query: {
                select: `SELECT DISTINCT
                            ?culturalProperty ?depiction ?tITLLabel ?locationType 
                            ?lat ?long  ?addressLabel  
                            ?startTime  ?endTime 
                            ?cPropLabel
                          WHERE
                        `,
                body: `
                       ?culturalProperty <${tITLURIs.hasTimeIndexedTypedLocation}> ?TimeIndexedTypedLocation .                       
                       ?TimeIndexedTypedLocation <${tITLURIs.hasLocationType}>  ?locationType .
                       OPTIONAL { ?TimeIndexedTypedLocation <${tITLURIs.atSite}> ?site .
                                  ?site <${tITLURIs.siteAddress}>     ?siteAddress .}
                       OPTIONAL  { ?TimeIndexedTypedLocation <${tITLURIs.atTime}> ?timeInterval } . 
                       OPTIONAL  { ?timeInterval <${tITLURIs.startTime}> ?startTime2B } .
                       OPTIONAL  { ?timeInterval <${tITLURIs.endTime}>   ?endTime2B   } .
                       OPTIONAL  { ?site <${tITLURIs.hasGeometry}> ?geometry .
                                   ?geometry <${tITLURIs.lat}>     ?lat2B .
                                   ?geometry <${tITLURIs.long}>    ?long2B .   }
                       OPTIONAL { ?culturalProperty <${rdfs}label> ?cPropLabel2B . } .
                       # catch information to try geocoding lat/long if they are missing       
                       OPTIONAL { ?siteAddress <${rdfs}label>   ?addressLabel2B . }                  
                       OPTIONAL  { ?TimeIndexedTypedLocation <${rdfs}label> ?tITLLabel2B . FILTER langMatches(lang(?tITLLabel2B), "it") }.
                       OPTIONAL  { ?culturalProperty <${foaf}depiction> ?depiction2B . }.
                       BIND ( IF (BOUND (?depiction2B), ?depiction2B, ''    )  as ?depiction    ) . 
                       BIND ( IF (BOUND (?tITLLabel2B), ?tITLLabel2B, ''    )  as ?tITLLabel    ) . 
                       BIND ( IF (BOUND (?cPropLabel2B), ?cPropLabel2B, ''  )  as ?cPropLabel   ) .
                       BIND ( IF (BOUND (?lat2B),  ?lat2B,  ''              )  as ?lat          ) . 
                       BIND ( IF (BOUND (?long2B), ?long2B, ''              )  as ?long         ) . 
                       BIND ( IF (BOUND (?addressLabel2B),?addressLabel2B,'')  as ?addressLabel ) .  
                       BIND ( IF (BOUND (?startTime2B),?startTime2B,      '')  as ?startTime    ) .         
                       BIND ( IF (BOUND (?endTime2B),  ?endTime2B,        '')  as ?endTime      ) .         
                `,
                aggregates: "LIMIT 1" // else multiple rows for the same instance are returned because of multiple labels
            },
            arguments: ["TimeIndexedTypedLocation"],
            stateKey: "tITLocations"
        },
        "http://www.ontologydesignpatterns.org/cp/owl/cultural-property-component-of": {
            patternIViewer: "PartWholeView",
            query: {
                select: `SELECT DISTINCT ?complexCProp ?cPropComponent ?depiction WHERE`,
                body: ` ?cPropComponent <${cPropComponentOfURIs.isPartOf}> ?ComplexCulturalProperty .
                        
                        OPTIONAL { ?complexCProp2B a rdf:HackToBound . } .
                        OPTIONAL { ?ComplexCulturalProperty <${foaf}depiction> ?depiction2B . }.
                        BIND ( IF (BOUND ( ?depiction2B ),   ?depiction2B,   "" )  as ?depiction   )
                        BIND ( IF (BOUND ( ?complexCProp2B), ?ComplexCulturalProperty, ?ComplexCulturalProperty ) as ?complexCProp )
                        `,
                aggregates: undefined
            },
            arguments: ["ComplexCulturalProperty"],
            stateKey: "cPropComponentOf"
        },
        "collection->https://w3id.org/arco/ontology/location/time-indexed-typed-location": {
            patternIViewer: "TimeIndexedTypedLocationView",
            query: {
                select: `SELECT DISTINCT
                            ?culturalProperty ?depiction ?tITLLabel ?locationType 
                            ?lat ?long  ?addressLabel  
                            ?startTime  ?endTime 
                            ?cPropLabel
                          WHERE
                        `,
                body: `
                       ?CulturalProperty <${tITLURIs.hasTimeIndexedTypedLocation}> ?TimeIndexedTypedLocation .                       
                       ?TimeIndexedTypedLocation <${tITLURIs.hasLocationType}>  ?locationType .
                       OPTIONAL { ?TimeIndexedTypedLocation <${tITLURIs.atSite}> ?site .
                                  ?site <${tITLURIs.siteAddress}>     ?siteAddress .}
                       OPTIONAL  { ?TimeIndexedTypedLocation <${tITLURIs.atTime}> ?timeInterval } . 
                       OPTIONAL  { ?timeInterval <${tITLURIs.startTime}> ?startTime2B } .
                       OPTIONAL  { ?timeInterval <${tITLURIs.endTime}>   ?endTime2B   } .
                       OPTIONAL  { ?site <${tITLURIs.hasGeometry}> ?geometry .
                                   ?geometry <${tITLURIs.lat}>     ?lat2B .
                                   ?geometry <${tITLURIs.long}>    ?long2B .   }
                       OPTIONAL { ?CulturalProperty <${rdfs}label> ?cPropLabel2B . } .
                       # catch information to try geocoding lat/long if they are missing       
                       OPTIONAL { ?siteAddress <${rdfs}label>   ?addressLabel2B . }                  
                       OPTIONAL  { ?TimeIndexedTypedLocation <${rdfs}label> ?tITLLabel2B . FILTER langMatches(lang(?tITLLabel2B), "it") }.
                       OPTIONAL  { ?CulturalProperty <${foaf}depiction> ?depiction2B . }.
                       BIND ( IF (BOUND (?depiction2B), ?depiction2B, ''    )  as ?depiction    ) . 
                       BIND ( IF (BOUND (?tITLLabel2B), ?tITLLabel2B, ''    )  as ?tITLLabel    ) . 
                       BIND ( IF (BOUND (?cPropLabel2B), ?cPropLabel2B, ''  )  as ?cPropLabel   ) .
                       BIND ( IF (BOUND (?lat2B),  ?lat2B,  ''              )  as ?lat          ) . 
                       BIND ( IF (BOUND (?long2B), ?long2B, ''              )  as ?long         ) . 
                       BIND ( IF (BOUND (?addressLabel2B),?addressLabel2B,'')  as ?addressLabel ) .  
                       BIND ( IF (BOUND (?startTime2B),?startTime2B,      '')  as ?startTime    ) .         
                       BIND ( IF (BOUND (?endTime2B),  ?endTime2B,        '')  as ?endTime      ) .         
                `,
                aggregates: undefined // else multiple rows for the same instance are returned because of multiple labels
            },
            arguments: ["CulturalProperty"],
            stateKey: "tITLocations"
        }
    }
};

// SELECT DISTINCT ?complexCProp
// ?cPropComponents
// (URI(CONCAT ("https://w3id.org/arco/resource/CPropComponentOfPattern", STRAFTER(STR(?complexCProp), "https://w3id.org/arco/resource/HistoricOrArtisticProperty"))) as ?instanceIRI)  # we hack instance URI as <new_ns + other_resource_UUID> | note: UUID() doesn't work in virtuoso
// ?depiction
//
// WHERE {
// ?complexCProp foaf:depiction ?depiction .
// ?complexCProp rdfs:label ?complexCPropLabel .
// {
//
// SELECT ?complexCProp
// (GROUP_CONCAT(DISTINCT ?cPropComponent; SEPARATOR=";") AS ?cPropComponents)
// WHERE
// {
//  ?cPropComponent <https://w3id.org/arco/ontology/arco/isCulturalPropertyComponentOf> ?complexCProp .
// }
// GROUP BY ?complexCProp
//
// }
// }  LIMIT 70
