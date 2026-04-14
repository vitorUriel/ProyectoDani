const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketcontroller');
const altascontroller = require('../controllers/altascontroller');
const authcontroller = require('../controllers/authcontroller');
const usuarcontroller = require('../controllers/usuarioscontroller');
const db = require('../config/database')

// SEGURIDAD
const noCache = (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
};

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.usuario) {
    return next();
  }
  return res.redirect('/login');
};

const protegerRuta = (req, res, next) => {
  if (!req.session || !req.session.usuario) {
    return res.redirect('/login');
  }

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  next();
};

router.get('/logout', authcontroller.logout);

// Validar si es Administrador General (Rol 1)
const isAdminGeneral = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.rol_id == 1) {
        return next(); 
    }
    res.status(403).send(`
        <div style="text-align: center; margin-top: 50px; font-family: Arial;">
            <h1 style="color: #d33;">Acceso Denegado 🛑</h1>
            <p>No tienes los permisos necesarios para ver esta página.</p>
            <a href="/inicioo" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Regresar a Inicio</a>        
        </div>
            `);
};

// Validar si es Administrador de Departamento (Rol 2)

const isAdminDepto = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.rol_id == 2) {
        return next();
    }
    res.status(403).send(`
        <div style="text-align: center; margin-top: 50px; font-family: Arial;">
            <h1 style="color: #d33;">Acceso Denegado 🛑</h1>
            <p>Esta área es exclusiva para los Administradores de Departamento.</p>
            <a href="/inicioo" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Regresar a Inicio</a>      
        </div>
    `);
};

const isUsuario = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.rol_id == 3) {
        return next();
    }
    res.status(403).send(`
        <div style="text-align: center; margin-top: 50px; font-family: Arial;">
            <h1 style="color: #d33;">Acceso Denegado 🛑</h1>
            <p>Es necesario iniciar sesion como usuario.</p>
            <a href="/inicioo" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Regresar a Inicio</a>      
        </div>
    `);
};



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


router.get('/login', noCache, (req, res) => {
    res.render('login', { titulo: 'Login - System Tickets' });
});
router.post('/login', authcontroller.login);
router.get('/logout', authcontroller.logout);


router.get('/usuariosN1', isAuthenticated, protegerRuta, noCache, async (req, res) => {
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

router.get('/ticketUsuario', isAuthenticated, isUsuario, protegerRuta, noCache, async (req, res) => {
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


router.post('/tickets', isAuthenticated, isUsuario, protegerRuta, noCache, async (req, res) => {
    // ...
});

//ADMIN DEPARTAMENTO
router.get('/adminDepto', isAuthenticated, isAdminDepto, protegerRuta,noCache, ticketController.mostrarAdminDepto);

router.post('/actualizarTicket', isAuthenticated, isAdminDepto, protegerRuta, noCache, ticketController.actualizarTicket);

router.get('/reporteMensual', isAuthenticated, isAdminDepto, protegerRuta, noCache, async (req, res) => {
    const user = req.session.usuario;
    if (!user) return res.redirect('/login'); 

    let mesSeleccionado = req.query.mes;
    if (!mesSeleccionado) {
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0'); 
        mesSeleccionado = `${año}-${mes}`; 
    }

    try {
        // 2. Consulta SQL: Cuenta tickets por departamento en ese mes en específico.
        const query = `
            SELECT d.nombre AS departamento, COUNT(t.id) AS total 
            FROM departamentos d 
            LEFT JOIN tickets t ON d.id = t.departamento_id 
                 AND DATE_FORMAT(t.fecha_creacion, '%Y-%m') = ?
            GROUP BY d.id, d.nombre
        `;
        
        const resultado = await db.query(query, [mesSeleccionado]);
        
        let estadisticas = [];
        if (Array.isArray(resultado[0])) {
            estadisticas = resultado[0];
        } else if (Array.isArray(resultado)) {
            estadisticas = resultado;
        }

        res.render('reporteMensual', { 
            estadisticas: estadisticas,
            mesSeleccionado: mesSeleccionado 
        });
    } catch (error) {
        console.error("Error al generar el reporte mensual:", error);
        res.status(500).send("Error al generar el reporte");
    }
});

router.get('/adminGeneral', isAuthenticated, isAdminGeneral, protegerRuta,noCache, usuarcontroller.mostrarUsuarios);




//altasUsuarios
router.get('/altasUsuario', isAuthenticated, isAdminGeneral, protegerRuta,noCache, altascontroller.mostrarVistaAltas);
router.post('/usuarios', isAuthenticated, isAdminGeneral, protegerRuta, noCache, altascontroller.crearUsuario);



// Ruta para imprimir un ticket específico usando un parámetro en la URL (:id)
router.get('/ticketImprimir/:id', isAuthenticated, protegerRuta, noCache, async (req, res) => {
    // Verificamos que haya un usuario logueado (puedes validar que sea admin si lo deseas)
    const user = req.session.usuario;
    if (!user) return res.redirect('/login');

    const idTicket = req.params.id; // Extraemos el ID de la URL

    try {
        // Buscamos solo el ticket que coincide con ese ID
        const resultado = await db.query('SELECT * FROM tickets WHERE id = ?', [idTicket]);
        
        let ticketEncontrado = null;
        if (Array.isArray(resultado[0]) && resultado[0].length > 0) {
            ticketEncontrado = resultado[0][0]; 
        } else if (Array.isArray(resultado) && resultado.length > 0) {
            ticketEncontrado = resultado[0];
        }

        if (!ticketEncontrado) {
            return res.status(404).send("El ticket solicitado no existe.");
        }

        res.render('ticketImprimir', { 
            ticket: ticketEncontrado 
        });

    } catch (error) {
        console.error("Error al buscar el ticket para imprimir:", error);
        res.status(500).send("Error al generar el ticket de impresión");
    }
});


module.exports = router;

