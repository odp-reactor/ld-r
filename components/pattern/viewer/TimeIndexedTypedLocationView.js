import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
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

import PatternService from '../../../services/clientside-services/PatternService';
import DbContext from '../../../services/base/DbContext';

class TimeIndexedTypedLocationView extends React.Component {
    constructor(props) {
        super(props);
        const sparqlEndpoint = 'https://arco.istc.cnr.it/visualPatterns/sparql';
        this.patternService = new PatternService(new DbContext(sparqlEndpoint));
        //
        this.state = {
            culturalPropertyWithTimeIndexedTypedLocation: null
        };
    }

    componentDidMount() {
        if (!this.state.culturalPropertyWithTimeIndexedTypedLocation) {
            this.patternService
                .findCulturalPropertyWithTimeIndexedTypedLocation(
                    this.props.patternInstanceUri
                )
                .then(culturalPropertyWithTimeIndexedTypedLocation => {
                    this.setState({
                        culturalPropertyWithTimeIndexedTypedLocation: culturalPropertyWithTimeIndexedTypedLocation
                    });
                });
        }
    }

    render() {
        /* 
           We need to check if env is BROWSER as leaflet require window object to
           work and avoid app crashing in server rendering.
           TimeIndexedTypedLocation pattern imports leaflet
            _______________________________________________________________________
        */
        if (process.env.BROWSER) {
            if (this.state.culturalPropertyWithTimeIndexedTypedLocation) {
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

                const culturalPropertyURI = this.state
                    .culturalPropertyWithTimeIndexedTypedLocation[0]
                    .culturalProperty;

                const locationTypeURI = this.state
                    .culturalPropertyWithTimeIndexedTypedLocation[0]
                    .locationType;

                let titl = this.state
                    .culturalPropertyWithTimeIndexedTypedLocation[0];

                let propertyList = {};
                if (!this.props.hideCulturalProperty) {
                    propertyList['Cultural property:'] = {
                        label: titl.cPropLabel,
                        onClick: () => {
                            getResource(culturalPropertyURI);
                        }
                    };
                }
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
                            flexWrap: 'wrap',
                            margin: 'auto'
                        }}
                    >
                        <div style={childStyle}>
                            <TimeIndexedTypedLocation
                                timeIndexedTypedLocations={
                                    this.state
                                        .culturalPropertyWithTimeIndexedTypedLocation
                                }
                                onObjectClick={() => {
                                    getResource(culturalPropertyURI);
                                }}
                            />
                        </div>
                        {this.props.showImageGrid && (
                            <div style={childStyle}>
                                <ImageGrid resourceURI={culturalPropertyURI} />
                            </div>
                        )}
                        {this.props.showPropertyValueList && (
                            <div
                                style={Object.assign(
                                    { margin: 50 },
                                    childStyle
                                )}
                            >
                                <PropertyValueList properties={propertyList} />
                            </div>
                        )}
                    </div>
                );
            } else {
                return null;
                // <div style={{ textAlign: 'center' }}>
                //     <CustomLoader></CustomLoader>
                // </div>
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
