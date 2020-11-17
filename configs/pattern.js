import { musicalInstrumentURIs } from "./pattern_uris/collection";

export default {
    patternConfig: {
        "https://w3id.org/arco/ontology/denotative-description/measurement-collection": {
            patternIViewer: "Collection",
            query: {
                select: `SELECT ?collectionLabel ?entityLabel ?depiction WHERE`,
                body: `?Collection <${musicalInstrumentURIs.hasMember}> ?entity ;
                                   <http://www.w3.org/2000/01/rdf-schema#label> ?collectionLabel .
                       ?entity <http://www.w3.org/2000/01/rdf-schema#label> ?entityLabel;
                               <http://xmlns.com/foaf/0.1/depiction> ?depiction .
                        `,
                aggregates: null
            },
            arguments: ["Collection"],
            key: "collection"
        }
    }
};
