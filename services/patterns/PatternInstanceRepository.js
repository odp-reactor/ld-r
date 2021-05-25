import GenericRepository from '../base/GenericRepository';
import PatternInstanceQueryBuilder from './PatternInstanceQueryBuilder';
import  { PatternInstance} from './PatternInstance'
import { VisualFrameRepository } from '../visualframes/VisualFrameRepository';

export class PatternInstanceRepository {
    constructor(dbClient, genericRepository, visualFrameRepository, patternQueryBuilder) {
        this.genericRepository = genericRepository || new GenericRepository(
            dbClient
        );
        this.visualFrameRepository = visualFrameRepository || new VisualFrameRepository()
        this.patternQueryBuilder = patternQueryBuilder || new PatternInstanceQueryBuilder();
    }
    async getPatternInstanceData(patternInstance) {
        if (patternInstance && patternInstance.pattern && patternInstance.uri && patternInstance.pattern.uri) {
            return this.genericRepository.fetchByQueryObject(
                this.patternQueryBuilder.getPatternInstanceDataQuery(patternInstance.uri, patternInstance.pattern.uri)
            )
        } else {
            return undefined
        }
    }

    async getPatternInstanceType(patternInstanceUri) {
        const pattern = await this.genericRepository.fetchByQueryObject(
            this.patternQueryBuilder.getPatternWithLabel(patternInstanceUri)
        );
        return pattern[0]
    }

    async getPatternInstanceWithTypeVisualFrameAndData(patternInstanceUri) {
        let pattern = await this.getPatternInstanceType(patternInstanceUri)
        let visualFrame = null
        if (pattern && pattern.uri) {
            visualFrame = await this.visualFrameRepository.getVisualFrame(pattern.uri)
        }
        const patternInstance = PatternInstance.create({uri: patternInstanceUri, pattern, visualFrame})
        let data = await this.getPatternInstanceData(patternInstance)
        patternInstance.data = data
        return patternInstance
    }
    async getPatternInstancesUrisByResource(resourceURI) {
        return await this.genericRepository.fetchByQueryObject(
            this.patternQueryBuilder.getPatternInstancesResourceBelongsTo(
                resourceURI
            )
        )
    }
    async getPatternInstancesByResourceParticipatingInPattern(resourceURI) {
        const patternInstancesURI = await this.getPatternInstancesUrisByResource(resourceURI)
        const patternInstances = []
        for (let i=0; i < patternInstancesURI.length; i++) {
            const patternInstance = await this.getPatternInstanceWithTypeVisualFrameAndData(patternInstancesURI[i].uri)
            patternInstances.push(patternInstance)
        }
        return patternInstances
    }
}
