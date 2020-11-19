# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a
   build.
2. Update the README.md with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.

# Embed you're pattern component

The force of linked data application emerge when you can visualize highly structured data at a glance, and to do that you need semantically aware visual components.

This application is open to embed you're visualizations.

Here are simple steps with an example. Suppose we want to add a view for data structured as collection of elements.

There are fundamentally three passage to perform:

1. Add an entry for a new visualization in the `Pattern` component (path: `(root)/components/pattern/Pattern.js`).
2. Add a configuration for the new pattern component in pattern configuration file (path: `(root)/configs/pattern.js`).
3. Create a visualization component for the data structured as collection of elements. Let's call it `CollectionView`. (path: `(root)/compoennts/pattern/viewer/CollectionView.js`)

The `Pattern` component will be used whenever a pattern instance will be loaded by the application.

In our example we assume we have an instance of pattern collection expressed by this triple:

```js
ex:collection_instace opla:isPatternInstanceOf ex:collection_pattern .
```

When `Pattern` is rendered it will call `patternReactor()`. This function will check in the pattern configuration file and if it find a visualization for the loaded pattern (`ex:collection_pattern`) it will rendered it's instance (`ex:collection_instance`) with the view specified in the configuration file (`CollectionView`).

In our case we will add an entry for `CollectionView` in the `patternReactor()` function. Add a configuration file for the pattern `ex:collection`. And then create a `CollectionView` component that will be rendered whenever a resource `ex:collection_instance` is loaded.

1. To add a new entry to `Pattern` component you will do:

```js
// at the top of the file
// import my new visualization
import CollectionView from './viewer/CollectionView';

//inside patternReactor
patternReactor() {

   ...

         case 'CollectionView':
                return (
                    <CollectionView                            // this are props. The React mechanism to
                                                               // pass data from parent to children
                        pattern={patternURI}                   // pattern type URI
                        dataset={this.props.datasetURI}        // dataset URI
                        instanceResources={instanceResources}  // nodes belonging to instance result set of (?node
                                                               // opla:belongsToPatternInstance ex:some_collection_instance)
                    />
                );
...
```

Then in the config file we will say whenever `ex:collection_instance` is the loaded resource display it with `CollectionView`. To be more specific whenever a resource with the triple `ex:some_collection_instance opla:belongsToPatternInstance ex:collection_pattern` is loaded , that resource will be displayed with `CollectionView`.

Here is the config file in `(root)/configs/pattern.js`:

```js

         // uri of the pattern type
        "ex:collection_pattern": {
            // view to visualize instance of this type
            patternIViewer: "CollectionView",
            // query to retrieve all the data the instance is composed by
            query: {
                select: `SELECT DISTINCT ?entity ?entityLabel ?depiction WHERE`,
                body: `?Collection ex:hasMember ?entity .
                       OPTIONAL { ?Collection rdfs:label ?collectionLabel .}.
                       OPTIONAL { ?entity RDFS:LABEL ?entityLabel2B .}.
                       OPTIONAL { ?entity FOAF:DEPICTION ?depiction2B .}.
                       BIND ( IF (BOUND ( ?entityLabel2B ), ?entityLabel2B, "" )  as ?entityLabel )
                       BIND ( IF (BOUND ( ?depiction2B ),   ?depiction2B,   "" )  as ?depiction   )
                       `,
                aggregates: undefined // LIMIT 1|GROUP BY ... default: undefined
            },
            // the keys to replace in the query the uppercased variable with the instance nodes of the type specified by the key
            arguments: ["Collection"],
            // state variable. You will receive the data of the query inside you're component under:
            // this.props.data.instanceData.collection
            // if you have stateKey: "anotherKey"
            // you will receive them in this.props.data.instanceData.anotherKey
            stateKey: "collection"

```

Now you can ask yourself: how to write a query generic to every instance? Or better, how to bind my instance to the query, to be sure that data belonging to that instance will be loaded?
This mechanism is thought for a knowledge base where we have data modelled according to opla vocabulary, and there are two requirements:

-   all the pattern instance are annotated with : `pattern_instance opla:isPatternInstanceOf pattern` (we see this above)
-   all the nodes belonging to an instance (or `instanceResources`) are annotated with: `node_x opla:belongsToPatternInstance pattern_instance`

Now what happens is that. `Pattern` component will always queries the SPARQL endpoint for all the nodes belonging to an instance and pass them down to its child, in this case `CollectionView`. We've already seen how (in `patternReactor` method):

```javascript
<CollectionView ... instanceResources={instanceResources}> // <===
<CollectionView>
```

Here you may ask: if I already have instanceResources|instanceData|instanceNodes (call them as you like), why to query again the SPARQL endpoint? opla vocabulary is expressive enough to include this information but you're KG probably won't be annotated. I mean you have all the nodes belonging to an instance but you don't have arcs. **TODO: add support for fully opla annotated Knowledge Graph, this will remove the need of a custom query for every pattern simplifying the user/dev job .**
What we are doing here is binding one or more of this nodes to the query and query again to receive them back in a format semantically feasible for our visualization, complete of all property and relations. The mechanism to bind them is: replace the uppercase node-type-labelled variable (`?Collection`) with the node of type `Collection`. You can include more uppercase variable in the query but, pay attention, be sure you're _variableByType_ will identify a resource of the pattern without be ambiguous. If in you're pattern there are two resources of the same type with different roles you cannot use this mechanism. Or you can use that for only one of them.

Now we have all, let's return to our configuration file.

```javascript

      body: `?Collection ex:hasMember ?entity .
            OPTIONAL { ?Collection rdfs:label ?collectionLabel .}.
      ...,
      arguments: ["Collection"]

```

The variable `?Collection` in the query will be replaced by the instance resource of type specified in `arguments`. So with the instance resource uri of type `"Collection"` (namespace will be stripped).

This two query row will be transformed in:

```javascript

ex:collection_node_1 ex:hasMember  ?entity .
            OPTIONAL { ex:collection_node_1 rdfs:label ?collectionLabel .}.

```

This is fundamentally a way to bind a node of the instance to our query such that we can retrieve all the data belonging to that instance when we don't have the KG pattern instances annotated with arcs (you will need a statement reification for that) .

In the end you will find your component `CollectionView` rendered and receiving results from that query. Where does it receive the results? It depends on `stateKey` specified in the config.

```javascript
   stateKey: "collection",
```

In you're `CollectionView` you may access data in `this.props.state.data.instanceData.{collection}`.

As we are in [fluxible](https://fluxible.io/) environment your component will get data from a store (centralized state management). The store for every pattern instance is `PatternInstanceStore`. Connect the `CollectionView` component to the store with following lines:

```javascript
// import objects needed to connect to store
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
// import store
import PatternInstanceStore from '../../../stores/PatternInstanceStore';

...


CollectionView.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};

// connect to stores (see the plural, you can connect to multiple stores)
CollectionView = connectToStores(
    CollectionView,
    [PatternInstanceStore],
    // this function say call the PatternInstanceStore getInstanceData method
    // and put the result in this.props.data
    // All the data received from a store will be in this.props
    function(context, props) {
        return {
            data: context.getStore(PatternInstanceStore).getInstanceData()
        };
    }
);

```

In the end you can get the view for the collection data in a separate package, such as [LD-UI-React](https://github.com/Christian-Nja/ld-ui-react) and reuse that component to show you're data. This package provide useful reusable visualization components for linked data structured as patterns. This visualization are semantically designed to represent the underlying data structure.

Inside `CollectionView`:

```javascript
        let collection = this.props.data.instanceData.collection;

        // import Collection component from ld-ui-react package
        const Collection = require('ld-ui-react').Collection;

        if (collection) {
            return (
                <Collection
                    entities={collection}
                    class={customClasses}
                ></Collection>
            );

```
