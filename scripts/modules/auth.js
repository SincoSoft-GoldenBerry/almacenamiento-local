myApp.define('auth', ['storage/cookie', 'storage/main', 'forms/sign-in', 'tasks/main'], (cookie, storage, signIn, tasks) => {
    const fondoModal = s5.get('.fondo-modal').shift();
    const spanUsuario = s5.get('.usuario').shift();
    const botonSalir = s5.get('.salir').shift();

    const validateIfSessionIsInit = () => {
        storage.setManager(cookie.getCookie() || 'session');
        if (storage.isInit()) {
            fondoModal.classList.add('d-none');
            mostrarUsuario(storage.getUser());
        }
        else {
            fondoModal.classList.remove('d-none');
            signIn.start(storage, mostrarUsuario);
        }
    };

    const asignarClickSalir = () => botonSalir.addEvent('click', () => {
        storage.clear();
        window.location.reload();
    });

    const mostrarUsuario = usuario => {
        spanUsuario.textContent = `${usuario.nombre} ${usuario.apellidos}`;
        asignarClickSalir();
        tasks.load(usuario);
    };

    return {
        start: validateIfSessionIsInit
    }
});