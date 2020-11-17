import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';

import loadPatternInstance from '../../../actions/loadPatternInstance';

import PatternInstanceStore from '../../../stores/PatternInstanceStore';

/**
 * This component is a wrapper around the one provide by the ld-ui-react package.
 * Define here the props to be passed to that.
 * In future you can define here the interaction and event handlers for it.
 *
 * It takes care to check browser environment
 *
 * @param {Object} props React props
 */
class Collection extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.instanceResources) {
            this.context.executeAction(loadPatternInstance, {
                instanceResources: this.props.instanceResources, // es. culturalProperty use this to bind the query
                dataset: this.props.dataset,
                pattern: this.props.pattern // this is used to catch the query in pattern configuration file
            });
        }
    }

    render() {
        const customClasses = {
            entityImage: 'custom-collection-image'
        };
        let Collection = require('ld-ui-react').Collection;
        let collection = this.props.data.instanceData.collection;
        if (collection) {
            return (
                <Collection
                    entities={collection}
                    class={customClasses}
                ></Collection>
            );
        } else {
            return <div>!Spinner!</div>;
        }
    }
}

Collection.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
Collection = connectToStores(Collection, [PatternInstanceStore], function(
    context,
    props
) {
    return {
        data: context.getStore(PatternInstanceStore).getInstanceData()
    };
});

export default Collection;
