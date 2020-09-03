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

import { config } from '../../configs/reactor';

/* Flux
_________*/

import ResourceStore from '../../stores/ResourceStore'; //store
import loadExtraData from '../../actions/loadExtraData'; //action
import { connectToStores } from 'fluxible-addons-react';

/* Ontology Design Patterns
______________________________*/

import TimeIndexedTypedLocation from './viewer/TimeIndexedTypedLocation';

class OntologyDesignPattern extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.fetchExtraData();
    }

    fetchExtraData() {
        this.context.executeAction(loadExtraData, {
            dataset: this.props.datasetURI, //missing
            resourceURI: this.props.resource,
            propertyPath: this.props.propertyPath,
            propertyURI: this.props.spec.propertyURI
        });
    }

    render() {
        // choose the view for pattern based on property
        const patternComponent = this.chooseView(this.props.spec.propertyURI);

        return this.props.ResourceStore.extraData ? (
            //patternComponent
            patternComponent
        ) : (
            <div>{'data loading? spinner'}</div>
        );
    }

    /**
     * Function select the pattern view based
     * based on user static specified config
     *
     * @param {string} propertyURI the propertyURI set in config file
     */
    chooseView(propertyURI) {
        let patternComponent;
        const patternView = this.getViewForPattern(propertyURI);
        switch (patternView) {
            case 'TimeIndexedTypedLocation':
                patternComponent = (
                    <TimeIndexedTypedLocation
                        timeIndexedTypedLocations={
                            this.props.ResourceStore.extraData
                        }
                    ></TimeIndexedTypedLocation>
                );
                break;
            default:
                patternComponent = <div>No visual pattern found</div>;
        }

        return patternComponent;
    }

    /**
     * Retrieve the pattern view to show for the given property
     * from the static config file
     *
     * @param {string} propertyURI
     */
    getViewForPattern(propertyURI) {
        if (config.property[propertyURI]) {
            if (config.property[propertyURI].patternIViewer)
                return config.property[propertyURI].patternIViewer;
            else
                return `[!] Err: no custom query specified for property ${propertyURI}`;
        } else {
            return `[!] Err: no configuration key find for property ${propertyURI}`;
        }
    }
}

OntologyDesignPattern.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
OntologyDesignPattern = connectToStores(
    OntologyDesignPattern,
    [ResourceStore],
    function(context, props) {
        return { ResourceStore: context.getStore(ResourceStore).getState() };
    }
);

export default OntologyDesignPattern;
