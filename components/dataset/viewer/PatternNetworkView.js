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
import PatternStore from '../../../stores/PatternStore';
import ApplicationStore from '../../../stores/ApplicationStore';
import { navigateAction } from 'fluxible-router';

export default class PatternNetworkView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        if (!this.props.PatternStore.list) {
            this.context.executeAction(loadPatterns, {
                dataset: this.props.datasetURI //missing
                // resourceURI: this.props.resource,
                // propertyPath: this.props.propertyPath,
                // propertyURI: this.props.spec.propertyURI
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

            console.log('Mount again ?');

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
        } else return null;
        // TODO: need to find a way to pospone the loader
        // return (
        //         <div style={datasetContainerStyle}>
        //             <CustomLoader></CustomLoader>
        //         </div>
        //     );
    }
}

PatternNetworkView.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
PatternNetworkView = connectToStores(
    PatternNetworkView,
    [PatternStore, ApplicationStore],
    function(context, props) {
        return {
            PatternStore: context.getStore(PatternStore).getState(),
            ApplicationStore: context.getStore(ApplicationStore).getState()
        };
    }
);
