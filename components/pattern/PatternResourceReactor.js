import React from 'react'

import { ServerConfigRepository } from '../../services/config/ServerConfigRepository';
import {PatternInstanceRepository} from '../../services/patterns/PatternInstanceRepository'
import DbClient from '../../services/base/DbClient';
import MosaicVisualFrame from './MosaicVisualFrame';

import {CustomLoader} from '../CustomLoader'

const configEndpoint = process.env.CONFIG_SPARQL_ENDPOINT_URI;
const serverConfigRepo = new ServerConfigRepository(
    new DbClient(configEndpoint)
);

export class PatternResourceReactor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            patternInstances: undefined,
            dbContext: undefined
        }
    }

    componentDidMount() {
        const getPatternInstancesByResource = async (datasetId, resourceURI) => {
            if (datasetId && resourceURI) {
                const dbContext = await serverConfigRepo.getSparqlEndpointAndGraphByDatasetId(datasetId)
                const dbClient = new DbClient(dbContext.sparqlEndpoint, dbContext.graph)
                const patternRepo = new PatternInstanceRepository(dbClient)
                if (dbContext && dbContext.sparqlEndpoint) {
                    const patternInstances = await patternRepo.getPatternInstancesByResourceParticipatingInPattern(resourceURI)
                    if (patternInstances) {
                        this.setState({
                            patternInstances: patternInstances,
                            dbContext: dbContext
                        })
                    }
                }
            } else {
                // console.log(`[!] No datasetId or resource uri. Cannot retrieve associated sparql endpoint. Dataset Id: ${datasetId} ; Pattern Instance Uri: ${resourceURI}`)
            }
        }
        getPatternInstancesByResource(this.props.datasetURI, this.props.resourceURI)
    }

    render() {

        // se fanno parte di stessa istanza aggregarli e passare istanze di pattern ai visual frame

        if (!this.state.patternInstances) {
            // fetching => loader
            return <div style={{textAlign:'center'}}><CustomLoader /></div>
        } else {
            if (this.state.patternInstances.length > 0) {
                // fetched: length > 0 => mosaic
                return <MosaicVisualFrame patternInstances={this.state.patternInstances} dbContext={this.state.dbContext} />
            } else {
                // no data => null
                return null
            }
        }
    }
}