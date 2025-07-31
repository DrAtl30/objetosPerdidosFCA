import { mostrarModal } from './modals.js';
import { esperarCierreModal } from './modals.js';

document.querySelectorAll('.toggle-password').forEach((icon) => {
    icon.addEventListener('click', () => {
        const inputId = icon.getAttribute('data-target');
        const input = document.getElementById(inputId);
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.classList.toggle('bi-eye-fill');
        icon.classList.toggle('bi-eye-slash-fill');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const csrfTokenLogin = document.querySelector('[name=csrfmiddlewaretoken]');
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            correo_institucional: document
                .getElementById('correo_electronico')
                .value.trim(),
            password: document.getElementById('contrasena').value.trim(),
        };
        if (data.correo_institucional && data.password) {
            try {
                //verificar correo
                const verificacion = await fetch(
                    '/api/verificarCorreoConfirmado/',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrfTokenLogin
                                ? csrfTokenLogin.value
                                : '',
                        },
                        body: JSON.stringify({
                            correo_institucional: data.correo_institucional,
                        }),
                    }
                );

                if (!verificacion.ok)
                    throw new Error('Error al verificar el correo');

                const verificacionData = await verificacion.json();
                
                if (!verificacionData.existe) {
                    mostrarModal(
                        'Este correo no esta registro en el Sistema de Objetos Perdidos FCA. Registrate antes de inciar sesión',
                        'errorModal'
                    );
                    await esperarCierreModal('errorModal',3000);
                    return;
                }

                if (!verificacionData.confirmado) {
                    mostrarModal(
                        'Tu correo aún no ha sido confirmado. Verifica tu bandeja de entrada.',
                        'errorModal'
                    );
                    await esperarCierreModal('errorModal',3000);
                    return;
                }

                const response = await fetch('/api/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfTokenLogin
                            ? csrfTokenLogin.value
                            : '',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) throw await response.json(); // <- igual que en tu registro

                const result = await response.json(); // <-- No olvidar parsearlo

                mostrarModal('Inicio de sesión exitoso', 'successModal');
                await esperarCierreModal('successModal');
                if (result.rol === 'administrador') {
                    window.location.href = '/administrador/';
                } else if (result.rol === 'alumno') {
                    window.location.href = '/';
                } else {
                    mostrarModal(
                        'Rol desconocido. Contacta al administrador.',
                        'errorModal'
                    );
                    await esperarCierreModal('errorModal');
                }
            } catch (err) {
                let mensaje = 'Error en el servidor. Intenta más tarde.';

                if (err && typeof err === 'object') {
                    const error = Object.values(err).flat().join('\n');
                    mensaje = error || mensaje;
                }

                mostrarModal(mensaje, 'errorModal');
                await esperarCierreModal('errorModal');
            }
        } else {
            mostrarModal('Debe llenar todos los campos', 'errorModal');
            await esperarCierreModal('errorModal');
        }
    });
});
