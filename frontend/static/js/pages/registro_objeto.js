import { crearSlider } from '../components/slider.js';
import { mostrarModal, esperarCierreModal } from '../components/modals.js';
import {createOrUpdateObjeto} from '../api/objetos.js'

document.addEventListener('DOMContentLoaded', function () {
    const csrfTokenRegistro = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const photoContainer = document.getElementById('photo-container');
    const photoInput = document.getElementById('photo-input');
    const form = document.getElementById('reg-obj-form');
    const submitButton = form.querySelector('button[type="submit"]');
    let imagenesSeleccionadas = [];
    let imagenesGuardadas = [...imagenesExistentes];
    mostrarVistaPrevia();

    function mostrarVistaPrevia() {
        photoContainer.innerHTML = '';

        if (imagenesGuardadas.length + imagenesSeleccionadas.length === 0) {
            const span = document.createElement('span');
            span.id = 'no-img-msj';
            span.textContent =
                'Arrastra y suelta una foto aquí o haz clic para seleccionar';
            photoContainer.appendChild(span);
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.classList.add('slider-wrapper');
        const carruseles = document.createElement('div');
        carruseles.classList.add('carruseles');

        // Mostrar imágenes existentes primero
        imagenesGuardadas.forEach((url, index) => {
            const section = document.createElement('section');
            section.classList.add('slider-section');

            const img = document.createElement('img');
            img.src = url;
            img.alt = `Imagen existente ${index + 1}`;

            // Botón eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn-eliminar');
            const icono = document.createElement('i');
            icono.classList.add('bi', 'bi-x-circle');
            btnEliminar.appendChild(icono);
            btnEliminar.addEventListener('click', (ev) => {
                ev.stopPropagation();
                // Eliminar imagen existente
                imagenesGuardadas.splice(index, 1);
                mostrarVistaPrevia();
            });

            section.appendChild(img);
            section.appendChild(btnEliminar);
            carruseles.appendChild(section);
        });

        // Mostrar imágenes nuevas (archivos)
        imagenesSeleccionadas.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const section = document.createElement('section');
                section.classList.add('slider-section');

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = `Imagen nueva ${index + 1}`;

                const btnEliminar = document.createElement('button');
                btnEliminar.classList.add('btn-eliminar');
                const icono = document.createElement('i');
                icono.classList.add('bi', 'bi-x-circle');
                btnEliminar.appendChild(icono);
                btnEliminar.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    imagenesSeleccionadas = imagenesSeleccionadas.filter(
                        (_, i) => i !== index
                    );
                    mostrarVistaPrevia();
                });

                section.appendChild(img);
                section.appendChild(btnEliminar);
                carruseles.appendChild(section);

                if (index === imagenesSeleccionadas.length - 1) {
                    // Al final, montar slider
                    wrapper.appendChild(carruseles);
                    const btnLeft = document.createElement('div');
                    btnLeft.classList.add('btn-left');
                    btnLeft.innerHTML = `<i class="bi bi-caret-left-fill"></i>`;

                    const btnRight = document.createElement('div');
                    btnRight.classList.add('btn-right');
                    btnRight.innerHTML = `<i class="bi bi-caret-right-fill"></i>`;

                    wrapper.appendChild(btnLeft);
                    wrapper.appendChild(btnRight);
                    photoContainer.appendChild(wrapper);
                    crearSlider(wrapper);
                }
            };
            reader.readAsDataURL(file);
        });
        if (imagenesSeleccionadas.length === 0) {
            wrapper.appendChild(carruseles);
            const btnLeft = document.createElement('div');
            btnLeft.classList.add('btn-left');
            btnLeft.innerHTML = `<i class="bi bi-caret-left-fill"></i>`;

            const btnRight = document.createElement('div');
            btnRight.classList.add('btn-right');
            btnRight.innerHTML = `<i class="bi bi-caret-right-fill"></i>`;

            wrapper.appendChild(btnLeft);
            wrapper.appendChild(btnRight);
            photoContainer.appendChild(wrapper);
            crearSlider(wrapper);
        }
    }

    photoContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        photoContainer.style.borderColor = '#3a5a40';
    });

    photoContainer.addEventListener('dragleave', () => {
        photoContainer.style.borderColor = '#5a7561';
    });

    photoContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        photoContainer.style.borderColor = '#5a7561';

        const nuevas = Array.from(e.dataTransfer.files);

        if (imagenesSeleccionadas.length + nuevas.length > 5) {
            mostrarModal(
                'Solo puedes subir como máximo 5 imágenes en total.',
                'errorModal'
            );
            esperarCierreModal('errorModal');
            return;
        }

        imagenesSeleccionadas.push(...nuevas);
        mostrarVistaPrevia();
    });

    photoContainer.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', () => {
        const nuevas = Array.from(photoInput.files);

        if (imagenesSeleccionadas.length + nuevas.length > 5) {
            mostrarModal('Debes subir entre 3 a 5 imágenes', 'errorModal');
            esperarCierreModal('errorModal');
            photoInput.value = '';
            return;
        }

        imagenesSeleccionadas.push(...nuevas);
        mostrarVistaPrevia();
        photoInput.value = '';
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const totalImagenes = imagenesGuardadas.length + imagenesSeleccionadas.length;
        if (totalImagenes < 3 || totalImagenes > 5) {
            mostrarModal('Debes subir entre 3 a 5 imágenes', 'errorModal');
            await esperarCierreModal('errorModal');
            return;
        }

        submitButton.disabled = true; // Desactivar botón mientras se procesa

        try {
            const idObjeto = document.getElementById('id_objeto')?.value;
            const nombre = document.getElementById('nombre').value.trim();
            const descripcion_general = document.getElementById('descripcion_general').value.trim();
            const descripcion_especifica = document.getElementById('descripcion_especifica').value.trim();
            const fecha = document.getElementById('fecha').value;
            const hora = document.getElementById('hora').value;
            const lugar = document.getElementById('lugar').value.trim();
            const encontrado_por = document.getElementById('encontrado_por').value.trim();


            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('descripcion_general', descripcion_general);
            formData.append('descripcion_especifica', descripcion_especifica);
            formData.append('fecha_perdida', fecha);
            formData.append('hora_perdida', hora);
            formData.append('lugar_perdida', lugar);
            formData.append('estado_objeto', 'publicado');
            formData.append('encontrado_por', encontrado_por);

            imagenesSeleccionadas.forEach((imagen) =>
                formData.append('imagenes_upload', imagen)
            );
            imagenesGuardadas.forEach((url) =>
                formData.append('imagenes_existentes', url)
            );
            
            await createOrUpdateObjeto({formData, idObjeto, csrfToken:csrfTokenRegistro});

            const mensaje = idObjeto ? 'Actualización exitosa' : 'Registro exitoso';
            mostrarModal(mensaje, 'successModal');
            form.reset();
            imagenesSeleccionadas = [];
            imagenesGuardadas = [];
            mostrarVistaPrevia();

            await esperarCierreModal('successModal');
            window.location.href = '/administrador';
        } catch (error) {
            console.error(error);
            mostrarModal(error.message || 'Error inesperado', 'errorModal');
            await esperarCierreModal('errorModal');
        } finally {
            submitButton.disabled = false; // Reactivar botón
        }
    });

    const esEdicion = document.getElementById('id_objeto') !== null;

    if (esEdicion) {
        // Cambiar título de la pestaña
        document.title = 'Actualizar Objeto';

        // Cambiar encabezado del contenedor
        const header = document.querySelector('.header-container h2');
        if (header) header.textContent = 'Actualizar Objeto Perdido';

        // Cambiar texto del botón
        const boton = document.querySelector('button[type="submit"]');
        if (boton) boton.textContent = 'Actualizar';
    }
});
