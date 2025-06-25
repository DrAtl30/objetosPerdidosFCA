/**
 * Script específico para la funcionalidad de recuperar contraseña
 * Incluye: verificación de correo confirmado y envío de recuperación
 */

document.addEventListener('DOMContentLoaded', function() {
    // Script para el Modal de recuperar contraseña 
    const recuperarForm = document.querySelector('.recuperarForm');

    if (recuperarForm) {
        recuperarForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var email = document.getElementById('correo_electronico').value;
            const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

            // Verificar si el correo está confirmado antes de continuar
            fetch('/verificarCorreoConfirmado/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({ correo_electronico: email }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data.confirmado) {
                    mostrarModal('Tu correo aún no ha sido confirmado. Verifica tu bandeja de entrada.', 'errorModal');
                    return;
                }

                // Si el correo está confirmado, proceder con la recuperación de contraseña
                fetch('/recuperarContrasena/recuperarContra', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify({ correo_electronico: email }),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP Error ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        mostrarModal('Se ha enviado un enlace de recuperación a tu correo electrónico.', 'successModal');
                    } else if (data.error) {
                        mostrarModal(data.error, 'errorModal');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    mostrarModal('Hubo un problema al procesar tu solicitud. Inténtalo de nuevo.', 'errorModal');
                });
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarModal('Hubo un problema al verificar tu correo. Inténtalo de nuevo.', 'errorModal');
            });
        });
    }

    // Funciones auxiliares específicas para esta página
    function mostrarModal(mensaje, tipoModal) {
        const modal = document.getElementById(tipoModal);
        const modalMessage = modal.querySelector('.modalMessage');
        
        if (modal && modalMessage) {
            modalMessage.textContent = mensaje;
            modal.style.display = 'flex';
        }
    }

    // Event listeners para cerrar modales
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});