import { BaseStore } from 'fluxible/addons';

class PatternStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.cleanData();
        this.cleanColors();
        this.cleanSpecializations();
        this.cleanCompositions();
        this.cleanCompositionCount();
        this.cleanSpecializationCount();
        this.cleanInstances();
        this.cleanClassesAndScores();
    }
    updateClassesAndScores(payload) {
        console.log('Update classes payload', payload);
        console.log(payload);
        this.classesAndScores = payload;
        this.emitChange();
    }
    updateData(payload) {
        this.list = payload['patternData'];
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
    cleanClassesAndScores() {
        this.classesAndScores = null;
        this.emitChange();
    }
    cleanData() {
        this.list = null;
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
    saveColorMap(payload) {
        console.log('colors', payload);
        this.colors = payload;
    }
    cleanColors() {
        this.colors = null;
        this.emitChange();
    }
    getState() {
        return {
            list: this.list,
            specializations: this.specializations,
            compositions: this.compositions,
            specializationCount: this.specializationCount,
            compositionCount: this.compositionCount,
            instances: this.instances,
            colors: this.colors,
            classesAndScores: this.classesAndScores
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.list = state.list;
        this.specializations = state.specializations;
        this.compositions = state.compositions;
        this.specializationCount = state.specializationCount;
        this.compositionCount = state.compositionCount;
        this.instances = state.instances;
        this.colors = state.colors;
        this.classesAndScores = state.classesAndScores;
    }
}

PatternStore.storeName = 'PatternStore'; // PR open in dispatchr to remove this need
PatternStore.handlers = {
    LOAD_CLASSES_AND_SCORES_SUCCESS: 'updateClassesAndScores',
    CLEAN_CLASSES_AND_SCORES_SUCCESS: 'cleanClassesAndScores',
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
    CLEAN_PATTERN_INSTANCES_SUCCESS: 'cleanInstances',
    SAVE_COLOR_MAP: 'saveColorMap'
};

export default PatternStore;
