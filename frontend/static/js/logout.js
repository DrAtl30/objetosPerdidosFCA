import { mostrarModal, esperarCierreModal } from "./modals.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-button");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const csrfTokenElement = document.querySelector(
        "input[name='csrfmiddlewaretoken']"
      );
      const csrfToken = csrfTokenElement ? csrfTokenElement.value : "";

      try {
        const response = await fetch("/api/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        });

        const result = await response.json(); // ✅ Obtener mensaje JSON del servidor

        if (response.ok) {
          mostrarModal(
            result.mensaje || "Sesión cerrada correctamente.",
            "successModal"
          );
          await esperarCierreModal("successModal");
          window.location.href = "/"; // o redirige donde gustes
        } else {
          mostrarModal(
            result.mensaje || "No se pudo cerrar sesión.",
            "errorModal"
          );
          await esperarCierreModal("errorModal");
        }
      } catch (err) {
        console.error("Error cerrando sesión:", err);
        mostrarModal("Error de red al cerrar sesión.", "errorModal");
        await esperarCierreModal("successModal");
      }
    });
  }
});
