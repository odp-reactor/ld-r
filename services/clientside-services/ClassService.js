import ClassRepository from '../classes/ClassRepository';

export default class ClassService {
    constructor(dbCtx) {
        this.classRepository = new ClassRepository(dbCtx);
    }
    async findAllClassesWithCentralityScore() {
        return this.classRepository.findAllClassesWithCentralityScore();
    }
}
