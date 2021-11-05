import { LDRRouter } from './LDRRouter'

export function routeToResource(dataset, resource) {
    const router = new LDRRouter()
    const host = process.env.HOST
    const port = process.env.PORT
    const protocol = port === '443' ? 'https' : 'http'
    const route = `${protocol}://${host}:${
        port
    }/dataset/${encodeURIComponent(
        dataset
    )}/resource/${encodeURIComponent(resource)}`;
    router.navigateTo(route)
}