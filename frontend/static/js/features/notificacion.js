import {esperarCierreModal,mostrarModal} from  '../components/modals.js';
import {notificacion, notificacionTrue} from '../api/notificacion.js';

export function mostrarNotificacion(notificaciones) {
    const modal = document.getElementById('notificacion');
    if (!modal)return;

    const container = modal.querySelector('.notiContent');
    container.innerHTML = ""; // limpiar antes de renderizar

    if (notificaciones.length === 0) {
        const div = document.createElement('div');
        div.classList.add('data');
        div.innerHTML = `<p class="mensajeNotif">No tienes notificaciones</p>`;
        container.appendChild(div);
    } else {
        notificaciones.forEach((notif) => {
            
            const div = document.createElement('div');
            div.classList.add('data');
            div.innerHTML = `<p class="mensajeNotif">${notif.mensaje}</p>`;
            container.appendChild(div);
        });
    }

    mostrarModal('Notificaciones', 'notificacion');
    notificacionTrue()
        .then(() => {
            if (window.actualizarBadge) window.actualizarBadge();
        })
        .catch((err) => console.error('Error al marcar leídas', err));
    esperarCierreModal('notificacion',0);
}

document.addEventListener('DOMContentLoaded', async () => {
    const btnNoti = document.getElementById('btnNotificaciones');
    const badge = document.getElementById('notif-badge');
    const icono = btnNoti ? btnNoti.querySelector('i.bi-person-circle') : null;

    async function actualizarBadge() {
        try {
            const data = await notificacion();
            const notificaciones = data.notificaciones;

            const noLeidas = notificaciones.filter((n) => !n.leida);

            if (noLeidas.length > 0) {
                if (badge) {
                    badge.textContent = noLeidas.length > 9 ? '9+' : noLeidas.length;
                    badge.style.display = 'inline-block';
                }
                if (icono) icono.style.display = 'none';
            } else {
                if (badge) badge.style.display = 'none';
                if (icono) icono.style.display = 'inline-block';
            }

            return notificaciones;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    
    window.actualizarBadge = actualizarBadge;

    // Actualizar el icono y badge al cargar la página
    await actualizarBadge();

    if (btnNoti) {
        btnNoti.addEventListener('click', async () => {
            const notificaciones = await actualizarBadge();
            mostrarNotificacion(notificaciones);
        });
    }
});