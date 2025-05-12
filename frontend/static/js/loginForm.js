import { mostrarModal } from "./modals.js";
import { esperarCierreModal } from "./modals.js";

document.addEventListener('DOMContentLoaded', function(){
    const csrfTokenLogin = document.querySelector("[name=csrfmiddlewaretoken]");
    const form = document.getElementById("login-form");

    form.addEventListener('submit', async(e) =>{
        e.preventDefault();
        const data = {
            correo_institucional:document.getElementById("correo_electronico").value.trim(),
            password: document.getElementById("contrasena").value.trim(),
        };
        if (data.correo_institucional && data.password) {
            console.log(data);
            try {
                //verificar correo
                const verificacion = await fetch("/api/verificarCorreoConfirmado/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfTokenLogin ? csrfTokenLogin.value : "",
                    },
                    body: JSON.stringify({ correo_institucional: data.correo_institucional }),
                });

                if (!verificacion.ok) throw new Error("Error al verificar el correo");

                const verificacionData = await verificacion.json();

                if (!verificacionData.confirmado) {
                    mostrarModal("Tu correo aún no ha sido confirmado. Verifica tu bandeja de entrada.", "errorModal");
                    return;
                }

                const response = await fetch("/api/login/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfTokenLogin ? csrfTokenLogin.value : "",
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) throw await response.json(); // <- igual que en tu registro

                const result = await response.json(); // <-- No olvidar parsearlo

                console.log("Respuesta del servidor: ", result);

                mostrarModal("Inicio de sesión exitoso", "successModal");
                await esperarCierreModal("successModal");
                window.location.href = "/";
            } catch (err) {
                console.error("Error en la solicitud:", err);

                let mensaje = "Error en el servidor. Intenta más tarde.";

                if (err && typeof err === "object") {
                    const error = Object.values(err).flat().join("\n");
                    mensaje = error || mensaje;
                }

                mostrarModal(mensaje, "errorModal");
            }
        } else {
            mostrarModal("Debe llenar todos los campos", "errorModal");
        }


    })
    

})