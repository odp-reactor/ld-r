export default function loadPatternSpecializationCount(context, payload, done) {
    context.dispatch('LOADING_DATA', {}); // loaderOn (in ApplicationStore)
    context.service.read(
        'pattern.specializationCount',
        payload,
        { timeout: 25 * 1000 },
        function(err, res) {
            if (err) {
                context.dispatch('LOAD_PATTERNS_FAILURE', err); // nobody listen to this
            } else {
                context.dispatch(
                    'CLEAN_PATTERN_SPECIALIZATION_COUNT_SUCCESS',
                    res
                );
                context.dispatch('CLEAN_GMAP_SUCCESS', res);
                context.dispatch(
                    'LOAD_PATTERN_SPECIALIZATION_COUNT_SUCCESS',
                    res
                ); // OK
            }
            context.dispatch('LOADED_DATA', {}); // loaderOff
            done();
        }
    );
}
