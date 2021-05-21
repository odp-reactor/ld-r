import { LDRRouter } from './LDRRouter'

export function routeToResource(dataset, resource) {
    const router = new LDRRouter()
    const route = `${process.env.HOST}:${
        process.env.PORT
    }/endpoints/${encodeURIComponent(
        dataset
    )}/graphs/${encodeURIComponent(resource)}`;
    router.navigateTo(route)
}