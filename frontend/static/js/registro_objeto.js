import {crearSlider} from '/static/js/slider.js';
import { mostrarModal, esperarCierreModal} from "/static/js/modals.js";

document.addEventListener("DOMContentLoaded", function () {

  const photoContainer = document.getElementById("photo-container");
  const photoInput = document.getElementById("photo-input");
  const form = document.getElementById("reg-obj-form");
  const imagenesSeleccionadas = [];

  function mostrarVistaPrevia() {
    photoContainer.innerHTML = ""; // Limpia el contenedor

    // Si no hay imágenes, mostrar de nuevo el mensaje
    if (imagenesSeleccionadas.length === 0) {
      const span = document.createElement("span");
      span.id = "no-img-msj";
      span.textContent = "Arrastra y suelta una foto aquí o haz clic para seleccionar";
      photoContainer.appendChild(span);
      return; // No sigas, no hay imágenes que mostrar
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

        // 🔘 Botón eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn-eliminar");
        const icono = document.createElement("i");
        icono.classList.add("bi", "bi-x-circle");
        btnEliminar.appendChild(icono);
        btnEliminar.addEventListener("click", (ev) => {
          ev.stopPropagation(); // evita abrir file picker
          imagenesSeleccionadas.splice(index, 1); // elimina imagen
          mostrarVistaPrevia(); // actualiza carrusel
        });

        section.appendChild(img);
        section.appendChild(btnEliminar);
        carruseles.appendChild(section);

        loadedCount++;
        if (loadedCount === imagenesSeleccionadas.length) {
          // Cuando ya se cargaron todas las imágenes
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
      // alert("Solo puedes subir como máximo 5 imágenes en total.");
      mostrarModal("Solo puedes subir como máximo 5 imágenes en total.","errorModal");
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
      // alert("Debes subir entre 3 a 5 imagenes");
      mostrarModal("Debes subir entre 3 a 5 imagenes", "errorModal");
      esperarCierreModal("errorModal");
      photoInput.value="";
      return;
    }
      imagenesSeleccionadas.push(...nuevas);
      mostrarVistaPrevia();
      photoInput.value="";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const fecha = document.getElementById("fecha").value;
    const lugar = document.getElementById("lugar").value;
    const fotos = imagenesSeleccionadas;

    if (fotos.length < 3 || fotos.length > 5) {
      // alert("Debes subir entre 3 y 5 imágenes.");
      mostrarModal("Debes subir entre 3 a 5 imagenes", "errorModal");
      esperarCierreModal("errorModal");
      return;
    }

    console.log("Nombre:", nombre);
    console.log("Descripción:", descripcion);
    console.log("Fecha:", fecha);
    console.log("Lugar:", lugar);
    Array.from(fotos).forEach((f, i) =>
      console.log(`Foto ${i + 1}: ${f.name}`)
    );
  });
});
