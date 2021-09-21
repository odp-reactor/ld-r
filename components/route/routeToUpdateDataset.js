import { LDRRouter } from './LDRRouter';

export function routeToUpdateDataset(datasetId) {
    const ldrRouter = new LDRRouter()
    ldrRouter.navigateTo(`${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : ''}/updatedataset/${datasetId}`)
}