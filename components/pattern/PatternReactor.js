import React from 'react';

import {PatternInstanceRepository} from '../../services/patterns/PatternInstanceRepository'
import { ServerConfigRepository } from '../../services/config/ServerConfigRepository';
import DbClient from '../../services/base/DbClient';

const configEndpoint = process.env.CONFIG_SPARQL_ENDPOINT_URI;
const serverConfigRepo = new ServerConfigRepository(
    new DbClient(configEndpoint)
);

export default class PatternReactor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patternInstance: undefined,
        }
    }

    componentDidMount() {
        const getPatternInstance = async (datasetId, patternInstanceUri) => {
            if (datasetId && patternInstanceUri) {
                const {sparqlEndpoint, graph} = await serverConfigRepo.getSparqlEndpointAndGraphByDatasetId(datasetId)
                const dbClient = new DbClient(sparqlEndpoint)
                const patternRepo = new PatternInstanceRepository(dbClient)
                if (sparqlEndpoint) {
                    const patternInstance = await patternRepo.getPatternInstanceWithType(patternInstanceUri)
                    if (patternInstance) {
                        this.setState({
                            patternInstance: patternInstance,
                        })
                    }
                }
            } else {
                console.log(`[!] No datasetId or pattern instances uri. Cannot retrieve associated sparql endpoint. Dataset Id: ${datasetId} ; Pattern Instance Uri: ${patternInstanceUri}`)
            }
        }
        getPatternInstance(this.props.datasetURI, this.props.resource)
    }

    render() {
        if (this.state.patternType) {

            const VisualFrame = this.patternInstance.visualFrame

            if (VisualFrame) {
                return (
                    <div>
                        <VisualFrame patternInstance={patternInstance}/>
                    </div>
                );
            } else {
                return <div>No visualframe found for pattern</div>
            }
        } else {
            return null
        }
    }
}

