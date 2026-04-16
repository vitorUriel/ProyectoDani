const supabase = require('../config/supabase');

async function mostrarUsuarios(req, res) {
  try {
    const q = req.query.q || '';
    const rol = req.query.rol || '';
    const departamento = req.query.departamento || '';

    let query = supabase
      .from('usuarios')
      .select('*, departamentos (nombre), roles (nombre)');

    if (q) {
      query = query.or(`nombre.ilike.%${q}%,correo.ilike.%${q}%`);
    }
    if (rol) {
      query = query.eq('rol_id', rol);
    }
    if (departamento) {
      query = query.eq('departamento_id', departamento);
    }

    const { data: usuariosRaw, error: errUsuarios } = await query;
    if (errUsuarios) throw errUsuarios;

    const usuarios = usuariosRaw.map(u => ({
      ...u,
      departamento_nombre: u.departamentos ? u.departamentos.nombre : 'N/A',
      rol_nombre: u.roles ? u.roles.nombre : u.rol_id
    }));

    const { data: departamentos, error: errDeptos } = await supabase
      .from('departamentos')
      .select('id, nombre');
    
    if (errDeptos) throw errDeptos;

    res.render('adminGeneral', {
      usuarios,
      departamentos,
      query: req.query || {}
    });
  } catch (error) {
    console.error('Error cargar adminGeneral con Supabase:', error);
    res.status(500).send('Error al cargar la gestión de usuarios');
  }
}

module.exports = {
  mostrarUsuarios
};