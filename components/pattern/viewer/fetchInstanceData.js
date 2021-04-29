import loadPatternInstance from '../../../actions/loadPatternInstance';

/**
 * @description Function common to every pattern to load instances. Data will be sent to PatternInstanceStore
 * @author Christian Colonna
 * @date 18-11-2020
 * @export
 * @param {Object} props React component props
 * @param {Object} context React component fluxible context
 */
export default function fetchInstanceData(props, context) {
    console.log('fetchData');
    console.log(props);
    if (props.instanceResources) {
        context.executeAction(loadPatternInstance, {
            // resources are used as entry to bind a generic query to the specific instance they belongs to
            instanceResources: props.instanceResources,
            dataset: props.dataset,
            // this is used to catch the query in pattern configuration file
            pattern: props.pattern
        });
    }
}
