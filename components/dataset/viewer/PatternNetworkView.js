import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';

/* Flux
_________*/

import loadPatterns from '../../../actions/loadPatterns';
import cleanInstances from '../../../actions/cleanInstances';
import PatternStore from '../../../stores/PatternStore';
import { navigateAction } from 'fluxible-router';
import CustomLoader from '../../CustomLoader';
import { forEach } from 'lodash';

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';

// import { PartWhole } from "odp-reactor/es/index";

import ClassService from '../../../services/clientside-services/ClassService';
import DbContext from '../../../services/base/DbContext';

export default class PatternNetworkView extends React.Component {
    constructor(props) {
        super(props);
        // this should be moved global if ali explain how to retireve
        // sparql endpoint associated to dataset else
        // we need to write the code ourselves what the fuck
        const sparqlEndpoint = 'http://arco.istc.cnr.it/visualPatterns/sparql';
        this.classService = new ClassService(new DbContext(sparqlEndpoint));
        //
        this.state = {
            classesWithScores: null
        };
    }

    componentDidMount() {
        // make navbar hidden
        this.fetchData();
    }

    componentDidUpdate() {
        const nav = document.getElementById('navbar');
        nav.classList.add('hidden-navbar');
        nav.classList.add('absolute-navbar');
        const navIcon = document.getElementById('nav-open');
        navIcon.classList.remove('hidden-nav-open');
        nav.addEventListener('mouseleave', this.hideNavbarListener);
        navIcon.addEventListener('mouseover', this.openNavbarListener);
    }

    componentWillUnmount() {
        const nav = document.getElementById('navbar');
        nav.classList.remove('hidden-navbar');
        nav.classList.remove('absolute-navbar');
        const navIcon = document.getElementById('nav-open');
        navIcon.removeEventListener('mouseover', this.openNavbarListener);
        nav.removeEventListener('mouseleave', this.hideNavbarListener);
    }

    openNavbarListener() {
        const nav = document.getElementById('navbar');
        nav.classList.remove('hidden-navbar');
    }

    hideNavbarListener() {
        const nav = document.getElementById('navbar');
        nav.classList.add('hidden-navbar');
        const navIcon = document.getElementById('nav-open');
        navIcon.classList.remove('hidden-nav-open');
    }

    fetchData() {
        // If there are instances of a single pattern loaded in the PatternStore we clean them
        // We expect a user click on a pattern and navigate new pattern instances
        // Navigation Scenario, Navigation Action:
        //      pattern screen, click on a pattern a visit its instances
        //      instances screen, filter and click on a instance visiting that instance
        //      instance screen, explore information of that single instance
        //      instance screen, go back button to instances screen
        //      instances screen, we found the previously loaded instances without query again
        //      instances screen, go back button
        //      pattern screen, clean the previously visited instances, ready to visit new ones
        this.context.executeAction(cleanInstances, {});

        if (!this.props.PatternStore.list) {
            this.context.executeAction(loadPatterns, {
                dataset: this.props.datasetURI //missing
            });
        }
        if (!this.state.classesWithScores) {
            this.classService
                .findAllClassesWithCentralityScore()
                .then(classesWithScores => {
                    this.setState({
                        classesWithScores: classesWithScores
                    });
                });
        }
    }

    render() {
        if (this.props.PatternStore.list && this.state.classesWithScores) {
            // we dependency inject the function to get instances by pattern URI
            // node is a Graphin node

            const KnowledgeGraph = require('odp-reactor').KnowledgeGraph;
            const Resource = require('odp-reactor').Resource;
            const scaleData = require('odp-reactor').scaleData;
            const ColorGenerator = require('odp-reactor').ColorGenerator;
            const PatternsAndClassesPage = require('odp-reactor')
                .PatternsAndClassesPage;

            const patterns = this.props.PatternStore.list;
            const classes = this.state.classesWithScores;

            const kg = new KnowledgeGraph();

            // add pattern resource to kg
            forEach(patterns, p => {
                const patternResource = Resource.create({
                    uri: p.pattern,
                    label: p.label,
                    description: p.description,
                    properties: {
                        type: 'Pattern',
                        occurences: p.occurences,
                        graphinProperties: {
                            onNodeOverTooltip: model => {
                                return `<span class="g6-tooltip-title">Pattern Name</span>:<span class="g6-tooltip-text">${model.label}</span></br> <span class="g6-tooltip-title">Description</span>:<span class="g6-tooltip-text">${model.data.description}</span><br/><span class="g6-tooltip-title">Occurrences</span>:<span class="g6-tooltip-text">${model.data.occurences}</span><br/><span class="g6-tooltip-title">Data</span>:<span class="g6-tooltip-text">${model.data.graphinProperties.dataInfo}</span><br/><span class="g6-tooltip-dblclick">Double click to view instances...</span>`;
                            },
                            graphinPatternNodeDoubleClick: () => {
                                if (p.occurences !== '0') {
                                    this.context.executeAction(navigateAction, {
                                        url: `${PUBLIC_URL}/datasets/${encodeURIComponent(
                                            this.props.datasetURI
                                        )}/patterns/${encodeURIComponent(
                                            p.pattern
                                        )}/color/${encodeURIComponent(
                                            'noColor'
                                        )}`
                                    });
                                }
                            },
                            shape: 'CustomNode',
                            dataInfo: dataInfoMap[p.pattern],
                            style: {
                                /** container 容齐 */
                                containerWidth: 40,
                                containerStroke: '#0693E3',
                                containerFill: '#fff',
                                /** icon 图标 */
                                iconSize: 10,
                                iconFill: '#0693E3',
                                /** badge 徽标 */
                                badgeFill: 'red',
                                badgeFontColor: '#fff',
                                badgeSize: 10,
                                /** text 文本 */
                                fontColor: '#3b3b3b',
                                fontSize: 20,
                                /** state */
                                dark: '#eee'
                            }
                        },
                        listProperties: {
                            listKeys: [
                                {
                                    label: 'Resources Categories',
                                    id: 'label'
                                },
                                {
                                    label: 'Description',
                                    id: 'description'
                                },
                                {
                                    label: 'Occurences',
                                    id: 'occurences'
                                }
                            ],
                            listItemClick: () => {
                                if (p.occurences !== '0') {
                                    this.context.executeAction(navigateAction, {
                                        url: `${PUBLIC_URL}/datasets/${encodeURIComponent(
                                            this.props.datasetURI
                                        )}/patterns/${encodeURIComponent(
                                            p.pattern
                                        )}/color/removeThis`
                                    });
                                }
                            }
                        }
                    }
                });
                kg.addResource(patternResource);
            });
            // add relations between pattern to kg
            forEach(patterns, p => {
                const patternResource = Resource.create({
                    uri: p.pattern
                });
                if (p.components !== '') {
                    let components = p.components.split(';');
                    forEach(components, c => {
                        const componentResource = Resource.create({
                            uri: c
                        });
                        const propertyResource = Resource.create({
                            label: 'has component'
                        });
                        kg.addTriple(
                            patternResource,
                            propertyResource,
                            componentResource
                        );
                    });
                }
                if (p.superPatterns !== '') {
                    let supers = p.superPatterns.split(';');
                    forEach(supers, s => {
                        const superResource = Resource.create({
                            uri: s
                        });
                        const propertyResource = Resource.create({
                            label: 'is a special case of'
                        });
                        kg.addTriple(
                            patternResource,
                            propertyResource,
                            superResource
                        );
                    });
                }
            });
            // add classes resources to kg
            forEach(classes, c => {
                const classResource = Resource.create({
                    uri: c.uri,
                    label: c.uri, // to be changed
                    description: c.description,
                    properties: {
                        type: 'Class',
                        centralityScore: c.pd,
                        graphinProperties: {
                            onNodeOverTooltip: model => {
                                return `<span class="g6-tooltip-title">Class Name</span>:<span class="g6-tooltip-text">${model.label}</span></br> <span class="g6-tooltip-title">Description</span>:<span class="g6-tooltip-text">${model.data.description}</span><br/><span class="g6-tooltip-title">Centrality Score</span>:<span class="g6-tooltip-text">${model.data.centralityScore}</span><br/><span class="g6-tooltip-title">Data</span>:<span class="g6-tooltip-text">${model.data.graphinProperties.dataInfo}</span><br/><span class="g6-tooltip-dblclick">Double click to view instances...</span>`;
                            },
                            graphinPatternNodeDoubleClick: () => {
                                console.log('Navigate to resource screen');
                                // this.context.executeAction(navigateAction, {
                                // url: `${PUBLIC_URL}/datasets/${encodeURIComponent(
                                //     this.props.datasetURI
                                // )}/patterns/${encodeURIComponent(
                                //     p.pattern
                                // )}/color/${encodeURIComponent(
                                //     "noColor"
                                // )}`
                                // });
                            },
                            shape: 'diamond',
                            type: 'diamond',
                            style: {
                                /** container 容齐 */
                                containerWidth: 40,
                                containerStroke: '#0693E3',
                                containerFill: '#fff',
                                /** icon 图标 */
                                iconSize: 10,
                                iconFill: '#0693E3',
                                /** badge 徽标 */
                                badgeFill: 'red',
                                badgeFontColor: '#fff',
                                badgeSize: 10,
                                /** text 文本 */
                                fontColor: '#3b3b3b',
                                fontSize: 20,
                                /** state */
                                dark: '#eee'
                            }
                        },
                        listProperties: {
                            listKeys: [
                                {
                                    label: 'Class',
                                    id: 'label'
                                },
                                {
                                    label: 'Description',
                                    id: 'description'
                                }
                            ],
                            listItemClick: () => {
                                console.log(
                                    'lIST ITEM CLICK NAVIGATE TO CLASS'
                                );
                                // this.context.executeAction(navigateAction, {
                                //     url: `${PUBLIC_URL}/datasets/${encodeURIComponent(
                                //         this.props.datasetURI
                                //     )}/patterns/${encodeURIComponent(
                                //         p.pattern
                                //     )}/color/removeThis`
                                // });
                            }
                        }
                    }
                });
                kg.addResource(classResource);
            });

            const colors = new ColorGenerator({
                colorCount: kg.getPatternCount()
            });
            const rndColors = colors.getColor();
            kg.forEachPattern((resourceURI, attributes) => {
                const oldGraphinProperties = kg.getResourceProperty(
                    resourceURI,
                    'graphinProperties'
                );
                const oldGraphinStyle = oldGraphinProperties['style'];
                let newGraphinProperties = Object.assign(
                    {},
                    oldGraphinProperties
                );
                let newGraphinStyle = Object.assign({}, oldGraphinStyle);
                const color = rndColors.next().value;
                newGraphinStyle.containerFill = color;
                newGraphinStyle.containerStroke = '#000';
                if (kg.getResourceProperty(resourceURI, 'occurences')) {
                    newGraphinStyle.containerWidth = Math.round(
                        scaleData(
                            kg.getResourceProperty(resourceURI, 'occurences'),
                            0,
                            350,
                            40,
                            150
                        )
                    );
                }
                newGraphinProperties.style = newGraphinStyle;
                kg.updateResourceProperty(
                    resourceURI,
                    'graphinProperties',
                    newGraphinProperties
                );
                kg.addResourceProperty(resourceURI, 'color', color);
            });

            return <PatternsAndClassesPage knowledgeGraph={kg} />;
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

PatternNetworkView.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
PatternNetworkView = connectToStores(
    PatternNetworkView,
    [PatternStore],
    function(context, props) {
        return {
            PatternStore: context.getStore(PatternStore).getState()
        };
    }
);

// const Graph = new Graph(this.props.PatternStore.list)

// const nodes = [
//     {
//         id: "node_1"
//     },
//     {
//         id: "node_2",
//         startTime: "1950",
//         endTime: "1980"
//     },
//     {
//         id: "node_3"
//     },
//     {
//         id: "node_4",
//         startTime: "1900",
//         endTime: "2000"
//     }
// ];

let dataInfoMap = {};
dataInfoMap['http://www.ontologydesignpatterns.org/cp/owl/collection'] =
    'Explore the instances to see information about collections of items in this dataset';
dataInfoMap['http://www.ontologydesignpatterns.org/cp/owl/part-of'] =
    'Explore instances of this pattern in the dataset to get information about things and the parts they’re composed of.';
dataInfoMap['http://www.ontologydesignpatterns.org/cp/owl/situation'] =
    'Explore the instances to get information about situations data and the things (participants, people, objects) involved in that situation.';
dataInfoMap[
    'http://www.ontologydesignpatterns.org/cp/owl/time-indexed-situation'
] =
    'Explore the instances of this pattern to get information about a situation, things involved and the time interval in which situation happened.';
dataInfoMap['http://www.ontologydesignpatterns.org/cp/owl/time-interval'] =
    'There are no independent time interval in the dataset.';
dataInfoMap[
    'https://w3id.org/arco/ontology/denotative-description/measurement-collection'
] =
    'Explore the instances of the pattern to view data relative to measurements collected about a cultural property.';
dataInfoMap[
    'https://w3id.org/arco/ontology/location/cultural-property-component-of'
] =
    'Explore the instances of this pattern to get information about a complex cultural property and components it\'s made by.';
dataInfoMap[
    'https://w3id.org/arco/ontology/location/time-indexed-typed-location'
] =
    'Explore instances of this pattern to get information about the location of a cultural property and the time period since it is in that location or where it was in the past.';
