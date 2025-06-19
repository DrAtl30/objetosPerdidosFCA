export function mostrarModal(mensaje, modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`No se encontró el modal con ID ${modalId}`);
    return;
  }

  const modalMessage = modal.querySelector(".modalMessage");
  if (modalMessage) {
    modalMessage.textContent = mensaje;
  }

  modal.style.display = "flex";
}

export function esperarCierreModal(modalId) {
  return new Promise((resolve) => {
    const modal = document.getElementById(modalId);
    const closeBtn = modal.querySelector(".close");

    function cerrarYResolver() {
      modal.style.display = "none";
      modal.removeEventListener("click", clickOutsideHandler);
      document.removeEventListener("keydown", keydownHandler);
      if (closeBtn) closeBtn.removeEventListener("click", cerrarYResolver);
      resolve();
    }

    function clickOutsideHandler(event) {
      if (event.target === modal) cerrarYResolver();
    }

    function keydownHandler(event) {
      if (event.key === "Escape") cerrarYResolver();
    }

    if (closeBtn) closeBtn.addEventListener("click", cerrarYResolver);
    modal.addEventListener("click", clickOutsideHandler);
    document.addEventListener("keydown", keydownHandler);
  });
}
