export default function loadCollection(context, payload, done) {
    context.dispatch('LOADING_DATA', {}); // loaderOn (in ApplicationStore)
    context.service.read(
        'resource.patternData',
        payload,
        { timeout: 25 * 1000 },
        function(err, res) {
            if (err) {
                context.dispatch('LOAD_COLLECTION_FAILURE', err); // nobody listen to this
            } else {
                context.dispatch('CLEAN_COLLECTION_SUCCESS', res);
                context.dispatch('CLEAN_GMAP_SUCCESS', res);
                context.dispatch('LOAD_COLLECTION_SUCCESS', res); // OK
            }
            context.dispatch('LOADED_DATA', {}); // loaderOff
            done();
        }
    );
}
