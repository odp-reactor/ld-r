import React from 'react';

import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import TITLocationStore from '../../../stores/TITLocationStore';

/**
 * This component is a wrapper around the one provide by the ld-ui-react package.
 * Define here the props to be passed to that.
 * In future you can define the interaction and event handlers for it.
 *
 * It takes care to check browser environment
 *
 * @param {Object} props React props
 */
class TimeIndexedTypedLocation extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchData();
    }

    render() {
        /* 
           We need to check if env is BROWSER as leaflet require window object to
           work and avoid app crashing in server rendering.
           TimeIndexedTypedLocation pattern imports leaflet
            _______________________________________________________________________
        */
        console.log(process.env.BROWSER);
        if (process.env.BROWSER) {
            if (this.props.TITLocationStore.patternData) {
                let TimeIndexedTypedLocation = require('ld-ui-react')
                    .TimeIndexedTypedLocation;
                return (
                    <TimeIndexedTypedLocation
                        timeIndexedTypedLocations={
                            this.props.TITLocationStore.patternData
                        }
                    ></TimeIndexedTypedLocation>
                );
            } else {
                return <div>!Spinner!</div>;
            }
        } else console.log(`server side, browser => ${process.env.BROWSER}`);
    }
}

TimeIndexedTypedLocation.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
TimeIndexedTypedLocation = connectToStores(
    TimeIndexedTypedLocation,
    [TITLocationStore],
    function(context, props) {
        return {
            TITLocationStore: context.getStore(TITLocationStore).getState()
        };
    }
);

export default TimeIndexedTypedLocation;
