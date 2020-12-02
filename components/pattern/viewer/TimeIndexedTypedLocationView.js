import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import fetchInstanceData from './fetchInstanceData';
import PatternInstanceStore from '../../../stores/PatternInstanceStore';

import CustomLoader from '../../CustomLoader';

/**
 * @description This component is a model for the corresponding view provided by the ld-ui-react package.
 *
 * It loads data to pass to the visualization.
 * It can takes care to check browser environment.
 * It defines a visualization logic: if no minimum required data are present shift to more generic views
 *     (Example: no coordinates?  show simpler visualization)
 * It defines interactive function for the application (onClickHandlers, fetchData ... )
 * @component
 * @param {Object} props React props
 * @author Christian Colonna
 * @class Collection
 * @extends {React.Component}
 */
class TimeIndexedTypedLocationView extends React.Component {
    constructor(props) {
        super(props);
        this.getResource = this.getResource.bind(this);
    }

    componentDidMount() {
        fetchInstanceData(this.props, this.context);
    }

    getResource() {
        this.context.executeAction(navigateAction, {
            url: `/dataset/${encodeURIComponent(this.props.dataset)}/resource/${
                this.props.data.instanceData.tITLocations[0].culturalProperty
            }`
        });
    }

    render() {
        /* 
           We need to check if env is BROWSER as leaflet require window object to
           work and avoid app crashing in server rendering.
           TimeIndexedTypedLocation pattern imports leaflet
            _______________________________________________________________________
        */
        if (process.env.BROWSER) {
            if (this.props.data.instanceData.tITLocations) {
                let TimeIndexedTypedLocation = require('ld-ui-react/lib/client-side')
                    .TimeIndexedTypedLocation;
                console.log(this.props.data.instanceData.tITLocations);
                return (
                    <TimeIndexedTypedLocation
                        timeIndexedTypedLocations={
                            this.props.data.instanceData.tITLocations
                        }
                        onCulturalPropertyClick={this.getResource}
                    ></TimeIndexedTypedLocation>
                );
            } else {
                return (
                    <div style={{ textAlign: 'center' }}>
                        <CustomLoader></CustomLoader>
                    </div>
                );
            }
        }
    }
}

TimeIndexedTypedLocationView.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
TimeIndexedTypedLocationView = connectToStores(
    TimeIndexedTypedLocationView,
    [PatternInstanceStore],
    function(context, props) {
        return {
            data: context.getStore(PatternInstanceStore).getInstanceData()
        };
    }
);

export default TimeIndexedTypedLocationView;
