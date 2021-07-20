import React from 'react';


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

            if (titls && titls.length > 0) {

                // const getResource = resourceURI => {
                //     this.context.executeAction(navigateAction, {
                //         url: `${PUBLIC_URL}/dataset/${encodeURIComponent(
                //             this.props.dataset
                //         )}/resource/${encodeURIComponent(resourceURI)}`
                //     });
                // };

                // const culturalPropertyURI = titls[0]
                //     ? titls[0].culturalProperty
                //     : '';

                // let propertyList = {};
                // if (!this.props.hideCulturalProperty) {
                //     propertyList['Cultural property :'] = {
                //         label: titls[0].cPropLabel,
                //         onClick: () => {
                //             getResource(culturalPropertyURI);
                //         }
                //     };
                // }
                // console.log('TITLS to put in table:', titls);
                // titls.map((titl, index) => {
                //     let number = titls.length > 1 ? index + 1 : '';
                //     if (titl.addressLabel && titl.addressLabel !== '') {
                //         propertyList[`Address ${number}:`] = {
                //             label: titl.addressLabel,
                //             index: number
                //         };
                //     }
                //     if (titl.locationType && titl.locationType !== '') {
                //         propertyList[`Location Type ${number}:`] = {
                //             label: titl.locationTypeLabel,
                //             onClick: () => {
                //                 getResource(titl.locationType);
                //             },
                //             index: number
                //         };
                //     }
                //     if (titl.long && titl.long !== '') {
                //         propertyList[`Longitude ${number}:`] = {
                //             label: titl.long,
                //             index: number
                //         };
                //     }
                //     if (titl.lat && titl.lat !== '') {
                //         propertyList[`Latitude ${number}:`] = {
                //             label: titl.lat,
                //             index: number
                //         };
                //     }
                //     if (titl.startTime && titl.startTime !== '')
                //         propertyList[`Start Time ${number}:`] = {
                //             label: titl.startTime,
                //             index: number
                //         };
                //     if (titl.endTime && titl.endTime !== '') {
                //         propertyList[`End Time ${number}:`] = {
                //             label: titl.endTime,
                //             index: number
                //         };
                //     }
                // });
                // console.log('Property List:', propertyList);
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
                        {/* {this.props.showImageGrid && (
                            <div style={childStyle}>
                                <ImageGrid resourceURI={culturalPropertyURI} />
                            </div>
                        )}
                        {this.props.showPropertyValueList && (
                            <div
                                style={Object.assign(
                                    { margin: 50 },
                                    childStyle
                                )}
                            >
                                <PropertyValueList properties={propertyList} />
                            </div>
                        )} */}
                    </div>
                );
            } else {
                return null;
                // <div style={{ textAlign: 'center' }}>
                //     <CustomLoader></CustomLoader>
                // </div>
            }
        } else return null;
    }
}