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
 *                      propertyReactor: ['OntologyDesignPattern'],
 *                      customQuery : ['<selectStatement>', '<queryBody>, '<aggregatesBlock>']
 *                      patternIViewer : ['SituationView']
 *                  }
 *              }
 *      }
 */

import React from 'react';

import { config } from '../../configs/reactor';
import PropertyHeader from '../property/PropertyHeader';

/* Flux
_________*/

import loadCollection from '../../actions/loadCollection'; //action
import loadTITLocation from '../../actions/loadTITLocation';

/* Ontology Design Patterns
______________________________*/

import TimeIndexedTypedLocation from './viewer/TimeIndexedTypedLocation';
import Collection from './viewer/Collection';

export default class OntologyDesignPattern extends React.Component {
    constructor(props) {
        super(props);
    }

    fetchPatternDataFactory(patternAction) {
        return () => {
            this.context.executeAction(patternAction, {
                dataset: this.props.datasetURI, //missing
                resourceURI: this.props.resource,
                propertyPath: this.props.propertyPath,
                propertyURI: this.props.spec.propertyURI
            });
        };
    }

    render() {
        // choose the view for pattern based on property
        const patternComponent = this.chooseView(this.props.spec.propertyURI);
        return (
            <div>
                {this.props.hidePropertyName ||
                (this.props.config && this.props.config.hidePropertyName) ? (
                        ''
                    ) : (
                        <div className="property-title">
                            <div className="ui horizontal list">
                                <div className="item">
                                    <PropertyHeader
                                        spec={this.props.spec}
                                        config={this.props.config}
                                        size="3"
                                        datasetURI={this.props.datasetURI}
                                        resourceURI={this.props.resource}
                                        propertyURI={this.props.property}
                                    />
                                </div>
                            </div>
                            <div className="ui dividing header"></div>
                        </div>
                    )}
                <div className="ui list">
                    <div className="item">
                        <div className="ui form grid">
                            <div className="twelve wide column field">
                                {patternComponent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                            this.props.PatternStore.extraData
                        }
                        fetchData={this.fetchPatternDataFactory(
                            loadTITLocation
                        )}
                    ></TimeIndexedTypedLocation>
                );
                break;
            case 'Collection':
                patternComponent = (
                    <Collection
                        fetchData={this.fetchPatternDataFactory(loadCollection)}
                    ></Collection>
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
