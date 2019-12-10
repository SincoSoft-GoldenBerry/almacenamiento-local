myApp.define('forms/sign-in', ['forms/sign-up', 'services', 'storage/cookie'], (signUp, services, cookie) => {
    let storage, mostrarUsuario;
    const formularios = s5.get('.sign-in, .sign-up');
    const formularioIngreso = formularios[0];
    const botonIngreso = s5.get('.ingresar').shift();
    const email = s5.get('.sign-in input[type=email]').shift();
    const password = s5.get('.sign-in input[type=password]').shift();
    const recordar = s5.get('recordar');

    const setEvents = () => {
        formularios.forEach(formulario => formulario.addEvent('submit', e => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }));
        botonIngreso.addEvent('click', validarUsuario);
        recordar.checked = cookie.getCookie() === 'local';
    };

    const validarUsuario = () => {
        if (formularioIngreso.checkValidity()) {
            services.obtenerUsuario(email.value, password.value, usuario => {
                if (usuario) {
                    const type = recordar.checked ? 'local': 'session';
                    cookie.setCookie(type);
                    storage.setManager(type);
                    storage.setUser(usuario);
                    mostrarUsuario(usuario);
                    s5.get('.fondo-modal').shift().classList.add('d-none');
                }
                else {
                    //Mostrar mensaje
                }
            });
        }
    };

    return {
        start: (store, fnMostrarUsuario) => {
            storage = store;
            mostrarUsuario = fnMostrarUsuario;
            setEvents();
        }
    }
});