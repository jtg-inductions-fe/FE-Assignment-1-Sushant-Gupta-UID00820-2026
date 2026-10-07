import {
    LOCAL_STORAGE_KEY_WON_OFFERS,
    CHECK_ICON_HEIGHT,
    ICON_SRC,
    TIME_IN_SEC,
    API_ENDPOINTS,
    SPIN_CONSTANTS,
    ONE_DAY_IN_SEC,
    DEFAULT_DAYS_FOR_EXPIRED_OFFERS,
    KEYDOWN_KEYS,
} from './constants';

const specialLink = document.querySelector('#special');
const dialog = document.querySelector('#my-dialog');
const closeBtn = document.querySelector('#close-btn');

const specialWheel = document.querySelector('#special-wheel');
const specialGame = document.querySelector('.special__game');
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
const loadingText = document.querySelector('.special__loading-text');

let allOffers = [];
let randomOffers = [];
let lastSpinDeg = 0;
let isSpinning = false;

/**
 * @return {Object[]}
 *
 * Fetches the won offers from localStorage
 */
const getWonOffers = () => {
    try {
        return (
            JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_WON_OFFERS)) || []
        );
    } catch {
        return [];
    }
};

/**
 *
 * @returns {Object[]}
 *
 * Fetches the offers from the Provided API
 */
const fetchOffers = async () => {
    try {
        const response = await fetch(API_ENDPOINTS['OFFERS']);
        return await response.json();
    } catch (error) {
        throw new Error('Internal server error', error);
    }
};

/**
 * @param {Object[]} allOffers
 * @returns {null}
 *
 * Filters the already won offers from all offers and
 * picks 4 random offers to display
 */
const getRandomOffers = (allOffers) => {
    const wonOffers = getWonOffers();
    const copiedOffers = [...allOffers];
    const filtered = copiedOffers.filter(
        (offer) =>
            !wonOffers.some(
                (wonOffer) => wonOffer.promoCode === offer.promoCode,
            ),
    );

    // Fisher–Yates shuffle Algorithm
    for (let index = filtered.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [filtered[index], filtered[randomIndex]] = [
            filtered[randomIndex],
            filtered[index],
        ];
    }

    return filtered.slice(0, SPIN_CONSTANTS['MAX_OFFERS']);
};

/**
 * @param {Object[]} allOffers
 * @returns {null}
 *
 * Initializes the wheel using template tag and
 * renders the offer details dynamically
 */

const initWheel = (allOffers) => {
    specialWheel.innerHTML = '';
    randomOffers = getRandomOffers(allOffers);

    if (randomOffers.length < SPIN_CONSTANTS['MAX_OFFERS']) {
        specialGame.innerHTML =
            '<p class="special__no-offers heading">No More Offers!</p>';

        loadingText.style.display = 'block';
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
        spinBtn.addEventListener('click', () =>
            handleSpin(allOffers, lastSpinDeg),
        );
    }
};

/**
 * @param {number} remainderDegree
 * @returns {number}
 *
 * Returns the Winning index of the offer
 */
const getWonIndex = (remainderDegree) => {
    if (remainderDegree < 90) return 0;
    else if (remainderDegree < 180) return 2;
    else if (remainderDegree < 270) return 3;
    else return 1;
};

/**
 * @param {number} storedLastSpinDegree
 * @returns {number}
 *
 * Takes the last spin degree as argument and
 * returns a random degree to spin
 */
const getRandomSpinDegree = (storedLastSpinDegree) => {
    let randomDegree =
        storedLastSpinDegree +
        SPIN_CONSTANTS['MIN_CIRCLE_SPIN_DEGREE'] +
        Math.floor(SPIN_CONSTANTS['CIRCLE_DEGREE'] * (Math.random() * 5 + 1));

    lastSpinDeg = randomDegree;

    return randomDegree;
};

/**
 *
 * @param {Object[]} randomOffers
 * @param {Object[]} updatedWonOffers
 * @param {number} wonIndex
 *
 * @return {null}
 *
 * Updates the Won Offer in localStorage. Also
 * calculates the time in IPOC timestamps
 */
const updateWinningOffer = (randomOffers, updatedWonOffers, wonIndex) => {
    let currentWinTime = new Date().getTime();

    let currentExpiryTime;

    if (randomOffers[wonIndex].validFor == null) {
        currentExpiryTime =
            currentWinTime + DEFAULT_DAYS_FOR_EXPIRED_OFFERS * ONE_DAY_IN_SEC;
    } else {
        currentExpiryTime =
            currentWinTime + randomOffers[wonIndex].validFor * ONE_DAY_IN_SEC;
    }
    updatedWonOffers.push({
        ...randomOffers[wonIndex],
        winTime: currentWinTime,
        expiryTime: currentExpiryTime,
    });

    localStorage.setItem(
        LOCAL_STORAGE_KEY_WON_OFFERS,
        JSON.stringify(updatedWonOffers),
    );
};

/**
 *
 * @param {Object[]} allOffers
 * @param {number} storedLastSpinDegree
 * @returns {null}
 *
 *
 * It handles the spinning and winning logic of the wheel
 */
const handleSpin = (allOffers, storedLastSpinDegree) => {
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
    const randomDegree = getRandomSpinDegree(storedLastSpinDegree);

    specialWheel.style.transform = `rotate(${randomDegree}deg)`;
    specialWheel.style.transition = `transform ${TIME_IN_SEC['SPIN']}s ease-out`;

    setTimeout(() => {
        const remainderDegree = lastSpinDeg % SPIN_CONSTANTS['CIRCLE_DEGREE'];
        let wonIndex = getWonIndex(remainderDegree);

        let updatedWonOffers = getWonOffers();

        updateWinningOffer(randomOffers, updatedWonOffers, wonIndex);

        specialWinWrapper.style.display = 'block';
        specialWinWrapper.innerHTML = '';

        if (updatedWonOffers.length > 7) {
            specialWinWrapper.innerHTML = `
                <div class="special__win">
                    <p class="special__win-text paragraph paragraph--xs">
                        You've unlocked maximum deals! View them below.
                    </p>
                </div>
            `;

            const spinBtn = specialWheel.querySelector('#spin-btn');

            if (spinBtn) spinBtn.disabled = true;
        } else {
            const winTemplateClone = winTemplate.content.cloneNode(true);
            const dealCardTemplateClone =
                dealCardTemplate.content.cloneNode(true);

            dealCardTemplateClone.querySelector(
                '.special-card__label',
            ).textContent = randomOffers[wonIndex].label;

            dealCardTemplateClone.querySelector(
                '.special-card__expiry',
            ).textContent =
                `Expires in ${randomOffers[wonIndex].validFor === null ? DEFAULT_DAYS_FOR_EXPIRED_OFFERS : randomOffers[wonIndex].validFor}d`;

            dealCardTemplateClone.querySelector(
                '.special-card__code',
            ).textContent = randomOffers[wonIndex].promoCode;

            specialWinWrapper.appendChild(winTemplateClone);
            specialWinWrapper
                .querySelector('.special__win')
                .appendChild(dealCardTemplateClone);

            const copyBtn = specialWinWrapper.querySelector(
                '.special-card__copy',
            );

            if (copyBtn) {
                copyBtnEventListener(copyBtn, randomOffers[wonIndex].promoCode);
            }
        }

        specialUnlockedCount.textContent = updatedWonOffers.length;
        isSpinning = false;
    }, TIME_IN_SEC['SPIN'] * 1000);
};

/**
 *
 * @param {HTMLElement} copyBtn
 * @param {string} promoCode
 * @returns {null}
 *
 * Adds an eventListener to the CopyBtn element
 */
const copyBtnEventListener = (copyBtn, promoCode) => {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(promoCode);
        const copyIcon = copyBtn.querySelector('.special-card__copy-icon');
        copyIcon.src = ICON_SRC['CHECK'];
        copyIcon.style.height = CHECK_ICON_HEIGHT;

        setTimeout(() => {
            copyIcon.src = ICON_SRC['COPY'];
        }, TIME_IN_SEC['CHECK_FLIP'] * 1000);
    });
};

/**
 * @return {null}
 *
 * Renders the previously unlocked deals / won offers
 * on the unlocked deals page.
 */
const renderUnlockedDeals = () => {
    const wonOffers = getWonOffers();

    const sortedWonOffers = wonOffers.filter(
        (wonOffer) => wonOffer.expiryTime - new Date().getTime() >= 0,
    );

    sortedWonOffers.sort((a, b) => a.expiryTime - b.expiryTime);

    wonOffers.forEach((wonOffer) => {
        const remainingExpiryTime = wonOffer.expiryTime - new Date().getTime();
        if (remainingExpiryTime <= 0) {
            sortedWonOffers.push(wonOffer);
        }
    });

    unlockedDealsList.innerHTML = '';

    sortedWonOffers.forEach((storedWonOffer) => {
        const isExpired = storedWonOffer.expiryTime <= new Date().getTime();

        const clone = dealCardTemplate.content.cloneNode(true);

        const card = clone.querySelector('.special-card');
        const label = clone.querySelector('.special-card__label');
        const expiry = clone.querySelector('.special-card__expiry');
        const code = clone.querySelector('.special-card__code');
        const copyBtn = clone.querySelector('.special-card__copy');
        const copyIcon = clone.querySelector('.special-card__copy-icon');

        label.textContent = storedWonOffer.label;
        code.textContent = storedWonOffer.promoCode;

        if (isExpired) {
            card.classList.add('special-card--expired');
            expiry.textContent = 'Deal expired';
            expiry.classList.add('special-card__expiry--expired');
            label.classList.add('special-card__label--expired');
            copyBtn.disabled = true;
            copyIcon.src = ICON_SRC['COPY_DISABLE'];
        } else {
            let expiresInDays = Math.ceil(
                (storedWonOffer.expiryTime - new Date().getTime()) /
                    ONE_DAY_IN_SEC,
            );
            expiry.textContent = `Expires in ${expiresInDays}d`;
            copyIcon.src = ICON_SRC['COPY'];
        }

        unlockedDealsList.appendChild(clone);
    });

    unlockedDealsList.addEventListener('click', (event) => {
        const closestCopyBtn = event.target.closest('.special-card__copy');
        navigator.clipboard.writeText(
            event.target
                .closest('.special-card')
                .querySelector('.special-card__code').textContent,
        );

        const copyIcon = closestCopyBtn.querySelector(
            '.special-card__copy-icon',
        );
        copyIcon.src = ICON_SRC['CHECK'];
        copyIcon.style.height = CHECK_ICON_HEIGHT;

        setTimeout(() => {
            copyIcon.src = ICON_SRC['COPY'];
        }, TIME_IN_SEC['CHECK_FLIP'] * 1000);
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
 * @return {null}
 *
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
        loadingText.style.display = 'none';
        initWheel(allOffers);
        specialWinWrapper.innerHTML = '';
        specialWinWrapper.style.display = 'none';
        isSpinning = false;

        dialog.classList.add('special--open');
    });

    closeBtn.addEventListener('click', () => {
        dialog.classList.remove('special--open');

        setTimeout(() => {
            dialog.close();
        }, TIME_IN_SEC['TRANSITION'] * 1000);
    });
};

dialog.addEventListener('keydown', (event) => {
    if (dialog.classList.contains('special--open')) {
        if (
            (event.target.classList.contains('special__unlocked-btn') ||
                event.target.id == 'go-back-btn') &&
            event.key == KEYDOWN_KEYS['TAB']
        ) {
            dialog.focus();
        }
    }
});

initSpin();
