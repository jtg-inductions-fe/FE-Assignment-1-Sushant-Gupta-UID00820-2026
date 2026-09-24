const hamburger = document.querySelector('.nav__hamburger');
const linksContainer = document.querySelector('.nav__links');

// Toggle Mobile Drawer
hamburger.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = linksContainer.classList.toggle('is-open');
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

// Prevent clicks inside drawer from closing it, and handle active link state
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
});
