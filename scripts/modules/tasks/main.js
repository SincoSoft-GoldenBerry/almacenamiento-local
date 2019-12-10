myApp.define('tasks/main', ['services', 'tasks/new'], (services, newTask) => {
    let usuario, tasks = [];

    const taskContainers = s5.get('.tasks-container');

    const load = usr => {
        usuario = usr;
        newTask.start(usr, mostrarTarea);
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
        const html = tasks.reduce((data, task) => {
            data[task.estado].push(`<div class="task d-flex flex-column px-4 py-3 m-1 border rounded-sm bg-secondary">
                <div class="task-options ${task.editable ? 'd-flex' : 'd-none'} justify-content-center align-items-center" data-id="${task.id}" data-next="${next[task.estado]}">
                    <i class="far fa-hand-point-right" title="Mover al siguiente estado"></i>
                </div>
                <div class="task-title">${task.titulo}</div>
                <div class="task-body">
                    <div class="mt-2">
                        ${task.descripcion}
                    </div>
                    <div class="mt-2 d-flex flex-column">
                        <small><b>Creado: </b>${task.fechaCreacion}</small>
                        <small><b>Para: </b>${task.fecha}</small>
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