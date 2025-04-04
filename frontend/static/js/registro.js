document.addEventListener('DOMContentLoaded', function(){
    const csrfTokenRegistro = document.querySelector(
      "[name=csrfmiddlewaretoken]"
    );
    const registroForm = document.getElementById("registro-form");
    if (registroForm) {
      registroForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellidos").value;
        const numCuenta = document.getElementById("numCuenta").value;
        const licenciatura = document.getElementById("licenciatura").value;
        const correo = document.getElementById("correo").value;
        const contrasena = document.getElementById("contrasena").value;
        const confirmarContrasena = document.getElementById(
          "confirmarContrasena"
        ).value;

        console.log("Formulario de registro enviado");
        console.log({
          nombre,
          apellido,
          numCuenta,
          licenciatura,
          correo,
          contrasena,
          confirmarContrasena,
        });

        if (contrasena !== confirmarContrasena) {
          alert("Las contraseñas no coinciden");
          return;
        }

        if (contrasena.length < 8) {
          alert("La contraseña debe tener al menos 8 caracteres");
          return;
        }

        const data = {
          nombre: nombre,
          apellidos: apellido,
          num_cuenta: numCuenta,
          correo_institucional: correo,
          contrasena: contrasena,
          licenciatura: licenciatura,
          rol : numCuenta && licenciatura ? "alumno" : "administrador",
        };

        console.log("Datos a enviar:", data);

        fetch("/api/registro/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfTokenRegistro ? csrfTokenRegistro.value : "",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((err) => {
                throw err;
              });
            }
            return response.json();
          })
          .then((data) => {
            mostrarModal("Registro exitoso", "successModal");
            esperarCierreModal("successModal").then(() => {
              window.location.href = "/login/";
            });
          })
          .catch((error) => {
            console.error("Error:", error);
            mostrarModal(
              "Hubo un problema al procesar tu solicitud. Revisa los campos e inténtalo de nuevo.",
              "errorModal"
            );
          });
      });
    }
})

function mostrarModal(mensaje, modalId) {
  var modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`No se encontró el modal con ID ${modalId}`);
    return;
  }

  var modalMessage = modal.querySelector(".modalMessage");
  if (modalMessage) {
    modalMessage.textContent = mensaje;
  } else {
    console.warn(
      `No se encontró el elemento con clase 'modalMessage' dentro de ${modalId}`
    );
  }

  modal.style.display = "flex";

  var closeBtn = modal.querySelector(".close");
  if (closeBtn) {
    closeBtn.onclick = function () {
      modal.style.display = "none";
    };
  } else {
    console.warn(`No se encontró el botón de cierre en ${modalId}`);
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  window.onkeydown = function (event) {
    if (event.key === "Escape") {
      modal.style.display = "none";
    }
  };
}

function esperarCierreModal(modalId) {
  return new Promise((resolve) => {
    const modal = document.getElementById(modalId);
    const closeBtn = modal.querySelector(".close");

    // Resuelve la promesa cuando el modal se cierre
    closeBtn.onclick = () => {
      modal.style.display = "none";
      resolve();
    };

    // También resuelve la promesa si se hace clic fuera del modal
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
        resolve();
      }
    };

    // Resuelve la promesa si se presiona la tecla Escape
    window.onkeydown = (event) => {
      const escapeKeys = ["Escape", "Esc"];
      const escapeKeyCodes = [27];
      const escapeKeyCodesDeprecated = [1, "1"]; // Algunos teclados pueden enviar un código de tecla de escape diferente

      if (
        escapeKeys.includes(event.key) ||
        escapeKeyCodes.includes(event.keyCode) ||
        escapeKeyCodesDeprecated.includes(event.keyCode)
      ) {
        modal.style.display = "none";
        resolve();
      }
    };
  });
}
