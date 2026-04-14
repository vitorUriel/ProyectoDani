const db = require('../config/database');
const bcrypt = require('bcrypt');

const nivelARolId = {
    '1': 3, // Usuario
    '2': 1, // Admin General
    '3': 2, '4': 2, '5': 2, '6': 2, // Admins de Área
};

const deptoFormAId = {
    '': null, '1': null, '2': 1, '3': 3, '4': 2, '5': 4,
};

// --- FUNCIÓN: Muestra el formulario ---
const mostrarVistaAltas = async (req, res) => {
    try {
        const [deptos] = await db.query('SELECT * FROM departamentos');
        res.render('altasUsuario', { 
            titulo: 'Dar de alta usuario', 
            mensaje: 'Crea un nuevo miembro',
            deptos 
        });
    } catch (err) {
        console.error(err);
        res.render('altasUsuario', { titulo: 'Altas', mensaje: 'Error al cargar deptos' });
    }
};


const crearUsuario = async (req, res) => {
    try {
      
        const { nombre, correo, password, rol_id, departamento_id } = req.body;

    
        const passwordEncriptada = await bcrypt.hash(password, 10);

      
        const sql = 'INSERT INTO usuarios (nombre, correo, password, rol_id, departamento_id) VALUES (?, ?, ?, ?, ?)';
        
        await db.query(sql, [nombre, correo, passwordEncriptada, rol_id, departamento_id]);
        
        res.json({ success: true, message: 'Usuario registrado con seguridad' });

    } catch (error) {
        console.log("Error al crear usuario:", error);
        res.status(500).json({ success: false, message: 'Error en el servidor al registrar' });
    }
};

module.exports = {
    mostrarVistaAltas,
    crearUsuario,
};