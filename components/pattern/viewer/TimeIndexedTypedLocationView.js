import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import PatternInstanceStore from '../../../stores/PatternInstanceStore';
import ResourceStore from '../../../stores/ResourceStore';
import { navigateAction } from 'fluxible-router';
import { cloneDeep } from 'lodash';
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
            titls: null
        };
    }

    componentDidMount() {
        const fetchData = async () => {
            const titls = await this.patternService.findCulturalPropertyWithTimeIndexedTypedLocationByUris(
                this.props.patternInstancesUri
            );
            this.setState({
                titls: titls
            });
        };
        fetchData();
    }

    render() {
        /* 
           We need to check if env is BROWSER as leaflet require window object to
           work and avoid app crashing in server rendering.
           TimeIndexedTypedLocation pattern imports leaflet
            _______________________________________________________________________
        */
        if (process.env.BROWSER) {
            const { titls } = cloneDeep(this.state);
            if (titls && titls.length > 0) {
                console.log('BUG:', titls);
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

                const culturalPropertyURI = titls[0]
                    ? titls[0].culturalProperty
                    : '';

                let propertyList = {};
                if (!this.props.hideCulturalProperty) {
                    propertyList['Cultural property :'] = {
                        label: titls[0].cPropLabel,
                        onClick: () => {
                            getResource(culturalPropertyURI);
                        }
                    };
                }
                titls.map((titl, index) => {
                    let number = titls > 1 ? index + 1 : '';
                    if (titl.addressLabel && titl.addressLabel !== '') {
                        propertyList[`Address ${number}:`] = {
                            label: titl.addressLabel
                        };
                    }
                    if (titl.locationType && titl.locationType !== '') {
                        propertyList[`Location Type ${number}:`] = {
                            label: titl.locationTypeLabel,
                            onClick: () => {
                                getResource(titl.locationType);
                            }
                        };
                    }
                    if (titl.long && titl.long !== '') {
                        propertyList[`Longitude ${number}:`] = {
                            label: titl.long
                        };
                    }
                    if (titl.lat && titl.lat !== '') {
                        propertyList[`Latitude ${number}:`] = {
                            label: titl.lat
                        };
                    }
                    if (titl.startTime && titl.startTime !== '')
                        propertyList[`Start Time ${number}:`] = {
                            label: titl.startTime
                        };
                    if (titl.endTime && titl.endTime !== '') {
                        propertyList[`End Time ${number}:`] = {
                            label: titl.endTime
                        };
                    }
                });
                console.log(titls);
                try {
                    titls.sort((a, b) => {
                        if (a.locationTypeLabel.includes('precedente')) {
                            return -1;
                        }
                        if (a.locationTypeLabel.includes('attuale')) {
                            return 1;
                        }
                        return 0;
                    });
                } catch (e) {
                    console.log('Error sorting values');
                }
                console.log('TITLS TO BE SORT:', titls);

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
                                timeIndexedTypedLocations={titls}
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
