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



// NUEVA RUTA DINÁMICA
router.get('/usuariosN1', async (req, res) => {
    const user = req.session.usuario;
    
    // Verificamos que el usuario esté logueado
    if (!user) return res.redirect('/login');

    try {
        // 1. Buscamos en la base de datos SOLO los tickets de este usuario
        const [misTickets] = await db.query('SELECT * FROM tickets WHERE usuario_id = ?', [user.id]);

        // 2. Renderizamos la vista y LE PASAMOS los tickets
        res.render('usuariosN1', { 
            titulo: 'Panel Usuario',
            usuarioNombre: user.nombre,
            tickets: misTickets // <--- ¡ESTA ES LA LÍNEA MÁGICA QUE QUITA EL ERROR!
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el panel de usuario");
    }
});

router.get('/ticketUsuario', async (req, res) => {
    const user = req.session.usuario;
    if (!user || user.rol_id !== 3) return res.redirect('/login');

    try {
        // 1. Atrapamos el ID que viene en la URL (si no viene nada, queda vacío)
        const deptoPreseleccionado = req.query.depto || "";

        // 2. Traemos los departamentos de la base de datos
        const [departamentos] = await db.query('SELECT id, nombre FROM departamentos');

        // 3. Renderizamos la vista y le pasamos todo
        res.render('ticketUsuario', { 
            departamentos: departamentos,
            deptoSeleccionado: deptoPreseleccionado // <--- Pasamos la variable nueva
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el formulario");
    }
});

// RUTA POST: Atrapa los datos del formulario y los guarda en la Base de Datos
router.post('/tickets', async (req, res) => {
    // 1. Verificamos quién está creando el ticket
    const user = req.session.usuario;
    if (!user) return res.redirect('/login');

    // 2. Extraemos lo que el usuario escribió en el formulario
    const { departamento_id, descripcion, ubicacion } = req.body;

    try {
        // 3. Insertamos el nuevo registro en la tabla de tickets
        // Nota: Le asignamos el estado 'Pendiente' por defecto al crearlo
        await db.query(
            'INSERT INTO tickets (usuario_id, departamento_id, descripcion, ubicacion, estado) VALUES (?, ?, ?, ?, ?)',
            [user.id, departamento_id, descripcion, ubicacion, 'Pendiente']
        );

        // 4. Si todo sale bien, lo regresamos a su pantalla principal
        res.redirect('/usuariosN1');
        
    } catch (error) {
        console.error("Error al guardar el ticket:", error);
        res.status(500).send("Hubo un error al intentar crear el ticket.");
    }
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

router.get('/usuariosN1', async (req, res) => {
    const user = req.session.usuario;
    if (!user) return res.redirect('/login');

    try {
        // Hacemos la consulta
        const resultado = await db.query('SELECT * FROM tickets WHERE usuario_id = ?', [user.id]);
        
        // Dependiendo de si usas mysql o mysql2, los datos vienen en el índice 0 o directo.
        // Esta línea asegura que SIEMPRE saquemos el arreglo de tickets correctamente.
        let misTickets = [];
        if (Array.isArray(resultado[0])) {
            misTickets = resultado[0]; // Para mysql2 (devuelve [rows, fields])
        } else if (Array.isArray(resultado)) {
            misTickets = resultado;    // Para otras configuraciones que devuelven directo los rows
        }

        // Imprimimos en consola para ver qué estamos mandando (te servirá para revisar)
        console.log("Tickets encontrados para el usuario:", misTickets);

        res.render('usuariosN1', { 
            titulo: 'Panel Usuario',
            usuarioNombre: user.nombre,
            tickets: misTickets 
        });
    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).send("Error al cargar el panel de usuario");
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



router.get('/ticketImprimir', (req, res) => {
    const mensaje = 'Bienvenido a la página de ticketImprimir';
    const titulo = 'ticketImprimir';
    res.render('ticketImprimir',{mensaje, titulo});
});


module.exports = router;

