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
import CustomLoader from '../../CustomLoader';
import { navigateAction } from 'fluxible-router';

export default class PatternInstancesNetwork extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        // insert here action to load data if required
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

        // we dependency inject the function to get instances by pattern URI
        const getInstance = () => {
            'running getInstance';
            this.context.executeAction(navigateAction, {
                url: `/dataset/${encodeURIComponent(
                    this.props.datasetURI
                )}/resourceTypeHere/${encodeURIComponent(
                    'http://www.ontologydesignpatterns.org/cp/owl/collection'
                )}`
            });
        };

        if (this.props.PatternStore.instances) {
            if (process.env.BROWSER) {
                let PatternInstancesNetwork = require('ld-ui-react')
                    .PatternInstancesNetwork;

                return (
                    <PatternInstancesNetwork
                        patterns={this.props.PatternStore}
                        getInstance={getInstance}
                    ></PatternInstancesNetwork>
                );
            }
        } else return null;
        // TODO: need to find a way to pospone the loader
        // return (
        //     <div style={datasetContainerStyle}>
        //         <CustomLoader></CustomLoader>
        //     </div>
        // );
    }
}

PatternInstancesNetwork.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
PatternInstancesNetwork = connectToStores(
    PatternInstancesNetwork,
    [PatternStore, ApplicationStore],
    function(context, props) {
        return {
            PatternStore: context.getStore(PatternStore).getState(),
            ApplicationStore: context.getStore(ApplicationStore).getState()
        };
    }
);
