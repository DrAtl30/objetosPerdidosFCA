const inputFecha = document.getElementById('fecha');
const hoy = new Date().toISOString().split('T')[0];
inputFecha.max = hoy;
