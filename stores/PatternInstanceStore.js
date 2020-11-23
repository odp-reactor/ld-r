import { BaseStore } from 'fluxible/addons';

class PatternInstanceStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.cleanAllInstance();
        this.instanceData = {};
    }
    updateInstance(payload) {
        // update instance data for pattern specified by pattern key
        // the key for pattern is in the response payload
        // example of payload:
        // {
        //   key :       "collection",
        //   collection:  [ data ...]
        //    }
        const patternKey = payload['key'];
        this.instanceData[patternKey] = payload[patternKey];
        this.emitChange();
    }
    cleanInstance() {
        this.instanceData = {};
        this.emitChange();
    }
    cleanAllInstance() {
        this.instanceData = null;
    }
    getState() {
        return {
            instanceData: this.instanceData
        };
    }
    getInstanceData() {
        return {
            instanceData: this.instanceData
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.instanceData = state.instanceData;
    }
}

PatternInstanceStore.storeName = 'PatternInstanceStore'; // PR open in dispatchr to remove this need
PatternInstanceStore.handlers = {
    LOAD_INSTANCE_SUCCESS: 'updateInstance',
    CLEAN_INSTANCE_SUCCESS: 'cleanInstance'
};

export default PatternInstanceStore;
