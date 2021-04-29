# Pattern Instantiation

This folder is a base for the production of RDF data based on Ontology Design Patterns.
To automate the process we use the language [ottr](https://www.ottr.xyz/) and the related tool [lutra](https://gitlab.com/ottr/lutra/lutra)

To run the tool you should have a Java 11 installed in your machine.

Briefly, for every ontology design pattern you need to define a formal template according to ottr languages and syntax.

The tool lutra may be used to _expand_ templates from ottr syntax into RDF, to instantiate templates, or to map data from different sources (CSV, RDF file, SPARQL endpoint, SQL, ... ) shaping them according to template.

## Example

You may define a template for the Ontology Design Pattern [Collection](http://ontologydesignpatterns.org/wiki/Submissions:CollectionEntity) like this:

```
@prefix odp-tpl:	<http://example.com/ns/> .
@prefix ottr:		<http://ns.ottr.xyz/0.4/> .
@prefix odp-col:	<http://www.ontologydesignpatterns.org/cp/owl/collectionentity.owl#> .

odp-tpl:Collection[ ottr:IRI ?collectionIRI, List<ottr:IRI> ?entities ] :: {
	cross
	  | ottr:Triple(?collectionIRI, odp-col:hasMember, ++?entities)
} .

```

The template block before `::` is the _signature_: `odp-tpl:Collection[ ottr:IRI ?collectionIRI, List<ottr:IRI> ?entities ]`
It defines the arguments the template may receive and that can be instantiated according to rules in _pattern_ (the block after `::`)
You can nest other templates inside template pattern.

Write a template instance like this:

```
@prefix odp-tpl:    <http://example.com/ns/> .
@prefix ex:	    <http://example.com/data/> .

odp-tpl:Collection(ex:collection_1, (ex:member_1, ex:member_2)) .

```

This is a file in `.stottr` format.

And you can instantiate the template producing data according the template library with `lutra`.
Remember to save your template in `my-lib.stottr` file.

And then run:

`$ lutra -m expand --fetchMissing --inputFormat stottr --library ./my-lib.stottr --libraryFormat stottr --outputFormat wottr instances.stottr`

Output:

```
@prefix odp-tpl: <http://example.com/ns/> .
@prefix odp-col: <http://www.ontologydesignpatterns.org/cp/owl/collectionentity.owl#> .
@prefix ex:      <http://example.com/data/> .


ex:collection_1
        odp-col:hasMember             ex:entity_1 , ex:entity_2 .
```

The `.wottr` output format is valid RDF.

You can define a mapping from a `source` and produce data shaping them with templates like this:

```
[] a ottr:InstanceMap ;
  ottr:source
      [ a ottr:SPARQLEndpointSource ;
        ottr:sourceURL "https://dati.beniculturali.it/sparql" ] ;
  ottr:query """
    SELECT ?collection
    (GROUP_CONCAT(DISTINCT ?member; SEPARATOR=";") AS ?members)

    WHERE
    {
	    ?collection a-dd:hasMeasurement ?member.
            ?collection a a-dd:MeasurementCollection .
            ?member a a-dd:Measurement .
    }
    group by ?collection
    LIMIT 10
  """;
  ottr:template odp-tpl:MeasurementCollection ;
    ottr:argumentMaps (
    [ ottr:type ottr:IRI ] ## empty Argument map
    [ ottr:type (rdf:List ottr:IRI);
      ottr:translationSettings [ ottr:listSep ";"]
    ]
  ) .
```

Remember to save this file as `.bottr` extension and to add prefixes.
The template `MeasurementCollection` may be easily be defined as a _specialization_ of `Collection` like this.

```
odp-tpl:MeasurementCollection[ ottr:IRI ?collectionIRI, List<ottr:IRI> ?measurements ] :: {
    o-rdfs:SubClassOf(a-dd:MeasurementCollection, odp-col:Collection),
    odp-tpl:Collection(?collectionIRI, ?measurements),
    odp-tpl:PatternInstance(?collectionIRI, odp-tpl:MeasurementCollection)
} .
```

You can also see here the reuse and nesting of more basic pattern/template `SubClassOf`.

You will produce data with command:

`$ lutra -m expand -I bottr -f -l ./lib.stottr -L stottr -O wottr myMap.bottr`

```
@prefix a-dd:  <https://w3id.org/arco/ontology/denotative-description/> .
@prefix opla:  <http://ontologydesignpatterns.org/opla/> .
@prefix odp-tpl: <http://www.ontologydesignpatterns.org/tpl#> .
@prefix odp-col: <http://www.ontologydesignpatterns.org/cp/owl/collectionentity.owl#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .

<https://w3id.org/arco/resource/MeasurementCollection/0100204071-1>
        opla:reusesPatternAsTemplate  odp-tpl:MeasurementCollection , odp-tpl:Collection ;
        odp-col:hasMember             <https://w3id.org/arco/resource/Measurement/0100204071-1-height> .

<https://w3id.org/arco/resource/MeasurementCollection/1200200456A-1>
        opla:reusesPatternAsTemplate  odp-tpl:Collection , odp-tpl:MeasurementCollection ;
        odp-col:hasMember             <https://w3id.org/arco/resource/Measurement/1200200456A-1-width> .

...
```

# TODO

il template di un pattern è così definito:

#### usa questo template per il pattern

template( namedIndividual,
proprietà 1 ... n ,
classe 1 ... m , # dominio e range delle proprietà
literal 1 a k ,
altre annotazioni sulle proprietà e classi: restrizioni, dominio, range ecc.
)

-   il template dirà che l'individuo pattern è istanza di un Pattern

Se il pattern specializza o ha come componente un altro pattern usa queste relazioni nel template :

-   specializzazione : specializationOfPattern
    listSubPropertyOf (tutte le proprietà che sono sottopropreità di quelle del pattern specializzato)
    listSubClassOf (vedi sopra)

-   composizione : componentOfPattern

#### usa questo template allinterno del template del pattern se il pattern specializza un altro pattern

template specializzaione( pattern1, pattern specializzato, ((properietà pattern 1), (proprietà pattern specializzato)), ((classi pattern 1 ), (classi pattern specializzato)))

#### usa questo template all'interno del template del pattern se il pattern ha come component un altro pattern

template composizione ( pattern1, pattern componente)

#

every instance reuse PatternInstance template
Super Instance need a IRI for every instantiation i mean:

-   we arbitrary decide not to involve types in template at the moment.
    In the sense that InstanceTemplate is not responsible for define type of resource it receives.
    This may be inferred by Pattern schema instantiating the relative template for patternInstance

-   you need to pass just props

###

# PATTERN SCHEMA

###

# for every pattern creates an individual (with its namespace)

# the individual is of type opla:Pattern

# the individual may be related opla:specializationOfPattern with other individual

###

# PATTERN DATA

###

# for every instance retrieved by the query

# create an instance

# assign resource to the instance

#### TODO

# study the null mechanism to avoid double instantiation when composition!

# check if you can create a list on the fly example: :MyTemplate([?var1, ?var2], x)

# none keywords works in list as is

# in templates you need to assign ? flag to the param you want nullable, else

# all the instance won't be print

# you can assign default values

@prefix odp-tpl: <http://www.ontologydesignpatterns.org/tpl#> .
@prefix odp-col: <http://www.ontologydesignpatterns.org/cp/owl/collectionentity.owl#> .
@prefix ottr: <http://ns.ottr.xyz/0.4/> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .

odp-tpl:CollectionInstance[ ottr:IRI ?collection,
List<ottr:IRI> ?entities,
! owl:ObjectProperty ?hasMember=odp-col:hasMember,
? ottr:IRI ?instance, ! ottr:IRI ?instanceType=odp-col:collection ] :: {
odp-tpl:PatternInstance(?instance, ?instanceType, ?entities, (?collection) )
} .
