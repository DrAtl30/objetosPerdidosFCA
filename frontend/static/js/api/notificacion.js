import {getCSRFToken} from '../utils/utils.js';

export async function notificacion() {
    const response = await fetch('/api/notificaciones/');
    if (!response.ok) throw new Error('No se pueden obtener las notificaciones, intentelo mas tarde');
    return await response.json();
}
export async function notificacionTrue() {
    const response = await fetch('/api/marcar_notificaciones_leidas/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
            },
        });
    if (!response.ok) throw new Error('No se pueden obtener las notificaciones, intentelo mas tarde');
    return await response.json();
}