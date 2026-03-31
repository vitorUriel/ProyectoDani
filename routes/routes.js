const express = require('express');
const router = express.Router();

router.get('/',(req , res) => {
}) 

/* 
const express = require('express');
const router = express.Router();

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
    const mensaje = 'Bienvenido a la página de login';
    const titulo = 'login';
    res.render('login',{mensaje, titulo});
});

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

router.get('/adminDepto', (req, res) => {
    const mensaje = 'Bienvenido a la página de adminDepto';
    const titulo = 'adminDepto';
    res.render('adminDepto',{mensaje, titulo});
});

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

router.get('/altasUsuario', (req, res) => {
    const mensaje = 'Bienvenido a la página de altasUsuario';
    const titulo = 'altasUsuario';
    res.render('altasUsuario',{mensaje, titulo});
});

module.exports = router;


*/