export default function loadPatternSpecializations(context, payload, done) {
    context.dispatch('LOADING_DATA', {}); // loaderOn (in ApplicationStore)
    context.service.read(
        'pattern.specializations',
        payload,
        { timeout: 25 * 1000 },
        function(err, res) {
            if (err) {
                context.dispatch('LOAD_PATTERNS_FAILURE', err); // nobody listen to this
            } else {
                context.dispatch('CLEAN_PATTERN_SPECIALIZATIONS_SUCCESS', res);
                context.dispatch('CLEAN_GMAP_SUCCESS', res);
                context.dispatch('LOAD_PATTERN_SPECIALIZATIONS_SUCCESS', res); // OK
            }
            context.dispatch('LOADED_DATA', {}); // loaderOff
            done();
        }
    );
}
