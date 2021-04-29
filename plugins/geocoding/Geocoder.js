const NodeGeocoder = require('node-geocoder');

Coordinates = require('./Coordinates');

class Geocoder {
    constructor() {
        /**
         * @type NodeGeocoder
         * Here we instantiate our geocoder service.
         * We're using openstreetmap geocoder: https://nominatim.org/release-docs/latest/
         * You may choose a different one from this list: https://github.com/nchaulet/node-geocoder#geocoder-providers-in-alphabetical-order
         */
        this.geocoderService = NodeGeocoder({
            provider: 'openstreetmap'
        });
    }

    /**
     * Returns a cluster of promises returning, once resolved, an array of Coordinates {@link Coordinates}
     * for the input addresses
     *
     * @param {Address[]} addresses an ordered list of addresses to resolve
     * @returns {Coordinates[]} an ordered list of coordinates
     */
    resolveCoordinates(addresses) {
        let addressQueryPromises = [];
        let coordinates = [];
        // for every address query we create a promise of resolution by the geocoder service
        addresses.forEach(address => {
            addressQueryPromises.push(
                this.geocoderService.geocode(address.toJson())
            );
        });
        // we then geocode the cluster of addresses and clean them
        return Promise.all(addressQueryPromises).then(geocodedAddresses => {
            geocodedAddresses.forEach(geocodedAddress => {
                coordinates.push(new Coordinates(geocodedAddress[0])); // attention geocoding service returns an array of results
            });
            return coordinates;
        });
    }
}

module.exports = Geocoder;
