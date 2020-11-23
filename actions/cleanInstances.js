export default function cleanInstances(context, payload, done) {
    context.dispatch('CLEAN_PATTERN_INSTANCES_SUCCESS');
    done();
}
