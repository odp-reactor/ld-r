import { BaseStore } from 'fluxible/addons';

class PatternInstanceStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.cleanInstanceResources();
        this.cleanAllInstance();
        this.instanceData = {};
    }
    updateInstanceResources(payload) {
        this.instanceResources = payload['patternData'];
        this.emitChange();
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
        console.log(this.instanceData);
        this.emitChange();
    }
    cleanInstanceResources() {
        this.instanceResources = null;
        this.emitChange();
    }
    cleanInstance(payload) {
        // clean instance data for pattern specified by pattern key
        // the key for pattern is in the response payload
        const patternKey = payload['key'];
        this.instanceData[patternKey] = null;
        this.emitChange();
    }
    cleanAllInstance() {
        this.instanceData = null;
    }
    getState() {
        return {
            instanceResources: this.instanceResources,
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
        this.instanceResources = state.instanceResources;
        this.instanceData = state.instanceData;
    }
}

PatternInstanceStore.storeName = 'PatternInstanceStore'; // PR open in dispatchr to remove this need
PatternInstanceStore.handlers = {
    LOAD_INSTANCE_RESOURCES_SUCCESS: 'updateInstanceResources',
    CLEAN_INSTANCE_RESOURCES_SUCCESS: 'cleanInstanceResources',
    LOAD_INSTANCE_SUCCESS: 'updateInstance',
    CLEAN_INSTANCE_SUCCESS: 'cleanInstance'
};

export default PatternInstanceStore;
