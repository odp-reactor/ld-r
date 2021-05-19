import {VisualFrameRepository} from './VisualFrameRepository'

describe('VisualFrameRepository return visual frame for pattern uri:', () => {
    const patternUri = 'odp:collection'
    const visualFrameKey = 'CollectionVisualFrame'
    test(`It should return '${visualFrameKey}' for ${patternUri}`, () => {
        const visualFrameMap = {
            [patternUri] : visualFrameKey
        }
        const visualFrameRepo = new VisualFrameRepository(visualFrameMap, new String(''))

        const collectionVisualFrame = visualFrameRepo.getVisualFramePath(patternUri)
        expect(collectionVisualFrame).toBe(visualFrameKey)
    })
    const exampleUri = 'http://example.com/example-pattern'
    const exampleVisualFramePathRelativeToVFRepo = '../../plugins/visualframes/ExampleVisualFrame.js'
    test(`It should return '${exampleVisualFramePathRelativeToVFRepo}' path for pattern uri ${exampleUri}`, () => {
        const visualFrameRepo = new VisualFrameRepository()
        const vfPath = visualFrameRepo.getVisualFramePath(exampleUri)
        expect(vfPath).toBe(exampleVisualFramePathRelativeToVFRepo)
    })
    test(`It should return ExsampleVisualFrame React component for ${exampleUri} pattern`, () => {
        const visualFrameRepo = new VisualFrameRepository()
        const { ExampleVisualFrame } = visualFrameRepo.getVisualFrame(exampleUri)
    })    
})