import CollectionUris from "./classes/CollectionUris";

/** #PREFIXES */
const a_dd = "https://w3id.org/arco/ontology/denotative-description/";

/**
 * @type {CollectionUris}
 * @description URIs for musical instrument collection
 */
const musicalInstrumentURIs = new CollectionUris({
    hasCollection: "https://virtuoso.local/hasMusicalInstrumentCollection",
    hasMember: "https://hasMember",
    hasMemberType: undefined
});

/**
 * @type {CollectionUris}
 * @description URIs for measurement collection pattern
 */
const measurementURIs = new CollectionUris({
    hasCollection: `${a_dd}hasMeasurementCollection`,
    hasMember: `${a_dd}hasMeasurement`,
    hasMemberType: `${a_dd}/hasMeasurementType`
});

export { musicalInstrumentURIs, measurementURIs };
