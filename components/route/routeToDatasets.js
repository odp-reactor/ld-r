import { LDRRouter } from './LDRRouter';

export function routeToDatasets() {
    const ldrRouter = new LDRRouter()
    ldrRouter.navigateTo(`${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : ''}/datasets`)
}