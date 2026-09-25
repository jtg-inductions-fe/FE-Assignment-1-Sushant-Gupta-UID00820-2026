import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

const hamburger = document.querySelector('.nav__hamburger');
const linksContainer = document.querySelector('.nav__links');
const body = document.body;

// Toggle Mobile Drawer
hamburger.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = linksContainer.classList.toggle('is-open');
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    body.classList.toggle('no-scroll', isOpen);
    hamburger.style.zIndex = 30;
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

const htmlTestimonial = `<li class="splide__slide">
    <article class="testimonial__content">
    
        <div class="testimonial__img">
            <img
                src='/assets/images/profile-img.webp'
                alt="" aria-hidden="true"
                class="testimonial__image"
            />
        </div>
        <div class="testimonial__footer">
            <div class="testimonial__author">
                <span class="testimonial__name"
                    >Mark Smith
            </span>

                <span class="testimonial__role">
                        Travel Enthusiast
                </span>
            </div>

            <div class="testimonial__rating" role="img" aria-label="rating 5 out of 5">
                <i class="icon icon-star testimonial__star" aria-hidden="true"></i>
                <i class="icon icon-star testimonial__star" aria-hidden="true"></i>
                <i class="icon icon-star testimonial__star" aria-hidden="true"></i>
                <i class="icon icon-star testimonial__star" aria-hidden="true"></i>
                <i class="icon icon-star testimonial__star" aria-hidden="true"></i>
                
            </div>
            <blockquote class="testimonial__text">
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC
            </blockquote>
        </div>
    </article>
</li>`;

const splide = new Splide('.splide', {
    type: 'loop',
    perPage: 1,
    arrows: true,
    pagination: true,
    classes: {
        pagination: 'splide__pagination my-pagination',
        page: 'splide__pagination__page dots',
        arrows: 'splide__arrows my-arrows',
        arrow: 'splide__arrow my-arrow',
        prev: 'splide__arrow--prev my-prev icon-left_arrow',
        next: 'splide__arrow--next my-next icon-right_arrow',
    },
});

async function showRating() {
    const list = document.querySelector('.splide__list');
    for (let i = 0; i < 3; i++) {
        list.innerHTML += htmlTestimonial;
    }

    splide.mount();
}
showRating();
