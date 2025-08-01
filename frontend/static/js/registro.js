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
    const csrfTokenRegistro = document.querySelector(
        '[name=csrfmiddlewaretoken]'
    );
    const form = document.getElementById('registro-form');
    const inputs = document.querySelectorAll('#registro-form input');

    //expresiones regulares para hacer validaciones
    const expresiones = {
        usuario: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,15}$/, // 8 a 15 digitos.
        correo: /^[a-zA-Z0-9_.+-]+@(gmail\.com|alumno\.uaemex\.mx|maildrop\.cc|devdigs\.com)$/,
        numCuenta: /^\d{7,7}$/,
    };

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
                validaCampo(expresiones.usuario, e.target, 'name');
                break;
            case 'apellidos':
                validaCampo(expresiones.usuario, e.target, 'last__name');
                break;
            case 'numCuenta':
                validaCampo(expresiones.numCuenta, e.target, 'numCuenta');
                break;
            case 'correo':
                validaCampo(expresiones.correo, e.target, 'email');
                break;
            case 'password':
                validaCampo(expresiones.password, e.target, 'pass');
                validarPass();
                break;
            case 'check__pass':
                validarPass();
                break;
        }
    };

    const validaCampo = (expresion, input, campo) => {
        const errorElement = document.querySelector(
            `#g__${campo} .formualrio__error`
        );
        if (input.value.trim() === '') {
            errorElement.classList.remove('formualrio__error-activo');
            campos[campo] = false;
        } else if (campo === 'pass' && /\s/.test(input.value)) {
            errorElement.classList.add('formualrio__error-activo');
            campos[campo] = false;
        } else if (expresion.test(input.value)) {
            errorElement.classList.remove('formualrio__error-activo');
            campos[campo] = true;
        } else {
            errorElement.classList.add('formualrio__error-activo');
            campos[campo] = false;
        }
    };

    const validarPass = () => {
        const pass1 = document.getElementById('password');
        const pass2 = document.getElementById('check__pass');
        const errorElement = document.querySelector(
            `#g__check__pass .formualrio__error`
        );

        if (pass1.value.trim() === '' || pass2.value.trim() === '') {
            errorElement.classList.remove('formualrio__error-activo');
            campos['pass'] = false;
        } else if (pass1.value !== pass2.value) {
            errorElement.classList.add('formualrio__error-activo');
            campos['pass'] = false;
        } else {
            errorElement.classList.remove('formualrio__error-activo');
            campos['pass'] = true;
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
                const response = await fetch('/api/registro/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfTokenRegistro || '',
                    },
                    body: JSON.stringify(obtenData),
                });

                if (!response.ok) throw await response.json();
                const data = await response.json();
                mostrarModal(
                    data.mensaje || 'Registro exitoso',
                    'successModal'
                );
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
