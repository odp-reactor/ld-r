import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import PatternInstanceStore from '../../../stores/PatternInstanceStore';

import { navigateAction } from 'fluxible-router';

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

        // import Collection component from ld-ui-react package
        const Collection = require('ld-ui-react').Collection;
        const Depiction = require('ld-ui-react').Depiction;

        if (collection) {
            return (
                <div>
                    <div className="property-title">
                        <div className="ui horizontal list">
                            <div className="item">
                                <h3
                                    style={{
                                        color: 'rgb(98, 91, 95)',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        this.context.executeAction(
                                            navigateAction,
                                            {
                                                url: `/dataset/${encodeURIComponent(
                                                    this.props.dataset
                                                )}/resource/${encodeURIComponent(
                                                    collection[0].cProp
                                                )}`
                                            }
                                        );
                                    }}
                                >
                                    {collection[0].cPropLabel}
                                </h3>
                            </div>
                        </div>
                        <div className="ui dividing header"></div>
                    </div>
                    <div style={{ textAlign: 'center', margin: 20 }}>
                        <Depiction
                            uri={collection[0].cProp}
                            style={{ maxHeight: 500 }}
                        />
                    </div>
                    <Collection
                        members={collection.map(member => {
                            return {
                                uri: member.meas,
                                label: `${member.measLabel} : ${member.value}`,
                                depiction:
                                    'https://image.flaticon.com/icons/png/512/5/5095.png'
                            };
                        })}
                        classes={customClasses}
                    ></Collection>
                </div>
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
