import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import { handleHistory, navigateAction } from 'fluxible-router';

/* Flux
_________*/

import PatternStore from '../../../stores/PatternStore';
import loadPatternInstances from '../../../actions/loadPatternInstances';
import cleanInstance from '../../../actions/cleanInstance';

import CustomLoader from '../../CustomLoader';

// import laodInstances action
// catch dataset id from route not from dataset store

export default class PatternInstancesNetworkView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // If there are resources of a pattern instance loaded in the PatternInstancesStore we clean them
        // We expect a user click on an instance and explore new data
        // Navigation Scenario, Navigation Action:
        //      instances screen, filter and click on a instance visiting that instance
        //      instance screen, explore information of that single instance
        //      instance screen, go back button to instances screen
        //      instances screen, we found the previously loaded instances without query again
        //      instances screen we clean data of the previously visited instance
        //      instances screen, click on a new instance
        //      instance screen, new data for this instance are loaded
        this.context.executeAction(cleanInstance, {});

        // we get these URIs from url params in currentNavigate
        // we receive this in props from navigateHandler
        const datasetURI = this.props.currentNavigate.route.params.did;
        const patternURI = this.props.currentNavigate.route.params.pid;
        if (!this.props.PatternStore.instances) {
            if (datasetURI && patternURI) {
                context.executeAction(loadPatternInstances, {
                    dataset: datasetURI,
                    pattern: patternURI
                });
            }
        }
    }

    render() {
        const getInstance = node => {
            this.context.executeAction(navigateAction, {
                url: `/dataset/${encodeURIComponent(
                    this.props.currentNavigate.route.params.did
                )}/resource/${encodeURIComponent(node.id)}`
            });
        };

        const PatternInstancesNetwork = require('ld-ui-react')
            .PatternInstancesNetwork;

        if (this.props.PatternStore.instances) {
            return (
                <PatternInstancesNetwork
                    patterns={this.props.PatternStore}
                    getInstance={getInstance}
                ></PatternInstancesNetwork>
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

PatternInstancesNetworkView.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
PatternInstancesNetworkView = connectToStores(
    PatternInstancesNetworkView,
    [PatternStore],
    function(context, props) {
        return {
            PatternStore: context.getStore(PatternStore).getState()
        };
    }
);

PatternInstancesNetworkView = handleHistory(PatternInstancesNetworkView, {
    enableScroll: false // example to show how to specify options for handleHistory
});
