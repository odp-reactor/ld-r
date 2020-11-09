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
import loadPatternInstances from '../../../actions/loadPatternInstances';
import PatternStore from '../../../stores/PatternStore';
import ApplicationStore from '../../../stores/ApplicationStore';
import CustomLoader from '../../CustomLoader';

export default class OntologyDesignPatternNetwork extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        this.context.executeAction(loadPatterns, {
            dataset: this.props.datasetURI //missing
            // resourceURI: this.props.resource,
            // propertyPath: this.props.propertyPath,
            // propertyURI: this.props.spec.propertyURI
        });
        this.context.executeAction(loadPatternCompositions, {
            dataset: this.props.datasetURI //missing
        });
        this.context.executeAction(loadPatternSpecializations, {
            dataset: this.props.datasetURI //missing
        });
        this.context.executeAction(loadPatternSpecializationCount, {
            dataset: this.props.datasetURI //missing
        });
        this.context.executeAction(loadPatternCompositionCount, {
            dataset: this.props.datasetURI //missing
        });
    }

    render() {
        const datasetContainerStyle = {
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto'
        };

        if (
            this.props.ApplicationStore.loading == 0 &&
            this.props.PatternStore.patternData
        ) {
            if (process.env.BROWSER) {
                let PatternNetwork = require('ld-ui-react').PatternNetwork;

                // we dependency inject the function to get instances by pattern URI
                const getInstances = patternURI => {
                    this.context.executeAction(loadPatternInstances, {
                        dataset: this.props.datasetURI,
                        pattern: patternURI
                    });
                };

                return (
                    <PatternNetwork
                        patterns={this.props.PatternStore}
                        getInstances={getInstances}
                    ></PatternNetwork>
                );
            } else {
                return null;
            }
        } else
            return (
                <div style={datasetContainerStyle}>
                    <CustomLoader></CustomLoader>
                </div>
            );
    }
}

OntologyDesignPatternNetwork.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
OntologyDesignPatternNetwork = connectToStores(
    OntologyDesignPatternNetwork,
    [PatternStore, ApplicationStore],
    function(context, props) {
        return {
            PatternStore: context.getStore(PatternStore).getState(),
            ApplicationStore: context.getStore(ApplicationStore).getState()
        };
    }
);
