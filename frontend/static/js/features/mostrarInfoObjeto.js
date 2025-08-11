import {mostrarModal, esperarCierreModal} from '../components/modals.js';
import {crearSlider} from '../components/slider.js';
import {crearComentarioObjeto, obtenerComentarios} from '../api/objetos.js'
import {getCSRFToken} from '../utils/utils.js'

export function mostrarInfoObjetoModal(objeto) {
    const modal = document.getElementById('info_objeto');
    if (!modal) return;
    
    const descEspecifica = modal.querySelector('#objetoDescripcionEspecifica').parentElement;
    const hora = modal.querySelector('#objetoHora').parentElement;
    const who = modal.querySelector('#objetoEncontradoPor').parentElement;

    if ('descripcion_especifica' in objeto) {
        descEspecifica.style.display = 'block';
        hora.style.display = 'block';
        who.style.display = 'block';

        modal.querySelector('#objetoDescripcionEspecifica').textContent = objeto.descripcion_especifica || 'Sin descripción';
        modal.querySelector('#objetoHora').textContent = objeto.hora_perdida || 'Sin Hora';
        modal.querySelector('#objetoEncontradoPor').textContent = objeto.encontrado_por || 'Anonimo';
    } else {
        descEspecifica.style.display = 'none';
        hora.style.display = 'none';
        who.style.display = 'none';
    }

    modal.querySelector('#objetoNombre').textContent = objeto.nombre || 'Sin nombre';
    modal.querySelector('#objetoDescripcionGeneral').textContent = objeto.descripcion_general || 'Sin descripción';
    modal.querySelector('#objetoLugar').textContent = objeto.lugar_perdida || 'Sin lugar';
    modal.querySelector('#objetoFecha').textContent = objeto.fecha_perdida || 'Sin fecha';


    const imgContainer = modal.querySelector('.img');
    imgContainer.innerHTML = '';

    if(Array.isArray(objeto.imagenes)  && objeto.imagenes.length > 0){
        const wrapper = document.createElement('div');
        wrapper.classList.add('slider-wrapper');
        const carruseles = document.createElement('div');
        carruseles.classList.add('carruseles')

        
        objeto.imagenes.forEach((imgObj, index) => {
            const section = document.createElement('section');
            section.classList.add('slider-section');

            const img = document.createElement('img');
            img.src = imgObj.ruta_imagen;
            img.alt = `Imagen ${index + 1}` || 'Sin nombre';

            section.appendChild(img);
            carruseles.appendChild(section);
        });
        wrapper.appendChild(carruseles);

        const btnLeft = document.createElement('div');
        btnLeft.classList.add('btn-left');
        btnLeft.innerHTML = `<i class="bi bi-caret-left-fill"></i>`;

        const btnRight = document.createElement('div');
        btnRight.classList.add('btn-right');
        btnRight.innerHTML = `<i class="bi bi-caret-right-fill"></i>`;

        wrapper.appendChild(btnLeft);
        wrapper.appendChild(btnRight);

        imgContainer.appendChild(wrapper);

        crearSlider(wrapper);
    }else{
        imgContainer.textContent = 'Este objeto no tiene imagenes';
    }

    mostrarModal('Informacion del objeto', 'info_objeto');
    esperarCierreModal('info_objeto',0)
    postComentarioModal(objeto.id);

}
export function postComentarioModal(objetoId) {
    const btnComentar = document.getElementById('btnComentar');
    const textarea = document.getElementById('comentario');
    const listaComentarios = document.querySelector('.listaComentarios');

    cargarComentarios(objetoId, listaComentarios);

    btnComentar.onclick = async () => {
        const textoComment = textarea.value.trim();

        if (!textoComment) {
            mostrarModal('El comentario no puede estar vacío', 'errorModal');
            await esperarCierreModal('errorModal');
            return;
        }

        try {
            const csrfToken = getCSRFToken();
            await crearComentarioObjeto(objetoId, textoComment, csrfToken);

            // Opcional: limpiar textarea después de enviar
            textarea.value = '';

            await cargarComentarios(objetoId, listaComentarios);

            mostrarModal('Comentario agregado exitosamente', 'successModal');
            await esperarCierreModal('successModal');
        } catch (error) {
            mostrarModal(error.message || 'Error al enviar comentario','errorModal');
            await esperarCierreModal('errorModal');
        }
    };
}


async function cargarComentarios(objetoId) {
    try {
        const data = await obtenerComentarios(objetoId);

        // Aquí el arreglo real está en data.results
        const comentarios = data.results;

        const lista = document.querySelector('.listaComentarios');
        lista.innerHTML = ''; // Limpia antes de agregar

        if (comentarios.length === 0) {
            lista.innerHTML = '<p>No hay comentarios todavía.</p>';
            return;
        }

        comentarios.forEach((c) => {
            const esUsuarioActual = c.id_usuario === window.usuarioActualId;
            const nombreUsuario = esUsuarioActual ? 'Tú' : c.nombre || 'Anónimo';
            
            const item = document.createElement('div');
            item.classList.add('comentarioItem');
            const text = document.createElement('div');
            text.classList.add('textoComment');
            text.innerHTML = `<p><strong>${nombreUsuario}:</strong> ${c.comentario}. <small class="dateComment">${new Date(c.fecha_comentario).toLocaleString()}</small> </p>`;
            item.appendChild(text);
            lista.appendChild(item);
        });
    } catch (error) {
        console.error('Error cargando comentarios:', error);
    }
}