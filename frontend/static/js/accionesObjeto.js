import { getCSRFToken } from './utils.js';
import {confirmarModal, mostrarModal, esperarCierreModal} from './modals.js'

export function editar(id) {
    window.location.href = `/api/objeto/editar/${id}`;
}

export function toggleOcultar(id, btnHidden, ocultos, objetosVisibles, container, currentPage, itemsPerPage, isAdmin, accionesHandlers) {
    fetch('/api/toggle_ocultar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({ id }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.status === 'ok') {
            const isHidden = data.estado === 'ocultado';
            const numId = Number(id);


            if (isHidden) {
                if(!ocultos.includes(numId)) ocultos.push(numId);
            } else {
                const index = ocultos.indexOf(numId);
                if (index > -1) ocultos.splice(index, 1);
            }
            

            btnHidden.innerHTML = isHidden
                ? `<i class="bi bi-eye-slash-fill"></i>`
                : `<i class="bi bi-eye-fill"></i>`;

            btnHidden.title = isHidden
                ? 'Mostrar en inicio'
                : 'Ocultar del inicio';

        }
    });
}


export async function eliminar(id) {
    const confirma = await confirmarModal(
        '¿Estás seguro de eliminar este objeto?'
    );
    if (!confirma) return;

    try {
        const response = await fetch(`/api/objetos/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCSRFToken(),
            },
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMsg =
                data.detail || 'Error desconocido al eliminar el objeto.';
            mostrarModal(errorMsg, 'errorModal');
            await esperarCierreModal('errorModal');
            return false;
        }
        return true;

    } catch (error) {
        console.error('Error al eliminar:', error);
        mostrarModal(
            'Error de red al intentar eliminar el objeto.',
            'errorModal'
        );
        await esperarCierreModal('errorModal');
        return false;
    }
}
