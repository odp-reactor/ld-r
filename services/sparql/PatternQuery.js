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
        this.query = `SELECT DISTINCT ?instance WHERE {
            ${gStart}
                ?instance opla:isPatternInstanceOf <${id}> .
            ${gEnd}
        }`;
        return this.query;
    }
}
