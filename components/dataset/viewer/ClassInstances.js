import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import { handleHistory, navigateAction } from 'fluxible-router';

/* Flux
_________*/

import PatternStore from '../../../stores/PatternStore';
import CustomLoader from '../../CustomLoader';
import NavbarHider from './NavbarHider';

import { forEach } from 'lodash';

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';

import ClassService from '../../../services/clientside-services/ClassService';
import DbContext from '../../../services/base/DbContext';

export default class ClassInstances extends React.Component {
    constructor(props) {
        super(props);
        this.navbarHider = new NavbarHider();
        // this should be moved global if ali explain how to retireve
        // sparql endpoint associated to dataset else
        // we need to write the code ourselves what the fuck
        const sparqlEndpoint = 'https://arco.istc.cnr.it/visualPatterns/sparql';
        this.classService = new ClassService(new DbContext(sparqlEndpoint));
        this.state = {
            resources: null,
            patterns: null
        };
    }

    componentDidMount() {
        // we get these URIs from url params in currentNavigate
        // we receive this in props from navigateHandler
        const datasetURI = this.props.RouteStore._currentNavigate.route.params
            .did;
        const classURI = this.props.RouteStore._currentNavigate.route.params
            .cid;

        if (!this.state.classWithPatterns) {
            if (datasetURI && classURI) {
                this.classService
                    .findResourcesByClassWithPatterns(classURI)
                    .then(resourcesWithPatterns => {
                        console.log(resourcesWithPatterns);
                        this.setState(resourcesWithPatterns);
                    });
            }
        }
    }

    componentDidUpdate() {
        this.navbarHider.hideNavbarAndAddShowOnOverListener();
    }

    componentWillUnmount() {
        this.navbarHider.showNavbarAndRemoveShowOnOverListener();
    }

    render() {
        let exploreResourceOnListItemClick;
        if (this.props.RouteStore._currentNavigate) {
        }
        const classURI = this.props.RouteStore._currentNavigate.route.params
            .cid;

        if (this.state.resources && this.state.patterns) {
            const KnowledgeGraph = require('odp-reactor').KnowledgeGraph;
            const ResourceFactory = require('odp-reactor').ResourceFactory;
            const ResourcesWithViewControllerPage = require('odp-reactor')
                .ResourcesWithViewControllerPage;

            const kg = new KnowledgeGraph();
            const resourceFactory = new ResourceFactory();

            const { resources, patterns } = this.state;

            forEach(resources, resource => {
                console.log('URI:', resource.uri);
                const resourceKG = resourceFactory.makeResource({
                    uri: resource.uri,
                    label: resource.label, // label: `${resource.label.substring(0, 50)}...`,
                    properties: {
                        listProperties: {
                            listKeys: [
                                {
                                    label: 'Label',
                                    id: 'label'
                                }
                            ],
                            listItemClick: () => {
                                console.log(
                                    'CLICKED LIST ITEM: uri ',
                                    resource.uri
                                );
                                this.context.executeAction(navigateAction, {
                                    url: `${PUBLIC_URL}/dataset/${encodeURIComponent(
                                        this.props.RouteStore._currentNavigate
                                            .route.params.did
                                    )}/resource/${encodeURIComponent(
                                        resource.uri
                                    )}`
                                });
                            },
                            listTitle: classURI
                        }
                    }
                });

                kg.addResource(resourceKG);
            });

            return <ResourcesWithViewControllerPage knowledgeGraph={kg} />;
        } else {
            const datasetContainerStyle = {
                height: '90vh',
                width: '90vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto'
            };
            return (
                <div style={datasetContainerStyle}>
                    <CustomLoader></CustomLoader>
                </div>
            );
        }
    }
}

ClassInstances.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
ClassInstances = connectToStores(ClassInstances, [PatternStore], function(
    context,
    props
) {
    return {
        PatternStore: context.getStore(PatternStore).getState(),
        RouteStore: context.getStore('RouteStore')
    };
});
