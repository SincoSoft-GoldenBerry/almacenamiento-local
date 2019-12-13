myApp.define('forms/sign-up', ['services'], services => {
    let formularios;
    const botonRegistro = s5.get('.registrar').shift();
    const controles = s5.get('.sign-up input[data-field]');
    const passwords = s5.get('.sign-up input[type=password]');
    const ingresar = s5.get('.sign-up a').shift();
    
    const setEvents = () => {
        botonRegistro.addEvent('click', registrarUsuario);
        ingresar.addEvent('click', mostrarLogin);
    };

    const show = () => formularios.forEach(form => form.classList.toggle('d-none'));

    const registrarUsuario = () => {
        if (formularios[1].checkValidity() && validarContrasena()) {
            passwords.forEach(pass => pass.classList.remove('is-invalid'));
            const usuarioNuevo = {};
            controles.forEach(control => usuarioNuevo[control.dataset.field] = control.value);
            services.registrarUsuario(usuarioNuevo, mostrarLogin);
        }
    };

    const mostrarLogin = () => {
        formularios[1].reset();
        show();
    };

    const validarContrasena = e => {
        if (passwords[0].value.replace(/[^a-z]/ig, '') === '') {
            passwords[0].classList.add('is-invalid');
            return false;
        }
        passwords[0].classList.remove('is-invalid');
        if (passwords[0].value !== passwords[1].value) {
            passwords[1].classList.add('is-invalid');
            return false;
        }
        return true;
    };

    return {
        start: forms => () => {
            formularios = forms;
            show();
            setEvents();
        }
    }
});