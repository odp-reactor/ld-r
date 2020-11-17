import SPARQLQuery from './SPARQLQuery';

export default class PatternQuery extends SPARQLQuery {
    constructor() {
        super();
        this.prefixes =
            this.prefixes +
            `
            PREFIX opla: <http://ontologydesignpatterns.org/opla/>
            `;
    }

    /**
     * Function creates query to retrieve all the pattern types in a knowledge base
     * and count every pattern instance
     */
    getPatternList(graphName) {
        let { gStart, gEnd } = this.prepareGraphName(graphName);
        this.query = `SELECT DISTINCT ?pattern (COUNT(DISTINCT ?instance) as ?occurences) WHERE {
            ${gStart}
               ?instance opla:isPatternInstanceOf ?pattern .
            ${gEnd}
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
                ?subPattern rdf:type opla:Pattern .
                ?pattern rdf:type opla:Pattern .
            ${gEnd}
        }
        `;
        return this.query;
    }

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
                ?componentPattern rdf:type opla:Pattern .
                ?pattern rdf:type opla:Pattern .
            ${gEnd}
        }`;
        return this.query;
    }

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
     * @description Creates a query retrieving a all the occurrences for a pattern
     * @author Christian Colonna
     * @date 09-11-2020
     * @param {string} graphName the graph to query against
     * @param {string} id the pattern IRI
     * @memberof PatternQuery
     */
    getInstancesByPattern(graphName, id) {
        let { gStart, gEnd } = this.prepareGraphName(graphName);
        this.query = `SELECT DISTINCT ?instance (COUNT(?node) as ?count) WHERE {
            ${gStart}
                ?node opla:belongsToPatternInstance ?instance .
                ?instance opla:isPatternInstanceOf <${id}> .
            ${gEnd}
        }`;
        return this.query;
    }

    /**
     * @description Return resources of a pattern. Nodes of pattern subgraph.
     * @author Christian Colonna
     * @date 15-11-2020
     * @param {string} graphName graph to query against
     * @param {string} instanceURI uri of the instance
     * @returns {string} query
     * @memberof PatternQuery
     */
    getInstanceResources(graphName, instanceURI) {
        let { gStart, gEnd } = this.prepareGraphName(graphName);
        this.query = `SELECT DISTINCT ?node ?type ?pattern WHERE {
            ${gStart}
                <${instanceURI}> opla:isPatternInstanceOf ?pattern .
                ?node opla:belongsToPatternInstance <${instanceURI}> ;
                      rdf:type ?type .
            ${gEnd}
        }`;
        return this.query;
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
        args.forEach(resourceType => {
            let resourceToBind = this.getResourceByType(
                instanceResources,
                resourceType
            );
            if (resourceToBind) {
                resourcesToBind.push(resourceToBind);
            }
        });
        let cleanedQueryBody = queryBody;
        resourcesToBind.forEach(resource => {
            let placeholder = `?${resource.type}`;
            cleanedQueryBody = this.prepareQueryBody(
                resource.uri,
                placeholder,
                cleanedQueryBody
            );
        });
        this.query = `
            SELECT ${selectStatement} WHERE {
                ${gStart}
                    ${cleanedQueryBody}
                ${gEnd}
            } ${aggregatesBlock}
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
        const resourceURI = resources.find(resources.type == type);
        return resourceURI ? resourceURI : undefined;
    }
}
