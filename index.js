const express = require('express');
const app = express();
const router = require('./routes/routes');
const path = require('path');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('inicioo', {
        titulo: 'Mi Proyecto Express',
        mensaje: 'Bienvenido a la página de inicioo'
    });
});

app.use(router);

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});