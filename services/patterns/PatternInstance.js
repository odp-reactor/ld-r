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
    static aggregateInstances(instance1, instance2) {
        return PatternInstance.create({
            uri: instance1.uri, 
            pattern: instance1.pattern, 
            visualFrame: instance1.visualFrame, 
            data: instance1.data.concat(instance2.data)
        })
    }
}