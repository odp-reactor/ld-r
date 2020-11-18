export default class TimeIndexedTypedLocationUris {
    /**
     * @param {Object} uris a JSON object with TimeIndexedTypedLocation Pattern URI has keys
     * @param {string} uris.hasTimeIndexedTypedLocation
     * @param {string} uris.hasLocationType
     * @param {string} uris.atTime
     * @param {string} uris.atSite
     * @param {string} uris.hasGeometry
     * @param {string} uris.siteAddress
     * @param {string} uris.hasCity
     * @param {string} uris.lat
     * @param {string} uris.long
     * @param {string} uris.startTime
     * @param {string} uris.endTime
     */
    constructor(uris) {
        this.hasTimeIndexedTypedLocation = uris.hasTimeIndexedTypedLocation;
        this.hasLocationType = uris.hasLocationType;
        this.atTime = uris.atTime;
        this.atSite = uris.atSite;
        this.hasGeometry = uris.hasGeometry;
        this.siteAddress = uris.siteAddress;
        this.hasCity = uris.hasCity;
        this.lat = uris.lat;
        this.long = uris.long;
        this.startTime = uris.startTime;
        this.endTime = uris.endTime;
    }
}
