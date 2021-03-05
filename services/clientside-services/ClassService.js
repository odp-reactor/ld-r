import ClassRepository from '../classes/ClassRepository';
import { map } from 'lodash';

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
    async findResourcesByClassWithPatternInstancesTheyBelongsTo(classUri) {
        // here I parse to remove duplicates
        let resourcesWithPatternInstances = await this.classRepository.findResourcesByClassWithPatternInstancesTheyBelongsTo(
            classUri
        );
        resourcesWithPatternInstances = map(
            resourcesWithPatternInstances,
            r => {
                if (r.belongsToPatternInstances === '') {
                    return {
                        uri: r.uri,
                        label: r.label,
                        classLabel: r.classLabel
                    };
                }
                let patternInstances = r.belongsToPatternInstances.split('|');
                patternInstances = map(patternInstances, patternInstance => {
                    const [uri, type, typeLabel] = patternInstance.split(';');
                    return {
                        uri: uri,
                        type: type,
                        typeLabel: typeLabel
                    };
                });
                return {
                    uri: r.uri,
                    label: r.label,
                    patternInstances: patternInstances,
                    classLabel: r.classLabel
                };
            }
        );
        return {
            resourcesWithPatternInstances: resourcesWithPatternInstances
        };
    }
    async findAllPatternInstancesWithTypeByResource(resourceUri) {
        return this.classRepository.findAllPatternInstancesWithTypeByResource(
            resourceUri
        );
    }
}
