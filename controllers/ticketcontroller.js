const supabase = require('../config/supabase');

const mostrarAdminDepto = async (req, res) => {
    const user = req.session.usuario;
    if (!user) return res.redirect('/login');

    try {
        // 1. Obtener nombre del departamento
        const { data: depto, error: errDepto } = await supabase
            .from('departamentos')
            .select('nombre')
            .eq('id', user.departamento_id)
            .single();

        if (errDepto || !depto) {
            console.error("Error al buscar departamento:", errDepto);
            return res.status(404).send('Departamento no encontrado');
        }

        // 2. Obtener tickets del departamento
        const { data: tickets, error: errTickets } = await supabase
            .from('tickets')
            .select('*')
            .eq('departamento_id', user.departamento_id);

        if (errTickets) throw errTickets;

        res.render('adminDepto', { 
            nombreDepto: depto.nombre,
            usuarioNombre: user.nombre,
            tickets
        });
    } catch (error) {
        console.error("Error en mostrarAdminDepto:", error);
        res.status(500).send("Error interno");
    }
};

const mostrarTicketUsuario = async (req, res) => {
    const user = req.session.usuario;
    if (!user || user.rol_id !== 3) return res.redirect('/login');

    try {
        const { data: misTickets, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('usuario_id', user.id);

        if (error) throw error;

        res.render('ticketUsuario', { 
            usuarioNombre: user.nombre,
            tickets: misTickets 
        });
    } catch (error) {
        console.error("Error en mostrarTicketUsuario:", error);
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
        const { data, error } = await supabase
            .from('tickets')
            .update({ 
                estado: estado, 
                prioridad: prioridad 
            })
            .eq('id', id)
            .select();

        if (error) {
            console.error("Error de Supabase al actualizar ticket:", error);
            return res.status(400).json({ ok: false, error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ ok: false, error: 'Ticket no encontrado' });
        }

        res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Error inesperado al actualizar ticket:', err);
        res.status(500).json({ ok: false, error: 'Error en el servidor' });
    }
};

module.exports = {
    mostrarAdminDepto,
    actualizarTicket,
    mostrarTicketUsuario
};