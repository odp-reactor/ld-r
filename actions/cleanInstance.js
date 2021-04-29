export default function cleanInstance(context, payload, done) {
    // pay attention we clean resource here (pattern instance resoucre )
    // and resource data
    context.dispatch('CLEAN_INSTANCE_SUCCESS');
    context.dispatch('CLEAN_RESOURCE_SUCCESS');
    done();
}
