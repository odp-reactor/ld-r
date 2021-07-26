import { LDRRouter } from './LDRRouter';

/**
 * Route to odp-reactor-graph microservice
 */
export function routeToGraph(sparqlEndpoint, graph) {
    const router = new LDRRouter();
    const host = process.env.ODP_REACTOR_GRAPH_HOST
    const port = process.env.ODP_REACTOR_GRAPH_PORT
    const protocol = port === '443' ? 'https' : 'http'
    const route = `${protocol}://${host}:${
        port
    }/endpoints/${encodeURIComponent(
        sparqlEndpoint
    )}/graphs/${encodeURIComponent(graph)}`;
    router.navigateTo(route);
}
