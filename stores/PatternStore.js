import { BaseStore } from 'fluxible/addons';

class PatternStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.cleanPatternData();
        this.cleanPatternSpecializations();
        this.cleanPatternCompositions();
    }
    updatePatternData(payload) {
        this.patternData = payload['patternData'];
        this.emitChange();
    }
    updatePatternSpecializations(payload) {
        this.patternSpecializations = payload['patternData'];
        this.emitChange();
    }
    updatePatternCompositions(payload) {
        this.patternCompositions = payload['patternData'];
        this.emitChange();
    }
    cleanPatternData() {
        this.patternData = null;
        this.emitChange();
    }
    cleanPatternSpecializations() {
        this.patternSpecializations = null;
        this.emitChange();
    }
    cleanPatternCompositions() {
        this.patternCompositions = null;
        this.emitChange();
    }
    getState() {
        return {
            patternData: this.patternData,
            patternSpecializations: this.patternSpecializations,
            patternCompositions: this.patternCompositions
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.patternData = state.patternData;
        this.patternSpecializations = state.patternSpecializations;
        this.patternCompositions = state.patternCompositions;
    }
}

PatternStore.storeName = 'PatternStore'; // PR open in dispatchr to remove this need
PatternStore.handlers = {
    LOAD_PATTERNS_SUCCESS: 'updatePatternData',
    CLEAN_PATTERNS_SUCCESS: 'cleanPatternData',
    LOAD_PATTERN_SPECIALIZATIONS_SUCCESS: 'updatePatternSpecializations',
    CLEAN_PATTERN_SPECIALIZATIONS_SUCCESS: 'cleanPatternSpecializations',
    LOAD_PATTERN_COMPOSITIONS_SUCCESS: 'updatePatternCompositions',
    CLEAN_PATTERN_COMPOSITIONS_SUCCESS: 'cleanPatternCompositions'
};

export default PatternStore;
