import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';

/* Flux
_________*/

import loadPatterns from '../../../actions/loadPatterns';
import loadPatternSpecializations from '../../../actions/loadPatternSpecializations';
import loadPatternCompositions from '../../../actions/loadPatternCompositions';
import loadPatternCompositionCount from '../../../actions/loadPatternCompositionCount';
import loadPatternSpecializationCount from '../../../actions/loadPatternSpecializationCount';
import cleanInstances from '../../../actions/cleanInstances';
import PatternStore from '../../../stores/PatternStore';
import { navigateAction } from 'fluxible-router';
import CustomLoader from '../../CustomLoader';

export default class PatternNetworkView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        // If there are instances of a single pattern loaded in the PatternStore we clean them
        // We expect a user click on a pattern and navigate new pattern instances
        // Navigation Scenario, Navigation Action:
        //      pattern screen, click on a pattern a visit its instances
        //      instances screen, filter and click on a instance visiting that instance
        //      instance screen, explore information of that single instance
        //      instance screen, go back button to instances screen
        //      instances screen, we found the previously loaded instances without query again
        //      instances screen, go back button
        //      pattern screen, clean the previously visited instances, ready to visit new ones
        this.context.executeAction(cleanInstances, {});

        if (!this.props.PatternStore.list) {
            this.context.executeAction(loadPatterns, {
                dataset: this.props.datasetURI //missing
            });
        }
        if (!this.props.PatternStore.compositions) {
            this.context.executeAction(loadPatternCompositions, {
                dataset: this.props.datasetURI //missing
            });
        }
        if (!this.props.PatternStore.specializations) {
            this.context.executeAction(loadPatternSpecializations, {
                dataset: this.props.datasetURI //missing
            });
        }
        if (!this.props.PatternStore.specializationCount) {
            this.context.executeAction(loadPatternSpecializationCount, {
                dataset: this.props.datasetURI //missing
            });
        }
        if (!this.props.PatternStore.compositionCount) {
            this.context.executeAction(loadPatternCompositionCount, {
                dataset: this.props.datasetURI //missing
            });
        }
    }

    render() {
        if (this.props.PatternStore.list) {
            // we dependency inject the function to get instances by pattern URI
            // node is a Graphin node
            const getInstances = node => {
                this.context.executeAction(navigateAction, {
                    url: `/datasets/${encodeURIComponent(
                        this.props.datasetURI
                    )}/patterns/${encodeURIComponent(node.id)}`
                });
            };

            const PatternNetwork = require('ld-ui-react').PatternNetwork;

            return (
                <PatternNetwork
                    patterns={this.props.PatternStore}
                    getInstances={getInstances}
                ></PatternNetwork>
            );
        } else {
            const datasetContainerStyle = {
                height: '90vh',
                width: '90vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto'
            };
            return (
                <div style={datasetContainerStyle}>
                    <CustomLoader></CustomLoader>
                </div>
            );
        }
    }
}

PatternNetworkView.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
PatternNetworkView = connectToStores(
    PatternNetworkView,
    [PatternStore],
    function(context, props) {
        return {
            PatternStore: context.getStore(PatternStore).getState()
        };
    }
);
