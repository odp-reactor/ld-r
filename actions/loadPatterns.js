export default function loadPatterns(context, payload, done) {
    context.dispatch('LOADING_DATA', {}); // loaderOn (in ApplicationStore)
    context.service.read(
        'pattern.instances',
        payload,
        { timeout: 25 * 1000 },
        function(err, res) {
            if (err) {
                context.dispatch('LOAD_PATTERNS_FAILURE', err); // nobody listen to this
            } else {
                context.dispatch('CLEAN_PATTERNS_SUCCESS', res);
                context.dispatch('CLEAN_GMAP_SUCCESS', res);
                context.dispatch('LOAD_PATTERNS_SUCCESS', res); // OK
            }
            context.dispatch('LOADED_DATA', {}); // loaderOff
            done();
        }
    );
}
