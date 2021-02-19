import GenericRepository from '../base/GenericRepository';
import ClassQuery from '../classes/ClassQuery';
import ClassDataMapper from './ClassDataMapper';

export default class ClassRepository {
    constructor(dbContext) {
        //classesDataMapper
        this.genericRepository = new GenericRepository(
            dbContext
            // new ClassDataMapper()
        );
        this.classQuery = new ClassQuery();
    }
    async findAllClassesWithCentralityScore() {
        const classesWithCentralityScore = this.genericRepository.fetchByQueryObject(
            this.classQuery.getClassesWithCentralityScore()
        );
        return classesWithCentralityScore;
    }
    async findClassesWithPatternsTheyBelongsTo() {
        const classesAndPatterns = this.genericRepository.fetchByQueryObject(
            this.classQuery.getClassesWithPatternsTheyBelongsTo()
        );
        return classesAndPatterns;
    }
    async findClassesWithPatternsAndScores() {
        const classesWithPatternsAndScores = this.genericRepository.fetchByQueryObject(
            this.classQuery.getClassesWithPatternsAndScores()
        );
        return classesWithPatternsAndScores;
    }
    async findResourcesByClassWithPatternInstancesTheyBelongsTo(classUri) {
        const resources = this.genericRepository.fetchByQueryObject(
            this.classQuery.getResourcesByClassWithPatternInstancesTheyBelongsTo(
                classUri
            )
        );
        return resources;
    }
    async findPatternsByClass(classUri) {
        const patterns = this.genericRepository.fetchByQueryObject(
            this.classQuery.getPatternsByClass(classUri)
        );
        return patterns;
    }
    async findAllPatternInstancesWithTypeByResource(resourceUri) {
        const patternInstances = this.genericRepository.fetchByQueryObject(
            this.classQuery.getPatternInstancesWithTypeByResource(resourceUri)
        );
        return patternInstances;
    }
}
