import { crearSlider } from "/static/js/slider.js";
import { mostrarModal, esperarCierreModal } from "/static/js/modals.js";

document.addEventListener("DOMContentLoaded", function () {
  const csrfTokenRegistro = document.querySelector(
    "[name=csrfmiddlewaretoken]"
  ).value;
  const photoContainer = document.getElementById("photo-container");
  const photoInput = document.getElementById("photo-input");
  const form = document.getElementById("reg-obj-form");
  const submitButton = form.querySelector('button[type="submit"]');
  let imagenesSeleccionadas = [];

  function mostrarVistaPrevia() {
    photoContainer.innerHTML = "";

    if (imagenesSeleccionadas.length === 0) {
      const span = document.createElement("span");
      span.id = "no-img-msj";
      span.textContent =
        "Arrastra y suelta una foto aquí o haz clic para seleccionar";
      photoContainer.appendChild(span);
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("slider-wrapper");
    const carruseles = document.createElement("div");
    carruseles.classList.add("carruseles");

    let loadedCount = 0;

    imagenesSeleccionadas.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const section = document.createElement("section");
        section.classList.add("slider-section");

        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = `Vista previa ${index + 1}`;

        // Botón eliminar (usar índice fijo al crear el listener)
        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn-eliminar");
        const icono = document.createElement("i");
        icono.classList.add("bi", "bi-x-circle");
        btnEliminar.appendChild(icono);
        btnEliminar.addEventListener("click", (ev) => {
          ev.stopPropagation();
          // Eliminar imagen por índice (recalcular para evitar problema con closures)
          imagenesSeleccionadas = imagenesSeleccionadas.filter(
            (_, i) => i !== index
          );
          mostrarVistaPrevia();
        });

        section.appendChild(img);
        section.appendChild(btnEliminar);
        carruseles.appendChild(section);

        loadedCount++;
        if (loadedCount === imagenesSeleccionadas.length) {
          wrapper.appendChild(carruseles);

          const btnLeft = document.createElement("div");
          btnLeft.classList.add("btn-left");
          btnLeft.innerHTML = `<i class="bi bi-caret-left-fill"></i>`;

          const btnRight = document.createElement("div");
          btnRight.classList.add("btn-right");
          btnRight.innerHTML = `<i class="bi bi-caret-right-fill"></i>`;

          wrapper.appendChild(btnLeft);
          wrapper.appendChild(btnRight);

          photoContainer.appendChild(wrapper);
          crearSlider(wrapper);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  photoContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    photoContainer.style.borderColor = "#3a5a40";
  });

  photoContainer.addEventListener("dragleave", () => {
    photoContainer.style.borderColor = "#5a7561";
  });

  photoContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    photoContainer.style.borderColor = "#5a7561";

    const nuevas = Array.from(e.dataTransfer.files);

    if (imagenesSeleccionadas.length + nuevas.length > 5) {
      mostrarModal(
        "Solo puedes subir como máximo 5 imágenes en total.",
        "errorModal"
      );
      esperarCierreModal("errorModal");
      return;
    }

    imagenesSeleccionadas.push(...nuevas);
    mostrarVistaPrevia();
  });

  photoContainer.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", () => {
    const nuevas = Array.from(photoInput.files);

    if (imagenesSeleccionadas.length + nuevas.length > 5) {
      mostrarModal("Debes subir entre 3 a 5 imágenes", "errorModal");
      esperarCierreModal("errorModal");
      photoInput.value = "";
      return;
    }

    imagenesSeleccionadas.push(...nuevas);
    mostrarVistaPrevia();
    photoInput.value = "";
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (imagenesSeleccionadas.length < 3 || imagenesSeleccionadas.length > 5) {
      mostrarModal("Debes subir entre 3 a 5 imágenes", "errorModal");
      await esperarCierreModal("errorModal");
      return;
    }

    submitButton.disabled = true; // Desactivar botón mientras se procesa

    try {
      const nombre = document.getElementById("nombre").value.trim();
      const descripcion = document.getElementById("descripcion").value.trim();
      const fecha = document.getElementById("fecha").value;
      const lugar = document.getElementById("lugar").value.trim();

      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("fecha_perdida", fecha);
      formData.append("lugar_perdida", lugar);
      formData.append("estado_objeto", "registrado");

      imagenesSeleccionadas.forEach((imagen) =>
        formData.append("imagenes", imagen)
      );

      const response = await fetch("/api/registro-objeto/", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfTokenRegistro,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Detalles del error del servidor:", errorData);
        const mensajeError =
          errorData?.mensaje ||
          errorData?.error ||
          JSON.stringify(errorData) ||
          "Error al registrar el objeto";
        throw new Error(mensajeError);
      }

      mostrarModal("Registro exitoso", "successModal");
      form.reset();
      imagenesSeleccionadas = [];
      mostrarVistaPrevia();

      await esperarCierreModal("successModal");
    } catch (error) {
      console.error(error);
      mostrarModal(error.message || "Error inesperado", "errorModal");
      await esperarCierreModal("errorModal");
    } finally {
      submitButton.disabled = false; // Reactivar botón
    }
  });
});
