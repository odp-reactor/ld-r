/**
 * This component may be used to create a complex visualization for a resource property.
 * Supposed that a resource of class Person has a relation 'isInvolvedIn' with a resource of class
 * Situation.
 *
 *  :John :isInvolvedIn :situation_1
 *
 * Situation is a complex resource, meaning that to fully understand it you need to know TimeInterval,
 * Geometry, Participants ...
 *
 * This component needs a custom query to load additional resources and properties (such as startTime,
 * endTime, latitude, ... in the case of Situation example) and a view to show this informations
 *
 * They may be defined in the configs/reactor.js file under:
 *
 *      config : {
 *          ...
 *          property : {
 *              ':isInvolvedIn' : {
 *                      propertyReactor: ['ComplexProperty'],
 *                      customQuery : ['<selectStatement>', '<queryBody>, '<aggregatesBlock>']
 *                      objectIViewer : ['SituationView']
 *                  }
 *              }
 *      }
 *
 * The data received by the SPARQL endpoint will be saved in the ResourceStore
 * ??? decide here how to save in the ResourceStore the additional data
 */

import React from 'react';
import PropTypes from 'prop-types';

import ResourceStore from '../../stores/ResourceStore';
import loadExtraResource from '../../actions/loadExtraResource';

import { connectToStores } from 'fluxible-addons-react';

class ComplexProperty extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.fetchExtraData();
    }

    fetchExtraData() {
        this.context.executeAction(loadExtraResource, {
            dataset: this.props.datasetURI,
            resourceURI: this.props.resource,
            propertyPath: this.props.propertyPath,
            propertyURI: this.props.spec.propertyURI
        });
    }

    render() {
        return this.props.resource ? (
            <div>[*] Functionality in progress, loading data</div>
        ) : (
            <div>[*] Functionality in progress, data loaded</div>
        );
    }
}

ComplexProperty.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
ComplexProperty = connectToStores(ComplexProperty, [ResourceStore], function(
    context,
    props
) {
    return { ResourceStore: context.getStore(ResourceStore).getState() };
});

export default ComplexProperty;

// write this Component (you need an action to trigger loadExtraData)
// write parseCustomProperties in ResourceUtil and call it inside service resource.extraData
// (to parse your data and add them to the store)
// here i need to connect this component at the resource store

// modify config file
// add dynamic config

// ( optional)
// after applied in several use cases modify documentation
// do pr
