import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
import { MAX_PAGINATION_DOTS } from './constants';

// Splide initilization with custom classes

const splide = new Splide('.splide', {
    type: 'loop',
    perPage: 1,
    arrows: true,
    pagination: false,
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
 * Show only MAX_DOTS in Splide Pagination.
 *
 * This code generates a custom pagination.
 * Therefore you need to disable the Splide pagination with the option `pagination: false`.
 * You can configure the number of visible pagination dots via MAX_DOTS.
 * The active dot is moved from left to right and starts at the left if the end of
 * MAX_DOTS is reached. So the user can see that there is something happen when using the Slider.
 *
 * Reference: https://gist.github.com/Jehu/1f4038fdbcf9ee8c0b5a58cefd7cbbfd
 */
const createCustomPagination = (splide) => {
    const customPagination = document.createElement('ul');
    customPagination.className = 'splide__pagination my-pagination';

    const updatePagination = () => {
        const totalSlides = splide.length;
        const currentIndex = splide.index;

        let start =
            Math.floor(currentIndex / MAX_PAGINATION_DOTS) *
            MAX_PAGINATION_DOTS;
        const end = Math.min(start + MAX_PAGINATION_DOTS, totalSlides);

        customPagination.innerHTML = '';

        for (let i = start; i < end; i++) {
            const li = document.createElement('li');
            li.className = 'splide__pagination__page dots';
            if (i === currentIndex) {
                li.classList.add('is-active');
            }

            customPagination.appendChild(li);
        }
    };

    // Initialize pagination immediately
    updatePagination();

    // Update splide pagination when moved
    splide.on('moved', updatePagination);

    return customPagination;
};

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

    splide.on('mounted', function () {
        const customPagination = createCustomPagination(splide);
        splide.root.appendChild(customPagination);
    });

    splide.mount();

    document
        .querySelector('.splide__pagination__page.dots.is-active')
        .setAttribute('tabindex', '-1');
}

showRating();
