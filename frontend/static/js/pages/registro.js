import { mostrarModal, esperarCierreModal } from '../components/modals.js';
import {registrarAlumno} from '../api/registro.js';
import {expresiones, validaCampo, validarPass} from '../utils/validaciones.js';
import { initPasswordToggles} from '../utils/password.js'

document.addEventListener('DOMContentLoaded', function () {
    initPasswordToggles();
    const csrfTokenRegistro = document.querySelector('[name=csrfmiddlewaretoken]');
    const form = document.getElementById('registro-form');
    const inputs = document.querySelectorAll('#registro-form input');

    const campos = {
        name: false,
        last__name: false,
        numCuenta: false,
        email: false,
        pass: false,
    };

    const validarFormulario = (e) => {
        switch (e.target.name) {
            case 'nombre':
                validaCampo(expresiones.usuario, e.target, 'name',campos);
                break;
            case 'apellidos':
                validaCampo(expresiones.usuario, e.target, 'last__name',campos);
                break;
            case 'numCuenta':
                validaCampo(expresiones.numCuenta, e.target, 'numCuenta',campos);
                break;
            case 'correo':
                validaCampo(expresiones.correo, e.target, 'email',campos);
                break;
            case 'password':
                validaCampo(expresiones.password, e.target, 'pass',campos);
                validarPass('password', 'check__pass', campos);
                break;
            case 'check__pass':
                validarPass('password', 'check__pass', campos);
                break;
        }
    };


    inputs.forEach((input) => {
        input.addEventListener('keyup', validarFormulario);
        input.addEventListener('blur', validarFormulario);
    });

    form.addEventListener('submit', async (e) => {
        //event = e
        e.preventDefault();

        if (
            campos.name &&
            campos.last__name &&
            campos.numCuenta &&
            campos.email &&
            campos.pass
        ) {
            const obtenData = {
                nombre: document.getElementById('nombre').value,
                apellidos: document.getElementById('apellidos').value,
                num_cuenta: document.getElementById('numCuenta').value,
                licenciatura: document.getElementById('licenciatura').value,
                correo_institucional: document.getElementById('correo').value,
                password: document.getElementById('password').value,
                rol: 'alumno',
            };

            try {
                const data = await registrarAlumno(obtenData, csrfTokenRegistro?.value)
                mostrarModal(data.mensaje || 'Registro exitoso','successModal');
                await esperarCierreModal('successModal',3000);
                window.location.href = '/login/';
            } catch (err) {
                let mensaje = 'Error al precesar la solicitud';

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
