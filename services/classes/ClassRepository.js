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
}
