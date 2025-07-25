import {
    renderPage,
    renderPagination,
    updatePaginationStates,
} from './renderObjeto.js';
import { editar, toggleOcultar, eliminar } from './accionesObjeto.js';
let objetosVisibles = [];
let ocultos = [];
let objetosFiltrados = [];

document.addEventListener('DOMContentLoaded', function () {
    const isAdmin = document.body.classList.contains('vista-admin');
    const container = document.getElementById('objetos-perdidos-container');
    const pagination = document.getElementById('pagination');
    const itemsPerPage = 8;
    let currentPage = 1;
    let totalPages;

    fetch('/api/objetos')
        .then((response) => response.json())
        .then((data) => {
            objetosVisibles = data || [];

            if (isAdmin) {
                fetch('/api/obtener_ocultos')
                    .then((response) => response.json())
                    .then((data) => {
                        ocultos = data.ocultos || [];
                        renderAll();
                    });
            } else {
                ocultos = [];
                renderAll();
            }
        })
        .catch(() => {
            // manejar error
        });

    function renderAll() {
        if (!isAdmin) {
            // filtra los objetos que NO están ocultos
            objetosFiltrados = objetosVisibles.filter(
                (obj) => !ocultos.includes(Number(obj.id_objeto))
            );
        } else {
            // admin ve todos
            objetosFiltrados = objetosVisibles;
        }

        if (objetosFiltrados.length === 0) {
            container.classList.remove('items_grid');
            container.innerHTML = `<h1 class="mensaje-vacio">No hay objetos para mostrar</h1>`;
            if (pagination) pagination.style.display = 'none';
            return;
        } else {
            if (pagination) pagination.style.display = '';
            container.classList.add('items_grid');
        }
        totalPages = Math.ceil(objetosFiltrados.length / itemsPerPage);
        renderPage(
            objetosFiltrados,
            container,
            currentPage,
            itemsPerPage,
            ocultos,
            isAdmin,
            { editar, toggleOcultar, eliminar: handleEliminar }
        );
        renderPagination(pagination, totalPages, currentPage);
        updatePaginationStates(pagination, totalPages, currentPage);
    }

    async function handleEliminar(id) {
        const exito = await eliminar(id);
        if (!exito) return;

        // Actualiza la lista global quitando el objeto eliminado
        objetosVisibles = objetosVisibles.filter((obj) => obj.id_objeto !== id);

        // Vuelve a filtrar según ocultos y rol admin
        if (!isAdmin) {
            objetosFiltrados = objetosVisibles.filter(
                (obj) => !ocultos.includes(Number(obj.id_objeto))
            );
        } else {
            objetosFiltrados = objetosVisibles;
        }

        // Recalcula totalPages, y ajusta currentPage si es necesario
        totalPages = Math.ceil(objetosFiltrados.length / itemsPerPage);
        if (currentPage > totalPages)
            currentPage = totalPages > 0 ? totalPages : 1;

        // Renderiza todo
        renderAll();
    }

    pagination.addEventListener('click', function (e) {
        e.preventDefault();
        const target = e.target;
        if (!target.classList.contains('page-link')) return;

        const text = target.textContent.trim();

        if (text === 'Anterior' && currentPage > 1) {
            currentPage--;
        } else if (text === 'Siguiente' && currentPage < totalPages) {
            currentPage++;
        } else if (!isNaN(text)) {
            currentPage = parseInt(text);
        }

        renderPage(
            objetosFiltrados,
            container,
            currentPage,
            itemsPerPage,
            ocultos,
            isAdmin,
            { editar, toggleOcultar, eliminar: handleEliminar }
        );
        renderPagination(pagination, totalPages, currentPage);
        updatePaginationStates(pagination, totalPages, currentPage);
    });
});
