export class PatternInstance {
    constructor(uri, pattern, visualFrame, data) {
        this.uri = uri
        this.pattern = pattern
        this.visualFrame = visualFrame
        this.data = data
    }
    static create({
        uri,
        pattern,
        visualFrame,
        data
    }) {
        return new PatternInstance(uri, pattern, visualFrame, data)
    }
}