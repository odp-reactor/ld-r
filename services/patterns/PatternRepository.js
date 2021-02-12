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
}
