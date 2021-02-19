import PatternRepository from '../patterns/PatternRepository';

export default class PatternService {
    constructor(dbCtx) {
        this.patternRepository = new PatternRepository(dbCtx);
    }
    async findCulturalPropertyWithTimeIndexedTypedLocation(patternUri) {
        return this.patternRepository.findCulturalPropertyWithTimeIndexedTypedLocation(
            patternUri
        );
    }
    async findCulturalPropertyWithParts(patternUri) {
        return this.patternRepository.findCulturalPropertyWithParts(patternUri);
    }
    async findCulturalPropertyWithMeasurements(patternUri) {
        return this.patternRepository.findCulturalPropertyWithMeasurements(
            patternUri
        );
    }
    async findPattern(patternInstanceUri) {
        return this.patternRepository.findPattern(patternInstanceUri);
    }
}
