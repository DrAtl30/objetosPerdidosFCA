import {declinarReclamacion,aceptarReclamacion} from '../api/reclamacion.js';
import {confirmarModal, mostrarModal, esperarCierreModal} from '../components/modals.js';

document.querySelectorAll('.declinar').forEach((btn) => {
    btn.addEventListener('click', async () => {
        const confirma = await confirmarModal('¿Estás seguro de eliminar esta reclamacion?');
        if (!confirma) return false;
        const idReclamacion = btn.dataset.id;
        try {
            const result = await declinarReclamacion(idReclamacion);
            mostrarModal(result.message || 'Reclamación eliminada correctamente', 'successModal');
            await esperarCierreModal('successModal', 2000);
            btn.closest('tr').remove();
        } catch (error) {
            console.error(error);
            mostrarModal(error.message, 'errorModal');
            await esperarCierreModal('errorModal', 2000);
        }
    });
});

document.querySelectorAll('.aceptar').forEach((btn) => {
    btn.addEventListener('click', async () => {
        const confirma = await confirmarModal('¿Aceptar la reclamación y entregar el objeto?','modalConfirmacion',
    'Aceptar');
        if (!confirma) return;

        const idReclamacion = btn.dataset.id;
        const objetoId = btn.dataset.objeto; // obtenemos el id del objeto

        try {
            const data = await aceptarReclamacion(idReclamacion);
            mostrarModal(data.message || 'Reclamación aceptada correctamente', 'successModal');
            await esperarCierreModal('successModal', 2000);

            data.reclamaciones_eliminadas.forEach((id) => {
                const fila = document.querySelector(`tr[data-id="${id}"]`);
                if (fila) fila.remove();
            });

            // Actualizamos el tbody si quedó vacío
            const tbody = document.querySelector('tbody');
            if (!tbody.querySelector('tr')) {
                tbody.innerHTML = `
                    <tr>
                        <td class="empty" colspan="6">No hay objetos reclamados</td>
                    </tr>
                `;
            }
        } catch (error) {
            console.error(error);
            mostrarModal(error.message || 'No se pudo aceptar la reclamación', 'errorModal');
            await esperarCierreModal('errorModal', 2000);
        }
    });
});