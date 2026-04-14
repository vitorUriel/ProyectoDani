const db = require('../config/database');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        
        if (usuarios.length === 0) {
            return res.redirect('/login?error=no_existe');
        }

        const usuario = usuarios[0];

        const coinciden = await bcrypt.compare(password, usuario.password);
        
        if (!coinciden) {
            return res.redirect('/login?error=password');
        }

        req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            rol_id: usuario.rol_id,
            departamento_id: usuario.departamento_id
        };
        
        req.session.save((err) => {
            if (err) {
                console.error("Error guardando sesión:", err);
                return res.status(500).send("Error al iniciar sesión.");
            }
        
            if (usuario.rol_id === 1) {
                res.redirect('/adminGeneral');
            } else if (usuario.rol_id === 2) {
                res.redirect('/adminDepto');
            } else if (usuario.rol_id === 3) {
                res.redirect('/usuariosN1');
            } else {
                res.redirect('/');
            }
        });

    } catch (error) {
        console.error("Error en el login:", error);
        res.send(`<script>alert('Error en el servidor'); window.history.back();</script>`);
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error cerrando sesión:', err);
            return res.status(500).send('Error al cerrar sesión.');
        }

        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};

module.exports = {
    login,
    logout
};