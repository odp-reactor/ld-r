import TimeIndexedTypedLocationUris from "./classes/TimeIndexedTypedLocationUris";

import { a_loc, tiapit, clvapit, cis, arco } from "./prefixes";

const tITLURIs = new TimeIndexedTypedLocationUris({
    hasTimeIndexedTypedLocation: `${a_loc}hasTimeIndexedTypedLocation`,
    hasLocationType: `${a_loc}hasLocationType`,
    atTime: `${tiapit}atTime`,
    atSite: `${a_loc}atSite`,
    hasGeometry: `${clvapit}hasGeometry`,
    siteAddress: `${cis}siteAddress`,
    hasCity: `${clvapit}hasCity`,
    lat: `${clvapit}lat`,
    long: `${clvapit}long`,
    startTime: `${arco}startTime`,
    endTime: `${arco}endTime`
});

export { tITLURIs };
