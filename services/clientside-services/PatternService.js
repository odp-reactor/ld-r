import PatternRepository from '../patterns/PatternRepository';

export default class PatternService {
    constructor(dbCtx) {
        this.patternRepository = new PatternRepository(dbCtx);
    }
    async findCulturalPropertyWithTimeIndexedTypedLocationByUris(patternUris) {
        const promises = patternUris.map(patternUri => {
            return this.patternRepository.findCulturalPropertyWithTimeIndexedTypedLocation(
                patternUri
            );
        });
        const results = await Promise.all(promises);
        const resultsToReturn = results.map(arr => {
            return arr[0];
        });
        if (
            resultsToReturn &&
            resultsToReturn.length > 0 &&
            typeof resultsToReturn[0] !== 'undefined'
        )
            return resultsToReturn;
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
