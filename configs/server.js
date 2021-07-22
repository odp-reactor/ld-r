// require("dotenv").config();

const configGraph =
    process.env.CONFIG_GRAPH || "http://virtuoso.localhost/configurations";


console.log("WebPack build configuration file: config graph", configGraph)

//important: first value in the array is considered as default value for the property
//this file is visible to the server-side
export default {
    serverPort: [4000],
    sparqlEndpoint: {
        generic: {
            host: "localhost",
            port: 8890,
            path: "/sparql",
            endpointType: "virtuoso"
        },
        // default: {
        //     host: "arco.istc.cnr.it",
        //     port: 80,
        //     path: "/visualPatterns/sparql",
        //     endpointType: "virtuoso"
        // },
        // "http://arco.istc.cnr.it/ldr/arco-toy": {
        //     host: "arco.istc.cnr.it",
        //     port: 80,
        //     path: "/visualPatterns/sparql",
        //     endpointType: "virtuoso"
        // },
        [configGraph]: {
            host: process.env.CONFIG_SPARQL_ENDPOINT_HOST || "localhost",
            port: process.env.CONFIG_SPARQL_ENDPOINT_PORT || 8890,
            path: process.env.CONFIG_SPARQL_ENDPOINT_PATH || "/sparql",
            endpointType: process.env.CONFIG_SPARQL_ENDPOINT_TYPE || "virtuoso"
        },
        "http://dpedia.org/sparql": {
            host: "dbpedia.org",
            port: 80,
            path: "/sparql",
            graphName: "default",
            endpointType: "virtuoso"
        },
        "http://dati.beniculturali.it/sparql": {
            host: "dati.beniculturali.it",
            port: 80,
            path: "/sparql",
            graphName: "default",
            endpointType: "virtuoso"
        }
    },
    dbpediaLookupService: [{ host: "lookup.dbpedia.org" }],
    dbpediaSpotlightService: [
        { host: "api.dbpedia-spotlight.org", port: 80, path: "/en/annotate" }
    ],
    //it is used only if you enabled recaptcha feature for user authentication
    //get keys from https://www.google.com/recaptcha
    googleRecaptchaService: {
        siteKey: ["put your google recaptcha site key here..."],
        secretKey: ["put your google recaptcha secret key here..."]
    }
};
