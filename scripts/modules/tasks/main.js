myApp.define('tasks/main', ['services', 'tasks/new'], ({ serviciosTareas: services }, { start }) => {
    let tasks = [];

    const taskContainers = s5.get('.tasks-container');

    const load = usr => {
        start(usr, mostrarTarea);
        services.obtenerTareasUsuario(usr.id, _tasks => {
            tasks = _tasks;
            mostrarTareas();
        });
    };

    const mostrarTarea = task => { 
        tasks.push(task); 
        mostrarTareas();
    };

    const next = {
        todo: 'progress',
        progress: 'done',
        done: ''
    };

    const mostrarTareas = () => {
        const html = tasks.reduce((data, { estado, editable, id, titulo, descripcion, fecha, fechaCreacion }) => {
            data[estado].push(`<div class="task d-flex flex-column px-4 py-3 m-1 border rounded-sm bg-secondary">
                <div class="task-options ${editable ? 'd-flex' : 'd-none'} justify-content-center align-items-center" data-id="${id}" data-next="${next[estado]}">
                    <i class="far fa-hand-point-right" title="Mover al siguiente estado"></i>
                </div>
                <div class="task-title">${titulo}</div>
                <div class="task-body">
                    <div class="mt-2">
                        ${descripcion}
                    </div>
                    <div class="mt-2 d-flex flex-column">
                        <small><b>Creado: </b>${fechaCreacion}</small>
                        <small><b>Para: </b>${fecha}</small>
                    </div>
                    <div class="task-responsable-container mt-2">
                        <img class="border rounded-circle" src="https://sincoerp.com/S5/imagenes/Carlos.jpg" />
                    </div>
                </div>
            </div>`);
            return data;
        }, { todo: [], progress: [], done: []});

        taskContainers.forEach(container => {
            container.innerHTML = html[container.dataset.type].join('');
            container.get('.task-options').forEach(opt => opt.addEvent('click', function() {
                const task = tasks.find(t => t.id === parseInt(this.dataset.id));
                task.estado = this.dataset.next;

                services.actualizarEstado(task.id, task.estado, () => mostrarTareas());
            }));
        });
    };

    return {
        load
    };
});