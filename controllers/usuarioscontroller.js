const db =  require('../config/database');

//funcion para mostrar los usuarios
const mostrarUsuarios = async (req, res) => {
    try {
      
        const [listaUsuarios] = await db.query('SELECT * FROM usuarios');

        res.render('adminGeneral', { usuarios: listaUsuarios });

    } catch (error) {
        console.error("Error al cargar la vista de Admin:", error);
        res.status(500).send("Error interno del servidor");
    }
};


module.exports = {
    mostrarUsuarios 
};