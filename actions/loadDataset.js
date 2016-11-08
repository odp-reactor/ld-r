import {appFullTitle} from '../configs/general';

export default function loadDataset(context, payload, done) {
    context.dispatch('LOADING_DATA', {});
    context.service.read('dataset.resourcesByType', payload, {timeout: 20 * 1000}, function (err, res) {
        if (err) {
            context.dispatch('LOAD_DATASET_FAILURE', err);
        } else {
            context.dispatch('CLEAN_DATASET_SUCCESS', res);
            context.dispatch('LOAD_DATASET_SUCCESS', res);
        }
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: (appFullTitle + ' | Dataset | ' + payload.id) || ''
        });
        context.dispatch('LOADED_DATA', {});
        done();
    });
}
