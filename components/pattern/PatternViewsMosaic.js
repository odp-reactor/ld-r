import React from 'react';
import PartWholeView from './viewer/PartWholeView';
import TimeIndexedTypedLocationView from './viewer/TimeIndexedTypedLocationView';
import CollectionView from './viewer/CollectionView';

import PatternService from '../../services/clientside-services/PatternService';
import DbContext from '../../services/base/DbContext';
import { clone, chunk } from 'lodash';
import { Grid, Segment } from 'semantic-ui-react';

export default class PatternViewsMosaic extends React.Component {
    constructor(props) {
        super(props);
        const sparqlEndpoint = 'https://arco.istc.cnr.it/visualPatterns/sparql';
        this.patternService = new PatternService(new DbContext(sparqlEndpoint));
        //
        this.state = {
            patternInstances: []
        };
    }
    componentDidMount() {
        if (this.props.patternInstancesUris) {
            this.props.patternInstancesUris.forEach(patternInstanceUri => {
                this.patternService
                    .findPattern(patternInstanceUri)
                    .then(pattern => {
                        let newPatternInstances = clone(
                            this.state.patternInstances
                        );
                        newPatternInstances.push({
                            uri: patternInstanceUri,
                            type: pattern.type,
                            typeLabel: pattern.typeLabel
                        });
                        this.setState({
                            patternInstances: newPatternInstances
                        });
                    });
            });
        }
    }
    render() {
        if (this.props.patternInstancesUris.length === 0) {
            return null;
        }
        if (this.state.patternInstances.length === 0) {
            return null;
        }
        let titlCount = 0;
        let rowCount = 0;

        const viewTitleStyle = {
            fontSize: 20,
            color: 'rgb(98, 91, 95)',
            marginBottom: 40
        };

        const cellStyle = {
            borderBottom: '1px solid rgba(34,36,38,.15)',
            marginBottom: 50
        };

        const timeIndexedTypedLocationInstances = this.state.patternInstances.filter(
            p => {
                return (
                    p.type ===
                    'https://w3id.org/arco/ontology/location/time-indexed-typed-location'
                );
            }
        );
        const nonTimeIndexedTypedLocationInstancs = this.state.patternInstances.filter(
            p => {
                return (
                    p.type !==
                    'https://w3id.org/arco/ontology/location/time-indexed-typed-location'
                );
            }
        );

        let index = 0;
        const viewsContent = [];
        nonTimeIndexedTypedLocationInstancs.forEach(patternInstance => {
            if (
                patternInstance.type ===
                'https://w3id.org/arco/ontology/location/cultural-property-component-of'
            ) {
                viewsContent.push(
                    <div key={index} style={index % 2 === 0 ? cellStyle : {}}>
                        <div class="mosaic-view-title" style={viewTitleStyle}>
                            {patternInstance.typeLabel}
                        </div>
                        <PartWholeView
                            pattern={patternInstance.type}
                            dataset={this.props.datasetURI}
                            patternInstanceUri={patternInstance.uri}
                            showPropertyValueList={true}
                            styles={{
                                partWhole: {
                                    containerStyle: {
                                        width: 450
                                    },
                                    littleItemStyle: {
                                        width: 100
                                    },
                                    centerItemStyle: {
                                        width: 300
                                    }
                                }
                            }}
                        />
                    </div>
                );
            }
            if (
                patternInstance.type ===
                'https://w3id.org/arco/ontology/denotative-description/measurement-collection'
            ) {
                viewsContent.push(
                    <div key={index} style={index % 2 === 0 ? cellStyle : {}}>
                        <div class="mosaic-view-title" style={viewTitleStyle}>
                            {patternInstance.typeLabel}
                        </div>
                        <CollectionView
                            pattern={patternInstance.type}
                            dataset={this.props.datasetURI}
                            patternInstanceUri={patternInstance.uri}
                            showPropertyValueList={true}
                            hideCulturalProperty={true}
                            styles={{
                                depiction: {
                                    width: '100%',
                                    margin: 'auto'
                                },
                                collection: {
                                    collectionContainerWidth: {
                                        width: '120%' // set this width to 120, 130, 140% to increase padding between items
                                    }
                                }
                            }}
                        />
                    </div>
                );
            }
            index++;
        });
        if (timeIndexedTypedLocationInstances.length > 0) {
            viewsContent.push(
                <div key={index} style={index % 2 === 0 ? cellStyle : {}}>
                    <div class="mosaic-view-title" style={viewTitleStyle}>
                        {timeIndexedTypedLocationInstances[0].typeLabel}
                    </div>
                    <TimeIndexedTypedLocationView
                        key={timeIndexedTypedLocationInstances.reduce(
                            (string, p) => {
                                console.log(p);
                                return string + p.uri;
                            },
                            ''
                        )}
                        pattern={timeIndexedTypedLocationInstances[0].type}
                        dataset={this.props.datasetURI}
                        patternInstancesUri={timeIndexedTypedLocationInstances.map(
                            p => {
                                return p.uri;
                            }
                        )}
                        showPropertyValueList={true}
                        hideCulturalProperty={true}
                    />
                </div>
            );
        }

        const viewsRowsAndColumns = chunk(viewsContent, 1).map(function(group) {
            return <Grid.Column>{group}</Grid.Column>;
        });

        return (
            // <div
            //     style={{
            //         /* display: flex; */
            //         display: "grid",
            //         /* grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); */
            //         gridAutoFlow: "column",
            //         gridGap: 20,
            //         gridTemplateRows: "50% 50%",
            //         gridTemplateColumns: "50% 50%",
            //         padding: 10,
            //         rowGap: 80
            //     }}
            // >
            <Grid
                container
                stackable
                columns={2}
                celled
                divided="vertically"
                // verticalAlign="middle"
            >
                <Grid.Row>{viewsRowsAndColumns}</Grid.Row>
            </Grid>
        );
        // return this.props.patternViews.map(viewKey => {
        //     if (viewKey === "partWhole") return <PartWholeView />;
        //     if (viewKey === "collection") return <CollectionView />;
        //     if (viewKey === "timeIndexedTypedLocation")
        //         return <TimeIndexedTypedLocationView />;
        // });
    }
}
