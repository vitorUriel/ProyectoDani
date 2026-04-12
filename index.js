const express = require('express');
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

// 4. Archivos Estáticos (CSS, Imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// 5. USO DE LAS RUTAS
// Nota: Eliminamos el app.get('/', ...) de aquí porque ya lo pusimos en el archivo de rutas
app.use(router); 

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});