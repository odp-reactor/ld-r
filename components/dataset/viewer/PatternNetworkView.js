import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';

/* Flux
_________*/

import loadPatterns from '../../../actions/loadPatterns';
import saveColorMap from '../../../actions/saveColorMap';
import cleanInstances from '../../../actions/cleanInstances';
import PatternStore from '../../../stores/PatternStore';
import { navigateAction } from 'fluxible-router';
import CustomLoader from '../../CustomLoader';

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';

export default class PatternNetworkView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // make navbar hidden
        this.fetchData();
    }

    componentDidUpdate() {
        const nav = document.getElementById('navbar');
        console.log('Nav element');
        console.log(nav);
        nav.classList.add('hidden-navbar');
        nav.classList.add('absolute-navbar');
        const navIcon = document.getElementById('nav-open');
        navIcon.classList.remove('hidden-nav-open');
        navIcon.addEventListener('mouseover', () => {
            nav.classList.remove('hidden-navbar');
        });
        nav.addEventListener('mouseleave', () => {
            nav.classList.add('hidden-navbar');
            navIcon.classList.remove('hidden-nav-open');
        });
    }

    componentWillUnmount() {
        const nav = document.getElementById('navbar');
        nav.classList.remove('hidden-navbar');
        nav.classList.remove('absolute-navbar');
        const navIcon = document.getElementById('nav-open');
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
    }

    render() {
        if (this.props.PatternStore.list) {
            // we dependency inject the function to get instances by pattern URI
            // node is a Graphin node

            const KG = require('odp-reactor').KG;
            const PatternFilter = require('odp-reactor').PatternFilter;
            const SliderFilter = require('odp-reactor').SliderFilter;
            const Graph = require('odp-reactor').Graph;
            const scaleData = require('odp-reactor').scaleData;
            const graph = new Graph();
            const list = [];
            const nodes = [];

            const patterns = this.props.PatternStore.list;
            for (let i = 0; i < patterns.length; i++) {
                const pNode = patterns[i];
                // add nodes to graph
                graph.addNode({
                    id: pNode.pattern,
                    occurences: pNode.occurences,
                    data: pNode,
                    label: pNode.label,
                    description: pNode.description,
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
                });
                // add component triples
                if (pNode.components !== '') {
                    let components = pNode.components.split(';');
                    for (let j = 0; j < components.length; j++) {
                        graph.addEdge({
                            s: { id: pNode.pattern },
                            p: 'has component',
                            o: { id: components[j] }
                        });
                    }
                }
                // add specializations triples
                if (pNode.superPatterns !== '') {
                    let supers = pNode.superPatterns.split(';');
                    for (let j = 0; j < supers.length; j++) {
                        graph.addEdge({
                            s: { id: pNode.pattern },
                            p: 'specialize',
                            o: { id: supers[j] }
                        });
                    }
                }
            }

            // this filter is passed to a bfs algorithm to apply colors and size scaling to every node
            // we use bfs to assign similar color to semantically close nodes
            const nodeColorSizeFilter = (node, id) => {
                // set colors according to a gradient
                node.style.containerFill = graph.nodeGradient()[id];
                node.style.containerStroke = '#000';
                // set size as a proportion of occurrences
                // we add this as we can filter on this with slider filter
                if (node.data.occurences !== 0) {
                    node.style.cursor = 'pointer';
                }
                if (node.data.occurences === 0) {
                    node.style.opacity = 0.3;
                }
                // compute dynamically max and min degree
                // with 0 occurrences -> -Infinity
                node.style.containerWidth = Math.round(
                    scaleData(node.data.occurences, 0, 350, 40, 150)
                );
            };
            graph.breadthFirstSearch(nodeColorSizeFilter);

            let colorMap = {};

            graph.nodes.forEach(n => {
                colorMap[n.id] = n.style.containerFill;
            });

            this.context.executeAction(saveColorMap, colorMap);

            const getInstances = node => {
                console.log(node);
                if (node.model.data.data.occurences !== '0') {
                    console.log('GET INSTANCE');
                    console.log(PUBLIC_URL);
                    console.log(encodeURIComponent(this.props.datasetURI));
                    console.log(encodeURIComponent(node.id));
                    console.log(
                        encodeURIComponent(node.model.style.containerFill)
                    );
                    this.context.executeAction(navigateAction, {
                        url: `${PUBLIC_URL}/datasets/${encodeURIComponent(
                            this.props.datasetURI
                        )}/patterns/${encodeURIComponent(
                            node.id
                        )}/color/${encodeURIComponent(
                            node.model.style.containerFill
                        )}`,
                        colorMap: colorMap
                    });
                }
            };
            const getInstancesTableClick = node => {
                if (node['Number of Instances'] !== '0') {
                    this.context.executeAction(navigateAction, {
                        url: `${PUBLIC_URL}/datasets/${encodeURIComponent(
                            this.props.datasetURI
                        )}/patterns/${encodeURIComponent(
                            node.id
                        )}/color/removeThis`,
                        colorMap: colorMap
                    });
                }
            };

            // TODO :
            // set colors for KnowledgeGraph here
            // set node size here
            // link filters

            graph.nodes.forEach(node => {
                let listNode = {};
                listNode['id'] = node.id;
                listNode['Id'] = node.id;
                listNode['Pattern Name'] = node.data.data.label;
                listNode['Description'] = node.data.data.description;
                listNode['Number of Instances'] = node.data.data.occurences;
                list.push(listNode);

                // nodes for filters, on every node all the information for every filter used
                console.log(node);
                nodes.push({
                    // id ! required
                    id: node.data.data.pattern,
                    // property fitler
                    title: node.data.data.pattern.split('/').pop(),
                    value: Number.parseInt(node.data.data.occurences),
                    color: node.style.containerFill,
                    // occurrency filter
                    occurences: node.data.data.occurences
                });
            });

            const defaultConfig =
                JSON.parse(
                    window.sessionStorage.getItem('patternState'),
                    reviver
                ) || null;

            return (
                <KG
                    defaultConfig={defaultConfig}
                    onContextChange={context => {
                        window.sessionStorage.setItem(
                            'patternState',
                            JSON.stringify(context, replacer)
                        );
                    }}
                    data={{ graph: graph, list: list, nodes: nodes }}
                    onNodeDoubleClick={getInstances}
                    textOnNodeHover={model => {
                        return `<span class="g6-tooltip-title">Pattern Name</span>:<span class="g6-tooltip-text">${model.data.data.label}</span></br> <span class="g6-tooltip-title">Description</span>:<span class="g6-tooltip-text">${model.data.data.description}</span><br/> <span class="g6-tooltip-title">Occurrences</span>:<span class="g6-tooltip-text">${model.data.occurences}</span><br/>`;
                    }}
                    onItemClick={getInstancesTableClick}
                    itemTooltip="Click to explore instances of this pattern"
                    listTitle={'Ontology Design Patterns'}
                >
                    <SliderFilter
                        valueKey="occurences"
                        title="Filter by Occurences"
                    />
                    <PatternFilter title={'Filter by Pattern'} />
                </KG>
            );
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

function replacer(key, value) {
    const originalObject = this[key];
    if (originalObject instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(originalObject.entries()) // or with spread: value: [...originalObject]
        };
    } else {
        return value;
    }
}

function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
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
