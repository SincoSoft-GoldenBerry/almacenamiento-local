myApp.define('forms/sign-up', [], () => {
    let storage;
    
    return {
        start: (store) => {
            storage = store;
        }
    }
});