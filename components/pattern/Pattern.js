import React from 'react';

import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';

import PropertyHeader from '../property/PropertyHeader';

/* Flux
_________*/

import loadPatternInstanceResources from '../../actions/loadPatternInstanceResources';
import loadPatternInstance from '../../actions/loadPatternInstance';

import PatternInstanceStore from '../../stores/PatternInstanceStore';

/* Visual Patterns
______________________________*/

import TimeIndexedTypedLocation from './viewer/TimeIndexedTypedLocation';
import Collection from './viewer/Collection';

import PatternUtil from '../../services/utils/PatternUtil';

const patternUtil = new PatternUtil();

export default class Pattern extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // fetch data in case we arrive to pattern view from a pattern instance node   pattern instances -> pattern instance
        if (
            this.props.spec.propertyURI ===
            'http://ontologydesignpatterns.org/opla/isPatternInstanceOf'
        ) {
            this.context.executeAction(loadPatternInstanceResources, {
                dataset: this.props.datasetURI,
                patternInstance: this.props.resource
            });

            this.context.executeAction(loadPatternInstance, {
                instanceResources: this.props.instanceResources,
                dataset: this.props.datasetURI,
                pattern: this.props.patternURI
            });
        } else {
            // fetch data in case we arrive to pattern view from a resource    resource -> pattern
            this.context.executeAction(loadPatternInstance, {
                instanceResources: this.props.resource, // es. culturalProperty use this to bind the query
                dataset: this.props.datasetURI,
                pattern: patternUtil.getPatternURI(this.props.spec.propertyURI) // this is used to catch the query in pattern configuration file
            });
        }
    }

    render() {
        console.log('[*] props received by Pattern component');
        console.log(this.props);
        const patternComponent = this.chooseView();
        return (
            <div>
                {this.props.hidePropertyName ||
                (this.props.config && this.props.config.hidePropertyName) ? (
                        ''
                    ) : (
                        <div className="property-title">
                            <div className="ui horizontal list">
                                <div className="item">
                                    <PropertyHeader
                                        spec={this.props.spec}
                                        config={this.props.config}
                                        size="3"
                                        datasetURI={this.props.datasetURI}
                                        resourceURI={this.props.resource}
                                        propertyURI={this.props.property}
                                    />
                                </div>
                            </div>
                            <div className="ui dividing header"></div>
                        </div>
                    )}
                <div className="ui list">
                    <div className="item">
                        <div className="ui form grid">
                            <div className="twelve wide column field">
                                {patternComponent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Function select the pattern view based
     * based on user static specified config
     */
    chooseView() {
        let patternComponent;
        let patternView = '';
        if (
            this.props.spec.propertyURI ===
            'http://ontologydesignpatterns.org/opla/isPatternInstanceOf'
        ) {
            if (this.props.patternURI) {
                patternView = patternUtil.getView(this.props.patternURI);
            }
        } else
            patternView = patternUtil.getViewByProperty(
                this.props.spec.propertyURI
            );
        switch (patternView) {
            case 'TimeIndexedTypedLocation':
                patternComponent = (
                    <TimeIndexedTypedLocation></TimeIndexedTypedLocation>
                );
                break;
            case 'Collection':
                patternComponent = <Collection></Collection>;
                break;
            default:
                patternComponent = this.props.instanceResources ? (
                    <div style={{ color: 'red' }}>No visual pattern found</div>
                ) : (
                    <div style={{ color: 'red' }}>
                        No resources belonging to pattern instance
                    </div>
                );
        }

        return patternComponent;
    }
}

Pattern.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
Pattern = connectToStores(Pattern, [PatternInstanceStore], function(
    context,
    props
) {
    return {
        PatternInstanceStore: context.getStore(PatternInstanceStore).getState()
    };
});
