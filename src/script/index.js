const hamburger = document.querySelector('.nav__hamburger');
const drawer = document.querySelector('.nav__drawer');
const navLinks = document.querySelectorAll('.nav-links');
const body = document.body;

hamburger.addEventListener('click', (event) => {
    event.stopPropagation();

    const isOpen = drawer.classList.toggle('is-open');

    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    body.classList.toggle('no-scroll', isOpen);
});

drawer.addEventListener('click', (event) => {
    event.stopPropagation();
});

body.addEventListener('click', () => {
    drawer.classList.remove('is-open');
    hamburger.setAttribute('aria-label', 'Open menu');
});

navLinks.forEach((nl) => {
    nl.addEventListener('click', () => {
        let activated;
        for (let key in navLinks) {
            if (navLinks[key].classList?.value.includes('active') == true) {
                activated = navLinks[key];
            }
        }

        activated.classList.remove('active');
        nl.classList.add('active');
    });
});
