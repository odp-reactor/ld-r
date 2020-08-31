add here custom reactors for resources

then in ../reactors/ResourceReactor.js
add the switch to enable your custom reactor


todo: as every resource view (UserResource, PersonResource ...) has the same store: ResourceStore
      you need only to understand how data are collected by loadResource service and put in store state
      create a custom VIEW (analyze UserResource) to render those data

loadResource ACTION trigger FLUX data flow

###

1) loadResource action calls resource services [ context.service.read('resource.properties')]
)  Service returns params calling callback, and Action receive them in the payload variable ( service.params == action.payload)
2) loadResource action dispatch LOAD_RESOURCE_SUCCESS if success on loading data
3) ResourceStore listen to LOAD_RESOURCE_SUCCESS and CLEAN_RESOURCE_SUCCESS
4) ResourceStore updates and emits change on these events
5) ResourceReactor component has Resource component state in ResourceStore
6) ResourceReactor using HOC pattern passes state to Resource through props
7) ResourceReactor component renders Resource component

opt) in server.js app has a service registered with fetchrPlugin.registerService(require('./services/resource'));


# analysis for Resource component

<Resource>

### props   // all the props are in the store of the ResourceReactor hoc

enableAuthentication={enableAuthentication}

in ResourceReactor, if TimeIndexed , if data missing , get missing data

missingData={}
datasetURI={ResourceReactor.props.ResourceStore.DatasetURI}
properties={ResourceRecator.props.ResourceStore.properties}
resource={ResourceReactor.props.ResourceStore.resourceURI}
resourceType={ResourceReactor.props.ResourceStore.resourceType}
title={ResourceReactor.props.ResourceStore.title}
currentCategory={ResourceReactor.props.ResourceStore.currentCategory;}
propertyPath={ResourceReactor.props.ResourceStore.propertyPath}

config={this.configMinus( ResourceReactor.props.ResourceStore.config, ['resourceReactor'])}
//return a new config with all the configuration from the store except for config['resourceReactor']


error={error}

### methods

render


### attributes

contextTypes {
    executeAction
    getUser
}
