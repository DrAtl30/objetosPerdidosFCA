import { mostrarModal } from "./modals.js";
import { esperarCierreModal } from "./modals.js";

document.addEventListener('DOMContentLoaded', function() {
    const csrfTokenRegistro = document.querySelector(
        "[name=csrfmiddlewaretoken]"
    );
    const form = document.getElementById('registro-form');
    const inputs = document.querySelectorAll('#registro-form input');

    //expresiones regulares para hacer validaciones
    const expresiones = {
        usuario: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
        password: /^.{8,15}$/, // 8 a 15 digitos.
        correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
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
          case "nombre":
            validaCampo(expresiones.usuario, e.target, "name");
            break;
          case "apellidos":
            validaCampo(expresiones.usuario, e.target, "last__name");
            break;
          case "numCuenta":
            validaCampo(expresiones.numCuenta, e.target, "numCuenta");
            break;
          case "correo":
            validaCampo(expresiones.correo, e.target, "email");
            break;
          case "password":
            validaCampo(expresiones.password, e.target, "pass");
            validarPass();
            break;
          case "check__pass":
            validarPass();
            break;
        }
    }

    const validaCampo = (expresion,input, campo) => {
        if (expresion.test(input.value)) {
            document.querySelector(`#g__${campo} .formualrio__error`).classList.remove('formualrio__error-activo');
            campos[campo] = true;
        } else {
            document.querySelector(`#g__${campo} .formualrio__error`).classList.add('formualrio__error-activo');
        }
    }

    const validarPass = () => {
        const pass1 = document.getElementById("password");
        const pass2 = document.getElementById("check__pass");

        if (pass1.value !== pass2.value) {
            document.querySelector(`#g__check__pass .formualrio__error`).classList.add('formualrio__error-activo');
            campos['pass'] = false;
        }else{
            document.querySelector(`#g__check__pass .formualrio__error`).classList.remove('formualrio__error-activo');
            campos["pass"] = true;
        }

    }

    inputs.forEach((input) => {
        input.addEventListener('keyup', validarFormulario);
        input.addEventListener('blur', validarFormulario);
    })


    form.addEventListener('submit', async (e) =>{//event = e
        e.preventDefault();

        console.log("recibiendo la data");
        if (campos.name && campos.last__name && campos.numCuenta && campos.email && campos.pass) {
            console.log("recibiendo la data");
            const obtenData = {
              nombre: document.getElementById("nombre").value,
              apellidos: document.getElementById("apellidos").value,
              num_cuenta: document.getElementById("numCuenta").value,
              licenciatura: document.getElementById("licenciatura").value,
              correo_institucional: document.getElementById("correo").value,
              contrasena: document.getElementById("password").value,
              rol: "alumno",
            };
            console.log("se recibio la data");
            console.log(obtenData);
            try {
                const response = await fetch("/api/registro/", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfTokenRegistro || "",
                    },
                    body: JSON.stringify(obtenData),
                });

                if (!response.ok) throw await response.json();

                mostrarModal("Registro exitoso", "successModal");
                await esperarCierreModal("successModal");
                window.location.href = "/login/";
            }catch (err) {
                const mensaje = err?.detalle || "Error al procesar la solicitud.";
                mostrarModal(mensaje, "errorModal");
            }
        }
    })

});