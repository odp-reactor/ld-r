import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';

/* Flux
_________*/

import PatternStore from '../../../stores/PatternStore';
import ApplicationStore from '../../../stores/ApplicationStore';
import DatasetStore from '../../../stores/DatasetStore';
import { navigateAction } from 'fluxible-router';

export default class PatternInstancesNetworkView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const getInstance = node => {
            this.context.executeAction(navigateAction, {
                url: `/dataset/${encodeURIComponent(
                    this.props.DatasetStore.dataset.datasetURI
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
        } else return null;
        // TODO: need to find a way to pospone the loader
        // return (
        //     <div style={datasetContainerStyle}>
        //         <CustomLoader></CustomLoader>
        //     </div>
        // );
    }
}

PatternInstancesNetworkView.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
PatternInstancesNetworkView = connectToStores(
    PatternInstancesNetworkView,
    [PatternStore, ApplicationStore, DatasetStore],
    function(context, props) {
        return {
            PatternStore: context.getStore(PatternStore).getState(),
            ApplicationStore: context.getStore(ApplicationStore).getState(),
            DatasetStore: context.getStore(DatasetStore).getState()
        };
    }
);
