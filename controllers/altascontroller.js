const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');

const mostrarVistaAltas = async (req, res) => {
    try {
        const { data: deptos, error } = await supabase
            .from('departamentos')
            .select('*');
            
        if (error) throw error;

        res.render('altasUsuario', { 
            titulo: 'Dar de alta usuario', 
            mensaje: 'Crea un nuevo miembro',
            deptos 
        });
    } catch (err) {
        console.error('Error al cargar departamentos:', err);
        res.render('altasUsuario', { 
            titulo: 'Altas',
            mensaje: 'Error al cargar deptos',
            deptos: []
        });
    }
};

const crearUsuario = async (req, res) => {
    try {
        console.log("--- Intento de creación de usuario ---");
        console.log("Datos recibidos:", req.body);
        
        const { nombre, correo, password, rol_id, departamento_id } = req.body;

        if (!nombre || !correo || !password || !rol_id) {
            console.warn("⚠️ Error: Campos obligatorios faltantes");
            return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
        }

        const passwordEncriptada = await bcrypt.hash(password, 10);

        const nuevoUsuario = { 
            nombre: nombre, 
            correo: correo, 
            password: passwordEncriptada, 
            rol_id: parseInt(rol_id), 
            departamento_id: (departamento_id && departamento_id !== "") ? parseInt(departamento_id) : null 
        };

        console.log("Objeto a insertar en Supabase:", nuevoUsuario);

        const { data, error } = await supabase
            .from('usuarios')
            .insert([nuevoUsuario])
            .select(); 
        
        if (error) {
            console.error("❌ ERROR DE SUPABASE:");
            console.error("Código:", error.code);
            console.error("Mensaje:", error.message);
            console.error("Detalle:", error.details);
            console.error("Hint:", error.hint);
            return res.status(400).json({ success: false, message: error.message });
        }
        
        console.log("✅ Usuario creado exitosamente:", data);
        res.json({ success: true, message: 'Usuario registrado con seguridad', data });

    } catch (error) {
        console.error("💥 Error inesperado:", error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

module.exports = {
    mostrarVistaAltas,
    crearUsuario,
};