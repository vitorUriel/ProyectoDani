// Importamos la base de datos AQUÍ en el controlador
const db = require('../config/database');

// 1. Función para mostrar la vista del Admin del Depto
const mostrarAdminDepto = async (req, res) => {
    const mensaje = 'Bienvenido a la página de adminDepto';
    const titulo = 'adminDepto';
    let tickets = [];
    
    try {
        const [rows] = await db.query(
            `SELECT id, descripcion, ubicacion, estado, prioridad
             FROM tickets
             WHERE departamento_id = ?`,
            [1] // Más adelante este '1' lo tomaremos de la sesión del usuario
        );
        tickets = rows;
    } catch (err) {
        console.error(err);
    }
    
    // Renderizamos la vista enviando los datos
    res.render('adminDepto', { mensaje, titulo, tickets });
};

// 2. Función para guardar los cambios (el POST) — body viene de fetch JSON gracias a express.json()
const actualizarTicket = async (req, res) => {
    const id = Number(req.body.id);
    const { estado, prioridad } = req.body;

    if (!Number.isFinite(id) || estado == null || prioridad == null) {
        return res.status(400).json({ ok: false, error: 'Datos inválidos' });
    }

    try {
        const [result] = await db.query(
            'UPDATE tickets SET estado = ?, prioridad = ? WHERE id = ?',
            [estado, prioridad, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, error: 'Ticket no encontrado' });
        }
        res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Error al actualizar ticket:', err);
        res.status(500).json({ ok: false, error: 'Error en el servidor' });
    }
};

// Exportamos las funciones para que las rutas las puedan usar
module.exports = {
    mostrarAdminDepto,
    actualizarTicket
};