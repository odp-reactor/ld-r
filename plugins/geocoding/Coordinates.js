class Coordinates {
    /**
     * Creates a coordinates object
     *
     * @param {Object} coordinates an object with coordinates attributes
     */
    constructor(coordinates = {}) {
        this.latitude = coordinates.latitude;
        this.longitude = coordinates.longitude;
    }
}

module.exports = Coordinates;
