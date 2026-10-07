import './testimonials';
import './specialDeals';
import { KEYDOWN_KEYS } from './constants';

const hamburger = document.querySelector('.nav__hamburger');
const linksContainer = document.querySelector('.nav__links');
const body = document.body;
const footer = document.querySelector('.footer');
const nav = document.querySelector('.nav');

/**
 * Toggles the mobile navigation drawer open/closed state,
 * updates accessibility attributes, and prevents background scrolling.
 */
hamburger.addEventListener('click', (event) => {
    event.stopPropagation();
    if (body.clientWidth <= 1024) {
        const isOpen = linksContainer.classList.toggle('nav__links--open');
        hamburger.setAttribute(
            'aria-label',
            isOpen ? 'Close menu' : 'Open menu',
        );
    }
});

/**
 * Tab Capture when drawer is open
 * using keydown event listener and key tracking
 */
nav.addEventListener('keydown', (event) => {
    event.stopPropagation();

    const isOpen = linksContainer.classList.contains('nav__links--open');
    if (isOpen && event.key == KEYDOWN_KEYS['ESC']) {
        linksContainer.classList.toggle('nav__links--open');
        hamburger.setAttribute('aria-label', 'Close menu');
    }

    if (isOpen && event.key == KEYDOWN_KEYS['TAB']) {
        if (
            event.target.id == 'drawer-signup' ||
            event.target.id == 'nav-signup'
        ) {
            event.stopPropagation();
            hamburger.focus();
        }
    }
});

/**
 * Handles navigation link selection, preventing event propagation
 * and managing the nav__link--active modifier state for menu items.
 */
linksContainer.addEventListener('click', (event) => {
    event.stopPropagation();

    const link = event.target.closest('.nav__link');
    if (!link) return;

    const container = link.closest('ul');
    if (container) {
        const currentActive = container.querySelector('.nav__link--active');
        if (currentActive) {
            currentActive.classList.remove('nav__link--active');
        }
        link.classList.add('nav__link--active');
    }
    if (body.clientWidth <= 1024) {
        const isOpen = linksContainer.classList.toggle('nav__links--open');
        hamburger.setAttribute(
            'aria-label',
            isOpen ? 'Close menu' : 'Open menu',
        );
    }
});

/**
 * Handles the accordion of the footer section
 * using event delegation
 */
footer.addEventListener('click', (event) => {
    const button = event.target.closest('.footer__accordian-button');
    if (!button) return;

    const icon = button.firstElementChild;
    const isExpanded = icon.classList.toggle('footer__drop-down--rotate');

    const navElementId = button.getAttribute('aria-controls');
    button.setAttribute('aria-expanded', isExpanded);
    const panel = document.getElementById(navElementId);
    if (panel) {
        panel.classList.toggle('footer__columns-items--active');
    }
});
