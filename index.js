const express = require('express');
const helmet =require('helmet');
const session = require('express-session');
const path = require('path');
const router = require('./routes/routes'); // AQUÍ se declara una sola vez

const app = express();

// 1. Configuraciones de lectura de datos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Configuración de Sesión
app.use(session({
    secret: 'keybord cat',
    resave: false,
    saveUninitialized: false,
}));

// 3. Configuración de Vistas (Pug)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//4. Configuración de seguridad de Helmet
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "https://cdn-icons-png.flaticon.com"],
        fontSrc: ["'self'", "https://cdn.jsdelivr.net"], // Permite los íconos de Bootstrap
      },
    },
  }));
  
  // 5. Archivos Estáticos (CSS, Imágenes)
 app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      
      // 👇 AGREGA ESTA LÍNEA EXACTAMENTE AQUÍ 👇
      scriptSrcAttr: ["'unsafe-inline'"], 
      
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https://cdn-icons-png.flaticon.com"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
    },
  },
}));

// 6. USO DE LAS RUTAS
app.use(router); 

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});