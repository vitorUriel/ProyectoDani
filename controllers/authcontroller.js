const db = require('../config/database');

const login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        // 1. Buscamos si existe alguien con ese correo
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        
        // Si el arreglo está vacío, el usuario no existe
        if (usuarios.length === 0) {
            return res.send(`<script>alert('El correo no existe'); window.history.back();</script>`);
        }

        // Extraemos al usuario encontrado
        const usuario = usuarios[0];

        // 2. Verificamos que la contraseña coincida
        if (usuario.password !== password) {
            return res.send(`<script>alert('Contraseña incorrecta'); window.history.back();</script>`);
        }

        // 3. ¡ÉXITO! Guardamos sus datos en la "memoria" (sesión)
        req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            rol_id: usuario.rol_id,
            departamento_id: usuario.departamento_id
        };

        // 4. EL DESVÍO DE RUTAS (Lo que pediste)
        // Redirigimos dependiendo de su nivel (rol_id)
        if (usuario.rol_id === 1) {
            // Admin General
            res.redirect('/adminGeneral');
        } else if (usuario.rol_id === 2) {
            // Admin de Área/Departamento
            res.redirect('/adminDepto'); 
        } else if (usuario.rol_id === 3) {
            // Usuario Normal
            res.redirect('/usuariosN1');
        } else {
            // Por si acaso
            res.redirect('/');
        }

    } catch (error) {
        console.error("Error en el login:", error);
        res.send(`<script>alert('Error en el servidor'); window.history.back();</script>`);
    }
};

module.exports = {
    login
};