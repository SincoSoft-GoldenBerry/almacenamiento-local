myApp.define('storage/main', [], () => {
    const storage = { session: sessionStorage, local: localStorage };
    let manager;
    
    const setUser = user => manager.setItem('user', JSON.stringify(user));
    const getUser = () => JSON.parse(manager.getItem('user'));
    const isInit = () => manager.getItem('user');
    const clear = () => manager.clear();
    const setManager = type => manager = storage[type];

    return {
        isInit,
        setUser,
        getUser,
        setManager,
        clear
    };
});