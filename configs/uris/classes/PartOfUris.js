export default class PartOfUris {
    /**
     * @param {Object} uris a JSON object with PartOf Pattern URI as keys
     * @param {string} uris.isPartOf
     * @param {string} uris.hasPart
     */
    constructor(uris) {
        this.isPartOf = uris.isPartOf;
        this.hasPart = uris.hasPart;
    }
}
