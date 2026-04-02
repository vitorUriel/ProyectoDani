const db =  require('../config/database');

//funcion para mostrar los usuarios
const mostrarUsuarios = async (req, res) => {
    try{
        const [usuarios] = await db.query('SELECT * FROM usuarios');

        res.render('usuarios',{
            listaUsuarios: usuarios
        });
    } catch(error){
        console.error(error)
        res.status(500).send("Error en la base de datos")
    }
};

module.exports = {
    mostrarUsuarios 
};