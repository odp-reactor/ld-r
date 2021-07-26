import React from 'react';

import { Collection, Depiction } from 'odp-reactor-visualframes'
import { routeToResource } from '../../components/route/routeToResource'
import { PropertyList } from '../../components/propertylist/PropertyList';
import { PropertyValueList } from '../../components/propertylist/PropertyValueList';




const defaultCollectionStyle = {
    collectionContainerWidth: {
        width: '150%' // set this width to 120, 130, 140% to increase padding between items
    }
};


export default class CollectionVisualFrame extends React.Component {

    render() {

        if (!this.props.patternInstance || !this.props.patternInstance.data) {
            return null
        }

        const collection = this.props.patternInstance.data


        if (!collection || collection.length === 0 ) {
            return null
        }

        const propertyValueList = new PropertyValueList()
        const datasetId = this.props.dbContext.getDataset()

        let routeToCulturalProperty = ()=>{}
        const culturalProperty = collection[0].cProp
        if (culturalProperty) {
            routeToCulturalProperty = ()=>{routeToResource(datasetId, culturalProperty)}           
        }

        if (!this.props.isMosaicFrameView) {
            propertyValueList.addProperty('Cultural Property :', {
                uri: culturalProperty,
                label: collection[0].cPropLabel,
                onClick: routeToCulturalProperty
            })
        }
        collection.forEach(c => {
            let label = c.meas.split('-').pop() + ':';

            label = label.charAt(0).toUpperCase() + label.slice(1);
            propertyValueList.addProperty(label, {
                label: `${c.value} ${c.unit}`
            })
        });

        return (
            <div>
                {!this.props.isMosaicFrameView && (
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
                            // style={defa}
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
                <div style={{ marginTop: 50, marginBottom: 50 }}>
                    <PropertyList
                        propertyValueList={propertyValueList}
                        label={false}
                    />
                </div>
            </div>
        );
    }
}

