import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';

/* Flux
_________*/

import PatternInstanceStore from '../../stores/PatternInstanceStore';
import PatternStore from '../../stores/PatternStore';
import loadPatternInstances from '../../actions/loadPatternInstances';

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

    componentDidMount() {
        // loadInstances is called by PatternInstancesNetworkView
        // if no instances
        // we are here from a refresh on instance screen
        // then
        // call from this component loadPatternInstances
        // TODO: i think if an instance is displayed there will be always data
        //       in case not then if the pattern instance has no data for some reason doesn't
        //       display it in PatternInstancesNetwork view
        if (!this.props.PatternStore.instances) {
            const datasetURI = this.props.datasetURI;
            const patternURI = this.props.spec.instances[0].value;

            if (datasetURI && patternURI) {
                context.executeAction(loadPatternInstances, {
                    dataset: datasetURI,
                    pattern: patternURI
                });
            }
        }
    }

    render() {
        const patternComponent = this.patternReactor();
        return (
        // {this.props.hidePropertyName ||
        // (this.props.config && this.props.config.hidePropertyName) ||
        // this.props.spec.propertyURI ===
        //     "http://ontologydesignpatterns.org/opla/isPatternInstanceOf" ? (
        //     ""
        // ) : (
        //     <div className="property-title">
        //         <div className="ui horizontal list">
        //             <div className="item">
        //                 <PropertyHeader
        //                     spec={this.props.spec}
        //                     config={this.props.config}
        //                     size="3"
        //                     datasetURI={this.props.datasetURI}
        //                     resourceURI={this.props.resource}
        //                     propertyURI={this.props.property}
        //                 />
        //             </div>
        //         </div>
        //         <div className="ui dividing header"></div>
        //     </div>
        // )}
            /* <div className="ui list">
                    <div className="item">
                        <div className="ui form grid">
                            <div
                                className="twelve wide column field"
                                style={{ margin: "auto" }}
                            > */
            <div>{patternComponent}</div>
            /* </div>
                        </div>
                    </div>
                </div> */
        );
    }

    /**
     * Function select the pattern view based on user static specified config
     */
    patternReactor() {
        let patternView = '';
        let patternURI;
        console.log('pattern reactor');
        console.log(this.props);
        const [instanceResources, pURI] = this.getInstanceResources(
            this.props.resource,
            this.props.PatternStore.instances
        );
        // click on pattern instance node -> pattern visualization
        if (
            this.props.spec.propertyURI ===
            'http://ontologydesignpatterns.org/opla/isPatternInstanceOf'
        ) {
            if (instanceResources.length > 0) {
                // there are instances we can proceed
                patternURI = pURI;
                patternView = patternUtil.getView(patternURI);
            } else {
                // no instances we need to trigger loadInstances
                console.log(
                    'We are here from a refresh on instance screen. This is done in componentDidMount'
                );
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
                    // TODO: this appear after a refresh on instance page
                    <div style={{ color: 'red' }}></div>
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
        if (patternInstances) {
            const instanceResources = [];
            const instance = patternInstances.find(inst => {
                return inst.instance === instanceURI;
            });
            const nodesAndTypes = instance.nodes.split(';');
            nodesAndTypes.forEach(nT => {
                const [n, t] = nT.split(' ');
                if (t != '') {
                    instanceResources.push({
                        id: n,
                        type: t
                    });
                }
            });
            return [instanceResources, instance.type];
        } else return [[], null];
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
