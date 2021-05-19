const visualFramesRelativePath = '../../plugins/visualframes/'

import defaultMap from '../../plugins/visualframes/visualframes.json'

export class VisualFrameRepository {

    constructor(visualFrameMap, relativePath) {
        this.visualFrameMap = visualFrameMap || defaultMap
        this.relativePath = relativePath || visualFramesRelativePath
    }

    getVisualFrameFile(patternURI) {
        if (this.visualFrameMap[patternURI]) {
            return this.visualFrameMap[patternURI]
        } else {
            return undefined
        }
    }
    getVisualFramePath(patternURI){
        let visualFrameFile = this.getVisualFrameFile(patternURI)
        return this.relativePath + visualFrameFile 
    }
    getVisualFrame(patternURI){
        return require(this.getVisualFramePath(patternURI))
    }
}