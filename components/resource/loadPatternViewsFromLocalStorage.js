const patternViewsKey = 'patternViews';

export default function loadPatternViewsFromLocalStorage() {
    console.log('LOAD PATTERN VIEWS FROM LOCAL STORAGE CALLED');
    try {
        return JSON.parse(window.localStorage.getItem(patternViewsKey));
    } catch (e) {
        return undefined;
    }
}
