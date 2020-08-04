/**
 * Address according to nominatim
 * specification for geocoding services.
 *
 * You can pass this object to a openstreetmap NodeGeocoder {@link NodeGeocoder}
 *
 * Learn more about params at: https://nominatim.org/release-docs/latest/api/Search/
 */
class Address {
    /**
     * Creates a Address
     *
     * @param {Object} address an address
     * @param {string} address.q a raw address string, example : london oxford street 50
     * @param {string} address.street
     * @param {string} address.city
     * @param {string} address.county
     * @param {string} address.state
     * @param {string} address.country
     * @param {string} address.postalcode
     * @param {string} address.acceptLanguage language result of resolution to geocoding
     */
    constructor(
        address = {
            q,
            street,
            city,
            county,
            state,
            country,
            postalcode,
            acceptLanguage
        }
    ) {
        this.q = address.q;
        this.street = address.street;
        this.city = address.city;
        this.county = address.county;
        this.state = address.state;
        this.country = address.country;
        this.postalcode = address.postalcode;
        this.acceptLanguage = address.acceptLanguage;
    }

    /**
     * @returns {Object} this.address as a json object
     */
    toJson() {
        return JSON.stringify(this);
    }
}

module.exports = Address;
