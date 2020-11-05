import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';

/* Flux
_________*/

import loadPatterns from '../../../actions/loadPatterns';
import loadPatternSpecializations from '../../../actions/loadPatternSpecializations';
import loadPatternCompositions from '../../../actions/loadPatternCompositions';
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
    }

    render() {
        const datasetContainerStyle = {
            height: '90vh',
            width: '90vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto'
        };

        if (process.env.BROWSER) {
            if (
                this.props.ApplicationStore.loading == 0 &&
                this.props.PatternStore.patternData
            ) {
                let PatternNetwork = require('ld-ui-react').PatternNetwork;
                return (
                    <div style={datasetContainerStyle}>
                        <PatternNetwork
                            patterns={this.props.PatternStore}
                        ></PatternNetwork>
                    </div>
                );
            } else
                return (
                    <div style={datasetContainerStyle}>
                        <CustomLoader></CustomLoader>
                    </div>
                );
        } else {
            return null;
        }
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
