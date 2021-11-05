import { LDRRouter } from './LDRRouter';

export function routeToUpdateQuery(queryId) {
    const ldrRouter = new LDRRouter()
    ldrRouter.navigateTo(`${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : ''}/updatequery/${queryId}`)
} 