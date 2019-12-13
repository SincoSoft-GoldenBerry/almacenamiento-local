myApp.define('services', ['dataBase/main'], (dataBase) => {

    const fechaActual = f => {
        const d = f || new Date();
        return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    };

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
        obtenerUsuario: (usuario, pass, fnNext) => dataBase.selectFirst(`SELECT * FROM usuario WHERE correo = "${usuario}" AND contrasena = "${pass}"`, row => ({
            id: row['id'],
            nombre: row['nombre'],
            apellidos: row['apellidos'],
            correo: row['correo']
        }), fnNext),
        obtenerUsuarios: fnNext => dataBase.select('SELECT * FROM usuario', row => ({ id: row['id'], nombre: row['nombre'], apellidos: row['apellidos'] }), fnNext),
        registrarUsuario: (usuario, fnNext) => dataBase.insert('INSERT INTO usuario(nombre, apellidos, correo, contrasena) VALUES (?,?,?,?)', [
            usuario.nombre,
            usuario.apellidos,
            usuario.correo,
            usuario.contrasena
        ], fnNext),
        obtenerTareasUsuario: (idUsuario, fnNext) => dataBase.select(`SELECT * FROM task WHERE creadorId = ${idUsuario} OR encargadoId = ${idUsuario}`, tarea(idUsuario), fnNext),
        agregarTarea: (task, fnNext) => dataBase.insert('INSERT INTO task(titulo, descripcion, estado, encargadoId, creadorId, fecha, fechaCreacion) VALUES(?,?,?,?,?,?,?)', [
            task.titulo,
            task.descripcion,
            'todo',
            task.encargadoId,
            task.creadorId,
            formatearFecha(task.fecha),
            fechaActual()
        ], result => dataBase.selectFirst(`SELECT * FROM task WHERE id = ${result.insertId}`, tarea(task.creadorId), fnNext)),
        actualizarEstado: (taskId, taskEstado, fnNext) => dataBase.insert('UPDATE task SET estado = ? WHERE id = ?', [taskEstado, taskId], fnNext)
    };
});