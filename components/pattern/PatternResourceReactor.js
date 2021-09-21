import React from 'react'

import { ServerConfigRepository } from '../../services/config/ServerConfigRepository';
import {PatternInstanceRepository} from '../../services/patterns/PatternInstanceRepository'
import DbClient from '../../services/base/DbClient';
import MosaicVisualFrame from './MosaicVisualFrame';

import {CustomLoader} from '../CustomLoader'
import {fetchInstanceStatusEnum} from './fetchInstanceStatusEnum'

const configEndpoint = process.env.CONFIG_SPARQL_ENDPOINT_URI;
const serverConfigRepo = new ServerConfigRepository(
    new DbClient(configEndpoint)
);

export class PatternResourceReactor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            patternInstances: null,
            dbContext: null,
            status: fetchInstanceStatusEnum.LOADING
        }
    }

    componentDidMount() {
        const getPatternInstancesByResource = async (datasetId, resourceURI) => {
            if (datasetId && resourceURI) {
                try {
                    const dbContext = await serverConfigRepo.getSparqlEndpointAndGraphByDatasetId(datasetId)
                    const dbClient = new DbClient(dbContext.sparqlEndpoint, dbContext.graph)
                    const patternRepo = new PatternInstanceRepository(dbClient)
                    if (dbContext && dbContext.sparqlEndpoint) {
                        const patternInstances = await patternRepo.getPatternInstancesByResourceParticipatingInPattern(resourceURI)
                        if (patternInstances) {
                            this.setState({
                                patternInstances: patternInstances,
                                dbContext: dbContext,
                                status: fetchInstanceStatusEnum.FOUND
                            })
                        } else {
                            this.setState({
                                status: fetchInstanceStatusEnum.NOT_FOUND
                            })
                        }
                    }
                } catch (err) {
                    console.log('[!] Error ', err)
                    this.setState({
                        status: fetchInstanceStatusEnum.FETCHING_ERROR
                    })   
                } 
            } else {
                this.setState({
                    status: fetchInstanceStatusEnum.SPARQL_ENDPOINT_NOT_VALID
                })
            }
        }
        getPatternInstancesByResource(this.props.datasetURI, this.props.resourceURI)
    }

    render() {

        // se fanno parte di stessa istanza aggregarli e passare istanze di pattern ai visual frame

        if (this.state.status === fetchInstanceStatusEnum.LOADING) {
            // fetching => loader
            return <div style={{textAlign:'center'}}><CustomLoader /></div>
        } else {
            if (this.state.status === fetchInstanceStatusEnum.FOUND && this.state.patternInstances.length > 0) {
                // fetched: length > 0 => mosaic
                return <MosaicVisualFrame patternInstances={this.state.patternInstances} dbContext={this.state.dbContext} />
            } else {
                // no data => null
                return null
            }
        }
    }
}