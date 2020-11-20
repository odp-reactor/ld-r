import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import fetchInstanceData from './fetchInstanceData';
import PatternInstanceStore from '../../../stores/PatternInstanceStore';

import CustomLoader from '../../CustomLoader';

//import { Geocoder, Address } from "@christian-nja/geocoding";

/**
 * @description This component is a model for the corresponding view provided by the ld-ui-react package.
 *
 * It loads data to pass to the visualization.
 * It can takes care to check browser environment.
 * It defines a visualization logic: if no minimum required data are present shift to more generic views
 *     (Example: no coordinates? Try to geocode them. No result show simpler visualization)
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
        this.state = {
            lat: undefined,
            long: undefined
        };
    }

    componentDidMount() {
        fetchInstanceData(this.props, this.context);
    }

    componentDidUpdate() {
        // check if lat long are presents or try to geocode them
        if (this.props.data.instanceData.tITLocations) {
            // this if we already geocode them
            if (!this.state.lat || !this.state.long) {
                // this in the instance data
                const lat =
                    this.props.data.instanceData.tITLocations[0].lat !== ''
                        ? this.props.data.instanceData.tITLocations[0].lat
                        : null;
                const long =
                    this.props.data.instanceData.tITLocations[0].long !== ''
                        ? this.props.data.instanceData.tITLocations[0].long
                        : null;

                if (!lat || !long) {
                    console.log('HERE');

                    // address label may be something like "FI, firenze"
                    const addressLabel = this.props.data.instanceData
                        .tITLocations[0].addressLabel;
                    console.log('addr label');
                    console.log(this.props);
                    console.log(addressLabel);

                    if (addressLabel) {
                        console.log(addressLabel);
                        const Geocoder = require('@christian-nja/geocoding')
                            .Geocoder;
                        const Address = require('@christian-nja/geocoding')
                            .Address;
                        const geocoder = new Geocoder();
                        const address = new Address({ q: addressLabel });
                        geocoder
                            .resolveCoordinates([address])
                            .then(results => {
                                console.log('Resolved coordinates ...');
                                console.log(results);
                                this.setState({
                                    lat: results[0].latitude,
                                    long: results[0].longitude
                                });
                            })
                            .catch(error => {
                                console.log(`promise ${error}`);
                            });
                    }
                }
            }
        }
    }

    render() {
        /* 
           We need to check if env is BROWSER as leaflet require window object to
           work and avoid app crashing in server rendering.
           TimeIndexedTypedLocation pattern imports leaflet
            _______________________________________________________________________
        */
        console.log(this.state);
        // if (process.env.BROWSER) {
        //     if (this.props.data.instanceData.tITLocations) {
        //         let TimeIndexedTypedLocation = require('ld-ui-react/lib/client-side')
        //             .TimeIndexedTypedLocation;
        //         return (
        //             <TimeIndexedTypedLocation
        //                 timeIndexedTypedLocations={this.props.titLocations}
        //             ></TimeIndexedTypedLocation>
        //         );
        //     } else {
        return (
            <div style={{ textAlign: 'center' }}>
                <CustomLoader></CustomLoader>
            </div>
        );
    }
}
//     }
// }

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
