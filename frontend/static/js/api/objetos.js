import {getCSRFToken} from '../utils/utils.js'
const ITEMS_PER_PAGE = 8;

export async function obtenerObjeto(pagina = 1, baseUrl = '/api/objetos/') {
    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set('page', pagina);

    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al cargar objetos');
    return await res.json();
}

export async function obtenerObjetoOculto() {
    const res = await fetch('/api/obtener_ocultos/', {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al cargar objetos ocultos');
    return await res.json();
}

export async function obtenerObjetoConFiltro(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al cargar objetos con filtros');
    return await res.json();
}

export async function obtenerDataObjeto(id) {
    const response = await fetch(`/api/objetos/${id}/`);
    if (!response.ok)
        throw new Error('NO SE PUDO OBTENER LA INFORMACION DEL OBJETO');
    return await response.json();
}

export async function toggleOcultarObjeto(id) {
    const response = await fetch('/api/toggle_ocultar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('Error al ocultar/mostrar objeto');
    const data = await response.json();
    return data;
}

export async function eliminarObjeto(id) {
    const response = await fetch(`/api/objetos/${id}`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Error desconocido al eliminar objeto');
    }
    return true;
}
export async function createOrUpdateObjeto({formData,idObjeto,csrfToken,}) {
    const url = idObjeto ? `/api/objetos/${idObjeto}/` : '/api/objetos/';
    const method = idObjeto ? 'PATCH' : 'POST';

    const response = await fetch(url, {
        method: method,
        body: formData,
        credentials: 'include',
        headers: {
            'X-CSRFToken': csrfToken,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const mensajeError =
            errorData?.mensaje ||
            errorData?.error ||
            JSON.stringify(errorData) ||
            'Error al registrar el objeto';
        throw new Error(mensajeError);
    }

    return await response.json(); // o `return true` si no necesitas la respuesta
}

export async function crearComentarioObjeto(objeto_id,textoComment, csrfToken) {
    const response = await fetch(`/api/comentario/${objeto_id}/`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({comentario: textoComment}),
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Error al cargar el comentario');
    }
    return await response.json();
}

export async function obtenerComentarios(objetoId) {
    const response = await fetch(`/api/comentario/${objetoId}/`, {
        headers: {},
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al obtener comentarios');
    return await response.json();
}