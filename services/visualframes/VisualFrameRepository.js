export class VisualFrameRepository {

    constructor(visualFrameMap) {
        this.visualFrameMap = visualFrameMap || require('./VisualFrameMap').visualFrameMap
    }

    findVisualFrameForPattern(patternURI) {
        if (this.visualFrameMap[patternURI]) {
            return this.visualFrameMap[patternURI]
        } else {
            return undefined
        }
    }
}