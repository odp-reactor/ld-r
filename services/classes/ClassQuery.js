export default class ClassQuery {
    // here graphql let's you combine the two queries!!!!!!!!!!!!!!
    getClassesWithCentralityScore() {
        return `PREFIX arco-gm: <https://w3id.org/arco/graph.measures/>
            select distinct  ?uri ?pd {
            ?uri arco-gm:percentageDegree ?pd .
             } ORDER BY DESC(?pd)
        `;
    }
    getClassesWithPatternsTheyBelongsTo() {
        return `PREFIX opla: <http://ontologydesignpatterns.org/opla/>
                SELECT ?uri ?pattern WHERE {
                ?uri opla:isNativeTo ?pattern
    }`;
    }
    getClassesWithPatternsAndScores() {
        return `PREFIX opla: <http://ontologydesignpatterns.org/opla/>
                PREFIX arco-gm: <https://w3id.org/arco/graph.measures/>
                SELECT ?uri ?pattern ?pd WHERE {
                    ?uri opla:isNativeTo ?pattern .
                    ?uri arco-gm:percentageDegree ?pd .
                 } ORDER BY DESC(?pd)
        `;
    }
}
