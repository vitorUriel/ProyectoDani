const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketcontroller');
const altascontroller = require('../controllers/altascontroller');
const authcontroller = require('../controllers/authcontroller');
const usuarcontroller = require('../controllers/usuarioscontroller');
const supabase = require('../config/supabase');

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
        // Hacemos la consulta con Supabase
        const { data: misTickets, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('usuario_id', user.id);
        
        if (error) throw error;

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

        // 2. Traemos los departamentos de Supabase
        const { data: departamentos, error } = await supabase
            .from('departamentos')
            .select('id, nombre');

        if (error) throw error;

        // 3. Renderizamos la vista y le pasamos todo
        res.render('ticketUsuario', { 
            departamentos: departamentos,
            deptoSeleccionado: deptoPreseleccionado 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el formulario");
    }
});


router.post('/tickets', isAuthenticated, isUsuario, protegerRuta, noCache, async (req, res) => {
    const user = req.session.usuario;
    if (!user || user.rol_id !== 3) {
        return res.redirect('/login');
    }

    const { departamento_id, descripcion, ubicacion } = req.body;
    const departamentoId = Number(departamento_id);

    if (!departamentoId || !descripcion || !ubicacion) {
        return res.status(400).send('Por favor completa todos los campos del formulario.');
    }

    try {
        const { error } = await supabase
            .from('tickets')
            .insert([
                { 
                    descripcion, 
                    ubicacion, 
                    usuario_id: user.id, 
                    departamento_id: departamentoId 
                }
            ]);

        if (error) throw error;

        return res.redirect('/usuariosN1');
    } catch (error) {
        console.error('Error al guardar el ticket:', error);
        return res.status(500).send('Error al crear el ticket. Intenta de nuevo más tarde.');
    }
});

//ADMIN DEPARTAMENTO
router.get('/adminDepto', isAuthenticated, isAdminDepto, protegerRuta,noCache, ticketController.mostrarAdminDepto);

router.post('/actualizarTicket', isAuthenticated, isAdminDepto, protegerRuta, noCache, ticketController.actualizarTicket);

router.get('/reporteMensual', isAuthenticated, isAdminGeneral, protegerRuta, noCache, async (req, res) => {
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
        // En Supabase, traemos los departamentos y contamos los tickets asociados.
        // Simulamos el comportamiento del mes filtrando manualmente o con rpc.
        // Aquí traemos los nombres de departamentos y luego los tickets de ese mes.
        
        const { data: deptos, error: errDeptos } = await supabase
            .from('departamentos')
            .select('nombre, id');
            
        if (errDeptos) throw errDeptos;

        // Traemos los tickets del mes seleccionado
        const { data: ticketsMes, error: errTickets } = await supabase
            .from('tickets')
            .select('departamento_id')
            .gte('fecha_creacion', `${mesSeleccionado}-01`)
            .lte('fecha_creacion', `${mesSeleccionado}-31T23:59:59`); // Aproximación simple del fin de mes

        if (errTickets) throw errTickets;

        // Agrupamos en JS para obtener las estadísticas
        const estadisticas = deptos.map(d => {
            const total = ticketsMes.filter(t => t.departamento_id === d.id).length;
            return { departamento: d.nombre, total };
        });

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
        // Buscamos solo el ticket que coincide con ese ID en Supabase
        const { data: ticketEncontrado, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('id', idTicket)
            .single();
        
        if (error || !ticketEncontrado) {
            console.error("Error o ticket no encontrado:", error);
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

