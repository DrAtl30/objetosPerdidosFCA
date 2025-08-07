const inputFecha = document.getElementById('fecha');
const hoy = new Date().toISOString().split('T')[0];
inputFecha.max = hoy;

const inputHora = document.getElementById('hora');
// Establecer hora mínima a las 07:00
inputHora.min = '07:00';
// Establecer hora máxima a las 20:00
inputHora.max = '20:00';
// Establecer paso en intervalos de 15 minutos (900 segundos)
inputHora.step = 900;