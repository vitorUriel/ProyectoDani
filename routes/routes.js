const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketcontroller');
const altascontroller = require('../controllers/altascontroller');
const authcontroller = require('../controllers/authcontroller');
const db = require('../config/database')



router.get('/', (req, res) => {
    const mensaje = 'Bienvenido a la página de inicioo';
    const titulo = 'Inicioo';
    res.render('inicioo',{mensaje, titulo});
});

router.get('/inicioo', (req, res) => {
    const mensaje = 'Bienvenido a la página de inicioo';
    const titulo = 'inicioo';
    res.render('inicioo',{mensaje, titulo});
});


router.get('/login', (req, res) => {
    res.render('login', { titulo: 'Login - System Tickets' });
});
router.post('/login', authcontroller.login);


router.get('/usuariosN1', (req, res) => {
    const mensaje = 'Bienvenido a la página de usuariosN1';
    const titulo = 'Usuarios';
    res.render('usuariosN1',{mensaje, titulo});
});

router.get('/ticketUsuario', (req, res) => {
    const mensaje = 'Bienvenido a la página de ticketUsuario';
    const titulo = 'ticketUsuario';
    res.render('ticketUsuario',{mensaje, titulo});
});

router.get('/adminDepto', ticketController.mostrarAdminDepto);

router.post('/actualizarTicket', ticketController.actualizarTicket);

router.get('/reporteMensu', (req, res) => {
    const mensaje = 'Bienvenido a la página de reporteMensu';
    const titulo = 'reporteMensu';
    res.render('reporteMensu',{mensaje, titulo});
});

router.get('/adminGeneral', (req, res) => {
    const mensaje = 'Bienvenido a la página de adminGeneral';
    const titulo = 'adminGeneral';
    res.render('adminGeneral',{mensaje, titulo});
});

router.get('/adminDepto', async (req, res) => {
    // 1. Verificamos que sea un Admin de Área (rol_id 2)
    const user = req.session.usuario;
    if (!user || user.rol_id !== 2) {
        return res.redirect('/login');
    }

    try {
        // 2. Buscamos el nombre del departamento
        const [depto] = await db.query('SELECT nombre FROM departamentos WHERE id = ?', [user.departamento_id]);
        
        // 3. Buscamos SOLO los tickets de SU departamento
        const [tickets] = await db.query('SELECT * FROM tickets WHERE departamento_id = ?', [user.departamento_id]);

        // 4. Renderizamos la vista con los datos reales
        res.render('adminDepto', { 
            nombreDepto: depto[0].nombre,
            usuarioNombre: user.nombre,
            tickets: tickets 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el panel");
    }
});

//altasUsuarios
router.get('/altasUsuario', altascontroller.mostrarVistaAltas);
router.post('/usuarios', altascontroller.crearUsuario);

router.get('/altasUsuario', (req, res) => {
    const mensaje = 'Bienvenido a la página de altasUsuario';
    const titulo = 'altasUsuario';
    res.render('altasUsuario',{mensaje, titulo});
});

router.get('/adminJardineria', (req, res) => {
    const mensaje = 'Bienvenido a la página de adminJardineria';
    const titulo = 'adminJardineria';
    res.render('adminJardineria',{mensaje, titulo});
});

router.get('/adminLimpieza', (req, res) => {
    const mensaje = 'Bienvenido a la página de adminLimpieza';
    const titulo = 'adminLimpieza';
    res.render('adminLimpieza',{mensaje, titulo});
});

router.get('/adminSoporte', (req, res) => {
    const mensaje = 'Bienvenido a la página de adminSoporte';
    const titulo = 'adminSoporte';
    res.render('adminSoporte',{mensaje, titulo});
});

router.get('/ticketImprimir', (req, res) => {
    const mensaje = 'Bienvenido a la página de ticketImprimir';
    const titulo = 'ticketImprimir';
    res.render('ticketImprimir',{mensaje, titulo});
});


module.exports = router;

