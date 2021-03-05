import PatternRepository from '../patterns/PatternRepository';

export default class PatternService {
    constructor(dbCtx) {
        this.patternRepository = new PatternRepository(dbCtx);
    }
    async findCulturalPropertyWithTimeIndexedTypedLocationByUris(patternUris) {
        const titls = [];
        const promises = patternUris.map(patternUri => {
            return this.patternRepository.findCulturalPropertyWithTimeIndexedTypedLocation(
                patternUri
            );
        });
        const results = await Promise.all(promises);
        return results.map(arr => {
            return arr[0];
        });
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
