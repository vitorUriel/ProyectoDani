
const db = require('../config/database');


const mostrarAdminDepto = async (req, res) => {
    const user = req.session.usuario;

    // Si por algo se pierde la sesión, evitamos el error enviando al login
    if (!user) return res.redirect('/login');

    try {
        // Obtenemos el nombre del departamento
        const [depto] = await db.query('SELECT nombre FROM departamentos WHERE id = ?', [user.departamento_id]);
        
        // Obtenemos los tickets
        const [tickets] = await db.query('SELECT * FROM tickets WHERE departamento_id = ?', [user.departamento_id]);

        // ¡AQUÍ ESTÁ LA CLAVE! 
        // Debes pasar "nombreDepto" exactamente como lo usas en el .pug
        res.render('adminDepto', { 
            nombreDepto: depto[0].nombre, // <--- Verifica que esto no sea undefined
            usuarioNombre: user.nombre,
            tickets: tickets 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno");
    }
};

const mostrarTicketUsuario = async (req, res) => {
    const user = req.session.usuario;
    if (!user || user.rol_id !== 3) return res.redirect('/login');

    try {
        // Buscamos SOLO los tickets que creó ESTE usuario en particular
        // (Asegúrate de que tu tabla 'tickets' tenga una columna como 'usuario_id')
        const [misTickets] = await db.query('SELECT * FROM tickets WHERE usuario_id = ?', [user.id]);

        res.render('ticketUsuario', { 
            usuarioNombre: user.nombre,
            tickets: misTickets 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el panel de usuario");
    }
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
    actualizarTicket,
    mostrarTicketUsuario
};