import {getCSRFToken} from '../utils/utils.js';

export async function declinarReclamacion(id_reclamacion) {
    const response = await fetch(`/api/reclamaciones/${id_reclamacion}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
    });

    const data = await response.json();
    if (!response.ok)
        throw new Error(data.error || 'Error al declinar la reclamación');

    return data;
}

export async function aceptarReclamacion(idReclamacion) {
    const response = await fetch(`/api/reclamaciones/${idReclamacion}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
    });

    const data = await response.json();
    if (!response.ok)
        throw new Error(data.error || 'Error al aceptar la reclamación');

    return data;
}

export async function enviarMensaje(reclamacionId, mensaje) {
    const response = await fetch('/api/enviar_notificacion_admin/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
        body: new URLSearchParams({
            reclamacion_id: reclamacionId,
            mensaje: mensaje,
        }),
    });

    const data = await response.json();
    if (!response.ok)
        throw new Error(data.error || 'Error al aceptar la reclamación');

    return data;
}