# Insert a new Pattern and a new Visual Frame

LD-R maps components to resource IRIs.

In this system when LD-R detects the triple `?pattern opla:isPatternInstanceOf ?patternInstanceUri`
it tries to map `?patternInstanceUri` to a common visual frame for `?pattern` feeding the visual frame
with instance data.

How this happen:

[`<Pattern>`](https://github.com/ODPReactor/ld-r/blob/master/components/pattern/Pattern.js) component is rendered.

This component its responsible for choosing which visual frame to render. It delegates [`VisualFrameRepository`] to find the React visual frame component corresponding to the uri and renders it. At the moment `VisualFrameRepository`
reads the map in a `VisualFrameMap` file (js file with React dependency). This 
is an entry example:

```js
"https://w3id.org/arco/ontology/denotative-description/measurement-collection" : <CollectionVisualFrame
      showResourceTitle={true}
      styles={{
          depiction: {
              maxHeight: 500
          }
      }}
  />,
```

At the moment there's a direct mapping from a resource uri to a react component. It may be clearer to change this to a string to the file containing the React component. `VisualFrameRepository` (after a little change to implementation of `findVisualFrameForPattern(patternURI)`) can read this from a text file or a .env file or db (if you want to change it dynamically). These will abstract away js mapping file and the need to touch core code. Example:

`.env.visualframes` file:

```
https://w3id.org/arco/ontology/denotative-description/measurement-collection=./plugins/visualframes/MyCollectionVisualFrame.js
```

Thus you may have a folder `/plugins/visualframes/` where anyone can add a new visual frame `MyCollectionVisualFrame.js` without touching codebase but creating a new file and add an entry to a js agnostic visual frame mapping file.

An example of Visual Frame file can be found [here](link to visual frame file).

This component has basically two dependency. `PatternRepository` and [`linked-data-ui`](https://odpreactor.github.io/linked-data-ui/).

Our `MyCollectionVisualFrame.js` encapsulates the logic to retrieve data, modify them, add decorating components ... etc. The "pure view" for linked data is developed in a separate package that can be reused and redistributed for other linked data projects. With documentation, public components api, and an example application. You can do everything in `ld-r` but it would be better for maintainability, testing and distribution to keep things separated. Especially for dependency managing. Visual Frame may require complex logic and heavy dependency it would be better do decouple totally them from ld-r module that is a legacy monolithic isomorphic application without any test. Here is a primitive [example of webpage](https://odpreactor.github.io/linked-data-ui/) showing visual frames for patterns. In this page you can add public component api and documentation for visual frames. 
Another point is: as the package is open source we may try to collect visual frames for ontology patterns by other experts working in the community, thus enriching the number of frames available and people involved. PR, fork etc.
Explore `linked-data-ui` for guide on developping new visual frames.

Let's go back to `PatternRepository`. This class interacts with the persistence layer to get back data for patterns to feed visual frames.

Add the moment you should implement here your method `getWholeAndParts(patternInstanceURI)` (e.g.) to retrieve pattern instance data for feeding visual frame. Repositories have two dependencies. The client to query persistence layer and a query builder to build the query.
We may consider changing `getWholeAndParts`, `getTimeIndexedTypedLocations` methods to a more generic `getPatternInstanceData(patternInstanceURI)`. This generic method will ask query builder the query for getting data (see (example query builder)[link to example query builder] ). And the query builder may consult a `QueryRepository` reading query for the given frame again from a file (see same considerations for reading visual frame from a file above).

You may have a `/plugins/queries/` folder where you can add a `my-query-for-collection-pattern{.txt,.js,...}` . And in an another file (`.env` ?) you specify the path to the query.

Example:

`.env.queries` file:

```
https://w3id.org/arco/ontology/denotative-description/measurement-collection=./plugins/queries/my-query-for-collection-pattern{.txt,.js,...}
```


Some modification to query builder should be done. For example you should bind parameters (e.g.) pattern instance uri to a variable in the query.
We can think to a `PatternClient` that automatically binds all the `?patternInstanceURI` in the query.


# Insert a new pattern in mosaic visual frame

Il `VisualFrameMosaic` è un componente che viene renderizzato quando una certa risorsa (che non è istanza di pattern) appartiene a qualche istanza di pattern. 
Vengono cercati tutti i pattern in cui quella risorsa compare e per ognuno di questi viene renderizzato lo specifico pattern. Può valere la regola come sopra: mappare l'uri di un tipo di pattern ad un file (visual frame). 

E poi si può fare un ciclo che per ogni uri di pattern renderizza lo specifico visual frame.

Problemi aperti: 

Capire cosa succede quando la risorsa compare in più istanze delle stesso tipo:
spesso può essere riusato lo stesso pattern come sopra ma in altri casi no. Esempio: Per TimeIndexedTypedLocation ci vorrà in questo caso un TimeIndexedTypedLocationAggregateVisualFrame. 
La logica potrebbe essere se la risorsa compare in più di una istanza dello stesso pattern fai un array e buttale dentro il componente, poi se la vede lui. Oppure no. Oppure si vuole che ogni istanza venga gestita singolarmente. Questa logica non è banalissima e sarebbe meglio trovare una soluzione univoca. Inoltre avere più possibilità complicherebbe un po' il file di configurazione rendendo meno accessibile il framework. Intendo: se la risorsa compare in più istanze di time indexed typed location, prendi tutte queste istanze e le passi ad un singolo componente che le gestisce tutte assieme. Altrimenti si potrebbe volere che ogni istanza venga gestita separatamente. Forse fare questa divisione complicherebbe la semplicità del file di configurazione chiave valore ? Possiamo decidere noi un comportamento a priori.

Problema due: il frame nel mosaico e il frame preso singolarmente (per l'istanza del pattern) potrebbe essere diverso. Esempio dimensioni diverse. Stile diverso. Oppure possono essere tolti degli elementi, esempio immagini. Quindi potrebbe richiedere una configurazione diversa. Potenzialmente delle query diverse?

Considererei l'idea di aggiugere un altro file di configurazione:

`.env.mosaic` file:

```
https://w3id.org/arco/ontology/denotative-description/measurement-collection=./plugins/visualframes/MyCollectionVisualFrameMosaicElement.js
```

Nulla vieta che questa entry in `.env.mosaic` e la entry in `.env.visualframes` puntino allo stesso file. Va aggiunto un metodo alla `VisualFrameRepository`.
`findVisualFrameForMosaicPattern(patternURI)`. Nulla vieta che questi metodi in futuro leggano da un database e i visual frame possano essere modificati dinamicamente nell'applicazione. Si astrae appunto dal layer di persistenza. E si astrae la configurazione dallo specifico linguaggio di programmazione. 

L'unico punto in cui andrebbe usato js/react è per creare un nuovo componente che viene renderizzato quando un istanza di pattern con la uri è renderizzata da odp reactor, oppure è renderizzata una risorsa/classe/key concept che compare in diverse istanze di pattern e va incasellata nel mosaico. Questi componenti andrebbero aggiunti in una cartella `/plugins/visualframes/` o `/plugins/mosaicvisualframes` o che dir si voglia.



# Insert new filters in odp reactor browser (graph frontend)



# Read data in odp-reactor table

