import React from 'react'
import CollectionVisualFrame from '../../components/pattern/viewer/toDeleteCollectionVisualFrame'
import PartWholeVisualFrame from '../../components/pattern/viewer/toDeletePartWholeVisualFrame'
import TimeIndexedTypedLocationVisualFrame from '../../components/pattern/viewer/toDeleteTimeIndexedTypedLocationVisualFrame'

export const visualFrameMap = {
    'https://w3id.org/arco/ontology/denotative-description/measurement-collection' : <CollectionVisualFrame
        showResourceTitle={true}
        // pattern={patternURI}
        // dataset={this.props.datasetURI}
        // patternInstanceUri={this.props.resource}
        styles={{
            depiction: {
                maxHeight: 500
            }
        }}
    />,
    'https://w3id.org/arco/ontology/location/time-indexed-typed-location' : <TimeIndexedTypedLocationVisualFrame 
        showPropertyValueList={true}
        showImageGrid={true}
        // pattern={patternURI}
        // dataset={this.props.datasetURI}
        // patternInstancesUri={[this.props.resource]}
    />,
    'https://w3id.org/arco/ontology/location/cultural-property-component-of' : <PartWholeVisualFrame
        showPropertyValueList={true}
        // pattern={patternURI}
        // dataset={this.props.datasetURI}
        // patternInstanceUri={this.props.resource}
    />
}
