const mesSeleccionado = '2026-04';
const [anio, mesNum] = mesSeleccionado.split('-').map(Number);
const ultimoDia = new Date(anio, mesNum, 0).getDate();
const finMes = `${mesSeleccionado}-${ultimoDia}T23:59:59Z`;
console.log(finMes);
