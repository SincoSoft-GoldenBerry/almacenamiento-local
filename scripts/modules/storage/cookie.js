myApp.define('storage/cookie', [], () => {
    const key = 'storage-type';
    const getCookie = () => s5.cookie(key);
    const setCookie = type => s5.cookie(key, type);

    return {
        getCookie,
        setCookie
    }
});