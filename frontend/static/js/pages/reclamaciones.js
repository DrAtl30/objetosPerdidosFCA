import {enviarMensaje} from '../api/reclamacion.js';
import {confirmarModal, esperarCierreModal,mostrarModal} from '../components/modals.js';
document.addEventListener('DOMContentLoaded', () => {
    const botonesEnviar = document.querySelectorAll('.send');

    botonesEnviar.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const reclamacionId = btn.dataset.id;
            const row = btn.closest('tr');
            const select = row.querySelector('.mensaje-select');
            const mensaje = select.value;

            if (!mensaje) {
                mostrarModal('Debes seleccionar un mensaje antes de enviar','errorModal');
                await esperarCierreModal('errorModal');
                return;

            }

            try {

                const data = await enviarMensaje(reclamacionId,mensaje)

                if (data.success) {
                    mostrarModal('Mensaje enviado correctamente ✅','successModal');
                    await esperarCierreModal('successModal');
                } else {
                    alert('Error: ' + data.mensaje);
                }
            } catch (err) {
                console.error(err);
                mostrarModal('Error enviando el mensaje', 'errorModal');
                await esperarCierreModal('errorModal');
            }
        });
    });
});

