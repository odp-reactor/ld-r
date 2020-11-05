import { BaseStore } from 'fluxible/addons';

class CollectionStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.cleanPatternData();
    }
    updatePatternData(payload) {
        this.patternData = payload['patternData'];
        this.emitChange();
    }
    cleanPatternData() {
        this.patternData = null;
        this.emitChange();
    }
    getState() {
        return {
            patternData: this.patternData
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.patternData = state.patternData;
    }
}

CollectionStore.storeName = 'CollectionStore'; // PR open in dispatchr to remove this need
CollectionStore.handlers = {
    LOAD_PATTERN_DATA_SUCCESS: 'updatePatternData',
    CLEAN_PATTERN_DATA_SUCCESS: 'cleanPatternData'
};

export default CollectionStore;
