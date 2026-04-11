const db = require('../config/database');

const mostrarAdminGeneral = async (req, res) => {
    const titulo = 'adminGeneral';
    const mensaje = 'Bienvenido a la página de adminGeneral';
    try {
        const [listaUsuarios] = await db.query(
            `SELECT u.id, u.nombre, u.correo,
                    r.nombre AS rol_nombre,
                    d.nombre AS depto_nombre
             FROM usuarios u
             INNER JOIN roles r ON u.rol_id = r.id
             LEFT JOIN departamentos d ON u.departamento_id = d.id
             ORDER BY u.id`
        );
        res.render('adminGeneral', { mensaje, titulo, listaUsuarios });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la base de datos');
    }
};

module.exports = {
    mostrarAdminGeneral,
};