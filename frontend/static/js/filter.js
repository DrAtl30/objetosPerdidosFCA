import { cargarObjetosConFiltros } from './items.js';

document.addEventListener('DOMContentLoaded', function () {
    const filterButton = document.getElementById('filter-button');
    const filterPanel = document.getElementById('filter-panel');
    const closeFilterPanelButton =
        document.getElementById('close-filter-panel');
    const applyFiltersButton = document.getElementById('apply-filters');

    filterButton.addEventListener('click', function () {
        filterPanel.style.display = 'block';
    });

    closeFilterPanelButton.addEventListener('click', function () {
        filterPanel.style.display = 'none';
    });
    applyFiltersButton.addEventListener('click', function () {
        const fecha =document.querySelector('input[name="fecha-carga"]:checked')?.value || '';
        const orden =document.querySelector('input[name="ordenar-por"]:checked')?.value || '';
        let url = `/api/objetos/?page=1`;
        
        if (fecha) url += `&fecha=${fecha}`;
        if (orden) url += `&orden=${orden}`;
        
        cargarObjetosConFiltros(url);
        filterPanel.style.display = 'none';
        
        document.querySelectorAll('input[name="fecha-carga"]').forEach((el) => el.checked = false);     
        document.querySelectorAll('input[name="ordenar-por"]').forEach((el) => el.checked = false);
    });
});
