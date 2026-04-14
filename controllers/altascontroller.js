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
        // Consultamos los departamentos
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

// --- FUNCIÓN: Crea el usuario ---
const crearUsuario = async (req, res) => {
    try {
        // Obtenemos los datos que envió el usuario desde el formulario
        // (Asegúrate de que tu form envíe 'rol_id' y 'departamento_id' o haz el mapeo con tus constantes de arriba)
        const { nombre, correo, password, rol_id, departamento_id } = req.body;

        // 1. Encriptamos la contraseña con bcrypt (10 "saltos" de seguridad)
        const passwordEncriptada = await bcrypt.hash(password, 10);

        // 2. Preparamos la consulta SQL
        const sql = 'INSERT INTO usuarios (nombre, correo, password, rol_id, departamento_id) VALUES (?, ?, ?, ?, ?)';
        
        // 3. Ejecutamos la consulta usando "await db.query" (Igual que arriba)
        await db.query(sql, [nombre, correo, passwordEncriptada, rol_id, departamento_id]);
        
        // Si no hay error en la línea anterior, respondemos que todo salió bien
        res.json({ success: true, message: 'Usuario registrado con seguridad' });

    } catch (error) {
        // Imprimimos el error en la terminal para saber qué falló
        console.log("Error al crear usuario:", error);
        res.status(500).json({ success: false, message: 'Error en el servidor al registrar' });
    }
};

module.exports = {
    mostrarVistaAltas,
    crearUsuario,
};