import Fluxible from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';
import authPlugin from './plugins/authentication';
import Application from './components/Application';
import RouteStore from './stores/RouteStore';
import ApplicationStore from './stores/ApplicationStore';
import DatasetStore from './stores/DatasetStore';
import UserStore from './stores/UserStore';
import ResourceStore from './stores/ResourceStore';
import IndividualObjectStore from './stores/IndividualObjectStore';
import DBpediaStore from './stores/DBpediaStore';
import DBpediaGMapStore from './stores/DBpediaGMapStore';
import FacetedBrowserStore from './stores/FacetedBrowserStore';
import DatasetsStore from './stores/DatasetsStore';
import DatasetAnnotationStore from './stores/DatasetAnnotationStore';
import QueryImportStore from './stores/QueryImportStore';
import ImportStore from './stores/ImportStore';
import PatternStore from './stores/PatternStore';
import PatternInstanceStore from './stores/PatternInstanceStore';

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';

let app = new Fluxible({
    component: Application,
    stores: [
        RouteStore,
        ApplicationStore,
        DatasetsStore,
        DatasetStore,
        UserStore,
        ResourceStore,
        IndividualObjectStore,
        DBpediaStore,
        DBpediaGMapStore,
        FacetedBrowserStore,
        DatasetAnnotationStore,
        QueryImportStore,
        ImportStore,
        PatternStore,
        PatternInstanceStore
    ]
});

app.plug(
    fetchrPlugin({
        xhrPath: `${PUBLIC_URL}/api` // Path for XHR to be served from
    })
);
app.plug(authPlugin({}));

export default app;
