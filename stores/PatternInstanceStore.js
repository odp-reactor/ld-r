import { BaseStore } from 'fluxible/addons';

class PatternInstanceStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.cleanInstanceResources();
    }
    updateInstanceResources(payload) {
        this.instanceResources = payload['patternData'];
        this.emitChange();
    }
    cleanInstanceResources() {
        this.instanceResources = null;
        this.emitChange();
    }
    getState() {
        return {
            instanceResources: this.instanceResources
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.instanceResources = state.instanceResources;
    }
}

PatternInstanceStore.storeName = 'PatternInstanceStore'; // PR open in dispatchr to remove this need
PatternInstanceStore.handlers = {
    LOAD_INSTANCE_RESOURCES_SUCCESS: 'updateInstanceResources',
    CLEAN_INSTANCE_RESOURCES_SUCCESS: 'cleanInstanceResources'
    // updatePatternInstance() {
    //      per questo pattern (questi sono i dati)
    // }
};

export default PatternInstanceStore;
