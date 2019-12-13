myApp.define('services', ['dataBase/main'], ({ selectFirst, select, insert }) => {

    const fechaActual = (d = new Date()) => `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;

    const formatearFecha = f => {
        const d = new Date(f);
        d.setDate(d.getDate() + 1);
        return fechaActual(d);
    };

    const tarea = idUsuario => row => ({
        id: row['id'],
        titulo: row['titulo'],
        descripcion: row['descripcion'],
        fechaCreacion: row['fechaCreacion'],
        fecha: row['fecha'],
        estado: row['estado'],
        editable: row['encargadoId'] == idUsuario
    });

    return {
        serviciosUsuario: {
            obtenerUsuario: (usuario, pass, fnNext) => selectFirst(`SELECT * FROM usuario WHERE correo = "${usuario}" AND contrasena = "${pass}"`, row => ({
                id: row['id'],
                nombre: row['nombre'],
                apellidos: row['apellidos'],
                correo: row['correo']
            }), fnNext),
            obtenerUsuarios: fnNext => select('SELECT * FROM usuario', row => ({ id: row['id'], nombre: row['nombre'], apellidos: row['apellidos'] }), fnNext),
            registrarUsuario: ({ nombre, apellidos, correo, contrasena }, fnNext) => insert('INSERT INTO usuario(nombre, apellidos, correo, contrasena) VALUES (?,?,?,?)', [ nombre, apellidos, correo, contrasena ], fnNext)
        },
        serviciosTareas: {
            obtenerTareasUsuario: (idUsuario, fnNext) => select(`SELECT * FROM task WHERE creadorId = ${idUsuario} OR encargadoId = ${idUsuario}`, tarea(idUsuario), fnNext),
            agregarTarea: ({ titulo, descripcion, encargadoId, creadorId, fecha }, fnNext) => insert('INSERT INTO task(titulo, descripcion, estado, encargadoId, creadorId, fecha, fechaCreacion) VALUES(?,?,?,?,?,?,?)', [
                titulo,
                descripcion,
                'todo',
                encargadoId,
                creadorId,
                formatearFecha(fecha),
                fechaActual()
            ], result => selectFirst(`SELECT * FROM task WHERE id = ${result.insertId}`, tarea(creadorId), fnNext)),
            actualizarEstado: (taskId, taskEstado, fnNext) => insert('UPDATE task SET estado = ? WHERE id = ?', [taskEstado, taskId], fnNext)
        }
    };
});