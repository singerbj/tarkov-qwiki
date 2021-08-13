export default {
    isElectron: () => {
        return !!(window && window.process && window.process.versions && !!window.process.versions['electron']);
    }
}