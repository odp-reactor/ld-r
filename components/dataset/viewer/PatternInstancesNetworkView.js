import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import { handleHistory, navigateAction } from 'fluxible-router';

/* Flux
_________*/

import PatternStore from '../../../stores/PatternStore';
import loadPatternInstances from '../../../actions/loadPatternInstances';
import loadPatterns from '../../../actions/loadPatterns';
import cleanInstance from '../../../actions/cleanInstance';

import CustomLoader from '../../CustomLoader';
import Qty from 'js-quantities';

// import laodInstances action
// catch dataset id from route not from dataset store

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';

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
        // fetch schema again and compute color map

        // if (this.props.RouteStore._currentNavigate) {
        //     if (!this.props.RouteStore._currentNavigate.colorMap) {
        //         this.context.executeAction(loadPatterns, {
        //             dataset: datasetURI //missing
        //         });
        //     }
        // }
    }

    componentDidUpdate() {
        const nav = document.getElementById('navbar');
        nav.classList.add('hidden-navbar');
        nav.classList.add('absolute-navbar');
        const navIcon = document.getElementById('nav-open');
        navIcon.classList.remove('hidden-nav-open');
        navIcon.addEventListener('mouseover', this.openNavbarListener);
        nav.addEventListener('mouseleave', this.hideNavbarListener);
    }

    componentWillUnmount() {
        const nav = document.getElementById('navbar');
        nav.classList.remove('hidden-navbar');
        nav.classList.remove('absolute-navbar');
        const navIcon = document.getElementById('nav-open');
        navIcon.removeEventListener('mouseover', this.openNavbarListener);
        navIcon.classList.add('hidden-nav-open');
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

    render() {
        let getInstance;
        let getInstanceTableClick;
        let color;
        let colorMap;
        let patternId;
        const Graph = require('odp-reactor').Graph;
        const Measurement = require('odp-reactor').Measurement;
        if (this.props.RouteStore._currentNavigate) {
            patternId = this.props.RouteStore._currentNavigate.route.params.pid;
            getInstance = node => {
                // temporary disable time interval to avoid app crash as there is no visualization set for this pattern!
                if (
                    node.model.data.type !==
                    'http://www.ontologydesignpatterns.org/cp/owl/time-interval'
                )
                    this.context.executeAction(navigateAction, {
                        url: `${PUBLIC_URL}/dataset/${encodeURIComponent(
                            this.props.RouteStore._currentNavigate.route.params
                                .did
                        )}/resource/${encodeURIComponent(node.id)}`
                    });
            };
            getInstanceTableClick = node => {
                this.context.executeAction(navigateAction, {
                    url: `${PUBLIC_URL}/dataset/${encodeURIComponent(
                        this.props.RouteStore._currentNavigate.route.params.did
                    )}/resource/${encodeURIComponent(node.id)}`
                });
            };
        }

        if (this.props.PatternStore.instances) {
            const KG = require('odp-reactor').KG;
            const TimeIntervalFilter = require('odp-reactor')
                .TimeIntervalFilter;
            const SliderFilter = require('odp-reactor').SliderFilter;
            const GeoFilter = require('odp-reactor').GeoFilter;
            const scaleData = require('odp-reactor').scaleData;
            const PropertyFilter = require('odp-reactor').PropertyFilter;
            const graph = new Graph();
            const list = [];
            const nodes = [];

            const instances = this.props.PatternStore.instances;

            // counters are used to conditionally render filters
            // e.g.
            // if in the knowledge subgraph there are no nodes with startTime and endTime
            // the filter is not rendered
            let timeNodesCount = 0;
            let measureNodesCount = 0;
            let partNodesCount = 0;
            let geoNodesCount = 0;
            let locTypeNodesCount = 0;
            const measureTypes = new Set(); // memorize the measure type key to prepare filters
            for (let i = 0; i < instances.length; i++) {
                const instanceNode = instances[i];
                //******************* PREPARING DATA TO FILTERS and FOR GRAPH */
                // check well data

                let nodeForFilters = { id: instanceNode.instance };

                // prepare startTime and endTime for time filter
                if (instanceNode.startTime && instanceNode.endTime) {
                    let startTime, endTime;
                    let s = instanceNode.startTime.match(/\d+/g);
                    let e = instanceNode.endTime.match(/\d+/g);
                    startTime = s ? s[0] : null; // clean time iwth regex ex. 1876 ante , post 1678
                    endTime = e ? e[0] : null;
                    nodeForFilters['startTime'] = startTime;
                    nodeForFilters['endTime'] = endTime;
                    timeNodesCount++;
                }
                if (instanceNode.locationType) {
                    nodeForFilters['locationType'] = instanceNode.locationType;
                    locTypeNodesCount++;
                }
                if (instanceNode.lat && instanceNode.long) {
                    nodeForFilters['lat'] = instanceNode.lat;
                    nodeForFilters['long'] = instanceNode.long;
                    geoNodesCount++;
                }
                if (instanceNode.measures) {
                    let measures = instanceNode.measures.split(';');
                    measures.forEach(measure => {
                        let [rawm, v, u] = measure.split(' ');
                        let m = rawm.split('-').pop();

                        const lengthUnits = ['cm', 'm', 'mm'];
                        const defaultMeasurementUnit = 'mm';

                        if (lengthUnits.includes(u) && v != 'MNR') {
                            v = v.replace(',', '.');
                            // do conversion

                            const measurement = Measurement.create({
                                unit: u,
                                value: v * 1
                            });
                            const newMeasurement = measurement.convert(
                                defaultMeasurementUnit
                            );
                            if (newMeasurement) {
                                v = newMeasurement.getValue();
                                u = newMeasurement.getUnit();
                            }
                        }

                        if (Number.parseInt(v)) {
                            measureTypes.add(m);
                            instanceNode[m] = v;
                            instanceNode['measurementUnit'] = u;
                            nodeForFilters[m] = v;
                        }
                    });
                    nodeForFilters['measureCount'] = measures
                        ? measures.length
                        : null;
                    measureNodesCount++;
                }
                if (instanceNode.parts) {
                    nodeForFilters['parts'] = instanceNode.parts.split(';')
                        ? instanceNode.parts.split(';').length
                        : null;
                    partNodesCount++;
                }
                // parts filter
                // nodes for filters
                nodes.push(nodeForFilters);

                graph.addNode({
                    id: instanceNode.instance,
                    data: instanceNode,
                    label: `${instanceNode.label.substring(0, 35)}...`,
                    description: instanceNode.description,
                    style: {
                        /** container 容齐 */
                        containerWidth: 40,
                        containerStroke: '#0693E3',
                        // containerFill: colorMap
                        //     ? colorMap[instanceNode.type]
                        //     : color,
                        containerFill: color,
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
            }

            graph.nodes.forEach(node => {
                let listNode = {};
                switch (instances[0].type) {
                    case 'https://w3id.org/arco/ontology/location/time-indexed-typed-location':
                        listNode['id'] = node.id;
                        listNode['Label'] = node.data.data.label;
                        listNode['Location Type'] = node.data.data.locationType
                            ? node.data.data.locationType.split('/').pop()
                            : null;
                        listNode['Start Time'] = node.data.data.startTime;
                        listNode['End Time'] = node.data.data.endTime;
                        listNode['Address'] = node.data.data.addressLabel;
                        listNode['Latitude'] = node.data.data.lat;
                        listNode['Longitude'] = node.data.data.long;
                        list.push(listNode);
                        break;
                    case 'https://w3id.org/arco/ontology/location/cultural-property-component-of':
                        listNode['id'] = node.id;
                        listNode['Label'] = node.data.data.label;
                        listNode['Parts'] = node.data.data.parts
                            ? node.data.data.parts.split(';').length
                            : null;
                        list.push(listNode);
                        break;
                    case 'https://w3id.org/arco/ontology/denotative-description/measurement-collection':
                        listNode['id'] = node.id;
                        listNode['Label'] = node.data.data.label;
                        listNode['Height'] = node.data.data.height
                            ? withUnit(
                                node.data.data.height,
                                node.data.data.measurementUnit
                            )
                            : '';
                        listNode['Width'] = node.data.data.width
                            ? withUnit(
                                node.data.data.width,
                                node.data.data.measurementUnit
                            )
                            : '';
                        listNode['Length'] = node.data.data.length
                            ? withUnit(
                                node.data.data.length,
                                node.data.data.measurementUnit
                            )
                            : '';
                        listNode['Depth'] = node.data.data.depth
                            ? withUnit(
                                node.data.data.depth,
                                node.data.data.measurementUnit
                            )
                            : '';
                        listNode['Diameter'] = node.data.data.diameter
                            ? withUnit(
                                node.data.data.diameter,
                                node.data.data.measurementUnit
                            )
                            : '';
                        listNode['Thickness'] = node.data.data.thickness
                            ? withUnit(
                                node.data.data.thickness,
                                node.data.data.measurementUnit
                            )
                            : '';
                        list.push(listNode);
                        break;
                }
            });

            const patternStateKey = `${patternId}State`;
            const defaultConfig =
                JSON.parse(
                    window.sessionStorage.getItem(patternStateKey),
                    reviver
                ) || null;

            // render filters only if there are nodes they can filter
            return (
                <KG
                    defaultLayoutOptions={{
                        menu: true,
                        help: true,
                        tableLayout: true,
                        graphLayout: false,
                        currentLayout: 'list'
                    }}
                    defaultConfig={defaultConfig}
                    data={{ graph: graph, list: list, nodes: nodes }}
                    list={list}
                    onContextChange={context => {
                        window.sessionStorage.setItem(
                            patternStateKey,
                            JSON.stringify(context, replacer)
                        );
                    }}
                    textOnNodeHover={model => {
                        switch (model.data.data.type) {
                            case 'https://w3id.org/arco/ontology/location/time-indexed-typed-location':
                                return `<span class="g6-tooltip-title">Label</span>:<span class="g6-tooltip-text">${model.data.data.label}</span><br/><span class="g6-tooltip-title">Location Type</span>:<span class="g6-tooltip-text">${model.data.data.locationType}</span><br/><span class="g6-tooltip-title">Start Time</span>:<span class="g6-tooltip-text">${model.data.data.startTime}</span>
                            <br/><span class="g6-tooltip-title">End Time</span>:<span class="g6-tooltip-text">${model.data.data.endTime}</span><br/><span class="g6-tooltip-title">Location</span>:<span class="g6-tooltip-text">${model.data.data.addressLabel}</span>`; //<br/>
                            case 'https://w3id.org/arco/ontology/denotative-description/measurement-collection':
                                let measureString = '';
                                if (model.data.data.measures) {
                                    model.data.data.measures
                                        .split(';')
                                        .forEach(m => {
                                            let [type, v, u] = m.split(' ');
                                            let t = type.split('-').pop();
                                            measureString =
                                                measureString +
                                                `<span class="g6-tooltip-title">${t}</span>:<span class="g6-tooltip-text">${v} ${u.toLowerCase()}</span><br/>`;
                                        });
                                }
                                return `<span class="g6-tooltip-title">Label</span>:<span class="g6-tooltip-text">${model.data.data.label}</span><br/>${measureString}`;
                            case 'https://w3id.org/arco/ontology/location/cultural-property-component-of':
                                return `<span class="g6-tooltip-title">Label</span>:<span class="g6-tooltip-text">${
                                    model.data.data.label
                                }</span><br/><span class="g6-tooltip-title">Parts</span>:<span class="g6-tooltip-text">${
                                    model.data.data.parts
                                        ? model.data.data.parts.split(';')
                                            .length
                                        : ''
                                }</span>`;
                        }
                    }}
                    onNodeDoubleClick={getInstance}
                    onItemClick={getInstanceTableClick}
                    itemTooltip="Click to explore the resource"
                    listTitle={'Instances'}
                >
                    {measureNodesCount > 0 ? (
                        <SliderFilter
                            title={'Filter by number of measurements'}
                            valueKey="measureCount"
                        />
                    ) : null}
                    {partNodesCount > 0 ? (
                        <SliderFilter
                            title={'Filter by number of parts'}
                            valueKey="parts"
                        />
                    ) : null}
                    {locTypeNodesCount > 0 ? (
                        <PropertyFilter
                            title={'Filter by Location Type'}
                            property="locationType"
                        />
                    ) : null}
                    {timeNodesCount > 0 ? (
                        <TimeIntervalFilter title={'Filter by Time Interval'} />
                    ) : null}
                    {Array.from(measureTypes).length !== 0
                        ? Array.from(measureTypes).map(measure => {
                            return (
                                <SliderFilter
                                    title={`Filter by ${measure}`}
                                    valueKey={measure}
                                    id={measure}
                                    measurementUnit="mm"
                                />
                            );
                        })
                        : null}
                    {geoNodesCount > 0 ? (
                        <GeoFilter title={'Filter by Geographic Location'} />
                    ) : null}
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

function withUnit(value, unit, defaultMeasurementUnit = 'm') {
    const v = Qty(`${value} ${unit}`).format(defaultMeasurementUnit);
    return v;
}
