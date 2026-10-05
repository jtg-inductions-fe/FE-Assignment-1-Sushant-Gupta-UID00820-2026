import './testimonials';
import './specialDeals';

const hamburger = document.querySelector('.nav__hamburger');
const linksContainer = document.querySelector('.nav__links');
const body = document.body;
const footer = document.querySelector('.footer');

/**
 * Toggles the mobile navigation drawer open/closed state,
 * updates accessibility attributes, and prevents background scrolling.
 */
hamburger.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = linksContainer.classList.toggle('is-open');
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    body.classList.toggle('no-scroll', isOpen);
    hamburger.style.zIndex = 30;
});

/**
 * Handles navigation link selection, preventing event propagation
 * and managing the active class state for menu items.
 */
linksContainer.addEventListener('click', (event) => {
    event.stopPropagation();

    const link = event.target.closest('.nav__link');
    if (!link) return;

    const container = link.closest('ul');
    if (container) {
        const currentActive = container.querySelector('.nav__link.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        link.classList.add('active');
    }

    const isOpen = linksContainer.classList.toggle('is-open');
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    body.classList.toggle('no-scroll', isOpen);
});

/**
 * Handles the accordion of the footer section
 * using event delegation
 */
footer.addEventListener('click', (event) => {
    const button = event.target.closest('.footer__accordian-button');

    const icon = button.firstElementChild;
    const isExpanded = icon.classList.toggle('footer__drop-down--rotate');

    const navElementId = button.getAttribute('aria-controls');
    button.setAttribute('aria-expanded', isExpanded);
    const panel = document.getElementById(navElementId);
    if (panel) {
        panel.classList.toggle('footer__columns-items--active');
    }
});
