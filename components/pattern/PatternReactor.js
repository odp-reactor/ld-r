import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';

/* Flux
_________*/

import PatternInstanceStore from '../../stores/PatternInstanceStore';
import PatternStore from '../../stores/PatternStore';

import PatternRepository from '../../services/patterns/PatternRepository'
import { ServerConfigRepository } from '../../services/config/ServerConfigRepository';
import {VisualFrameRepository} from '../../services/visualframes/VisualFrameRepository'
import DbClient from '../../services/base/DbClient';

const configEndpoint = process.env.CONFIG_SPARQL_ENDPOINT_URI;
const serverConfigRepo = new ServerConfigRepository(
    new DbClient(configEndpoint)
);
const visualFrameRepository = new VisualFrameRepository()

export default class PatternReactor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patternType: undefined
        }
    }

    componentDidMount() {
        const getSparqlEndpointAndPatternTypeForInstance = async (datasetId, patternInstanceUri) => {
            if (datasetId && patternInstanceUri) {
                const {sparqlEndpoint, graph} = await serverConfigRepo.getSparqlEndpointAndGraphByDatasetId(datasetId)
                if (sparqlEndpoint) {
                    const patternRepo = new PatternRepository(new DbClient(sparqlEndpoint))
                    const pattern = await patternRepo.findPattern(patternInstanceUri)
                    if (pattern && pattern.type) {
                        this.setState({
                            patternType: pattern.type
                        })
                    }
                }
            } else {
                console.log(`[!] No datasetId or pattern instances uri. Cannot retrieve associated sparql endpoint. Dataset Id: ${datasetId} ; Pattern Instance Uri: ${patternInstanceUri}`)
            }
        }
        getSparqlEndpointAndPatternTypeForInstance(this.props.datasetURI, this.props.resource)
    }

    render() {
        if (this.state.patternType) {

            const VisualFrame = visualFrameRepository.getVisualFrame(this.state.patternType)


            console.log('[PatternReactor] Loaded visual frame:', VisualFrame)

            const visualFrameGeneralProps = { dataset : this.props.datasetURI,
                patternInstanceUri : this.props.resource
            }
            const VisualFrameWithGeneralProps = React.cloneElement(VisualFrame, visualFrameGeneralProps)
            return (
                <div>
                    <VisualFrame patternInstanceUri={this.props.resource}/>
                </div>
            /* {VisualFrameWithGeneralProps}</div> */
            );
        }
        return null
    }
}

PatternReactor.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
PatternReactor = connectToStores(
    PatternReactor,
    [PatternInstanceStore, PatternStore],
    function(context, props) {
        return {
            PatternInstanceStore: context
                .getStore(PatternInstanceStore)
                .getState(),
            PatternStore: context.getStore(PatternStore)
        };
    }
);
