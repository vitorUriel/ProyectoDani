
const db = require('../config/database');


const mostrarAdminDepto = async (req, res) => {
    const mensaje = 'Bienvenido a la página de adminDepto';
    const titulo = 'adminDepto';
    let tickets = [];
    
    try {
        const [rows] = await db.query(
            `SELECT id, descripcion, ubicacion, estado, prioridad
             FROM tickets
             WHERE departamento_id = ?`,
            [1] 
        );
        tickets = rows;
    } catch (err) {
        console.error(err);
    }
    
    res.render('adminDepto', { mensaje, titulo, tickets });
};

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

module.exports = {
    mostrarAdminDepto,
    actualizarTicket
};