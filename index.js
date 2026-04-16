require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');
const router = require('./routes/routes'); 
const supabase = require('./config/supabase'); // Importar Supabase

const app = express();

const SESSION_SECRET = process.env.SESSION_SECRET || 'development-secret-please-change';

// 1. Configuraciones de lectura de datos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Si estás detrás de un proxy o HTTPS, confiar en el proxy ayuda a que las cookies se envíen correctamente
app.set('trust proxy', 1);

// 3. Configuración de Sesión
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 // 1 hora
  }
}));

// 3. Configuración de Vistas (Pug)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 4. Configuración de seguridad de Helmet (UNIFICADA)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrcAttr: ["'unsafe-inline'"], // Tu solución para los onclicks
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https://cdn-icons-png.flaticon.com"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
        },
    },
}));

// 5. Archivos Estáticos (CSS, Imágenes, JS del cliente)
// Suponiendo que tienes una carpeta llamada "public"
app.use(express.static(path.join(__dirname, 'public')));

// 6. USO DE LAS RUTAS
app.use(router); 

// 7. Arranque del servidor (Buena práctica: usar puerto del .env o 3000 por defecto)
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    
    // Prueba rápida de conexión a Supabase
    try {
        const { data, error } = await supabase.from('usuarios').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log('✅ Conexión exitosa a Supabase');
    } catch (err) {
        console.error('⚠️ Advertencia: No se pudo conectar a Supabase:', err.message);
    }
});