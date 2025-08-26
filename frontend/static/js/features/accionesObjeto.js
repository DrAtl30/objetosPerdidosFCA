import { getCSRFToken } from '../utils/utils.js';
import {confirmarModal, mostrarModal, esperarCierreModal} from '../components/modals.js';
import {toggleOcultarObjeto, eliminarObjeto} from '../api/objetos.js';

export function editar(id) {
    window.location.href = `/api/objeto/editar/${id}`;
}

export async function toggleOcultar(
    id,
    btnHidden,
    ocultos,
    objetosVisibles,
    container,
    currentPage,
    itemsPerPage,
    isAdmin,
    accionesHandlers
) {
    try {
        const data = await toggleOcultarObjeto(id);
        if (data.status === 'ok') {
            const isHidden = data.estado === 'ocultado';
            const numId = Number(id);

            if (isHidden) {
                if (!ocultos.includes(numId)) ocultos.push(numId);
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

            return isHidden;
        }
    } catch (error) {
        mostrarModal(error.message, 'errorModal'); // Mostrar mensaje exacto del backend
        await esperarCierreModal('errorModal');
    }
}


export async function eliminar(id) {
    const confirma = await confirmarModal('¿Estás seguro de eliminar este objeto?');
    if (!confirma) return false;

    try {
        const data = await eliminarObjeto(id); // obtiene el JSON directamente
        mostrarModal(data.message || 'Objeto eliminado correctamente', 'successModal');
        await esperarCierreModal('successModal', 1500);
        return true;
    } catch (error) {
        console.error('Error al eliminar:', error);
        mostrarModal(error.message, 'errorModal'); // usa el mensaje real
        await esperarCierreModal('errorModal', 2000);
        return false;
    }
}
