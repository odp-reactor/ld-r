/**
 * Here you can map VisualFrames and pattern uri.
 * You can assign the same VisualFrame to different patterns.
 */

import ExampleVisualFrame from './ExampleVisualFrame'
import CollectionVisualFrame from './CollectionVisualFrame'
import PartOfVisualFrame from './PartOfVisualFrame'
import TimeIndexedTypedLocationVisualFrame from './TimeIndexedTypedLocationVisualFrame'

const visualFramesMap = {
    'http://example.com/example-pattern' : ExampleVisualFrame,
    'https://w3id.org/arco/ontology/denotative-description/measurement-collection' : CollectionVisualFrame,
    'https://w3id.org/arco/ontology/location/cultural-property-component-of' : PartOfVisualFrame,
    'https://w3id.org/arco/ontology/location/time-indexed-typed-location' : TimeIndexedTypedLocationVisualFrame   
}

export {visualFramesMap}