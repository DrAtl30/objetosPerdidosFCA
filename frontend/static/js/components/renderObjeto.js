import { esperarCierreModal, mostrarModal } from '../components/modals.js';
import {mostrarInfoObjetoModal} from '../features/mostrarInfoObjeto.js'

import {obtenerDataObjeto} from '../api/objetos.js'

export function renderPage(objetosVisibles,container,currentPage,itemsPerPage,ocultos,isAdmin,accionesHandlers) {
    container.innerHTML = '';
    const ocultosNumeros = ocultos.map((o) => Number(o));
    const objetosPagina = objetosVisibles;

    if (objetosPagina.length === 0) {
        container.classList.remove('items_grid');
        container.innerHTML = `<h1 class="mensaje-vacio">No hay objetos para mostrar</h1>`;
        return;
    } else {
        container.classList.add('items_grid'); // Asumiendo que esta clase es para grid
    }

    objetosPagina.forEach((objeto) => {
        const item = document.createElement('div');
        item.className = 'item';

        const itemHeader = document.createElement('div');
        itemHeader.className = 'item-header';
        const img = document.createElement('img');
        if (objeto.imagenes && objeto.imagenes.length > 0) {
            img.src = objeto.imagenes[0].ruta_imagen;
        } else {
            img.src = '/static/img/default.png'; // <-- Usa la ruta estática real aquí
        }
        img.alt = 'Foto del objeto';
        img.className = 'objeto-imagen';
        itemHeader.appendChild(img);

        const itemBody = document.createElement('div');
        itemBody.className = 'item-body';
        const h5 = document.createElement('h5');
        h5.textContent = objeto.nombre || 'Sin título';
        const p = document.createElement('p');
        const maxDescrpcion = 20;
        let descripcionView =  objeto.descripcion_general || '';
        if (descripcionView.length > maxDescrpcion) {
            descripcionView =  descripcionView.slice(0,maxDescrpcion) + '...';
        }
        p.textContent = descripcionView;
        itemBody.append(h5, p);

        const itemFooter = document.createElement('div');
        itemFooter.className = 'item-footer';
        if (!isAdmin) {
            const button = document.createElement('button');
            button.className = 'primary-btn';
            button.textContent = 'Ver mas';
            button.addEventListener('click', () => {
                obtenerYMostrarData(objeto.id_objeto);
            });
            itemFooter.appendChild(button);
        }

        if (isAdmin) {
            // Botón editar
            const btnEdit = document.createElement('button');
            btnEdit.className = 'primary-btn edit';
            btnEdit.innerHTML = `<i class="bi bi-pencil-square"></i>`;
            btnEdit.addEventListener('click', () =>
                window.location.href = `/editar-objeto/${objeto.id_objeto}`
            );

            // Botón ocultar
            const btnHidden = document.createElement('button');
            btnHidden.className = 'primary-btn hidden';
            const isHidden = ocultosNumeros.includes(Number(objeto.id_objeto));
            btnHidden.innerHTML = isHidden
                ? `<i class="bi bi-eye-slash-fill"></i>`
                : `<i class="bi bi-eye-fill"></i>`;
            btnHidden.title = isHidden
                ? 'Mostrar en inicio'
                : 'Ocultar del inicio';
            if (isHidden) {
                btnHidden.classList.add('change');
            }
            btnHidden.addEventListener('click', () =>
                accionesHandlers.toggleOcultar(
                    objeto.id_objeto,
                    btnHidden,
                    ocultos,
                    objetosVisibles,
                    container,
                    currentPage,
                    itemsPerPage,
                    isAdmin,
                    accionesHandlers
                ).then((isHidden) => {
                    if (isHidden) {
                        btnHidden.classList.add('change');
                    }else{
                        btnHidden.classList.remove('change');
                    }
                })
            );

            // Botón eliminar
            const btnDelete = document.createElement('button');
            btnDelete.className = 'primary-btn delete';
            btnDelete.innerHTML = `<i class="bi bi-x-circle"></i>`;
            btnDelete.addEventListener('click', () =>
                accionesHandlers.eliminar(objeto.id_objeto)
            );

            itemFooter.appendChild(btnEdit);
            itemFooter.appendChild(btnHidden);
            itemFooter.appendChild(btnDelete);
        }

        item.append(itemHeader, itemBody, itemFooter);
        item.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            obtenerYMostrarData(objeto.id_objeto);
        });
        container.appendChild(item);
    });
}

export function renderPagination(pagination, totalPages, currentPage) {
    pagination.innerHTML = '';

    const liPrev = document.createElement('li');
    liPrev.className = 'page-item';
    liPrev.innerHTML = `<a class="page-link primary-btn" href="#">Anterior</a>`;
    pagination.appendChild(liPrev);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = 'page-item';
        if (i === currentPage) li.classList.add('active');

        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pagination.appendChild(li);
    }

    const liNext = document.createElement('li');
    liNext.className = 'page-item';
    liNext.innerHTML = `<a class="page-link primary-btn" href="#">Siguiente</a>`;
    pagination.appendChild(liNext);
}

export function updatePaginationStates(pagination, totalPages, currentPage) {
    const pageItems = pagination.querySelectorAll('.page-item');
    const prev = pageItems[0];
    const next = pageItems[pageItems.length - 1];

    prev.classList.toggle('disabled', currentPage === 1);
    next.classList.toggle('disabled', currentPage === totalPages);

    pageItems.forEach((item) => {
        const link = item.querySelector('.page-link');
        if (link && !isNaN(link.textContent)) {
            const pageNum = parseInt(link.textContent);
            item.classList.toggle('active', pageNum === currentPage);
        }
    });
}

async function obtenerYMostrarData(id) {
    try {
        const data = await obtenerDataObjeto(id);
        mostrarInfoObjetoModal(data);

    } catch (error) {
        console.error(error);
        mostrarModal('Error al cargar la Informacion del objeto', 'errorModal');
        await esperarCierreModal('errorModal');
    }
}