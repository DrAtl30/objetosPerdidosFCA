import { cargarObjetosConFiltros, construirUrl } from './items.js';

document.addEventListener('DOMContentLoaded', function () {
    const filterButton = document.getElementById('filter-button');
    const filterPanel = document.getElementById('filter-panel');
    const closeFilterPanelButton =document.getElementById('close-filter-panel');
    const applyFiltersButton = document.getElementById('apply-filters');

    filterButton.addEventListener('click', function () {
        filterPanel.style.display = 'block';
    });

    closeFilterPanelButton.addEventListener('click', function () {
        filterPanel.style.display = 'none';
    });
    applyFiltersButton.addEventListener('click', function () {
        const paramsString = construirUrl();
        const url = `/api/objetos/?page=1&${paramsString}`;
        window.history.pushState({}, '', `?${paramsString}`);
        cargarObjetosConFiltros(url);
        filterPanel.style.display = 'none';
    });
});
