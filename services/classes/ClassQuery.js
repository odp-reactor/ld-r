export default class ClassQuery {
    getClassesWithCentralityScore() {
        return `PREFIX arco-gm: <https://w3id.org/arco/graph.measures/>
            select distinct  ?uri ?pd {
            ?uri arco-gm:percentageDegree ?pd .
             } ORDER BY DESC(?pd)
        `;
    }
}
