console.log('Process');
console.log(process.env.CONFIG_GRAPH);

const configGraph = process.env.CONFIG_GRAPH;
// || "noworking";

export class ServerConfigQueryBuilder {
    constructor() {}

    getConfigByDatasetId(datasetId) {
        return `
                PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#>

                SELECT ?protocol ?host ?port ?path ?endpointType ?graph WHERE {

                    GRAPH <${configGraph}> {
              
                      ?serverConfig a ldr:ServerConfig ;
                      ldr:dataset <${datasetId}> ;
                      ldr:host ?host ;
                      ldr:port ?port ;
                      ldr:path ?path ;
                      ldr:protocol ?protocol ;
                      ldr:endpointType ?endpointType ;
                      ldr:graphName ?graph .              
                   } 
              }
                `;
    }
}
