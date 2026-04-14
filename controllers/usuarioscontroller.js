const db = require('../config/database');

async function mostrarUsuarios(req, res) {
  try {
    const q = req.query.q || '';
    const rol = req.query.rol || '';
    const departamento = req.query.departamento || '';

    let sql = `
      SELECT u.*, d.nombre AS departamento_nombre
      FROM usuarios u
      LEFT JOIN departamentos d ON u.departamento_id = d.id
      WHERE 1 = 1
    `;
    const params = [];

    if (q) {
      sql += ' AND (u.nombre LIKE ? OR u.correo LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }
    if (rol) {
      sql += ' AND u.rol_id = ?';
      params.push(rol);
    }
    if (departamento) {
      sql += ' AND u.departamento_id = ?';
      params.push(departamento);
    }

    const [usuarios] = await db.query(sql, params);
    const [departamentos] = await db.query('SELECT id, nombre FROM departamentos');

    res.render('adminGeneral', {
      usuarios,
      departamentos,
      query: req.query || {}
    });
  } catch (error) {
    console.error('Error cargar adminGeneral:', error);
    res.status(500).send('Error al cargar la gestión de usuarios');
  }
}

module.exports = {
  mostrarUsuarios
};