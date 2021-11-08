import DbClient from './base/DbClient';
import ClassDataMapper from './classes/ClassDataMapper';
import ClassRepository from './classes/ClassRepository';

// THIS SHOULD ABSOLUTELY BE CHANGE
// unfortunately getDynamicEnpoindParameters
// doesn't let you get some global reference to which sparql endpoint
// the dataset is connect to
const sparqlEndpoint = 'http://arco.istc.cnr.it/visualPatterns/sparql';

export default {
    name: 'class',
    read: (req, resource, params, config, callback) => {
        const dbClient = new DbClient(sparqlEndpoint, {});
        const classDataMapper = new ClassDataMapper();
        const classRepository = new ClassRepository(dbClient, classDataMapper);
        if (resource === 'class.getClassesAndScores') {
            console.log('Class service called');
            const result = classRepository.findAllClassesWithCentralityScore();
            callback(null, JSON.parse(JSON.stringify(result)));
        }
    }
};
