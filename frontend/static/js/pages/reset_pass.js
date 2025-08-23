import {resetPassword} from '../api/reset_pass.js';
import {mostrarModal,esperarCierreModal} from '../components/modals.js';
import {initPasswordToggles} from '../utils/password.js';
import {expresiones,validarPass,validaCampo} from '../utils/validaciones.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('reset_pass');
    const formNew = document.getElementById('new_pass');
    const formReenvio = document.getElementById('reenviarForm');

    initPasswordToggles();

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.querySelector('#correo_electronico').value;

            try {
                const data = await resetPassword(email);

                mostrarModal(data.mensaje, 'successModal');
                await esperarCierreModal('successModal', 3000);
            } catch (err) {
                mostrarModal(
                    'ocurrio un error intentelo de nuevo',
                    'errorModal'
                );
                await esperarCierreModal('errorModal', 3000);
            }
        });
    }
    
    if (formNew) {
        const inputs = formNew.querySelectorAll('input');
        const campos = {pass: false};

        const validarFormulario = (e) =>{
            switch (e.target.name) {
                case 'password':
                    validaCampo(expresiones.password, e.target, 'pass', campos);
                    validarPass('password', 'check__pass', campos);
                    break;
            
                case 'check__pass':
                    validarPass('password', 'check__pass', campos);
                    break;
            }
        };

        inputs.forEach((input) => {
            input.addEventListener('keyup',validarFormulario);
            input.addEventListener('blur', validarFormulario);
        })


        formNew.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (campos.pass) {
                let formData = new FormData(formNew);
                
                try {
                    const res = await fetch(formNew.action, {
                        method: 'POST',
                        body: formData,
                    });
    
                    const data = await res.json();
                    if (!res.ok)
                        throw new Error(data.error || 'Error en la petición');
    
                    mostrarModal(data.mensaje, 'successModal');
                    await esperarCierreModal('successModal', 3000);
    
                    // Opcional: redirigir al login después de actualizar contraseña
                    window.location.href = '/login/';
                } catch (error) {
                    mostrarModal(error.message, 'errorModal');
                    await esperarCierreModal('errorModal', 3000);
                }
            }
            
            

        });
    }

    if (formReenvio) {
        formReenvio.addEventListener('submit', async function (e) {
            e.preventDefault();
            let fromData = new FormData(formReenvio);

            try {
                const res = await fetch(formReenvio.action, {
                    method: 'POST',
                    body: fromData,
                });

                const data = await res.json();
                if (!res.ok)
                    throw new Error(data.mensaje || 'Error en la petición');

                mostrarModal(data.mensaje, 'successModal');
                await esperarCierreModal('successModal', 3000);
            } catch (error) {
                mostrarModal(
                    'ocurrio un error intentelo de nuevo',
                    'errorModal'
                );
                await esperarCierreModal('errorModal', 3000);
            }
        });
    }

    
});

