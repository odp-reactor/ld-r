import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import PatternInstanceStore from '../../../stores/PatternInstanceStore';

import fetchInstanceData from './fetchInstanceData';

import CustomLoader from '../../CustomLoader';

/**
 * @description This component is a model for the corresponding view provided by the ld-ui-react package.
 *
 * It loads data to pass to the visualization.
 * It can takes care to check browser environment.
 * It defines a visualization logic: if no minimum required data are present shift to more generic views
 * It defines interactive function for the application (onClickHandlers, fetchData ... )
 * @component
 * @param {Object} props React props
 * @author Christian Colonna
 * @class Collection
 * @extends {React.Component}
 */
class CollectionView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        fetchInstanceData(this.props, this.context);
    }

    render() {
        const customClasses = {
            entityImage: 'custom-collection-image'
        };
        let collection = this.props.data.instanceData.collection;

        const Collection = require('ld-ui-react').Collection;

        if (collection) {
            return (
                <Collection
                    entities={collection}
                    class={customClasses}
                ></Collection>
            );
        } else {
            return (
                <div style={{ textAlign: 'center' }}>
                    <CustomLoader></CustomLoader>
                </div>
            );
        }
    }
}

CollectionView.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
CollectionView = connectToStores(
    CollectionView,
    [PatternInstanceStore],
    function(context, props) {
        return {
            data: context.getStore(PatternInstanceStore).getInstanceData()
        };
    }
);

export default CollectionView;
