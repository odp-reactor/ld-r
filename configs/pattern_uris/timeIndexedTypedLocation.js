import TimeIndexedTypedLocationUris from "./classes/TimeIndexedTypedLocationUris";

const tITLURIs = new TimeIndexedTypedLocationUris({
    hasTimeIndexedTypedLocation:
        "https://w3id.org/arco/ontology/location/hasTimeIndexedTypedLocation",
    hasLocationType: "https://w3id.org/arco/ontology/location/hasLocationType",
    atTime: "https://w3id.org/italia/onto/TI/atTime",
    atSite: "https://w3id.org/arco/ontology/location/atSite",
    hasGeometry: "https://w3id.org/italia/onto/CLV/hasGeometry",
    siteAddress: "http://dati.beniculturali.it/cis/siteAddress",
    hasCity: "https://w3id.org/italia/onto/CLV/hasCity",
    lat: "https://w3id.org/italia/onto/CLV/lat",
    long: "https://w3id.org/italia/onto/CLV/long",
    startTime: "https://w3id.org/arco/ontology/arco/startTime",
    endTime: "https://w3id.org/arco/ontology/arco/endTime"
});

export { tITLURIs };
