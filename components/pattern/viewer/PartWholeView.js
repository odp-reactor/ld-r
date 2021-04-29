import React from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import PatternInstanceStore from '../../../stores/PatternInstanceStore';
import { navigateAction } from 'fluxible-router';

import fetchInstanceData from './fetchInstanceData';

import CustomLoader from '../../CustomLoader';

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';

/**
 * @description This component is a model for the corresponding view provided by the odp-reactor package.
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

import PatternService from '../../../services/clientside-services/PatternService';
import DbContext from '../../../services/base/DbContext';

class PartWholeView extends React.Component {
    constructor(props) {
        super(props);
        const sparqlEndpoint = 'https://arco.istc.cnr.it/visualPatterns/sparql';
        this.patternService = new PatternService(new DbContext(sparqlEndpoint));
        //
        this.state = {
            culturalPropertyWithParts: null
        };
    }

    componentDidMount() {
        if (!this.state.culturalPropertyWithParts) {
            this.patternService
                .findCulturalPropertyWithParts(this.props.patternInstanceUri)
                .then(culturalPropertyWithParts => {
                    this.setState({
                        culturalPropertyWithParts: culturalPropertyWithParts
                    });
                });
        }
    }

    render() {
        let data = this.state.culturalPropertyWithParts;

        // const PartWhole = require('odp-reactor').PartWhole;

        // const PropertyValueList = require('odp-reactor').PropertyValueList;

        return null;

        if (data) {
            const whole = { uri: data[0].complexCProp };
            let parts = data.map(part => {
                return { uri: part.cPropComponent };
            });
            parts = [...new Set(parts)]; //clean duplicate values
            const getResource = resourceURI => {
                this.context.executeAction(navigateAction, {
                    url: `${PUBLIC_URL}/dataset/${encodeURIComponent(
                        this.props.dataset
                    )}/resource/${encodeURIComponent(resourceURI)}`
                });
            };

            let propertyList = {};
            let c = 1;
            data.map(part => {
                propertyList[`Component ${c} :`] = {
                    uri: part.cPropComponent,
                    onClick: () => {
                        getResource(part.cPropComponent);
                    }
                };
                c++;
            });

            return (
                <div>
                    <div style={{ textAlign: 'center', margin: 'auto' }}>
                        <PartWhole
                            parts={parts}
                            whole={whole}
                            onResourceClick={getResource}
                            styles={
                                this.props.styles && this.props.styles.partWhole
                                    ? this.props.styles.partWhole
                                    : defaultPartWholeStyle
                            }
                        />
                    </div>
                    {this.props.showPropertyValueList && (
                        <div style={{ marginTop: 50, marginBottom: 50 }}>
                            <PropertyValueList
                                properties={propertyList}
                                label={true}
                            />
                        </div>
                    )}
                </div>
            );
        } else {
            return null;

            //     <div style={{ textAlign: 'center' }}>
            //         <CustomLoader></CustomLoader>
            //     </div>
            // );
        }
    }
}

const defaultPartWholeStyle = {
    containerStyle: {
        width: 700
    },
    littleItemStyle: {
        width: 100
    },
    centerItemStyle: {
        width: 500
    }
};

PartWholeView.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
PartWholeView = connectToStores(PartWholeView, [PatternInstanceStore], function(
    context,
    props
) {
    return {
        data: context.getStore(PatternInstanceStore).getInstanceData()
    };
});

export default PartWholeView;
