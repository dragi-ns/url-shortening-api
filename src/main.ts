import './style.css';

// MOBILE MENU
const menu = document.getElementById('menu') as HTMLElement;
const menuBtn = document.getElementById('menu-btn') as HTMLButtonElement;
menuBtn.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});
