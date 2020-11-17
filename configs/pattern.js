import { measurementURIs } from "./pattern_uris/collection";

export default {
    patternConfig: {
        "https://w3id.org/arco/ontology/denotative-description/measurement-collection": {
            patternIViewer: "Collection",
            query: {
                select: `SELECT DISTINCT ?entity ?entityLabel ?depiction WHERE`,
                body: `?MeasurementCollection <${measurementURIs.hasMember}> ?entity .
                       OPTIONAL { ?MeasurementCollection <http://www.w3.org/2000/01/rdf-schema#label> ?collectionLabel .}.
                       OPTIONAL { ?entity <http://www.w3.org/2000/01/rdf-schema#label> ?entityLabel2B .}.
                       OPTIONAL { ?entity <http://xmlns.com/foaf/0.1/depiction> ?depiction2B .}.

                       BIND ( IF (BOUND ( ?entityLabel2B ), ?entityLabel2B, "" )  as ?entityLabel )
                       BIND ( IF (BOUND ( ?depiction2B ),   ?depiction2B,   "" )  as ?depiction   )
                       `,
                aggregates: undefined
            },
            arguments: ["MeasurementCollection"],
            stateKey: "collection"
        }
    }
};
