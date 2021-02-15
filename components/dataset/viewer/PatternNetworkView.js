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
import NavbarHider from './NavbarHider';
import { forEach, filter } from 'lodash';

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
        // BUT it's a simple query to dynamic endpoint
        const sparqlEndpoint = 'https://arco.istc.cnr.it/visualPatterns/sparql';
        this.classService = new ClassService(new DbContext(sparqlEndpoint));
        //
        this.state = {
            classesWithPatternsAndScores: null
        };
        this.navbarHider = new NavbarHider();
    }

    componentDidMount() {
        // make navbar hidden
        this.fetchData();
    }

    componentDidUpdate() {
        this.navbarHider.hideNavbarAndAddShowOnOverListener();
    }

    componentWillUnmount() {
        this.navbarHider.showNavbarAndRemoveShowOnOverListener();
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
        if (!this.state.classesWithPatternsAndScores) {
            this.classService
                .findClassesWithPatternsAndScores()
                .then(classesWithPatternsAndScores => {
                    this.setState({
                        classesWithPatternsAndScores: classesWithPatternsAndScores
                    });
                });
        }
    }

    render() {
        if (
            this.props.PatternStore.list &&
            this.state.classesWithPatternsAndScores
        ) {
            // we dependency inject the function to get instances by pattern URI
            // node is a Graphin node

            const KnowledgeGraph = require('odp-reactor').KnowledgeGraph;
            const Resource = require('odp-reactor').Resource;
            const scaleData = require('odp-reactor').scaleData;
            const findMinMax = require('odp-reactor').findSliderDomain;
            const ColorGenerator = require('odp-reactor').ColorGenerator;
            const PatternsAndClassesPage = require('odp-reactor')
                .PatternsAndClassesPage;

            const patterns = filter(this.props.PatternStore.list, p => {
                return p.occurences !== '0';
            });
            const classes = this.state.classesWithPatternsAndScores;

            const [minCentralityScore, maxCentralityScore] = findMinMax(
                classes,
                'pd'
            );

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
                                return `<span class="g6-tooltip-title">Pattern Name</span>:<span class="g6-tooltip-text">${model.label}</span></br> <span class="g6-tooltip-title">Description</span>:<span class="g6-tooltip-text">${model.data.graphinProperties.dataInfo}</span><br/><span class="g6-tooltip-title">Occurrences</span>:<span class="g6-tooltip-text">${model.data.occurences}</span><br/><span class="g6-tooltip-dblclick">Double click to view instances...</span>`;
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
            // add classes resources to kg and relation with patterns
            forEach(classes, c => {
                const classResource = Resource.create({
                    uri: c.uri,
                    label: c.label, // to be changed
                    description: c.description,
                    properties: {
                        type: 'Class',
                        centralityScore: c.pd,
                        graphinProperties: {
                            onNodeOverTooltip: model => {
                                return `<span class="g6-tooltip-title">Entity</span>:<span class="g6-tooltip-text">${
                                    model.label
                                }</span></br> <span class="g6-tooltip-title">Description</span>:<span class="g6-tooltip-text">${
                                    model.data.description
                                }</span><br/><span class="g6-tooltip-title">Relevance</span>:<span class="g6-tooltip-text">${scaleInto01(
                                    model.data.centralityScore,
                                    minCentralityScore,
                                    maxCentralityScore
                                )}</span><br/><span class="g6-tooltip-dblclick">Double click to view entities...</span>`;
                            },
                            graphinPatternNodeDoubleClick: () => {
                                this.context.executeAction(navigateAction, {
                                    url: `${PUBLIC_URL}/datasets/${encodeURIComponent(
                                        this.props.datasetURI
                                    )}/classes/${encodeURIComponent(c.uri)}`
                                });
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
                                this.context.executeAction(navigateAction, {
                                    url: `${PUBLIC_URL}/datasets/${encodeURIComponent(
                                        this.props.datasetURI
                                    )}/classes/${encodeURIComponent(c.uri)}`
                                });
                            }
                        }
                    }
                });
                kg.addResource(classResource);
                const relatedPattern = kg.getResource(c.pattern);
                if (relatedPattern) {
                    const classPatternRelation = Resource.create({
                        label: 'involves'
                    });
                    kg.addTriple(
                        classResource,
                        classPatternRelation,
                        relatedPattern
                    );
                }
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
    'Cultural properties described through collections of measurements e.g. dimensional measures. Explore this view to see the data about measurements collected for a cultural property.';
dataInfoMap[
    'https://w3id.org/arco/ontology/location/cultural-property-component-of'
] =
    'Cultural Properties and their components. Explore this view to see the data about a complex cultural property and components it\'s made by.';
dataInfoMap[
    'https://w3id.org/arco/ontology/location/time-indexed-typed-location'
] =
    'Locations of cultural properties at a certain time and with a specific location (e.g Current Location). Explore this view to see the data about the location of a cultural property and the time period since it is in that location or where it was in the past.';

function scaleInto01(x, min, max) {
    return (x - min) / (max - min);
}
