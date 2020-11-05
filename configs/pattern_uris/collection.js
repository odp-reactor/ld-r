import CollectionUris from "./classes/CollectionUris";

const musicalInstrumentURIs = new CollectionUris({
    hasCollection: "https://virtuoso.local/hasMusicalInstrumentCollection",
    hasMember: "virtuoso/hasMember",
    hasMemberType: undefined
});

const measurementURIs = new CollectionUris({
    hasCollection:
        "https://w3id.org/arco/ontology/denotative-description/hasMeasurementCollection",
    hasMember:
        "https://w3id.org/arco/ontology/denotative-description/hasMeasurement",
    hasMemberType:
        "https://w3id.org/arco/ontology/denotative-description/hasMeasurementType"
});

export { musicalInstrumentURIs, measurementURIs };
