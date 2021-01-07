export default function saveColorMap(context, payload, done) {
    context.dispatch('SAVE_COLOR_MAP', payload); // nobody listen to this
    done();
}
