import React from 'react';
import PartWholeView from './viewer/PartWholeView';
import TimeIndexedTypedLocationView from './viewer/TimeIndexedTypedLocationView';
import CollectionView from './viewer/CollectionView';

import ClassService from '../../services/clientside-services/ClassService';
import DbContext from '../../services/base/DbContext';

export default class PatternViewsMosaic extends React.Component {
    constructor(props) {
        super(props);
        const sparqlEndpoint = 'https://arco.istc.cnr.it/visualPatterns/sparql';
        this.classService = new ClassService(new DbContext(sparqlEndpoint));
        //
        this.state = {
            patternInstances: null
        };
    }
    componentDidMount() {
        if (!this.state.patternInstances) {
            if (this.props.resourceURI) {
                this.classService
                    .findAllPatternInstancesWithTypeByResource(
                        this.props.resourceURI
                    )
                    .then(patternInstances => {
                        console.log(
                            'MOSAIC: retrieved pattern instances',
                            patternInstances
                        );
                        this.setState({ patternInstances: patternInstances });
                    });
            }
        }
    }
    componentDidUpdate() {
        if (!this.state.patternInstances) {
            if (this.props.resourceURI) {
                this.classService
                    .findAllPatternInstancesWithTypeByResource(
                        this.props.resourceURI
                    )
                    .then(patternInstances => {
                        console.log(
                            'MOSAIC: retrieved pattern instances',
                            patternInstances
                        );
                        this.setState({ patternInstances: patternInstances });
                    });
            }
        }
    }
    render() {
        console.log('MOSAIC RENDERED');
        console.log(this.props.resourceURI);
        if (this.props.patternViews.length === 0) {
            return null;
        }
        if (
            this.state.patternInstances === null ||
            this.state.patternInstances.length === 0
        ) {
            return null;
        }
        return (
            <div
                className="mosaic-container"
                style={{
                    /* display: flex; */
                    display: 'grid',
                    /* grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); */
                    gridAutoFlow: 'column',
                    gridGap: 20,
                    gridTemplateRows: '50% 50%',
                    gridTemplateColumns: '50% 50%',
                    padding: 10
                }}
            >
                {this.state.patternInstances.map(patternInstance => {
                    if (
                        patternInstance.type ===
                        'https://w3id.org/arco/ontology/location/cultural-property-component-of'
                    ) {
                        return (
                            <PartWholeView
                                pattern={patternInstance.type}
                                dataset={this.props.datasetURI}
                                patternInstanceUri={patternInstance.uri}
                            />
                        );
                    }
                    if (
                        patternInstance.type ===
                        'https://w3id.org/arco/ontology/denotative-description/measurement-collection'
                    ) {
                        return (
                            <CollectionView
                                pattern={patternInstance.type}
                                dataset={this.props.datasetURI}
                                patternInstanceUri={patternInstance.uri}
                            />
                        );
                    }
                    if (
                        patternInstance.type ===
                        'https://w3id.org/arco/ontology/location/time-indexed-typed-location'
                    ) {
                        return (
                            <TimeIndexedTypedLocationView
                                pattern={patternInstance.type}
                                dataset={this.props.datasetURI}
                                patternInstanceUri={patternInstance.uri}
                            />
                        );
                    }
                })}
            </div>
        );
        // return this.props.patternViews.map(viewKey => {
        //     if (viewKey === "partWhole") return <PartWholeView />;
        //     if (viewKey === "collection") return <CollectionView />;
        //     if (viewKey === "timeIndexedTypedLocation")
        //         return <TimeIndexedTypedLocationView />;
        // });
    }
}
