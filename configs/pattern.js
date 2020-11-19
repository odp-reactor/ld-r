import { measurementURIs } from "./uris/collection";
import { tITLURIs } from "./uris/timeIndexedTypedLocation";

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
            patternIViewer: "TimeIndexedTypedLocationiew",
            query: {
                select: `SELECT DISTINCT
                            ?cProp ?depiction ?tITLLabel ?locationType 
                            ?lat ?long  ?addressLabel  
                            ?startTime  ?endTime 
                          WHERE
                        `,
                body: `
                       ?cProp <${tITLURIs.hasTimeIndexedTypedLocation}> ?TimeIndexedTypedLocation .
                       ?TimeIndexedTypedLocation <${tITLURIs.hasLocationType}>  ?locationType .
                
                       OPTIONAL { ?TimeIndexedTypedLocation <${tITLURIs.atSite}> ?site .
                                  ?site <${tITLURIs.siteAddress}>     ?siteAddress .
                                 }
                       OPTIONAL  { ?TimeIndexedTypedLocation <${tITLURIs.atTime}> ?timeInterval } . 
                       OPTIONAL  { ?timeInterval <${tITLURIs.startTime}> ?startTime2B } .
                       OPTIONAL  { ?timeInterval <${tITLURIs.endTime}>   ?endTime2B   } .
                
                       OPTIONAL  { ?site <${tITLURIs.hasGeometry}> ?geometry .
                                   ?geometry <${tITLURIs.lat}>     ?lat2B .
                                   ?geometry <${tITLURIs.long}>    ?long2B .   }
                       
                       # catch information to try geocoding lat/long if they are missing       
                       OPTIONAL { ?siteAddress <${rdfs}label>   ?addressLabel2B .} 
                               
                       OPTIONAL  { ?TimeIndexedTypedLocation <${rdfs}label> ?tITLLabel2B .
                                                                         FILTER langMatches(lang(?tITLLabel2B), "it") }.
                       OPTIONAL  { ?cProp <${foaf}depiction> ?depiction2B . }.
                
                       BIND ( IF (BOUND (?depiction2B), ?depiction2B, ''    )  as ?depiction    ) . 
                       BIND ( IF (BOUND (?tITLLabel2B), ?tITLLabel2B, ''    )  as ?tITLLabel    ) . 
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
        }
    }
};
