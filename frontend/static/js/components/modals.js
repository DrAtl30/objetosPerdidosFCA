export function mostrarModal(mensaje, modalId) {
    const modal = document.getElementById(modalId);
    if (!modal)
        return console.error(`No se encontró el modal con ID ${modalId}`);

    const mensajeElemento = modal.querySelector('.modalMessage');
    if (mensajeElemento) mensajeElemento.textContent = mensaje;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
}

export function esperarCierreModal(modalId, duracion = 1500) {
    return new Promise((resolve) => {
        const modal = document.getElementById(modalId);
        if (!modal) return resolve();

        const closeBtn = modal.querySelector('.close');

        const cerrarModal = () => {
            document.activeElement.blur();
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            removeEventListeners();
            resolve();
        };

        const clickOutsideHandler = (e) => {
            if (e.target === modal) cerrarModal();
        };

        const keydownHandler = (e) => {
            if (e.key === 'Escape') cerrarModal();
        };

        const removeEventListeners = () => {
            modal.removeEventListener('click', clickOutsideHandler);
            document.removeEventListener('keydown', keydownHandler);
            if (closeBtn) closeBtn.removeEventListener('click', cerrarModal);
            clearTimeout(autoCloseTimeout);
        };

        modal.addEventListener('click', clickOutsideHandler);
        document.addEventListener('keydown', keydownHandler);
        if (closeBtn) closeBtn.addEventListener('click', cerrarModal);

        // Poner el valor de duracion en 0 mantendra el modal abierto y podra ser cerrado manualmemte
        let autoCloseTimeout;
        if(duracion > 0){
            autoCloseTimeout = setTimeout(cerrarModal, duracion);
        }
    });
}

export function confirmarModal(mensaje, modalId = 'modalConfirmacion',textoBotonConfirmar = 'Eliminar') {
    return new Promise((resolve) => {
        const modal = document.getElementById(modalId);
        const mensajeElemento = modal.querySelector('.modalMessage');
        const btnConfirmar = modal.querySelector('#btnConfirmarEliminar');
        const btnCancelar = modal.querySelector('.close');

        if (mensajeElemento) mensajeElemento.textContent = mensaje;
        if (btnConfirmar) btnConfirmar.textContent = textoBotonConfirmar;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');

        const limpiar = () => {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            btnConfirmar.removeEventListener('click', onConfirmar);
            btnCancelar.removeEventListener('click', onCancelar);
        };

        const onConfirmar = () => {
            limpiar();
            resolve(true);
        };

        const onCancelar = () => {
            limpiar();
            resolve(false);
        };

        btnConfirmar.addEventListener('click', onConfirmar);
        btnCancelar.addEventListener('click', onCancelar);
    });
}
