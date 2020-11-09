import { BaseStore } from 'fluxible/addons';

class PatternStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.cleanData();
        this.cleanSpecializations();
        this.cleanCompositions();
        this.cleanCompositionCount();
        this.cleanSpecializationCount();
        this.cleanInstances();
    }
    updateData(payload) {
        this.patternData = payload['patternData'];
        this.emitChange();
    }
    updateSpecializations(payload) {
        this.specializations = payload['patternData'];
        this.emitChange();
    }
    updateCompositions(payload) {
        this.compositions = payload['patternData'];
        this.emitChange();
    }
    updateSpecializationCount(payload) {
        this.specializationCount = payload['patternData'];
        this.emitChange();
    }
    updateCompositionCount(payload) {
        this.compositionCount = payload['patternData'];
        this.emitChange();
    }
    updateInstances(payload) {
        this.instances = payload['patternData'];
        this.emitChange();
    }
    cleanData() {
        this.patternData = null;
        this.emitChange();
    }
    cleanSpecializations() {
        this.specializations = null;
        this.emitChange();
    }
    cleanCompositions() {
        this.compositions = null;
        this.emitChange();
    }
    cleanSpecializationCount() {
        this.specializationCount = null;
        this.emitChange();
    }
    cleanCompositionCount() {
        this.compositionCount = null;
        this.emitChange();
    }
    cleanInstances() {
        this.instances = null;
        this.emitChange();
    }
    getState() {
        return {
            patternData: this.patternData,
            specializations: this.specializations,
            compositions: this.compositions,
            specializationCount: this.specializationCount,
            compositionCount: this.compositionCount,
            instances: this.instances
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.patternData = state.patternData;
        this.specializations = state.specializations;
        this.compositions = state.compositions;
        this.specializationCount = state.specializationCount;
        this.compositionCount = state.compositionCount;
        this.instances = state.instances;
    }
}

PatternStore.storeName = 'PatternStore'; // PR open in dispatchr to remove this need
PatternStore.handlers = {
    LOAD_PATTERNS_SUCCESS: 'updateData',
    CLEAN_PATTERNS_SUCCESS: 'cleanData',
    LOAD_PATTERN_SPECIALIZATIONS_SUCCESS: 'updateSpecializations',
    CLEAN_PATTERN_SPECIALIZATIONS_SUCCESS: 'cleanSpecializations',
    LOAD_PATTERN_COMPOSITIONS_SUCCESS: 'updateCompositions',
    CLEAN_PATTERN_COMPOSITIONS_SUCCESS: 'cleanCompositions',
    LOAD_PATTERN_SPECIALIZATION_COUNT_SUCCESS: 'updateSpecializationCount',
    CLEAN_PATTERN_SPECIALIZATION_COUNT_SUCCESS: 'cleanSpecializationCount',
    LOAD_PATTERN_COMPOSITION_COUNT_SUCCESS: 'updateCompositionCount',
    CLEAN_PATTERN_COMPOSITION_COUNT_SUCCESS: 'cleanCompositionCount',
    LOAD_PATTERN_INSTANCES_SUCCESS: 'updateInstances',
    CLEAN_PATTERN_INSTANCES_SUCCESS: 'cleanInstances'
};

export default PatternStore;
