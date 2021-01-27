import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import fetchInstanceData from './fetchInstanceData';
import PatternInstanceStore from '../../../stores/PatternInstanceStore';
import ResourceStore from '../../../stores/ResourceStore';
import { navigateAction } from 'fluxible-router';

import CustomLoader from '../../CustomLoader';

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';

/**
 * @description This component is a model for the corresponding view provided by the odp-reactor package.
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
    }

    componentDidMount() {
        fetchInstanceData(this.props, this.context);
    }

    render() {
        /* 
           We need to check if env is BROWSER as leaflet require window object to
           work and avoid app crashing in server rendering.
           TimeIndexedTypedLocation pattern imports leaflet
            _______________________________________________________________________
        */
        if (process.env.BROWSER) {
            console.log('time indexed typed location props');
            console.log(this.props);
            if (this.props.data.instanceData.tITLocations) {
                let TimeIndexedTypedLocation = require('odp-reactor/lib/client-side')
                    .TimeIndexedTypedLocation;
                let ImageGrid = require('odp-reactor').ImageGrid;
                const PropertyValueList = require('odp-reactor')
                    .PropertyValueList;

                const getResource = resourceURI => {
                    this.context.executeAction(navigateAction, {
                        url: `${PUBLIC_URL}/dataset/${encodeURIComponent(
                            this.props.dataset
                        )}/resource/${encodeURIComponent(resourceURI)}`
                    });
                };

                const culturalPropertyURI = this.props.data.instanceData
                    .tITLocations[0].culturalProperty;

                const locationTypeURI = this.props.data.instanceData
                    .tITLocations[0].locationType;

                let titl = this.props.data.instanceData.tITLocations[0];

                let propertyList = {};
                propertyList['Cultural property:'] = {
                    label: titl.cPropLabel,
                    onClick: () => {
                        getResource(culturalPropertyURI);
                    }
                };
                propertyList['Address:'] = { label: titl.addressLabel };
                propertyList['Location Type:'] = {
                    label: titl.locationTypeLabel,
                    onClick: () => {
                        getResource(locationTypeURI);
                    }
                };
                propertyList['Longitude:'] = { label: titl.long };
                propertyList['Latitude:'] = { label: titl.lat };
                propertyList['Start Time:'] = { label: titl.startTime };
                propertyList['End Time:'] = { label: titl.endTime };

                const childStyle = {
                    flex: '1 0 45%'
                };

                return (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            flexWrap: 'wrap'
                        }}
                    >
                        <div style={childStyle}>
                            <TimeIndexedTypedLocation
                                timeIndexedTypedLocations={
                                    this.props.data.instanceData.tITLocations
                                }
                                onObjectClick={() => {
                                    getResource(culturalPropertyURI);
                                }}
                            />
                        </div>
                        <div style={childStyle}>
                            <ImageGrid resourceURI={culturalPropertyURI} />
                        </div>
                        <div style={Object.assign({ margin: 50 }, childStyle)}>
                            <PropertyValueList properties={propertyList} />
                        </div>
                    </div>
                );
            } else {
                return (
                    <div style={{ textAlign: 'center' }}>
                        <CustomLoader></CustomLoader>
                    </div>
                );
            }
        } else return null;
    }
}

TimeIndexedTypedLocationView.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
TimeIndexedTypedLocationView = connectToStores(
    TimeIndexedTypedLocationView,
    [PatternInstanceStore, ResourceStore],
    function(context, props) {
        return {
            data: context.getStore(PatternInstanceStore).getInstanceData(),
            ResourceStore: context.getStore(ResourceStore)
        };
    }
);

export default TimeIndexedTypedLocationView;
