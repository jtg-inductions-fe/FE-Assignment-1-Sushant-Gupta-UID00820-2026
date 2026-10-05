const specialLink = document.querySelector('#special');
const dialog = document.querySelector('#my-dialog');
const closeBtn = document.querySelector('#close-btn');

const specialWheel = document.querySelector('#special-wheel');
const wheelTemplate = document.querySelector('#wheel-template');
const winTemplate = document.querySelector('#win-template');
const specialWinWrapper = document.querySelector('.special__win-wrapper');
const specialUnlockedCount = document.querySelector('.special__unlocked-count');

const spinView = document.querySelector('#spin-view');
const dealsView = document.querySelector('#deals-view');
const unlockedDealsList = document.querySelector('#unlocked-deals-list');
const dealCardTemplate = document.querySelector('#deal-card-template');
const goBackBtn = document.querySelector('#go-back-btn');
const viewUnlockedBtn = document.querySelector('.special__unlocked-btn');

let allOffers = [];
let randomOffers = [];
let wonIndex = -1;
let lastSpinDeg = 0;
let isSpinning = false;

/**
 * Fetches the won offers from localStorage
 */
const getWonOffers = () => {
    try {
        return JSON.parse(localStorage.getItem('wonOffers')) || [];
    } catch {
        return [];
    }
};

/**
 * Fetches the offers from the Provided API
 */
const fetchOffers = async () => {
    try {
        const response = await fetch(
            'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/',
        );

        return await response.json();
    } catch (error) {
        throw new Error('Internal server error', error);
    }
};

/**
 * Filters the already won offers from all offers and
 * picks 4 random offers to display
 */
const getRandomOffers = (array) => {
    const wonOffers = getWonOffers();
    const shuffled = [...array];
    const filtered = shuffled.filter(
        (offer) => !wonOffers.some((won) => won.promoCode === offer.promoCode),
    );

    for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }

    return filtered.slice(0, 4);
};

/**
 * Initializes the wheel using template tag and
 * renders the offer details dynamically
 */
const initWheel = () => {
    specialWheel.innerHTML = '';
    randomOffers = getRandomOffers(allOffers);

    if (randomOffers.length < 4) {
        specialWheel.innerHTML =
            '<p class="special__loading-text" style="display: block;">No More Offers!</p>';
        return;
    }

    const templateNode = wheelTemplate.content.cloneNode(true);
    for (let i = 0; i < randomOffers.length; i++) {
        const textEl = templateNode.querySelector(
            `.special__segment-text--${i + 1}`,
        );

        if (textEl) textEl.textContent = randomOffers[i].label;
    }

    specialWheel.appendChild(templateNode);

    const spinBtn = specialWheel.querySelector('#spin-btn');
    if (spinBtn) {
        spinBtn.addEventListener('click', handleSpin);
    }
};

/**
 * It handles the spinning and winning logic of the wheel
 */
const handleSpin = () => {
    if (isSpinning) return;
    isSpinning = true;

    specialWinWrapper.style.display = 'none';

    let wonOffers = getWonOffers();

    if (wonOffers.length > 0) {
        specialWinWrapper.innerHTML = '';
        randomOffers = getRandomOffers(allOffers);

        for (let i = 0; i < randomOffers.length; i++) {
            const textEl = specialWheel.querySelector(
                `.special__segment-text--${i + 1}`,
            );

            if (textEl) textEl.textContent = randomOffers[i].label;
        }
    }

    const randomDegree =
        lastSpinDeg + 1600 + Math.floor(360 * (Math.random() * 5 + 1));
    lastSpinDeg = randomDegree;

    specialWheel.style.transform = `rotate(${randomDegree}deg)`;
    specialWheel.style.transition = 'transform 3s ease-out';

    setTimeout(() => {
        const remainderDegree = lastSpinDeg % 360;

        if (remainderDegree < 90) wonIndex = 0;
        else if (remainderDegree < 180) wonIndex = 2;
        else if (remainderDegree < 270) wonIndex = 3;
        else wonIndex = 1;

        let updatedWonOffers = getWonOffers();

        updatedWonOffers.push(randomOffers[wonIndex]);

        localStorage.setItem('wonOffers', JSON.stringify(updatedWonOffers));

        specialWinWrapper.style.display = 'block';
        specialWinWrapper.innerHTML = '';

        if (updatedWonOffers.length > 6) {
            specialWinWrapper.innerHTML = `
                <div class="special__win">
                    <p class="special__win-text special-text special-text--sm">
                        You've unlocked maximum deals! View them below.
                    </p>
                </div>
            `;

            const spinBtn = specialWheel.querySelector('#spin-btn');

            if (spinBtn) spinBtn.disabled = true;
        } else {
            const winTemplateClone = winTemplate.content.cloneNode(true);

            winTemplateClone.querySelector('.special-card__label').textContent =
                randomOffers[wonIndex].label;

            winTemplateClone.querySelector(
                '.special-card__expiry',
            ).textContent = `Expires in ${randomOffers[wonIndex].validFor}d`;

            winTemplateClone.querySelector('.special-card__code').textContent =
                randomOffers[wonIndex].promoCode;

            specialWinWrapper.appendChild(winTemplateClone);

            const copyBtn = specialWinWrapper.querySelector('.special__copy');

            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(
                        randomOffers[wonIndex].promoCode,
                    );
                });
            }
        }

        specialUnlockedCount.textContent = updatedWonOffers.length;
        isSpinning = false;
    }, 3000);
};

/**
 * Renders the previously unlocked deals / won offers
 * on the unlocked deals page.
 */
const renderUnlockedDeals = () => {
    const wonOffers = getWonOffers();

    const sortedWonOffers = wonOffers.filter((elem) => elem.validFor !== null);

    sortedWonOffers.sort((a, b) => a.validFor - b.validFor);

    wonOffers.forEach((elem) => {
        if (elem.validFor === null) {
            sortedWonOffers.push(elem);
        }
    });

    unlockedDealsList.innerHTML = '';

    sortedWonOffers.forEach((offer) => {
        const isExpired = offer.validFor <= 0;

        const clone = dealCardTemplate.content.cloneNode(true);

        const card = clone.querySelector('.special-card');
        const label = clone.querySelector('.special-card__label');
        const expiry = clone.querySelector('.special-card__expiry');
        const code = clone.querySelector('.special-card__code');
        const copyBtn = clone.querySelector('.special-card__copy');
        const copyIcon = clone.querySelector('.special-card__copy-icon');

        label.textContent = offer.label;
        code.textContent = offer.promoCode;

        if (isExpired) {
            card.classList.add('special-card--expired');
            expiry.textContent = 'Deal expired';
            expiry.classList.add('special-card__expiry--expired');
            label.classList.add('special-card__label--expired');
            copyBtn.disabled = true;
            copyIcon.src = '/assets/svgs/copy-disable.svg';
        } else {
            expiry.textContent = `Expires in ${offer.validFor}d`;
            copyIcon.src = '/assets/svgs/copy.svg';

            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(offer.promoCode);
            });
        }

        unlockedDealsList.appendChild(clone);
    });
};

/**
 * Unlocked button event listener
 */
viewUnlockedBtn.addEventListener('click', () => {
    spinView.classList.add('special__view--hidden');
    dealsView.classList.remove('special__view--hidden');
    renderUnlockedDeals();
});

/**
 * Go back button event listener
 */
goBackBtn.addEventListener('click', () => {
    dealsView.classList.add('special__view--hidden');
    spinView.classList.remove('special__view--hidden');
});

/**
 * Initializes the spinning wheel when the
 * special deals nav-link is clicked
 */
const initSpin = async () => {
    allOffers = await fetchOffers();

    const wonOffers = getWonOffers();
    specialUnlockedCount.textContent = wonOffers.length;
    specialLink.addEventListener('click', () => {
        dialog.showModal();

        spinView.classList.remove('special__view--hidden');
        dealsView.classList.add('special__view--hidden');

        initWheel();
        specialWinWrapper.innerHTML = '';
        isSpinning = false;
    });

    closeBtn.addEventListener('click', () => {
        dialog.close();
    });
};

initSpin();
