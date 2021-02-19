import GenericRepository from '../base/GenericRepository';
import PatternQuery from '../patterns/PatternQuery';

export default class PatternRepository {
    constructor(dbContext) {
        //classesDataMapper
        this.genericRepository = new GenericRepository(
            dbContext
            // new ClassDataMapper()
        );
        this.patternQuery = new PatternQuery();
    }
    async findCulturalPropertyWithTimeIndexedTypedLocation(patternUri) {
        return this.genericRepository.fetchByQueryObject(
            this.patternQuery.getCulturalPropertyWithTimeIndexedTypedLocation(
                patternUri
            )
        );
    }
    async findCulturalPropertyWithMeasurements(patternUri) {
        return this.genericRepository.fetchByQueryObject(
            this.patternQuery.getCulturalPropertyWithMeasurements(patternUri)
        );
    }
    async findCulturalPropertyWithParts(patternURI) {
        return this.genericRepository.fetchByQueryObject(
            this.patternQuery.getCulturalPropertyWithParts(patternURI)
        );
    }
    async findPattern(patternInstanceUri) {
        let pattern = await this.genericRepository.fetchByQueryObject(
            this.patternQuery.getPatternWithLabel(patternInstanceUri)
        );
        console.log('Find pattern', pattern);
        return pattern[0];
    }
}
