Geocoder = require('./Geocoder');
Address = require('./Address');
NodeGeocoder = require('node-geocoder');

geocoderService = NodeGeocoder({
    provider: 'openstreetmap'
});

geocoderService;

let geocoder = new Geocoder();

const address_0 = new Address({
    q: 'paris france louvre'
});
const address_1 = new Address({ q: 'london oxford street', city: 'london' });
const address_2 = new Address({ q: 'new york ', city: 'new york' });

coordinates = [];
geocoder
    .resolveCoordinates([address_0, address_1, address_2])
    .then(results => console.log(results));
