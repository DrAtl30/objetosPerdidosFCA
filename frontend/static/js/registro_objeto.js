document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Script cargado correctamente");

  const photoContainer = document.getElementById("photo-container");
  const photoInput = document.getElementById("photo-input");
  const form = document.getElementById("reg-obj-form");

  function mostrarVistaPrevia(files) {
    photoContainer.innerHTML = ""; // Limpia previews anteriores

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "Vista previa";
        img.style.maxWidth = "100px";
        img.style.maxHeight = "100px";
        img.style.margin = "0.5rem";
        img.style.objectFit = "cover";

        photoContainer.appendChild(img);
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
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      photoInput.files = files; // Actualiza el input para el form
      mostrarVistaPrevia(files);
    }
  });

  photoContainer.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (file) {
      mostrarVistaPrevia(file);
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const fecha = document.getElementById("fecha").value;
    const lugar = document.getElementById("lugar").value;
    const fotos = photoInput.files; // ✅ ahora sí existe

    console.log("Nombre:", nombre);
    console.log("Descripción:", descripcion);
    console.log("Fecha:", fecha);
    console.log("Lugar:", lugar);
    Array.from(fotos).forEach((f, i) =>
      console.log(`Foto ${i + 1}: ${f.name}`)
    );
  });
});
