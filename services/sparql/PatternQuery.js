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
}
