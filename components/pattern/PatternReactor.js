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
            dbContext: undefined
        }
    }

    componentDidMount() {
        const getPatternInstance = async (datasetId, patternInstanceUri) => {
            if (datasetId && patternInstanceUri) {
                const dbContext = await serverConfigRepo.getSparqlEndpointAndGraphByDatasetId(datasetId)
                const dbClient = new DbClient(dbContext.sparqlEndpoint, dbContext.graph)
                const patternRepo = new PatternInstanceRepository(dbClient)
                if (dbContext && dbContext.sparqlEndpoint) {
                    const patternInstance = await patternRepo.getPatternInstanceWithTypeVisualFrameAndData(patternInstanceUri)
                    if (patternInstance) {
                        this.setState({
                            patternInstance: patternInstance,
                            dbContext: dbContext
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
        if (this.state.patternInstance) {

            const VisualFrame = this.state.patternInstance.visualFrame

            if (VisualFrame) {
                return (
                    <div>
                        <VisualFrame patternInstance={this.state.patternInstance} dbContext={this.state.dbContext} />
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

