import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';

/* Flux
_________*/

import PatternInstanceStore from '../../stores/PatternInstanceStore';
import PatternStore from '../../stores/PatternStore';

/* Visual Patterns
______________________________*/

import TimeIndexedTypedLocationView from './viewer/TimeIndexedTypedLocationView';
import CollectionView from './viewer/CollectionView';
import PartWholeView from './viewer/PartWholeView';

import PatternUtil from '../../services/utils/PatternUtil';
const patternUtil = new PatternUtil();

export default class Pattern extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);
        const patternComponent = this.patternReactor();
        return (
            // <div>
            //     {this.props.hidePropertyName ||
            //     (this.props.config && this.props.config.hidePropertyName) ? (
            //         ""
            //     ) : (
            //         <div className="property-title">
            //             <div className="ui horizontal list">
            //                 <div className="item">
            //                     <PropertyHeader
            //                         spec={this.props.spec}
            //                         config={this.props.config}
            //                         size="3"
            //                         datasetURI={this.props.datasetURI}
            //                         resourceURI={this.props.resource}
            //                         propertyURI={this.props.property}
            //                     />
            //                 </div>
            //             </div>
            //             <div className="ui dividing header"></div>
            //         </div>
            //     )}
            //     <div className="ui list">
            //         <div className="item">
            //             <div className="ui form grid">
            //                 <div className="twelve wide column field">
            <div>{patternComponent}</div>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
        );
    }

    /**
     * Function select the pattern view based on user static specified config
     */
    patternReactor() {
        let patternView = '';
        let patternURI;
        const instanceResources = this.getInstanceResources(
            this.props.resource,
            this.props.PatternStore.instances
        );
        // click on pattern instance node -> pattern visualization
        if (
            this.props.spec.propertyURI ===
            'http://ontologydesignpatterns.org/opla/isPatternInstanceOf'
        ) {
            patternURI = instanceResources
                ? instanceResources[0].pattern
                : null;
            if (patternURI) {
                patternView = patternUtil.getView(patternURI);
            }
        } else
            patternView = patternUtil.getViewByProperty(
                this.props.spec.propertyURI
            );
        switch (patternView) {
            case 'TimeIndexedTypedLocationView':
                return (
                    <TimeIndexedTypedLocationView
                        pattern={patternURI}
                        dataset={this.props.datasetURI}
                        instanceResources={instanceResources}
                    />
                );
            case 'CollectionView':
                return (
                    <CollectionView
                        pattern={patternURI}
                        dataset={this.props.datasetURI}
                        instanceResources={instanceResources}
                    />
                );
            case 'PartWholeView':
                return (
                    <PartWholeView
                        pattern={patternURI}
                        dataset={this.props.datasetURI}
                        instanceResources={instanceResources}
                    ></PartWholeView>
                );
            default:
                return instanceResources ? (
                    <div style={{ color: 'red' }}>No visual pattern found</div>
                ) : null;
        }
    }

    /**
     * @description Retrieve all the instance resources for a given instancce in a list of instances
     *              We clean data received from fluxible service after SPARQL query
     * @author Christian Colonna
     * @date 23-11-2020
     * @memberof Pattern
     */
    getInstanceResources(instanceURI, patternInstances) {
        const instanceResources = [];
        patternInstances.forEach(instance => {
            if (instance.instance === instanceURI) {
                instanceResources.push(instance);
            }
        });
        return instanceResources;
    }
}

Pattern.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
Pattern = connectToStores(
    Pattern,
    [PatternInstanceStore, PatternStore],
    function(context, props) {
        return {
            PatternInstanceStore: context
                .getStore(PatternInstanceStore)
                .getState(),
            PatternStore: context.getStore(PatternStore)
        };
    }
);
