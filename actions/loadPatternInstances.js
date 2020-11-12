export default function loadPatternInstances(context, payload, done) {
    context.dispatch('LOADING_DATA', {}); // loaderOn (in ApplicationStore)
    context.service.read(
        'pattern.instances',
        payload,
        { timeout: 25 * 1000 },
        function(err, res) {
            if (err) {
                context.dispatch('LOAD_PATTERNS_FAILURE', err); // nobody listen to this
            } else {
                context.dispatch('CLEAN_PATTERN_INSTANCES_SUCCESS', res);
                context.dispatch('CLEAN_GMAP_SUCCESS', res);
                context.dispatch('LOAD_PATTERN_INSTANCES_SUCCESS', res); // OK
            }
            // check how to pass appFullTitle
            // context.dispatch('UPDATE_PAGE_TITLE', {
            //     pageTitle:
            //         appFullTitle +
            //             ' | Dataset | ' +
            //             decodeURIComponent(payload.dataset) +
            //             ' | Resource | ' +
            //             decodeURIComponent(payload.resource) +
            //             ' | Category | ' +
            //             payload.category || ''
            // });
            context.dispatch('LOADED_DATA', {}); // loaderOff
            done();
        }
    );
}
