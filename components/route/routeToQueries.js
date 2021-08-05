import { LDRRouter } from './LDRRouter';

export function routeToQueries() {
    const ldrRouter = new LDRRouter()
    ldrRouter.navigateTo(`${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : ''}/queries`)
} 