import React from 'react'

import {PartWhole} from 'odp-reactor-visualframes'
import { routeToResource } from '../../components/route/routeToResource'


// const defaultPartWholeStyle = {
//     containerStyle: {
//         width: 700
//     },
//     littleItemStyle: {
//         width: 100
//     },
//     centerItemStyle: {
//         width: 500
//     }
// };

export default class PartOfVisualFrame extends React.Component {

    render() {

        if (!this.props.patternInstance || !this.props.patternInstance.data) {
            return null
        }

        console.log('PartWholeVisualFrame props state', this.props, this.state)

        const data = this.props.patternInstance.data

        if (data) {
            const whole = { uri: data[0].complexCProp, source: this.props.dbContext.sparqlEndpoint };

            let parts = data.map(part => {
                return { uri: part.cPropComponent, source: this.props.dbContext.sparqlEndpoint };
            });

            parts = [...new Set(parts)]; //clean duplicate values

            const routeToDatasetResource = (resourceUri) => {
                routeToResource(this.props.dbContext.datasetId, resourceUri)
            }

            // const getResource = resourceURI => {
            //     this.context.executeAction(navigateAction, {
            //         url: `${PUBLIC_URL}/dataset/${encodeURIComponent(
            //             this.props.dataset
            //         )}/resource/${encodeURIComponent(resourceURI)}`
            //     });
            // };

            // let propertyList = {};
            // let c = 1;
            // data.map(part => {
            //     propertyList[`Component ${c} :`] = {
            //         uri: part.cPropComponent,
            //         onClick: () => {
            //             getResource(part.cPropComponent);
            //         }
            //     };
            //     c++;
            // });

            return (
                <div>
                    <div style={{ textAlign: 'center', margin: 'auto' }}>
                        <PartWhole
                            parts={parts}
                            whole={whole}
                            onResourceClick={routeToDatasetResource}
                            // styles={
                            //     defaultPartWholeStyle
                            // }
                        />
                    </div>
                    {/* {this.props.showPropertyValueList && (
                        <div style={{ marginTop: 50, marginBottom: 50 }}>
                            <PropertyValueList
                                properties={propertyList}
                                label={true}
                            />
                        </div>
                    )} */}
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

