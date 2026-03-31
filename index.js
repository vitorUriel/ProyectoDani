const express = require('express');
const app = express();
const router = require('./routes/routes');
const path = require('path');

// Configurar Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { titulo: 'Mi Proyecto Express' });
});

app.use(router);

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});