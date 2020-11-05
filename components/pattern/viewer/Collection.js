import React from 'react';

import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';

import CollectionStore from '../../../stores/CollectionStore';

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
        this.props.fetchData();
    }

    render() {
        const customClasses = {
            entityImage: 'custom-collection-image'
        };
        let Collection = require('ld-ui-react').Collection;
        if (this.props.CollectionStore.patternData) {
            return (
                <Collection
                    entities={this.props.CollectionStore.patternData}
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
Collection = connectToStores(Collection, [CollectionStore], function(
    context,
    props
) {
    return { CollectionStore: context.getStore(CollectionStore).getState() };
});

export default Collection;
