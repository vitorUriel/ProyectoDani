require('dotenv').config();
const supabase = require('./config/supabase');

async function testQuery() {
    const mesSeleccionado = '2026-04';
    const inicioMes = `${mesSeleccionado}-01T00:00:00Z`;
    const [anio, mesNum] = mesSeleccionado.split('-').map(Number);
    const ultimoDia = new Date(anio, mesNum, 0).getDate();
    const finMes = `${mesSeleccionado}-${ultimoDia}T23:59:59Z`;

    console.log('Querying Supabase...');
    const { data: ticketsMes, error: errTickets } = await supabase
        .from('tickets')
        .select('departamento_id')
        .gte('fecha_creacion', inicioMes)
        .lte('fecha_creacion', finMes);

    if (errTickets) {
        console.error('ERROR:', errTickets);
    } else {
        console.log('SUCCESS, data length:', ticketsMes.length);
    }
}

testQuery();
