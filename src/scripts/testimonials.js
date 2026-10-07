import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

// Splide initilization with custom classes

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

/**
 * Fetches testimonial data from a JSON file, dynamically populates
 * the testimonial template with content and corresponding star ratings,
 * appends them to the DOM, and initializes the Splide slider.
 */
async function showRating() {
    const list = document.querySelector('.splide__list');
    const template = document.querySelector('#testimonial-template');
    const response = await fetch('/assets/json/testimonial.json');
    const testimonials = await response.json();

    if (Array.isArray(testimonials)) {
        testimonials.forEach((testimonial) => {
            const testimonialNode = template.content.cloneNode(true);

            testimonialNode.querySelector('.testimonial__name').textContent =
                testimonial.name;

            testimonialNode.querySelector('.testimonial__role').textContent =
                testimonial.role;

            testimonialNode.querySelector('.testimonial__text').textContent =
                testimonial.text;

            testimonialNode.querySelector('.testimonial__image').src =
                testimonial.image;

            const ratingContainer = testimonialNode.querySelector(
                '.testimonial__rating',
            );

            ratingContainer.setAttribute(
                'aria-label',
                `rating ${testimonial.rating} out of 5`,
            );

            ratingContainer.innerHTML = '';

            for (let i = 0; i < testimonial.rating; i++) {
                const star = document.createElement('i');
                star.classList.add('icon', 'icon-star', 'testimonial__star');
                star.setAttribute('aria-hidden', 'true');
                ratingContainer.appendChild(star);
            }

            list.appendChild(testimonialNode);
        });
    }

    splide.mount();

    document
        .querySelector('.splide__pagination__page.dots.is-active')
        .setAttribute('tabindex', '-1');
}

showRating();
