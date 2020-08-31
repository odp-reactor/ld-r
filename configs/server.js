//important: first value in the array is considered as default value for the property
//this file is visible to the server-side
export default {
    serverPort: [4000],
    sparqlEndpoint: {
        'generic': {
            host: 'localhost', port: 8890, path: '/sparql', endpointType: 'virtuoso'
        },
	'http://virtuoso.local/configurations': {
	    host: 'arco.istc.cnr.it', port: 80, path: '/ldr/sparql', endpointType: 'virtuoso'
	},
	'http://dpedia.org/sparql': {
            host: 'dbpedia.org', port: 80, path: '/sparql', graphName: 'default', endpointType: 'virtuoso'
	},
	'http://dati.beniculturali.it/sparql': {
	    host: 'dati.beniculturali.it', port: 80, path: '/sparql', graphName: 'default', endpointType: 'virtuoso'
	},
    },
    dbpediaLookupService: [
        { host: 'lookup.dbpedia.org' }
    ],
    dbpediaSpotlightService: [
        { host: 'api.dbpedia-spotlight.org', port: 80, path: '/en/annotate' }
    ],
    //it is used only if you enabled recaptcha feature for user authentication
    //get keys from https://www.google.com/recaptcha
    googleRecaptchaService: {
        siteKey: ['put your google recaptcha site key here...'],
        secretKey: ['put your google recaptcha secret key here...']
    }
};
