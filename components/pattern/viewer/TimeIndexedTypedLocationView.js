import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import fetchInstanceData from './fetchInstanceData';
import PatternInstanceStore from '../../../stores/PatternInstanceStore';
import ResourceStore from '../../../stores/ResourceStore';
import { navigateAction } from 'fluxible-router';

import CustomLoader from '../../CustomLoader';

import PropertyHeader from '../../property/PropertyHeader';

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
                return (
                    <div>
                        {/* {this.props.ResourceStore.resourceType[0] ===
                        "https://w3id.org/arco/ontology/location/time-indexed-typed-location" ? (
                            <div className="property-title">
                                <div className="ui horizontal list">
                                    <div className="item">
                                        <PropertyHeader
                                            spec={"hasTimeIndexedTypedLocation"}
                                            config={this.props.config}
                                            size="3"
                                            datasetURI={this.props.datasetURI}
                                            resourceURI={this.props.resource}
                                            propertyURI={
                                                "hasTimeIndexedTypedLocation"
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="ui dividing header"></div>
                            </div>
                        ) : null} */}
                        <TimeIndexedTypedLocation
                            timeIndexedTypedLocations={
                                this.props.data.instanceData.tITLocations
                            }
                            onCulturalPropertyClick={getResource}
                        ></TimeIndexedTypedLocation>
                    </div>
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
    [PatternInstanceStore, ResourceStore],
    function(context, props) {
        return {
            data: context.getStore(PatternInstanceStore).getInstanceData(),
            ResourceStore: context.getStore(ResourceStore)
        };
    }
);

export default TimeIndexedTypedLocationView;
