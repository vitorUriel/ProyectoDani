const db = require('../config/database');
// const bcrypt = require('bcryptjs'); // Descomenta esto cuando instales la librería

const nivelARolId = {
    '1': 3, // Usuario
    '2': 1, // Admin General
    '3': 2, '4': 2, '5': 2, '6': 2, // Admins de Área
};

const deptoFormAId = {
    '': null, '1': null, '2': 1, '3': 3, '4': 2, '5': 4,
};

// --- NUEVA FUNCIÓN: Muestra el formulario ---
const mostrarVistaAltas = async (req, res) => {
    try {
        // Opcional: Podrías consultar los departamentos aquí para mandarlos al select del Pug
        const [deptos] = await db.query('SELECT * FROM departamentos');
        res.render('altasUsuario', { 
            titulo: 'Dar de alta usuario', 
            mensaje: 'Crea un nuevo miembro',
            deptos // Se los pasas al Pug
        });
    } catch (err) {
        console.error(err);
        res.render('altasUsuario', { titulo: 'Altas', mensaje: 'Error al cargar deptos' });
    }
};

// --- TU FUNCIÓN: Crea el usuario ---
const crearUsuario = async (req, res) => {
    // 1. Recibimos los datos con los nombres exactos que pusimos en el Pug
    const { nombre, correo, password, rol_id, departamento_id } = req.body;

    // 2. Validación básica
    if (!nombre?.trim() || !correo?.trim() || !password || !rol_id) {
        return res.status(400).json({ success: false, message: 'Faltan datos obligatorios' });
    }

    // 3. Regla de negocio: Si es Admin General (1) o Usuario Normal (3), ignoramos el departamento
    let deptoFinal = departamento_id ? parseInt(departamento_id) : null;

    if (rol_id === '1') {
        deptoFinal = 1;
    } else if (rol_id === '3') {
        deptoFinal = null;
    } else if (rol_id ==='2' && !deptoFinal) {
        return res.status(400).json({ success: false, message: 'Favor de selccionar, a que departamento pertenece este administrador'});
    }

    try {
        // 4. Guardar en la base de datos
        await db.query(
            `INSERT INTO usuarios (nombre, correo, password, rol_id, departamento_id)
             VALUES (?, ?, ?, ?, ?)`,
            [nombre.trim(), correo.trim(), password, parseInt(rol_id), deptoFinal] 
        );
        
        // Respondemos con JSON para que el script de Pug muestre la alerta bonita
        res.json({ success: true, message: '¡Usuario creado exitosamente!' });

    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'Ese correo ya está registrado.' });
        }
        res.status(500).json({ success: false, message: 'Error al crear el usuario en la base de datos.' });
    }
};



module.exports = {
    mostrarVistaAltas, // ¡No olvides exportarla!
    crearUsuario,
};

