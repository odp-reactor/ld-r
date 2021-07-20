import defaultMap from '../../plugins/visualframes/visualframes.json'

export class VisualFrameRepository {

    constructor(visualFrameMap) {
        this.visualFrameMap = visualFrameMap || defaultMap
    }

    getVisualFrameFile(patternURI) {
        if (this.visualFrameMap[patternURI]) {
            return this.visualFrameMap[patternURI]
        } else {
            return undefined
        }
    }
    getVisualFrame(patternURI){
        // we need some chunk of static path to implicitly tell webpack how to resolve this path at runtime 
        try {
            return require('../../plugins/visualframes/' + this.getVisualFrameFile(patternURI))
        } catch(err) {
            return undefined
        }
    }
}