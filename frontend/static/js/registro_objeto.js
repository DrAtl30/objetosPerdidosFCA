const photoContainer = document.getElementById("photo-container");
const photoInput = document.getElementById("photo-input");

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
  const file = e.dataTransfer.files[0];
  if (file) {
    photoInput.files = e.dataTransfer.files;
    alert(`Archivo seleccionado: ${file.name}`);
  }
});

photoContainer.addEventListener("click", () => {
  photoInput.click();
});
