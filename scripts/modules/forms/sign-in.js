myApp.define('forms/sign-in', ['forms/sign-up', 'services', 'storage/cookie'], (signUp, services, cookie) => {
    let storage, mostrarUsuario;
    const formularios = s5.get('.sign-in, .sign-up');
    const formularioIngreso = formularios[0];
    const botonIngreso = formularioIngreso.get('.ingresar').shift();
    const email = formularioIngreso.get('input[type=email]').shift();
    const password = formularioIngreso.get('input[type=password]').shift();
    const recordar = formularioIngreso.get('recordar');
    const registrarse = s5.get('.sign-in a').shift();
    const mensaje = formularioIngreso.get('.mensaje').shift();

    const setEvents = () => {
        formularios.forEach(formulario => formulario.addEvent('submit', e => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }));
        botonIngreso.addEvent('click', validarUsuario);
        registrarse.addEvent('click', signUp.start(formularios));
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
                    mensaje.classList.add('d-none');
                }
                else {
                    mensaje.classList.remove('d-none');
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