import ClassRepository from '../classes/ClassRepository';

export default class ClassService {
    constructor(dbCtx) {
        this.classRepository = new ClassRepository(dbCtx);
    }
    async findAllClassesWithCentralityScore() {
        return this.classRepository.findAllClassesWithCentralityScore();
    }
    async findClassesWithPatternsTheyBelongsTo() {
        return this.classRepository.findClassesWithPatternsTheyBelongsTo();
    }
    async findClassesWithPatternsAndScores() {
        return this.classRepository.findClassesWithPatternsAndScores();
    }
    async findResourcesByClassWithPatterns(classUri) {
        // here I parse to remove duplicates
        const resources = await this.classRepository.findResourcesByClass(
            classUri
        );
        const patterns = await this.classRepository.findPatternsByClass(
            classUri
        );
        return {
            resources: resources,
            patterns: patterns
        };
    }
}
