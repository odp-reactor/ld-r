import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import fetchInstanceData from './fetchInstanceData';
import PatternInstanceStore from '../../../stores/PatternInstanceStore';
import ResourceStore from '../../../stores/ResourceStore';
import { navigateAction } from 'fluxible-router';

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
                let TimeIndexedTypedLocation = require('ld-ui-react/lib/client-side')
                    .TimeIndexedTypedLocation;
                let ImageGrid = require('ld-ui-react').ImageGrid;
                const PropertyValueList = require('ld-ui-react')
                    .PropertyValueList;

                const getResource = () => {
                    this.context.executeAction(navigateAction, {
                        url: `/dataset/${encodeURIComponent(
                            this.props.dataset
                        )}/resource/${encodeURIComponent(
                            this.props.data.instanceData.tITLocations[0]
                                .culturalProperty
                        )}`
                    });
                };

                const culturalPropertyURI = this.props.data.instanceData
                    .tITLocations[0].culturalProperty;

                let titl = this.props.data.instanceData.tITLocations[0];

                let propertyList = {};
                propertyList['Cultural property:'] = titl.cPropLabel;
                propertyList['Address:'] = titl.addressLabel;
                propertyList['Location Type:'] = titl.locationType;
                propertyList['Longitude:'] = titl.long;
                propertyList['Latitude:'] = titl.lat;
                propertyList['Start Time:'] = titl.startTime;
                propertyList['End Time:'] = titl.endTime;

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
                                onCulturalPropertyClick={getResource}
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
