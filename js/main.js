import { loadBestsellers, loadCatalogue } from './catalogue.js';
import './modal.js';
import './forms.js';

const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const menuLinks = mobileMenu.querySelectorAll('a');

const setMenuState = (isOpen) => {
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  mobileMenu.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
};

menuButton.addEventListener('click', () => {
  setMenuState(menuButton.getAttribute('aria-expanded') !== 'true');
});

menuLinks.forEach((link) => link.addEventListener('click', () => setMenuState(false)));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenuState(false);
    menuButton.focus();
  }
});

const year = document.querySelector('[data-current-year]');
year.textContent = new Date().getFullYear();

loadBestsellers();
loadCatalogue({ reset: true });

