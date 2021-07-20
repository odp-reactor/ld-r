import React from 'react';

import { chunk } from 'lodash';
import { Grid } from 'semantic-ui-react';
import _ from 'lodash'
import {PatternInstance} from '../../services/patterns/PatternInstance'


export default class MosaicVisualFrame extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        const viewTitleStyle = {
            fontSize: 20,
            color: 'rgb(98, 91, 95)',
            marginBottom: 40
        };

        const cellStyle = {
            borderBottom: '1px solid rgba(34,36,38,.15)',
            marginBottom: 50
        };

        const viewsContent = [];

        let index = 0


        // if different pattern instances are instance of the same pattern they're data field is group together
        // [ [p1], [p2], [p3, p4] ]
        // visual frames receive a list of pattern instances 
        const aggregatedPatternInstances = _.chain(this.props.patternInstances).groupBy((patternInstance) => {
            return patternInstance.pattern.uri
        }).map((group) => {
            if (group.length === 1) {
                return group[0]
            } else {
                return _.reduce(group, (newPatternInstance, currentPatternInstance)=> {
                    return PatternInstance.aggregateInstances(newPatternInstance, currentPatternInstance)
                })
            }
        }).value()

        aggregatedPatternInstances.forEach(
            (patternInstance) => {
                const VisualFrame = patternInstance.visualFrame
                const title = patternInstance.pattern && patternInstance.pattern.label ? patternInstance.pattern.label : 'Visual Frame'
                if (VisualFrame) {
                    viewsContent.push(
                        <div key={index} style={index % 2 === 0 ? cellStyle : {}}>
                            <div class="mosaic-view-title" style={viewTitleStyle}>
                                {title} 
                            </div>
                            <VisualFrame patternInstance={patternInstance} dbContext={this.props.dbContext} isMosaicFrameView={true} />
                        </div>
                    )
                    index++
                }
            }
        )

        const viewsRowsAndColumns = chunk(viewsContent, 1).map(function(group) {
            return <Grid.Column>{group}</Grid.Column>;
        });

        return (
            <Grid
                container
                stackable
                columns={2}
                celled
                divided="vertically"
            >
                <Grid.Row>{viewsRowsAndColumns}</Grid.Row>
            </Grid>
        );
    }
}
