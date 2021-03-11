import SPARQLQuery from './SPARQLQuery';

import URIUtil from '../../components/utils/URIUtil';

export default class PatternQuery extends SPARQLQuery {
    constructor() {
        super();
        this.prefixes =
            this.prefixes +
            'PREFIX opla: <http://ontologydesignpatterns.org/opla/>';
    }

    /**
     * Function creates query to retrieve all the pattern types in a knowledge base
     * and count every pattern instance
     */
    getPatternList(graphName) {
        let { gStart, gEnd } = this.prepareGraphName(graphName);
        this.query = `
                        SELECT DISTINCT  ?pattern ?label ?description
                        (COUNT(DISTINCT ?instance) as ?occurences)  
                        (GROUP_CONCAT(DISTINCT ?superPattern; SEPARATOR=";") as ?superPatterns)
                       (GROUP_CONCAT(DISTINCT ?component; SEPARATOR=";") as ?components) WHERE {
            { SELECT ?pattern ?instance ?label ?description WHERE     {   
                           #?instance opla:isPatternInstanceOf ?pattern1 .
                           #?pattern1 opla:specializationOfPattern* ?pattern .
                           ?instance opla:isPatternInstanceOf ?pattern .
                           ?pattern a opla:Pattern .     
                           ?pattern rdfs:label ?label .        
                           ?pattern rdfs:comment ?description .        
                  } GROUP BY ?pattern }
                  UNION { 
                      SELECT ?pattern ?label ?description ?superPattern ?component WHERE {
                                      ?pattern a opla:Pattern .
            
                                      ?pattern rdfs:label ?label .        
                                      ?pattern rdfs:comment ?description .             
           
                           OPTIONAL {?pattern opla:specializationOfPattern ?superPattern2B }.
                           OPTIONAL {?component2B opla:componentOfPattern ?pattern }.
            
                           BIND ( IF (BOUND (?superPattern2B), ?superPattern2B, '')  as ?superPattern) .
                           BIND ( IF (BOUND (?component2B), ?component2B, '')  as ?component) .            
            
                       } 
                  }
        }`;
        return this.query; // TODO: ?pattern rdf:type opla:Pattern (if reasoning available)
    }

    /**
     * Function creates query to retireve tuples of pattern and subà-patterns
     * *******
     * @param {string} graphName name of the graph to query against
     */
    getSpecializationList(graphName) {
        let { gStart, gEnd } = this.prepareGraphName(graphName);
        this.query = `SELECT DISTINCT ?subPattern ?pattern WHERE {
            ${gStart}
                ?subPattern opla:specializationOfPattern ?pattern .
                ${gEnd}
            }
            `;
        return this.query;
    }
    // ?subPattern rdf:type opla:Pattern .
    // ?pattern rdf:type opla:Pattern .

    /**
     * Function creates query to retrieve tuples of pattern and composing patterns
     * ********
     * @param {string} graphName name of the graph to query against
     */
    getCompositionList(graphName) {
        let { gStart, gEnd } = this.prepareGraphName(graphName);
        this.query = `SELECT DISTINCT ?componentPattern ?pattern WHERE {
            ${gStart}
                ?componentPattern opla:componentOfPattern ?pattern .
                ${gEnd}
            }`;
        return this.query;
    }
    // ?componentPattern rdf:type opla:Pattern .
    // ?pattern rdf:type opla:Pattern .

    /**
     * @description returns all the patterns specialized and number of time they've been specialized
     * @author Christian Colonna
     * @date 06-11-2020
     * @param {string} graphName graph to quuery against
     * @returns {string} sparql query as string
     * @memberof PatternQuery
     */
    getSpecializationCountPerPattern(graphName) {
        let { gStart, gEnd } = this.prepareGraphName(graphName);
        this.query = `SELECT DISTINCT ?pattern (COUNT(?subPattern) AS ?count) WHERE {
            ${gStart}
                ?subPattern opla:specializationOfPattern ?pattern .
            ${gEnd}
        }`;
        return this.query;
    }

    /**
     * @description returns all the pattern used as components and the number of time they've been used
     * @author Christian Colonna
     * @date 06-11-2020
     * @param {*} graphName
     * @returns {*}
     * @memberof PatternQuery
     */
    getCompositionCountPerPattern(graphName) {
        let { gStart, gEnd } = this.prepareGraphName(graphName);
        this.query = `SELECT DISTINCT ?pattern (COUNT(?pattern) AS ?count) WHERE {
            ${gStart}
                ?pattern opla:componentOfPattern ?composedPattern .
            ${gEnd}
        }`;
        return this.query;
    }

    /**
     * @description Creates a query retrieving:
     *              - all the occurrences for a pattern
     *              - nodes of the pattern
     *              - type of every node
     *              - pattern the instance is of
     *              - OPTIONAL : if pattern hasComponent TimeInterval, startDate and endDate of the interval
     *
     * @author Christian Colonna
     * @date 09-11-2020
     * @param {string} graphName the graph to query against
     * @param {string} id the pattern IRI
     * @memberof PatternQuery
     */
    getInstancesByPattern(graphName, id) {
        let [
            instanceDependentVariables,
            body
        ] = this.getInstanceInstanceDependentData(id);
        let { gStart, gEnd } = this.prepareGraphName(graphName);
        this.query = `SELECT DISTINCT ?instance ?label ?type ?patternLabel ?patternDescription ?nodes ${instanceDependentVariables} 
        WHERE {?instance opla:isPatternInstanceOf ?type .
        ?type opla:specializationOfPattern* <${id}> .
        ?type rdfs:label ?patternLabel .
        ?type rdfs:comment ?patternDescription .
            OPTIONAL { SELECT DISTINCT  ?instance (SAMPLE(?label) as ?label)  WHERE {
                ?instance <http://www.w3.org/2000/01/rdf-schema#label> ?label2B . BIND ( IF (BOUND (?label2B), ?label2B, '')  as ?label) . } } . OPTIONAL{ SELECT DISTINCT ?instance (GROUP_CONCAT(DISTINCT ?nodeType; SEPARATOR=";") AS ?nodes) WHERE { 
 ?instance opla:hasPatternInstanceMember ?node .  OPTIONAL { ?node rdf:type ?typet . } BIND (CONCAT(?node, " ",?typet) AS ?nodeType)} GROUP BY ?instance } ${body} 
        }`;
        return this.query;
    }

    getInstanceInstanceDependentData(id) {
        switch (id) {
            case 'https://w3id.org/arco/ontology/location/time-indexed-typed-location':
            case 'http://www.ontologydesignpatterns.org/cp/owl/time-indexed-situation':
            case 'http://www.ontologydesignpatterns.org/cp/owl/situation': {
                return [
                    '?locationType ?startTime ?endTime ?lat ?long ?addressLabel ?cProp ?cPropLabel',
                    `    OPTIONAL {SELECT ?instance (SAMPLE(?cProp) as ?cProp) (SAMPLE(?cPropLabel) as?cPropLabel) {OPTIONAL {?instance opla:hasPatternInstanceMember ?titl . ?titl rdf:type <https://w3id.org/arco/ontology/location/TimeIndexedTypedLocation> . ?cProp <https://w3id.org/arco/ontology/location/hasTimeIndexedTypedLocation> ?titl .?cProp rdfs:label ?cPropLabel .}}}OPTIONAL{ SELECT ?instance (SAMPLE(?locationType) as ?locationType) { OPTIONAL { ?instance opla:hasPatternInstanceMember ?titl . ?titl rdf:type <https://w3id.org/arco/ontology/location/TimeIndexedTypedLocation> . ?titl <https://w3id.org/arco/ontology/location/hasLocationType> ?locationType2B . ?locationType2B rdfs:label ?locationLabel . FILTER (lang(?locationLabel) = 'it') } BIND ( IF ( BOUND (?locationLabel), ?locationLabel, "" ) as ?locationType ) .} GROUP BY ?instance } OPTIONAL{ SELECT ?instance (SAMPLE(?addressLabel) as ?addressLabel) WHERE { OPTIONAL { ?instance opla:hasPatternInstanceMember ?titl . ?titl rdf:type <https://w3id.org/arco/ontology/location/TimeIndexedTypedLocation> . ?titl <https://w3id.org/arco/ontology/location/atSite> ?site . ?site <http://dati.beniculturali.it/cis/siteAddress>?siteAddress . ?siteAddress rdfs:label ?addressLabel2B . } BIND ( IF (BOUND (?addressLabel2B),?addressLabel2B,'')  as ?addressLabel ) .} GROUP BY ?instance } OPTIONAL{ SELECT ?instance (SAMPLE(?startTime) AS ?startTime) (SAMPLE(?endTime) as ?endTime) { OPTIONAL { ?instance opla:hasPatternInstanceMember ?titl . ?titl rdf:type <https://w3id.org/arco/ontology/location/TimeIndexedTypedLocation> . ?titl <https://w3id.org/italia/onto/TI/atTime> ?tInterval .  ?tInterval <https://w3id.org/arco/ontology/arco/startTime> ?startTime2B ; <https://w3id.org/arco/ontology/arco/endTime> ?endTime2B . }                       BIND ( IF ( BOUND (?startTime2B), ?startTime2B, "" ) as ?startTime ) . BIND ( IF ( BOUND (?endTime2B), ?endTime2B, "" ) as ?endTime ) . } GROUP BY ?instance } OPTIONAL{ SELECT ?instance (SAMPLE(?lat) as ?lat) (SAMPLE(?long) AS ?long) { OPTIONAL { ?instance opla:hasPatternInstanceMember ?titl .                    ?titl rdf:type <https://w3id.org/arco/ontology/location/TimeIndexedTypedLocation> . ?titl <https://w3id.org/arco/ontology/location/atSite> ?site .
                ?site <https://w3id.org/italia/onto/CLV/hasGeometry> ?geometry .
                ?geometry <https://w3id.org/italia/onto/CLV/lat>     ?lat2B .
                ?geometry <https://w3id.org/italia/onto/CLV/long>    ?long2B .   }
                BIND ( IF (BOUND (?lat2B),  ?lat2B,  '')  as ?lat) .
                BIND ( IF (BOUND (?long2B), ?long2B, '')  as ?long) .
               } GROUP BY ?instance
            }`
                ];
            }
            case 'https://w3id.org/arco/ontology/denotative-description/measurement-collection':
            case 'http://www.ontologydesignpatterns.org/cp/owl/collection': {
                return [
                    '?measures ?cProp ?cPropLabel',
                    `OPTIONAL { SELECT ?instance ?cProp (SAMPLE(?cPropLabel) as ?cPropLabel) WHERE {
                        OPTIONAL   { ?instance opla:hasPatternInstanceMember ?cProp .
                                      ?cProp <https://w3id.org/arco/ontology/denotative-description/hasMeasurementCollection> ?mc .
                                      ?cProp rdfs:label ?cPropLabel
                                   }
                                   } GROUP BY ?instance ?cProp  }   
                    OPTIONAL { SELECT ?instance (GROUP_CONCAT(DISTINCT ?measure; SEPARATOR=";") AS ?measures) {  
                        ?instance opla:hasPatternInstanceMember ?node .
                        { ?node <https://w3id.org/arco/ontology/denotative-description/hasValue> ?val .
                        ?val <https://w3id.org/italia/onto/MU/value> ?value .
                    { SELECT ?instance (SAMPLE (?units) as ?unit) WHERE {
                            OPTIONAL {
                                ?instance opla:hasPatternInstanceMember ?node .
                                ?node <https://w3id.org/arco/ontology/denotative-description/hasValue> ?val .
                                ?val <https://w3id.org/italia/onto/MU/hasMeasurementUnit> ?u .
                                ?u rdfs:label ?units . }        
                            } GROUP BY ?instance
                    }                            
                    } 
                        BIND (CONCAT(?node, " ",?value, " ",STR(?unit)) AS ?measure)
                      } 
              }`
                ];
            }
            case 'https://w3id.org/arco/ontology/location/cultural-property-component-of':
            case 'http://www.ontologydesignpatterns.org/cp/owl/part-of': {
                return [
                    '?parts ?cProp ?cPropLabel',
                    `OPTIONAL { SELECT ?instance (GROUP_CONCAT(DISTINCT ?node; SEPARATOR=";") AS ?parts) { OPTIONAL { 
                    ?instance opla:hasPatternInstanceMember ?node .
                    ?node <https://w3id.org/arco/ontology/arco/isCulturalPropertyComponentOf> ?cProp .
                    } 
                  } 
          }OPTIONAL { SELECT ?instance (SAMPLE(?cProp) as ?cProp) (SAMPLE(?cPropLabel) as ?cPropLabel) WHERE {
            ?instance opla:hasPatternInstanceMember ?component .
                                  ?component <https://w3id.org/arco/ontology/arco/isCulturalPropertyComponentOf> ?cProp .
                                  ?cProp rdfs:label ?cPropLabel
                               } 
     } `
                ];
            }
            default:
                return ['', ''];
        }
    }

    /**
     * @description Creates a query returning data of a pattern instance
     *              It needs one or more pattern instance nodes as entry resources.
     *              The SPARQL matching pattern are created around this entry resource.
     *              Example: pattern Collection the entry resource may be the node of type Collection
     *
     *              The query will have an uppercase special variable of type ?Collection which will
     *              be replaced by uri of the resource of type Collection
     *
     * @author Christian Colonna
     * @date 15-11-2020
     * @param {string} graphName graph to query against
     * @param {Object[]} instanceResources an array of instance nodes [{ uri: uri, type: type } ... ]
     * @param {string[]} args an array of the types the resource of this type will be bind to query
     * @param {string} selectStatement query select statement
     * @param {string} queryBody query body, it contains special uppercase variables that may be replaced by resources, ex. ?Collection
     * @param {string} [aggregatesBlock]
     * @returns {string} query
     * @memberof PatternQuery
     */
    getInstanceDataByInstanceResources(
        graphName,
        instanceResources,
        args,
        selectStatement,
        queryBody,
        aggregatesBlock
    ) {
        let { gStart, gEnd } = this.prepareGraphName(graphName);
        let resourcesToBind = [];
        console.log('args');
        console.log(args);
        console.log(instanceResources);
        args.forEach(resourceType => {
            let resourceToBind = this.getResourceByType(
                instanceResources,
                resourceType
            );
            if (resourceToBind) {
                resourcesToBind.push(resourceToBind);
            }
        });

        console.log('r to bind');
        console.log(resourcesToBind);

        let cleanedQueryBody = queryBody;
        resourcesToBind.forEach(resource => {
            let placeholder = `\\?${URIUtil.getURILabel(resource.type)}`;
            cleanedQueryBody = this.prepareQueryBody(
                resource.id,
                placeholder,
                cleanedQueryBody
            );
        });
        this.query = `
            ${selectStatement} {
                ${gStart}
                    ${cleanedQueryBody}
                ${gEnd}
            } ${aggregatesBlock ? aggregatesBlock : ''}
            `;
        return this.query;
    }

    /**
     * @description Returns the URI and TYPE of a resource of type TYPE in a list of resources.
     *              A resource is an object { uri: <uri>, type: <type> }
     * @author Christian Colonna
     * @date 15-11-2020
     * @param {Object[]} resources
     * @param {string} resource.uri the uri of a resource
     * @param {string} resource.type the type of a resource
     * @param {string} type resource of this type will be returned
     * @returns {Object} the resource of type TYPE in a list of resources
     * @memberof PatternQuery
     */
    getResourceByType(resources, type) {
        const resourceURI = resources.find(resource => {
            console.log('resources pattern');
            console.log(resource);
            return URIUtil.getURILabel(resource.type) === type;
        });
        return resourceURI ? resourceURI : undefined;
    }
}
