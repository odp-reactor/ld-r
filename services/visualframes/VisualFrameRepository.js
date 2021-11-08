import {visualFramesMap} from '../../plugins/visualframes/visualframes'

export class VisualFrameRepository {

    constructor(visualFrameMap) {
        this.visualFrameMap = visualFramesMap || visualFrameMap
    }

    getVisualFrame(patternURI){
        // we need some chunk of static path to implicitly tell webpack how to resolve this path at runtime 
        try {
            return this.visualFrameMap[patternURI]
        } catch(err) {
            return undefined
        }
    }
}