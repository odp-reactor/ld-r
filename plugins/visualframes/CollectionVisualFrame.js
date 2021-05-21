import React from 'react';

import { Collection, Depiction } from 'odp-reactor-visualframes'
import { routeToResource } from '../../components/route/routeToResource'


const defaultCollectionStyle = {
    collectionContainerWidth: {
        width: '150%' // set this width to 120, 130, 140% to increase padding between items
    }
};


export default class CollectionVisualFrame extends React.Component {

    render() {

        const collection = this.props.patternInstance.data

        console.log('Data:',collection)

        if (!collection || collection.length === 0 ) {
            return null
        }

        let routeToCulturalProperty = ()=>{}
        const culturalProperty = collection[0].cProp
        if (culturalProperty) {
            routeToCulturalProperty = routeToResource(this.props.datasetId, culturalProperty)
        }
      
        // let propertyList = {};
        // if (!this.props.hideCulturalProperty) {
        //     propertyList['Cultural Property :'] = {
        //         uri: collection[0].cProp,
        //         onClick: () => {
        //             this.context.executeAction(navigateAction, {
        //                 url: `${PUBLIC_URL}/dataset/${encodeURIComponent(
        //                     this.props.dataset
        //                 )}/resource/${encodeURIComponent(
        //                     collection[0].cProp
        //                 )}`
        //             });
        //         }
        //     };
        // }
        // collection.forEach(c => {
        //     let label = c.meas.split('-').pop() + ':';

        //     label = label.charAt(0).toUpperCase() + label.slice(1);
        //     propertyList[label] = {
        //         label: `${c.value} ${c.unit}`
        //     };
        // });

        return (
            <div>
                {!this.props.isMosaicFrameItem && (
                    <div className="property-title">
                        <div className="ui horizontal list">
                            <div className="item">
                                <h3
                                    style={{
                                        color: '#4183c4',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        routeToCulturalProperty()
                                    }}
                                >
                                    {collection[0].cPropLabel}
                                </h3>
                            </div>
                        </div>
                        <div className="ui dividing header"></div>
                    </div>
                )}
                <div
                    style={{
                        display: 'flex',
                        padding: 30,
                        width: '100%',
                        margin: 'auto'
                    }}
                >
                    <div style={{ margin: 'auto' }}>
                        <Depiction
                            uri={culturalProperty}
                            source={this.props.dbContext.sparqlEndpoint}
                            style={defa}
                            // style={this.props.styles.depiction}
                        />
                    </div>
                    <div style={{ margin: 'auto', marginLeft: 30 }}>
                        <Collection
                            members={collection.map(member => {
                                return {
                                    uri: member.meas,
                                    label: `${member.meas
                                        .split('-')
                                        .pop()} : ${member.value} ${
                                        member.unit
                                    }`,
                                    depiction:
                                            'https://image.flaticon.com/icons/png/512/5/5095.png'
                                };
                            })}
                            styles={
                                defaultCollectionStyle
                            }
                        ></Collection>
                    </div>
                </div>
                {/* {this.props.showPropertyValueList && (
                        <div style={{ marginTop: 50, marginBottom: 50 }}>
                            <PropertyValueList
                                properties={propertyList}
                                label={false}
                            />
                        </div>
                    )} */}
            </div>
        );
    }
}

