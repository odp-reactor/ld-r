import {VisualFrameRepository} from './VisualFrameRepository'

describe('VisualFrameRepository return visual frame for pattern uri:', () => {
    const exampleUri = 'http://example.com/example-pattern'
    test(`It should return ExampleVisualFrame React component for ${exampleUri} pattern`, () => {
        const visualFrameRepo = new VisualFrameRepository()
        const { ExampleVisualFrame } = visualFrameRepo.getVisualFrame(exampleUri)
    })    
})