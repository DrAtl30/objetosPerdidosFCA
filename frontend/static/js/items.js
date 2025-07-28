import {
    renderPage,
    renderPagination,
    updatePaginationStates,
} from './renderObjeto.js';
import { editar, toggleOcultar, eliminar } from './accionesObjeto.js';

let objetosVisibles = [];
let ocultos = [];
let objetosFiltrados = [];
const itemsPerPage = 8;
let currentPage = 1;
let totalPages;

let container;
let pagination;
let isAdmin;

document.addEventListener('DOMContentLoaded', async function () {
    isAdmin = document.body.classList.contains('vista-admin');
    container = document.getElementById('objetos-perdidos-container');
    pagination = document.getElementById('pagination');

    await cargarOcultos(); // primero cargamos ocultos (si aplica)
    await cargarObjetos(1);

    pagination.addEventListener('click', function (e) {
        e.preventDefault();
        const target = e.target;
        if (!target.classList.contains('page-link')) return;

        const text = target.textContent.trim();

        if (text === 'Anterior' && currentPage > 1) {
            cargarObjetos(currentPage - 1);
        } else if (text === 'Siguiente' && currentPage < totalPages) {
            cargarObjetos(currentPage + 1);
        } else if (!isNaN(text)) {
            cargarObjetos(parseInt(text));
        }
    });
});

async function cargarObjetos(pagina = 1) {
    try {
        const res = await fetch(`/api/objetos/?page=${pagina}`);
        if (res.ok) {
            const data = await res.json();
            objetosVisibles = data.results || [];
            totalPages = Math.ceil(data.count / itemsPerPage);
            currentPage = pagina;

            renderAll();
        }
    } catch (error) {
        console.error('Error cargando objetos:', error);
    }
}

async function cargarOcultos() {
    if (!isAdmin) return;
    try {
        const res = await fetch('/api/obtener_ocultos/', {
            credentials: 'include',
        });
        if (res.ok) {
            const data = await res.json();
            ocultos = data.ocultos || [];
        }
    } catch (error) {
        console.error('Error cargando objetos ocultos:', error);
    }
}

async function handleEliminar(id) {
    const exito = await eliminar(id);
    if (!exito) return;

    objetosVisibles = objetosVisibles.filter((obj) => obj.id_objeto !== id);

    if (!isAdmin) {
        objetosFiltrados = objetosVisibles.filter(
            (obj) => !ocultos.includes(Number(obj.id_objeto))
        );
    } else {
        objetosFiltrados = objetosVisibles;
    }

    totalPages = Math.ceil(objetosFiltrados.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages > 0 ? totalPages : 1;

    cargarObjetos(currentPage);
}

function renderAll() {
    objetosFiltrados = objetosVisibles;

    if (objetosFiltrados.length === 0) {
        container.classList.remove('items_grid');
        container.innerHTML = `<h1 class="mensaje-vacio">No hay objetos para mostrar</h1>`;
        if (pagination) pagination.style.display = 'none';
        return;
    } else {
        if (pagination) pagination.style.display = '';
        container.classList.add('items_grid');
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
}

export async function cargarObjetosConFiltros(url) {
    try {
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            objetosVisibles = data.results || [];
            totalPages = Math.ceil(data.count / itemsPerPage);
            currentPage = 1; // Reinicia a la primera página
            renderAll();
        }
    } catch (error) {
        console.error('Error al aplicar filtros:', error);
    }
}
