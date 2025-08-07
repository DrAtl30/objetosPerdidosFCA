import { cargarObjetosConFiltros, construirUrl } from '../components/items.js';

document.addEventListener('DOMContentLoaded', function () {
    const filterButton = document.getElementById('filter-button');
    const filterPanel = document.getElementById('filter-panel');
    const closeFilterPanelButton =document.getElementById('close-filter-panel');
    const applyFiltersButton = document.getElementById('apply-filters');
    const resetFiltersButton = document.getElementById('reset-filters');

    filterButton.addEventListener('click', function () {
        filterPanel.style.display = 'block';
    });

    closeFilterPanelButton.addEventListener('click', function () {
        filterPanel.style.display = 'none';
    });
    applyFiltersButton.addEventListener('click', function () {
        const paramsString = construirUrl();
        const url = `/api/objetos/?page=1&${paramsString}`;
        const newUrl = paramsString ? `?${paramsString}` : window.location.pathname;
        window.history.pushState({}, '', newUrl);
        cargarObjetosConFiltros(url);
        filterPanel.style.display = 'none';
    });
    resetFiltersButton.addEventListener('click', function (){
        const radios = document.querySelectorAll('#filter-panel input[type="radio"]');
        radios.forEach(radio => radio.checked =false);
        const paramsString = construirUrl(); // debería devolver "" si no hay filtros
        const url = `/api/objetos/?page=1&${paramsString}`;
        const newUrl = paramsString ? `?${paramsString}` : window.location.pathname;
        window.history.pushState({}, '', newUrl);
        cargarObjetosConFiltros(url);

        // Opcional: cerrar panel
        filterPanel.style.display = 'none';
    });
});
