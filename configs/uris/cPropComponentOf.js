import PartOfUris from "./classes/PartOfUris";
import { arco } from "./prefixes";

const cPropComponentOfURIs = new PartOfUris({
    isPartOf: `${arco}isCulturalPropertyComponentOf`,
    hasPart: `${arco}hasCulturalPropertyComponent`
});

export { cPropComponentOfURIs };
