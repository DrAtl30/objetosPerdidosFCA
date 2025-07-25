import { esperarCierreModal, mostrarModal } from './modals.js';

document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.item');

    items.forEach((item) => {
        item.addEventListener('click', () => {
            mostrarModal('Modal abierto correctamente', 'info_objeto');
            esperarCierreModal('info_objeto',0);
        });
    });
});
