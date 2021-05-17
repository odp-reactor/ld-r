import {VisualFrameRepository} from './VisualFrameRepository'

describe('VisualFrameRepository return visual frame for pattern uri:', () => {
    const patternUri = 'odp:collection'
    const visualFrameKey = 'CollectionVisualFrame'
    test(`It should return '${visualFrameKey}' for ${patternUri}`, () => {
        const visualFrameMap = {
            [patternUri] : visualFrameKey
        }
        const visualFrameRepo = new VisualFrameRepository(visualFrameMap)

        const collectionVisualFrame = visualFrameRepo.findVisualFrameForPattern(patternUri)
        expect(collectionVisualFrame).toBe(visualFrameKey)
    })
})