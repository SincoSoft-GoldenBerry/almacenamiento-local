myApp.define('tasks/new', ['services'], (services) => {
    let usuario, mostrarTarea;
    const botonMostrarFormulario = s5.get('.boton-mostrar-menu').shift();
    const contenedorFormulario = s5.get('.nueva-tarea-flotante').shift();
    const iconoBoton = botonMostrarFormulario.get('.fas').shift();
    const formulario = s5.get('.nueva-tarea').shift();
    const botonAgregar = formulario.get('.btn').shift();
    const controles = formulario.get('input, textarea, select');
    const responsables = formulario.get('[data-field=encargadoId]').shift();

    const start = (usr, fnMostrarTarea) => {
        usuario = usr;
        mostrarTarea = fnMostrarTarea;
        formulario.get('[data-field=creadorId]').shift().value = usuario.id;
        setupEvents();
        cargarResponsables();
    };

    const setupEvents = () => {
        botonMostrarFormulario.addEvent('click', clickMostrarFormulario);
        formulario.addEvent('submit', e => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        });
        botonAgregar.addEvent('click', crearTarea);
    };

    const clickMostrarFormulario = () => {
        contenedorFormulario.classList.toggle('visible');
        iconoBoton.classList.toggle('fa-plus-circle');
        iconoBoton.classList.toggle('fa-times-circle');
    };

    const crearTarea = () => {
        if (formulario.checkValidity()) {
            const task = {};
            controles.forEach(control => task[control.dataset.field] = control.value);
            services.agregarTarea(task, taskNew => {
                mostrarTarea(taskNew);
                formulario.reset();
            });
        }
    };

    const cargarResponsables = () => 
        services.obtenerUsuarios(data => data.forEach(responsable => 
            responsables.insert(
                s5.createElem('option', { 'value': responsable.id })
                    .insert(document.createTextNode(`${responsable.nombre} ${responsable.apellidos}`))
            )
        ));

    return {
        start
    };
});