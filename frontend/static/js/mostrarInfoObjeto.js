import {mostrarModal, esperarCierreModal} from './modals.js';
import {crearSlider} from './slider.js';

export function mostrarInfoObjetoModal(objeto) {
    const modal = document.getElementById('info_objeto');
    if (!modal) return;

    modal.querySelector('#objetoNombre').textContent = objeto.nombre || 'Sin nombre';
    modal.querySelector('#objetoDescripcion').textContent = objeto.descripcion || 'Sin descripción';
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

}