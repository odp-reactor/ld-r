import { LDRRouter } from './LDRRouter';

export function routeToAddDataset() {
    const ldrRouter = new LDRRouter()
    ldrRouter.navigateTo(`${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : ''}/adddataset`)
} 