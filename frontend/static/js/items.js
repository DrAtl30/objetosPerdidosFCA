document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("objetos-perdidos-container");
  const pagination = document.getElementById("pagination");
  const itemsPerPage = 9;//aqui se configura el numero de elementos que se muestran en el inicio del usuario
  let currentPage = 1;

  // ||objetosPerdidos.length === 0
  if (typeof objetosPerdidos === "undefined" || !Array.isArray(objetosPerdidos)) {
    container.innerHTML = `<h1 style="text-align:center; width:100%;">No hay objetos para mostrar</h1>`;
    if (pagination) pagination.style.display = "none";
    return;
  }

  const totalPages = Math.ceil(objetosPerdidos.length / itemsPerPage);

  function renderPage(page) {
    container.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const objetosPagina = objetosPerdidos.slice(start, end);

    objetosPagina.forEach((objeto) => {
      const item = document.createElement("div");
      item.className = "item";

      const itemHeader = document.createElement("div");
      itemHeader.className = "item-header";
      const img = document.createElement("img");
      img.src = objeto.imagen;
      img.alt = "Foto del objeto";
      img.className = "objeto-imagen";
      itemHeader.appendChild(img);

      const itemBody = document.createElement("div");
      itemBody.className = "item-body";
      const h5 = document.createElement("h5");
      h5.textContent = objeto.titulo;
      const p = document.createElement("p");
      p.textContent = objeto.descripcion;

      const itemFooter = document.createElement("div");
      itemFooter.className = "item-footer";
      const button = document.createElement("button");
      button.className = "btn btn-success primary-btn";
      button.textContent = "Reclamar";
      itemFooter.appendChild(button);

      itemBody.append(h5, p, itemFooter);
      item.append(itemHeader, itemBody);
      container.appendChild(item);
    });
  }

  function renderPagination() {
    pagination.innerHTML = "";

    const liPrev = document.createElement("li");
    liPrev.className = "page-item";
    liPrev.innerHTML = `<a class="page-link primary-btn" href="#">Anterior</a>`;
    pagination.appendChild(liPrev);

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = "page-item";
      if (i === currentPage) li.classList.add("active");

      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      pagination.appendChild(li);
    }

    const liNext = document.createElement("li");
    liNext.className = "page-item";
    liNext.innerHTML = `<a class="page-link primary-btn" href="#">Siguiente</a>`;
    pagination.appendChild(liNext);

    updatePaginationStates();
  }

  function updatePaginationStates() {
    const pageItems = pagination.querySelectorAll(".page-item");
    const prev = pageItems[0];
    const next = pageItems[pageItems.length - 1];

    prev.classList.toggle("disabled", currentPage === 1);
    next.classList.toggle("disabled", currentPage === totalPages);

    pageItems.forEach((item, index) => {
      const link = item.querySelector(".page-link");
      if (link && !isNaN(link.textContent)) {
        const pageNum = parseInt(link.textContent);
        item.classList.toggle("active", pageNum === currentPage);
      }
    });
  }

  pagination.addEventListener("click", function (e) {
    e.preventDefault();
    const target = e.target;
    if (!target.classList.contains("page-link")) return;

    const text = target.textContent.trim();

    if (text === "Anterior" && currentPage > 1) {
      currentPage--;
    } else if (text === "Siguiente" && currentPage < totalPages) {
      currentPage++;
    } else if (!isNaN(text)) {
      currentPage = parseInt(text);
    }

    renderPage(currentPage);
    renderPagination();
  });

  // Inicializar
  renderPage(currentPage);
  renderPagination();
});
