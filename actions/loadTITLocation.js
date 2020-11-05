export default function loadTITLocation(context, payload, done) {
    context.dispatch('LOADING_DATA', {}); // loaderOn (in ApplicationStore)
    context.service.read(
        'resource.patternData',
        payload,
        { timeout: 25 * 1000 },
        function(err, res) {
            if (err) {
                context.dispatch('LOAD_T_I_T_LOCATION_FAILURE', err); // nobody listen to this
            } else {
                context.dispatch('CLEAN_T_I_T_LOCATION_SUCCESS', res);
                context.dispatch('CLEAN_GMAP_SUCCESS', res);
                context.dispatch('LOAD_T_I_T_LOCATION_SUCCESS', res); // OK
            }
            context.dispatch('LOADED_DATA', {}); // loaderOff
            done();
        }
    );
}
