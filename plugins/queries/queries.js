import {example} from './example'
import {collection} from './collection'
import {culturalcomponentof} from './culturalcomponentof'
import {timedlocation} from './timedlocation'

const queryMap = {
    'http://example.com/example-pattern' : example,
    'https://w3id.org/arco/ontology/denotative-description/measurement-collection' : collection,
    'https://w3id.org/arco/ontology/location/cultural-property-component-of' : culturalcomponentof,
    'https://w3id.org/arco/ontology/location/time-indexed-typed-location' : timedlocation
}

export {queryMap}
