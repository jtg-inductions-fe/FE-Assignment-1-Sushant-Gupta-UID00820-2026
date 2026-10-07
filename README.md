# Travlog

Travlog is a responsive, static travel-landing-page built with plain HTML, SCSS and vanilla JavaScript, bundled with Vite. It was built as Frontend Assignment 1.

## About the Project

The page presents a travel-booking brand and includes:

-   **Navbar**: responsive navigation with a mobile hamburger drawer (keyboard focus is trapped while the drawer is open), and scroll-based active link highlighting.
-   **Hero**: headline, call-to-action and visual collage.
-   **Brands**: partner logos (Expedia, Airbnb, Booking, Tripadvisor, etc.).
-   **About**: short brand introduction section.
-   **Testimonials**: a carousel built with [Splide](https://splidejs.com/). Testimonial data is loaded dynamically from `public/assets/json/testimonial.json` and rendered through an HTML `<template>`.
-   **Footer**: company, contact and location columns.
-   **Special Deals (spin-the-wheel)**: clicking "special deals" in the navbar opens a `<dialog>` with a spin wheel. Offers are fetched from a remote API, 4 random not-yet-won offers are placed on the wheel, and the winning offer (with a copyable promo code) is stored in `localStorage` so it can be viewed later in the "unlocked deals" view. Expired offers become available again after a set number of days.

### Tech Stack

| Area            | Tools                                                  |
| --------------- | ------------------------------------------------------ |
| Build tool      | Vite 5, `vite-plugin-html`, `vite-plugin-image-optimizer` |
| Styling         | SCSS (Sass), organised using the 7-1 pattern           |
| Scripting       | Vanilla JavaScript (ES modules)                        |
| Carousel        | `@splidejs/splide`                                     |
| Code quality    | ESLint, Prettier, Husky, lint-staged                   |

## Folder Structure
```
FE-Assignment-1-Sushant-Gupta/
├── .github/workflows/
│           └── pr-check.yml    # CI: validates branch name, PR title and commit messages
├── .husky/
│   ├── pre-commit              # Validates branch name, then runs lint-staged
│   └── commit-msg              # Validates commit message format
├── public/                     # Static assets used in the project like fonts, images, svgs, etc.
├── src/                        
│   ├── scripts/                # JS Scripts - index.js, specialDeals.js, constants.js and testimonials.js
│   └── styles/                 # Styles using 7-1 folder structure and SCSS partials 
├── index.html                  # Single page markup
├── vite.config.js              # Vite config (plugins, build output names, dev server port)
├── eslint.config.js            # ESLint config
├── prettier.config.js          # Prettier config
├── .nvmrc                      # Node version used by nvm
├── .npmrc                      # npm settings (engine-strict)
└── package.json                # Scripts and dependencies
└── README.md                   # Project documentation
```

## Getting Started

### Prerequisites

-   **Node.js**: Version 18+ or 20+. You can download and install it from nodejs.org.
-   **npm**: Node.js package manager, which comes bundled with Node.js.

### Installing

To set up the project on your local environment, follow these steps:

1. **Clone the Repository**

    First, you need to clone the repository.

2. **nvm (Node Version Manager)**: If the required Node version 18+ is already installed and active, you can skip this step else you can use nvm (Node Version Manager). Here's how to use it:

    - **Switch Node Version**: If the required Node version is already installed, run:

    ```bash
    nvm use
    ```

    - **Install Node Version**: If the required Node version isn’t installed, you can install it by running:

    ```bash
    nvm install
    ```

    > **_Tip:_** If you don't have nvm installed, you can install it by following the instructions on [nvm-sh/nvm](https://github.com/nvm-sh/nvm).

    Alternatively, you can update Node.js directly by downloading the latest version from the official website: nodejs.org.

3. **Install the necessary dependencies using npm**

    ```bash
    npm install
    ```

4. **Run the Development Server**

    ```bash
    npm run dev
    ```

    The app will typically be available at http://localhost:3000, but check the terminal output for the exact URL.

    > **_NOTE:_** Note: If you want to change the server's port number, you can do so by modifying the **vite.config.js** file at the root level of the project:

    ```js
    server{
        port:<New Port>,
    }
    ```

5. **Build the Project**

    ```bash
    npm run build
    ```

    This command will generate the optimized files in the dist directory.

6. **Lint the Code**
    ```bash
    npm run lint
    ```
