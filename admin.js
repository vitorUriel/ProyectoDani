require('dotenv').config(); // Para leer tu base de datos
const db = require('./config/database'); // Ajusta la ruta si es diferente
const bcrypt = require('bcrypt');

const sembrarAdmin = async () => {
    try {
        // 1. Encriptamos la contraseña "admin123"
        const passwordEncriptada = await bcrypt.hash('Martinez17', 10);

        // 2. Insertamos al usuario con rol_id = 1 (Admin General)
        const sql = `INSERT INTO usuarios (nombre, correo, password, rol_id, departamento_id) 
                     VALUES ('Victor Martinez', 'victorur@gmail.com', ?, 1, NULL)`;
        
        await db.query(sql, [passwordEncriptada]);

        console.log('✅ ¡Administrador creado con éxito!');
        console.log('📧 Correo: victorur@gmail.com');
        console.log('🔑 Password: Martinez17');
        
    } catch (error) {
        console.error('❌ Error al crear el admin:', error);
    } finally {
        process.exit(); // Apaga este mini-script
    }
};

sembrarAdmin();