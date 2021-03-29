/*globals document*/

import React from 'react';
import PropTypes from 'prop-types';
import Nav from './Nav';
import HelpModal from './HelpModal';
import Home from './Home';
import About from './About';
import ApplicationStore from '../stores/ApplicationStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import ErrorHandler from './ErrorHandler';
import MatomoTracker from '@datapunt/matomo-tracker-js';

import regeneratorRuntime from 'regenerator-runtime';
import { hotjar } from 'react-hotjar';

class Application extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            matomoTracker: null
        };
    }
    componentDidUpdate(prevProps) {
        let newProps = this.props;
        if (
            newProps.ApplicationStore.pageTitle ===
            prevProps.ApplicationStore.pageTitle
        ) {
            return;
        }
        document.title = newProps.ApplicationStore.pageTitle;
    }
    componentDidMount() {
        // hotjar.initialize(2294500, 6);
        if (!this.state.matomoTracker) {
            const tracker = new MatomoTracker({
                urlBase: 'https://cnr.matomo.cloud/',
                siteId: 6,
                disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
                heartBeat: {
                    // optional, enabled by default
                    active: true, // optional, default value: true
                    seconds: 10 // optional, default value: `15
                },
                linkTracking: true, // optional, default value: true
                configurations: {
                    // optional, default value: {}
                    // any valid matomo configuration, all below are optional
                }
            });
            this.setState({ matomoTracker: tracker });
        }
    }
    render() {
        var Handler = this.props.currentRoute.handler;
        if (this.state.matomoTracker) {
            console.log('Tracking matomo');
            this.state.matomoTracker.trackPageView();
        }
        //render content
        return (
            <ErrorHandler>
                <div>
                    <Nav loading={this.props.ApplicationStore.loading} />
                    <Handler />
                    <HelpModal />
                </div>
            </ErrorHandler>
        );
    }
}

Application.contextTypes = {
    getStore: PropTypes.func,
    executeAction: PropTypes.func,
    getUser: PropTypes.func
};

Application = connectToStores(Application, [ApplicationStore], function(
    context,
    props
) {
    return {
        ApplicationStore: context.getStore(ApplicationStore).getState()
    };
});

Application = handleHistory(Application, { enableScroll: false });

Application = provideContext(Application, {
    //jshint ignore:line
    getUser: PropTypes.func
});

export default Application;
