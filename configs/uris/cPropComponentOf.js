import PartOfUris from "./classes/PartOfUris";
import { odp_pat } from "./prefixes";

const cPropComponentOfURIs = new PartOfUris({
    isPartOf: `${odp_pat}isCulturalPropertyComponentOf`,
    hasPart: `${odp_pat}hasCulturalPropertyComponent`
});

export { cPropComponentOfURIs };
