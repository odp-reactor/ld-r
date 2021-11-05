import loadDatasets from "../actions/loadDatasets";
import loadDataset from "../actions/loadDataset";
import loadResource from "../actions/loadResource";
import loadUsersList from "../actions/loadUsersList";
import loadFacets from "../actions/loadFacets";
import loadEnvStates from "../actions/loadEnvStates";
import getLoadEnvState from "../actions/getLoadEnvState";
import {
    appFullTitle,
    appShortTitle,
    authDatasetURI,
    baseResourceDomain
} from "../configs/general";

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "";

export default {
    home: {
        path: `${PUBLIC_URL}/`,
        method: "get",
        handler: require("../components/Home"),
        label: appShortTitle,
        action: (context, payload, done) => {
            context.dispatch("UPDATE_PAGE_TITLE", {
                pageTitle: appFullTitle + " | Home"
            });
            done();
        }
    },
    about: {
        path: `${PUBLIC_URL}/about`,
        method: "get",
        handler: require("../components/About"),
        label: "About",
        action: (context, payload, done) => {
            context.dispatch("UPDATE_PAGE_TITLE", {
                pageTitle: appFullTitle + " | About"
            });
            done();
        }
    },
    importCSV: {
        path: `${PUBLIC_URL}/importCSV`,
        method: "get",
        handler: require("../components/import/CSVImport"),
        label: "CSVImport",
        action: (context, payload, done) => {
            context.dispatch("UPDATE_PAGE_TITLE", {
                pageTitle: appFullTitle + " | Import CSV files"
            });
            done();
        }
    },
    newDataset: {
        path: `${PUBLIC_URL}/newDataset`,
        method: "get",
        handler: require("../components/NewDataset"),
        label: "NewDataset",
        action: (context, payload, done) => {
            context.dispatch("UPDATE_PAGE_TITLE", {
                pageTitle: appFullTitle + " | Add a new dataset"
            });
            done();
        }
    },
    annotateDataset: {
        path: `${PUBLIC_URL}/annotateDataset`,
        method: "get",
        handler: require("../components/DatasetAnnotation"),
        label: "DatasetAnnotation",
        action: (context, payload, done) => {
            context.executeAction(
                loadDatasets,
                { pageTitle: "Annotate a dataset" },
                done
            );
        }
    },
    wysiwyq: {
        path: `${PUBLIC_URL}/wysiwyq`,
        method: "get",
        handler: require("../components/WYSIWYQ"),
        label: "ImportQuery",
        action: (context, payload, done) => {
            context.executeAction(
                loadEnvStates,
                { pageTitle: "Import a Query | WYSIWYQ mode" },
                done
            );
        }
    },
    facets: {
        path: `${PUBLIC_URL}/browse/:id?/:stateURI?`,
        method: "get",
        handler: require("../components/dataset/FacetedBrowser"),
        label: "Faceted Browser",
        action: (context, payload, done) => {
            let datasetURI, page, stateURI;
            datasetURI = payload.params.id;
            stateURI = payload.params.stateURI;
            if (!datasetURI) {
                datasetURI = 0;
            }
            if (!stateURI) {
                //only init if no state is given
                stateURI = 0;
                context.executeAction(
                    loadFacets,
                    {
                        mode: "init",
                        id: decodeURIComponent(datasetURI),
                        stateURI: stateURI,
                        selection: 0,
                        page: 1
                    },
                    done
                );
            } else {
                //get && load the given state
                context.executeAction(
                    getLoadEnvState,
                    {
                        mode: "init",
                        id: decodeURIComponent(datasetURI),
                        stateURI: stateURI,
                        selection: 0,
                        page: 1
                    },
                    done
                );
            }
        }
    },
    datasets: {
        //if no id is provided -> will start by defaultDatasetURI in reactor.config
        path: `${PUBLIC_URL}/datasets`,
        method: "get",
        handler: require("../components/DatasetsConfigurationPage"),
        label: "Datasets",
    },
    updateDataset : {
        path: `${PUBLIC_URL}/updatedataset/:datasetId`,
        method: "get",
        handler: require("../components/UpdateDatasetPage"),
        label: "Update Dataset",
    },
    newDataset: {
        path: `${PUBLIC_URL}/adddataset`,
        method: "get",
        handler: require("../components/AddDatasetPage"),
        label: "Add Dataset",
    },
    queries: {
        //if no id is provided -> will start by defaultDatasetURI in reactor.config
        path: `${PUBLIC_URL}/queries`,
        method: "get",
        handler: require("../components/QueryConfigurationPage"),
        label: "Queries",
    },
    newQuery: {
        path: `${PUBLIC_URL}/addquery`,
        method: "get",
        handler: require("../components/AddQueryPage"),
        label: "Add Query",
    },
    updateQuery: {
        path: `${PUBLIC_URL}/updatequery/:queryId`,
        method: "get",
        handler: require("../components/UpdateQueryPage"),
        label: "Update Query",
    },
    dataset: {
        //if no id is provided -> will start by defaultDatasetURI in reactor.config
        path: `${PUBLIC_URL}/dataset/:page?/:id?`,
        method: "get",
        handler: require("../components/reactors/DatasetReactor"),
        label: "Dataset",
        action: (context, payload, done) => {
            let datasetURI, page;
            datasetURI = decodeURIComponent(payload.params.id);
            if (!datasetURI) {
                datasetURI = 0;
            }
            page = payload.params.page;
            if (!page) {
                page = 1;
            }
            //do not allow to browse user graph
            if (datasetURI === authDatasetURI[0]) {
                datasetURI = 0;
            }
            context.executeAction(
                loadDataset,
                { id: datasetURI, page: page },
                done
            );
        }
    },
    resource: {
        path: `${PUBLIC_URL}/dataset/:did/:resource/:rid/:pcategory?/:propertyPath?`,
        method: "get",
        handler: require("../components/reactors/ResourceReactor"),
        label: "Resource",
        action: (context, payload, done) => {
            //predicate Category
            let category = payload.params.pcategory;
            if (!category) {
                category = 0;
            }
            let propertyPath = payload.params.propertyPath;
            if (!propertyPath) {
                propertyPath = [];
            }
            let datasetURI = payload.params.did;
            if (!datasetURI) {
                datasetURI = 0;
            }
            context.executeAction(
                loadResource,
                {
                    dataset: datasetURI,
                    resource: payload.params.rid,
                    category: category,
                    propertyPath: propertyPath
                },
                done
            );
        }
    },
    resourcePatterns: {
        path: `${PUBLIC_URL}/patterns/dataset/:did/:resource/:rid/:patternIds`,
        method: "get",
        handler: require("../components/reactors/ResourceReactor"),
        label: "ResourcePatterns",
        action: (context, payload, done) => {
            console.log(
                "resourcePatternsRoute patternIds: ",
                payload.params.patternIds
            );
            //predicate Category
            let category = payload.params.pcategory;
            if (!category) {
                category = 0;
            }
            let propertyPath = payload.params.propertyPath;
            if (!propertyPath) {
                propertyPath = [];
            }
            let datasetURI = payload.params.did;
            if (!datasetURI) {
                datasetURI = 0;
            }
            context.executeAction(
                loadResource,
                {
                    dataset: datasetURI,
                    resource: payload.params.rid,
                    category: category,
                    propertyPath: propertyPath
                },
                done
            );
        }
    },
    user: {
        path: `${PUBLIC_URL}/user/:id`,
        method: "get",
        handler: require("../components/reactors/ResourceReactor"),
        label: "User",
        action: (context, payload, done) => {
            let category = 0;
            context.executeAction(
                loadResource,
                {
                    dataset: authDatasetURI[0],
                    resource:
                        baseResourceDomain +
                        "/user/" +
                        decodeURIComponent(payload.params.id),
                    category: category
                },
                done
            );
        }
    },
    users: {
        path: `${PUBLIC_URL}/users`,
        method: "get",
        handler: require("../components/admin/UsersList"),
        label: "Users List",
        action: (context, payload, done) => {
            context.executeAction(loadUsersList, {}, done);
        }
    },
    errortest: {
        path: `${PUBLIC_URL}/errortest`,
        method: "get",
        handler: require("../components/ErrorTest"),
        label: "Error Test"
    }
};
