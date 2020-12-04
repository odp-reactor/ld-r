export default class CollectionUris {
    /**
     * @param {Object} uris a JSON object with Collection Pattern URI has keys
     * @param {string} uris.hasCollection
     * @param {string} uris.hasMember
     * @param {string} uris.hasMemberType
     */
    constructor(uris) {
        this.hasCollection = uris.hasCollection;
        this.hasMember = uris.hasMember;
        this.hasMemberType = uris.hasMemberType;
        this.hasValue = uris.hasValue;
    }
}
