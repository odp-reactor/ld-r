import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';

/* Flux
_________*/

import loadPatternInstanceResources from '../../actions/loadPatternInstanceResources';

import PatternInstanceStore from '../../stores/PatternInstanceStore';

/* Visual Patterns
______________________________*/

import TimeIndexedTypedLocationView from './viewer/TimeIndexedTypedLocationView';
import CollectionView from './viewer/CollectionView';

import PatternUtil from '../../services/utils/PatternUtil';
const patternUtil = new PatternUtil();

export default class Pattern extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // load nodes belonging to given pattern instance
        if (
            this.props.spec.propertyURI ===
                'http://ontologydesignpatterns.org/opla/isPatternInstanceOf' &&
            !this.props.PatternInstanceStore.instanceResources
        ) {
            this.context.executeAction(loadPatternInstanceResources, {
                dataset: this.props.datasetURI,
                patternInstance: this.props.resource
            });
        }
        // you need an alternative when props is another one. ex.
        // resource hasTimeIndexedTypedLocation
        // use this.props.resource
    }

    render() {
        const patternComponent = this.patternReactor();
        return (
            // <div>
            //     {this.props.hidePropertyName ||
            //     (this.props.config && this.props.config.hidePropertyName) ? (
            //         ""
            //     ) : (
            //         <div className="property-title">
            //             <div className="ui horizontal list">
            //                 <div className="item">
            //                     <PropertyHeader
            //                         spec={this.props.spec}
            //                         config={this.props.config}
            //                         size="3"
            //                         datasetURI={this.props.datasetURI}
            //                         resourceURI={this.props.resource}
            //                         propertyURI={this.props.property}
            //                     />
            //                 </div>
            //             </div>
            //             <div className="ui dividing header"></div>
            //         </div>
            //     )}
            //     <div className="ui list">
            //         <div className="item">
            //             <div className="ui form grid">
            //                 <div className="twelve wide column field">
            <div>{patternComponent}</div>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
        );
    }

    /**
     * Function select the pattern view based on user static specified config
     */
    patternReactor() {
        let patternView = '';
        let patternURI;
        let instanceResources = this.props.PatternInstanceStore
            .instanceResources
            ? this.props.PatternInstanceStore.instanceResources
            : null;
        // click on pattern instance node -> pattern visualization
        if (
            this.props.spec.propertyURI ===
            'http://ontologydesignpatterns.org/opla/isPatternInstanceOf'
        ) {
            patternURI = instanceResources
                ? instanceResources[0].pattern
                : null;
            if (patternURI) {
                patternView = patternUtil.getView(patternURI);
            }
        } else
            patternView = patternUtil.getViewByProperty(
                this.props.spec.propertyURI
            );
        switch (patternView) {
            case 'TimeIndexedTypedLocation':
                return (
                    <TimeIndexedTypedLocationView
                        pattern={patternURI}
                        dataset={this.props.datasetURI}
                        instanceResources={instanceResources}
                    />
                );
            case 'Collection':
                return (
                    <CollectionView
                        pattern={patternURI}
                        dataset={this.props.datasetURI}
                        instanceResources={instanceResources}
                    />
                );
            default:
                return instanceResources ? (
                    <div style={{ color: 'red' }}>No visual pattern found</div>
                ) : null;
        }
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
