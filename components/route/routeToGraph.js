import { LDRRouter } from './LDRRouter';

/**
 * Route to odp-reactor-graph microservice
 */
export function routeToGraph(sparqlEndpoint, graph) {
    const router = new LDRRouter();
    const route = `${process.env.ODP_REACTOR_GRAPH_HOST}:${
        process.env.ODP_REACTOR_GRAPH_PORT
    }/endpoints/${encodeURIComponent(
        sparqlEndpoint
    )}/graphs/${encodeURIComponent(graph)}`;
    router.navigateTo(route);
}
