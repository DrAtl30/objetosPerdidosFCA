import {cargarObjetosConFiltros, construirUrl} from '../components/items.js'

const input = document.getElementById('search-input');
const clear = document.getElementById('clear-btn');

input.addEventListener('input', () => {
    if (input.value.trim() != '') {
        clear.style.display = 'flex'
    }else{
        clear.style.display = 'none'
    }
});

clear.addEventListener('click', () => {
    input.value = '';
    clear.style.display = 'none'
    input.focus();
    buscarObjetos();
});

document.querySelector('.search-btn').addEventListener('click', buscarObjetos);
document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.querySelector('.search-btn').click(); // simula el clic del botón
    }
});

function buscarObjetos(){
    const paramsString = construirUrl();

    const url = `/api/objetos/?page=1&${paramsString}`;
    const newUrl = paramsString ? `?${paramsString}` : window.location.pathname;

    window.history.pushState({}, '', newUrl);

    cargarObjetosConFiltros(url);
}
