// Expresiones regulares reutilizables
export const expresiones = {
    usuario: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,15}$/,
    correo: /^[a-zA-Z0-9_.+-]+@(gmail\.com|alumno\.uaemex\.mx|maildrop\.cc|devdigs\.com)$/,
    numCuenta: /^\d{7,7}$/,
};

// Validación genérica de campo
export function validaCampo(expresion, input, campo, campos) {
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
}

// Validación de contraseñas
export function validarPass(passId, checkPassId, campos) {
    const pass1 = document.getElementById(passId);
    const pass2 = document.getElementById(checkPassId);
    const errorElement = document.querySelector(
        `#g__${checkPassId} .formualrio__error`
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
}
