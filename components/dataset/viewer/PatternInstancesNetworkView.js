import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import { handleHistory, navigateAction } from 'fluxible-router';

/* Flux
_________*/

import PatternStore from '../../../stores/PatternStore';
import loadPatternInstances from '../../../actions/loadPatternInstances';
import cleanInstance from '../../../actions/cleanInstance';

import CustomLoader from '../../CustomLoader';

// import laodInstances action
// catch dataset id from route not from dataset store

export default class PatternInstancesNetworkView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // If there are resources of a pattern instance loaded in the PatternInstancesStore we clean them
        // We expect a user click on an instance and explore new data
        // Navigation Scenario, Navigation Action:
        //      instances screen, filter and click on a instance visiting that instance
        //      instance screen, explore information of that single instance
        //      instance screen, go back button to instances screen
        //      instances screen, we found the previously loaded instances without query again
        //      instances screen we clean data of the previously visited instance
        //      instances screen, click on a new instance
        //      instance screen, new data for this instance are loaded
        this.context.executeAction(cleanInstance, {});

        // we get these URIs from url params in currentNavigate
        // we receive this in props from navigateHandler
        const datasetURI = this.props.RouteStore._currentNavigate.route.params
            .did;
        const patternURI = this.props.RouteStore._currentNavigate.route.params
            .pid;
        if (!this.props.PatternStore.instances) {
            if (datasetURI && patternURI) {
                context.executeAction(loadPatternInstances, {
                    dataset: datasetURI,
                    pattern: patternURI
                });
            }
        }
    }

    render() {
        let getInstance;
        let getInstanceTableClick;
        let color;
        if (this.props.RouteStore._currentNavigate) {
            // node color
            color = this.props.RouteStore._currentNavigate.route.params.c;

            getInstance = node => {
                // temporary disable time interval to avoid app crash as there is no visualization set for this pattern!
                if (
                    node.model.data.type !==
                    'http://www.ontologydesignpatterns.org/cp/owl/time-interval'
                )
                    this.context.executeAction(navigateAction, {
                        url: `/dataset/${encodeURIComponent(
                            this.props.RouteStore._currentNavigate.route.params
                                .did
                        )}/resource/${encodeURIComponent(node.id)}`
                    });
            };
            getInstanceTableClick = node => {
                console.log('instance table click');
                console.log(node);
                this.context.executeAction(navigateAction, {
                    url: `/dataset/${encodeURIComponent(
                        this.props.RouteStore._currentNavigate.route.params.did
                    )}/resource/${encodeURIComponent(node.id)}`
                });
            };
        }

        if (this.props.PatternStore.instances) {
            const KG = require('ld-ui-react').KG;
            const Graph = require('ld-ui-react').Graph;
            const TimeIntervalFilter = require('ld-ui-react')
                .TimeIntervalFilter;
            const SliderFilter = require('ld-ui-react').SliderFilter;
            const GeoFilter = require('ld-ui-react').GeoFilter;
            const scaleData = require('ld-ui-react').scaleData;
            const graph = new Graph();

            const instances = this.props.PatternStore.instances;

            const timeNodes = [];
            const measureCountNodes = [];
            const partNodes = [];
            const measureTypes = {};
            for (let i = 0; i < instances.length; i++) {
                const instanceNode = instances[i];
                //******************* PREPARING DATA TO FILTERS and FOR GRAPH */
                // check well data

                if (instanceNode.startTime && instanceNode.endTime) {
                    let s = instanceNode.startTime.match(/\d+/g);
                    let e = instanceNode.endTime.match(/\d+/g);
                    timeNodes.push({
                        id: instanceNode.instance,
                        startTime: s ? s[0] : '', // clean time iwth regex ex. 1876 ante , post 1678
                        endTime: e ? e[0] : ''
                    });
                }
                if (instanceNode.measures) {
                    let measures = instanceNode.measures.split(';');
                    measureCountNodes.push({
                        id: instanceNode.instance,
                        count: measures.length
                    });
                    measures.forEach(measure => {
                        const [rawm, v, u] = measure.split(' ');
                        let m = rawm.split('-').pop();
                        if (!measureTypes[m]) measureTypes[m] = [];
                        if (Number.parseInt(v)) {
                            measureTypes[m].push({
                                id: instanceNode.instance,
                                value: v
                            });
                            instanceNode[m] = v;
                        }
                    });
                }
                if (instanceNode.parts) {
                    let parts = instanceNode.parts.split(';');
                    partNodes.push({
                        id: instanceNode.instance,
                        count: parts.length
                    });
                }

                graph.addNode({
                    id: instanceNode.instance,
                    data: instanceNode,
                    label: instanceNode.label,
                    description: instanceNode.description,
                    style: {
                        primaryColor: color
                    }
                });
            }

            let formatter;
            // assign a formatter for the table to every node
            switch (instances[0].type) {
                case 'https://w3id.org/arco/ontology/location/time-indexed-typed-location':
                    formatter = node => {
                        return {
                            label: node.label,
                            locationType: node.data.data.locationType
                                .split('/')
                                .pop(),
                            startTime: node.data.data.startTime,
                            endTime: node.data.data.endTime,
                            address: node.data.data.addressLabel,
                            lat: node.data.data.lat,
                            long: node.data.data.long
                        };
                    };
                    break;
                case 'https://w3id.org/arco/ontology/location/cultural-property-component-of':
                    formatter = node => {
                        return {
                            label: node.label,
                            parts: node.data.data.parts.split(';').length
                        };
                    };
                    break;

                case 'https://w3id.org/arco/ontology/denotative-description/measurement-collection':
                    formatter = node => {
                        return {
                            label: node.label,
                            height: node.data.data.height,
                            width: node.data.data.width,
                            length: node.data.data.length,
                            depth: node.data.data.depth,
                            diameter: node.data.data.diameter,
                            thickness: node.data.data.thickness
                        };
                    };
                    break;
            }

            // render filters only if there are nodes they can filter
            return (
                <KG
                    tableFormatter={formatter}
                    graph={graph}
                    textOnNodeHover={model => {
                        switch (model.data.data.type) {
                            case 'https://w3id.org/arco/ontology/location/time-indexed-typed-location':
                                return `Location Type : ${model.data.data.locationType}<br/> Start Time : ${model.data.data.startTime}
                            <br/> End Time: ${model.data.data.endTime} <br/> Location: ${model.data.data.addressLabel}`; //<br/>
                            case 'https://w3id.org/arco/ontology/denotative-description/measurement-collection':
                                let measureString = '';
                                model.data.data.measures
                                    .split(';')
                                    .forEach(m => {
                                        let [type, v, u] = m.split(' ');
                                        let t = type.split('-').pop();
                                        measureString =
                                            measureString +
                                            `${t} : ${v} ${u.toLowerCase()}<br/>`;
                                    });
                                return `Label : ${model.data.data.label} <br/> ${measureString}`;
                            case 'https://w3id.org/arco/ontology/location/cultural-property-component-of':
                                return `Label : ${
                                    model.data.data.label
                                } <br/> Parts : ${
                                    model.data.data.parts.split(';').length
                                }`;
                        }
                    }}
                    onNodeDoubleClick={getInstance}
                    onItemClick={getInstanceTableClick}
                    itemTooltip="Click to explore the resource"
                >
                    {measureCountNodes.length !== 0 ? (
                        <SliderFilter
                            nodes={measureCountNodes}
                            title={'Filter by number of measurements'}
                            valueKey="count"
                        />
                    ) : null}
                    {partNodes.length !== 0 ? (
                        <SliderFilter
                            nodes={partNodes}
                            title={'Filter by number of parts'}
                            valueKey="count"
                        />
                    ) : null}
                    {timeNodes.length !== 0 ? (
                        <TimeIntervalFilter
                            nodes={timeNodes}
                            title={'Filter by Time Interval'}
                        />
                    ) : null}
                    {Object.keys(measureTypes).length !== 0
                        ? Object.keys(measureTypes).map(k => {
                            return (
                                <SliderFilter
                                    nodes={measureTypes[k]}
                                    title={`Filter by ${k}`}
                                    valueKey="value"
                                    options={{ key: k }}
                                />
                            );
                        })
                        : null}
                    <GeoFilter title={'Filter by Geographic Location'} />
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

PatternInstancesNetworkView.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
PatternInstancesNetworkView = connectToStores(
    PatternInstancesNetworkView,
    [PatternStore],
    function(context, props) {
        return {
            PatternStore: context.getStore(PatternStore).getState(),
            RouteStore: context.getStore('RouteStore')
        };
    }
);

// PatternInstancesNetworkView = handleHistory(PatternInstancesNetworkView, {
//     enableScroll: false // example to show how to specify options for handleHistory
// });
