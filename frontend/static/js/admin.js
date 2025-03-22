document.addEventListener('DOMContentLoaded', function() {
    const filterButton = document.getElementById('filter-button');
    const filterPanel = document.getElementById('filter-panel');
    const closeFilterPanelButton = document.getElementById('close-filter-panel');
    const applyFiltersButton = document.getElementById('apply-filters');

    filterButton.addEventListener('click', function() {
        filterPanel.style.display = 'block';
    });

    closeFilterPanelButton.addEventListener('click', function() {
        filterPanel.style.display = 'none';
    });

    applyFiltersButton.addEventListener('click', function() {
        filterPanel.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('objetos-perdidos-container');
    const maxItems = 6;

    objetosPerdidos.slice(0, maxItems).forEach(objeto => {
        const col = document.createElement('div');
        col.className = 'col-md-4';

        const item = document.createElement('div');
        item.className = 'item d-flex';

        const itemHeader = document.createElement('div');
        itemHeader.className = 'item-header';
        const img = document.createElement('img');
        img.src = objeto.imagen;
        img.alt = 'Foto del objeto';
        itemHeader.appendChild(img);

        const itemBody = document.createElement('div');
        itemBody.className = 'item-body';
        const h5 = document.createElement('h5');
        h5.textContent = objeto.titulo;
        const p = document.createElement('p');
        p.textContent = objeto.descripcion;
        itemBody.appendChild(h5);
        itemBody.appendChild(p);

        const itemFooter = document.createElement('div');
        itemFooter.className = 'item-footer';
        const button = document.createElement('button');
        button.className = 'btn btn-success';
        button.textContent = 'Editar información';
        itemFooter.appendChild(button);

        item.appendChild(itemHeader);
        item.appendChild(itemBody);
        item.appendChild(itemFooter);
        col.appendChild(item);
        container.appendChild(col);
    });
});