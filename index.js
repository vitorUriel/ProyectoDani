require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');
const router = require('./routes/routes'); 

const app = express();

// 1. Configuraciones de lectura de datos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Configuración de Sesión (¡AQUÍ USAMOS EL .ENV!)
app.use(session({
    secret: process.env.SESSION_SECRET, // Llamamos al secreto de tu archivo .env
    resave: false,
    saveUninitialized: false,
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
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});