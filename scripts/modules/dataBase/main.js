myApp.define('dataBase/main', [], () => {
    const sqls = [
        'CREATE TABLE IF NOT EXISTS usuario(id integer primary key autoincrement, nombre text, apellidos text, correo text unique, contrasena text)',
        'CREATE TABLE IF NOT EXISTS task(id integer primary key autoincrement, titulo text, descripcion text, estado text, encargadoId integer, creadorId integer, fecha datetime, fechaCreacion datetime, FOREIGN KEY (encargadoId) REFERENCES usuario(id), FOREIGN KEY (creadorId) REFERENCES usuario(id))',
        `INSERT INTO usuario(nombre, apellidos, correo, contrasena)
        VALUES("Carlos Eduardo", "Díaz Valbuena", "carlos.diaz@sinco.com.co", "carlos123"),
        ("Administrador", "SincoSoft", "goldenberry@sinco.com.co", "admin123")`,
        `INSERT INTO task(titulo, descripcion, estado, encargadoId, creadorId, fecha, fechaCreacion)
        VALUES("Crear ejemplo localStorage", "Se debe crear un ejemplo con HTML y JS para mostrar localStorage", "todo", 1, 2, "13/12/2019", "10/12/2019"),
        ("Crear ejemplo sessionStorage", "Se debe crear un ejemplo con HTML y JS para mostrar sessionStorage", "progress", 2, 1, "12/12/2019", "10/12/2019"),
        ("Crear base de datos Web", "Se debe crear la base de datos para mostrar Web SQL", "done", 2, 2, "10/12/2019", "10/12/2019"),
        ("Preparar solución", "Crear la solución para realizar los ejemplos", "done", 2, 1, "10/12/2019", "10/12/2019")`
    ];

    const crearDB = () => openDatabase('BD Tasks', '1.0', 'Tasks List', 50*1024*1024);
    const crearTablas = () => {
        const db = crearDB();

        db.transaction(tx => {
            const ex = sql => tx.executeSql(sql, [], (tx, results) => {
                let s = sqls.shift();
                if (s) ex(s);
            });

            ex(sqls.shift());
        });
    };

    crearTablas();

    const select = (sql, map, next) => {
        const db = crearDB();

        db.transaction(tx => tx.executeSql(sql, [], (tx, results) => {
            const values = [].map.call(results.rows, map);
            next(values);
        }));
    };

    const insert = (sql, data, next) => {
        const db = crearDB();

        db.transaction(tx => tx.executeSql(sql, data, (tx, results) => {
            next(results);
        }));
    };

    const selectFirst = (sql, map, next) => select(sql, map, values => next(values.shift()));

    return {
        select,
        selectFirst,
        insert
    };
});