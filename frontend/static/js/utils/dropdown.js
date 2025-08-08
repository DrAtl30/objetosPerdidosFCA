const dropdown =  document.querySelector('.dropdown');

const select = dropdown.querySelector('.select-opt');
const menu = dropdown.querySelector('.menu');
const options = dropdown.querySelector('.menu li');
const selected =  dropdown.querySelector('.selected-opt');

select.addEventListener('click', () => {
    
    menu.classList.toggle('menu-open');
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
        menu.classList.remove('menu-open');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        menu.classList.remove('menu-open');
    }
});