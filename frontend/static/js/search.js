import {cargarObjetosConFiltros, construirUrl} from './items.js'

document.querySelector('.search-btn').addEventListener('click', buscarObjetos);
document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.querySelector('.search-btn').click(); // simula el clic del botón
    }
});

function buscarObjetos(){
    const paramsString = construirUrl();

    const url = `/api/objetos/?page=1&${paramsString}`;;

    window.history.pushState({}, '', `?${paramsString}`);

    cargarObjetosConFiltros(url);
}
