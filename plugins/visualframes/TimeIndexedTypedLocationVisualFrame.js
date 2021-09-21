import React from 'react';

import {ImageGrid} from '../../components/image/ImageGrid'
import {PropertyList} from '../../components/propertylist/PropertyList'
import { PropertyValueList } from '../../components/propertylist/PropertyValueList';
import { routeToResource } from '../../components/route/routeToResource';

export default class TimeIndexedTypedLocationVisualFrame extends React.Component {

    render() {
        /* 
           We need to check if env is BROWSER as leaflet require window object to
           work and avoid app crashing in server rendering.
           TimeIndexedTypedLocation pattern imports leaflet
            _______________________________________________________________________
        */
        if (process.env.BROWSER) {

            if (!this.props.patternInstance || !this.props.patternInstance.data) {
                return null
            }

            const { TimeIndexedTypedLocation } = require('odp-reactor-visualframes/dist/browser')

            console.log('TimeIndexedTypedLocationVisualFrame props state', this.props, this.state)

            const titls = this.props.patternInstance.data

            const propertyValueList = new PropertyValueList()
            const datasetId = this.props.dbContext.getDataset()

            if (titls && titls.length > 0) {

                if (!this.props.isMosaicFrameView) {
                    // add cultural property info for the table
                    propertyValueList.addProperty(
                        'Cultural Property :',
                        {
                            label: titls[0].cPropLabel,
                            onClick: ()=>{routeToResource(datasetId, titls[0].culturalProperty)}
                        }
                    )
                }
                // add properties for the tabel
                titls.forEach((titl, index) => {
                    let number = titls.length > 1 ? index + 1 : '';
                    if (titl.addressLabel && titl.addressLabel !== '') {
                        propertyValueList.addProperty(`Address ${number}:`, {
                            label: titl.addressLabel,
                            index: number
                        })
                    }
                    if (titl.locationType && titl.locationType !== '') {
                        propertyValueList.addProperty(`Location Type ${number}:`, {
                            label: titl.locationTypeLabel,
                            onClick: ()=>{routeToResource(datasetId, titl.locationType)},
                            index: number

                        })
                    }
                    if (titl.long && titl.long !== '') {
                        propertyValueList.addProperty(`Longitude ${number}:`, {
                            label: titl.long,
                            index: number
                        })
                    }
                    if (titl.lat && titl.lat !== '') {
                        propertyValueList.addProperty(`Latitude ${number}:`, {
                            label: titl.lat,
                            index: number
                        })
                    }
                    if (titl.startTime && titl.startTime !== '')
                        propertyValueList.addProperty(`Start Time ${number}:`, {
                            label: titl.startTime,
                            index: number
                        })
                    if (titl.endTime && titl.endTime !== '') {
                        propertyValueList.addProperty(`End Time: ${number}:`, {
                            label: titl.endTime,
                            index: number
                        })
                    }
                })
                try {
                    titls.sort((a, b) => {
                        if (a.locationTypeLabel.includes('precedente')) {
                            return -1;
                        }
                        if (a.locationTypeLabel.includes('attuale')) {
                            return 1;
                        }
                        return 0;
                    });
                } catch (e) {
                    console.log('Error sorting values');
                }

                const childStyle = {
                    flex: '1 0 45%'
                };

                console.log('TITLS:', titls)
                const culturalPropertyURI = titls[0].culturalProperty

                return (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            flexWrap: 'wrap',
                            margin: 'auto'
                        }}
                    >
                        <div style={childStyle}>
                            <TimeIndexedTypedLocation
                                timeIndexedTypedLocations={titls}
                                onObjectClick={() => {
                                    // getResource(culturalPropertyURI);
                                }}
                            />
                        </div>
                        {!this.props.isMosaicFrameView && (
                            <div style={childStyle}>
                                <ImageGrid resourceURI={culturalPropertyURI} source={this.props.dbContext.sparqlEndpoint}/>
                            </div>
                        )}
                        <div
                            style={Object.assign(
                                { margin: 50 },
                                childStyle
                            )}
                        >
                            <PropertyList propertyValueList={propertyValueList} />
                        </div>
                    </div>
                );
            } else {
                return null;
            }
        } else return null;
    }
}