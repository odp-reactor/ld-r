import React from 'react';

import {PatternInstanceRepository} from '../../services/patterns/PatternInstanceRepository'
import { ServerConfigRepository } from '../../services/config/ServerConfigRepository';
import DbClient from '../../services/base/DbClient';
import {CustomLoader} from '../CustomLoader'
import {fetchInstanceStatusEnum} from './fetchInstanceStatusEnum'

const configEndpoint = process.env.CONFIG_SPARQL_ENDPOINT_URI;
const serverConfigRepo = new ServerConfigRepository(
    new DbClient(configEndpoint)
);




export default class PatternReactor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patternInstance: null,
            dbContext: null,
            status : fetchInstanceStatusEnum.LOADING
        }
    }

    componentDidMount() {
        const getPatternInstance = async (datasetId, patternInstanceUri) => {
            if (datasetId && patternInstanceUri) {
                try {
                    const dbContext = await serverConfigRepo.getSparqlEndpointAndGraphByDatasetId(datasetId)
                    const dbClient = new DbClient(dbContext.sparqlEndpoint, dbContext.graph)
                    const patternRepo = new PatternInstanceRepository(dbClient)
                    if (dbContext && dbContext.sparqlEndpoint) {
                        const patternInstance = await patternRepo.getPatternInstanceWithTypeVisualFrameAndData(patternInstanceUri)
                        if (patternInstance) {
                            this.setState({
                                patternInstance: patternInstance,
                                dbContext: dbContext,
                                status: fetchInstanceStatusEnum.FOUND
                            })
                        } else {
                            this.setState({
                                status: fetchInstanceStatusEnum.NOT_FOUND
                            })
                        }
                    }
                } catch(err) {
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
        getPatternInstance(this.props.datasetURI, this.props.resource)
    }

    render() {
        if (this.state.status === fetchInstanceStatusEnum.LOADING) {
            // loading
            return <div style={{
                textAlign: 'center'
            }}>
                <CustomLoader />
            </div>  
        } else {
            if (this.state.status === fetchInstanceStatusEnum.FOUND) {
                // instance found                
                const VisualFrame = this.state.patternInstance.visualFrame

                if (VisualFrame) {
                    // instance has a valid visual frame to render
                    return (
                        <div>
                            <VisualFrame patternInstance={this.state.patternInstance} dbContext={this.state.dbContext} />
                        </div>
                    );
                } else {
                    // no valid visual frame
                    return <div>No visualframe found for pattern</div>
                }
                
            } else {
                // no instance found
                return null
            }
        }
    }
}

