import { BaseStore } from 'fluxible/addons';

class TITLocationStore extends BaseStore {
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

TITLocationStore.storeName = 'TITLocationStore'; // PR open in dispatchr to remove this need
TITLocationStore.handlers = {
    LOAD_T_I_T_LOCATION_SUCCESS: 'updatePatternData',
    CLEAN_T_I_T_LOCATION_SUCCESS: 'cleanPatternData'
};

export default TITLocationStore;
