import { mostrarModal, esperarCierreModal } from '../components/modals.js';
import {logout} from '../api/auth.js'

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-button');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const csrfTokenElement = document.querySelector("input[name='csrfmiddlewaretoken']");
            const csrfToken = csrfTokenElement ? csrfTokenElement.value : '';
            try {
                const result = await logout(csrfToken);
                mostrarModal(result.mensaje || 'Sesión cerrada correctamente.','successModal');
                await esperarCierreModal('successModal');
                window.location.href = '/'; // o redirige donde gustes
            } catch (err) {
                mostrarModal('Error de red al cerrar sesión.', 'errorModal');
                await esperarCierreModal('successModal');
            }
        });
    }
});
