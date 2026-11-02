// =====================================================
// JAMAL — WEBSITE INTERACTIONS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // =================================================
    // ELEMENTS
    // =================================================

    const body = document.body;

    const yearElement =
        document.getElementById("year");

    const header =
        document.getElementById("header") ||
        document.querySelector(".header");

    const menuToggle =
        document.getElementById("menuToggle");

    const nav =
        document.getElementById("nav");

    const navLinks =
        document.querySelectorAll(".nav a");

    const revealElements =
        document.querySelectorAll(".reveal");

    const hero =
        document.querySelector(".hero");

    const heroImage =
        document.querySelector(".hero-image img");

    const heroContent =
        document.querySelector(".hero-content");

    const scrollText =
        document.querySelector(".scroll-text");

    const galleryItems =
        document.querySelectorAll(".gallery-item");

    const videoCards =
        document.querySelectorAll(".video-card");

    const sections =
        document.querySelectorAll("main section[id]");

    const allImages =
        document.querySelectorAll("img");


    // =================================================
    // CURRENT YEAR
    // =================================================

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }


    // =================================================
    // MOTION SETTINGS
    // =================================================

    const motionQuery =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

    let prefersReducedMotion =
        motionQuery.matches;


    function updateMotionPreference(event) {
        prefersReducedMotion = event.matches;

        if (prefersReducedMotion) {
            resetHeroParallax();
        }
    }


    if (motionQuery.addEventListener) {
        motionQuery.addEventListener(
            "change",
            updateMotionPreference
        );
    } else if (motionQuery.addListener) {
        // Older Safari fallback
        motionQuery.addListener(
            updateMotionPreference
        );
    }


    // =================================================
    // PAGE READY / HERO ENTRANCE
    // =================================================

    /*
        DOMContentLoaded can happen after some resources
        have already loaded, so we do not rely solely
        on window "load" for the entrance animation.
    */

    requestAnimationFrame(() => {
        body.classList.add("page-loaded");
    });


    // =================================================
    // MOBILE MENU
    // =================================================

    function openMenu() {

        if (!nav || !menuToggle) {
            return;
        }

        nav.classList.add("open");
        menuToggle.classList.add("active");
        body.classList.add("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        /*
            Keep header visible while menu is open.
        */

        header?.classList.remove(
            "header-hidden"
        );
    }


    function closeMenu() {

        if (!nav || !menuToggle) {
            return;
        }

        nav.classList.remove("open");
        menuToggle.classList.remove("active");
        body.classList.remove("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }


    function toggleMenu() {

        if (!nav || !menuToggle) {
            return;
        }

        if (nav.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    }


    menuToggle?.addEventListener(
        "click",
        toggleMenu
    );


    // Close mobile menu after selecting a link

    navLinks.forEach((link) => {

        link.addEventListener(
            "click",
            closeMenu
        );

    });


    // Escape closes mobile menu

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                nav?.classList.contains("open")
            ) {
                closeMenu();
                menuToggle?.focus();
            }

        }
    );


    // Reset mobile menu if viewport becomes desktop

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900 &&
                nav?.classList.contains("open")
            ) {
                closeMenu();
            }

            /*
                Reset parallax transforms when moving
                to mobile.
            */

            if (
                window.innerWidth <= 600 ||
                prefersReducedMotion
            ) {
                resetHeroParallax();
            }

        },
        {
            passive: true
        }
    );


    // =================================================
    // SMOOTH INTERNAL LINKS
    // =================================================

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]:not([href="#"])'
        );


    internalLinks.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetID =
                    link.getAttribute("href");

                if (!targetID) {
                    return;
                }

                let target;

                try {
                    target =
                        document.querySelector(
                            targetID
                        );
                } catch {
                    return;
                }

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior:
                        prefersReducedMotion
                            ? "auto"
                            : "smooth",

                    block: "start"
                });

            }
        );

    });


    // =================================================
    // STAGGER ANIMATION DELAYS
    // =================================================

    galleryItems.forEach(
        (item, index) => {

            item.style.setProperty(
                "--delay",
                `${index * 120}ms`
            );

        }
    );


    videoCards.forEach(
        (card, index) => {

            card.style.setProperty(
                "--delay",
                `${index * 80}ms`
            );

        }
    );


    // =================================================
    // SCROLL REVEAL
    // =================================================

    if (
        "IntersectionObserver" in window &&
        !prefersReducedMotion
    ) {

        const revealObserver =
            new IntersectionObserver(

                (entries, observer) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add("active");

                                observer.unobserve(
                                    entry.target
                                );
                            }

                        }
                    );

                },

                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -60px 0px"
                }
            );


        revealElements.forEach(
            (element) => {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        /*
            Reduced motion and older-browser
            fallback.
        */

        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "active"
                );

            }
        );
    }


    // =================================================
    // HEADER + HERO SCROLL EFFECTS
    // =================================================

    let lastScrollY =
        Math.max(window.scrollY, 0);

    let scrollTicking = false;


    function updateHeader() {

        if (!header) {
            return;
        }

        const currentScroll =
            Math.max(window.scrollY, 0);


        // Background after leaving top of hero

        header.classList.toggle(
            "scrolled",
            currentScroll > 80
        );


        /*
            Hide while scrolling down.
            Show while scrolling up.

            Never hide while:
            - menu is open
            - near top of page
        */

        const scrollingDown =
            currentScroll > lastScrollY + 4;

        const scrollingUp =
            currentScroll < lastScrollY - 4;


        if (
            scrollingDown &&
            currentScroll > 500 &&
            !nav?.classList.contains("open")
        ) {

            header.classList.add(
                "header-hidden"
            );

        } else if (
            scrollingUp ||
            currentScroll <= 500 ||
            nav?.classList.contains("open")
        ) {

            header.classList.remove(
                "header-hidden"
            );
        }


        lastScrollY = currentScroll;
    }


    function resetHeroParallax() {

        if (heroImage) {
            heroImage.style.transform = "";
        }

        if (heroContent) {
            heroContent.style.transform = "";
        }

        if (scrollText) {
            scrollText.style.opacity = "";
        }
    }


    function updateHeroParallax() {

        if (
            !hero ||
            !heroImage ||
            prefersReducedMotion ||
            window.innerWidth <= 600
        ) {

            resetHeroParallax();
            return;
        }


        const scrollPosition =
            Math.max(window.scrollY, 0);

        const heroHeight =
            hero.offsetHeight;


        if (scrollPosition <= heroHeight) {

            const imageMovement =
                scrollPosition * 0.07;


            heroImage.style.transform =
                `scale(1.06) translate3d(
                    0,
                    ${imageMovement}px,
                    0
                )`;


            if (heroContent) {

                heroContent.style.transform =
                    `translate3d(
                        0,
                        ${scrollPosition * -0.025}px,
                        0
                    )`;
            }


            if (scrollText) {

                const opacity =
                    Math.max(
                        0,
                        1 - scrollPosition / 350
                    );

                scrollText.style.opacity =
                    String(opacity);
            }

        } else {

            /*
                Do not leave unnecessary transforms
                running after hero is off-screen.
            */

            if (scrollText) {
                scrollText.style.opacity = "0";
            }
        }
    }


    function handleScroll() {

        if (scrollTicking) {
            return;
        }

        scrollTicking = true;

        window.requestAnimationFrame(() => {

            updateHeader();

            if (!prefersReducedMotion) {
                updateHeroParallax();
            }

            scrollTicking = false;

        });
    }


    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );


    updateHeader();

    if (!prefersReducedMotion) {
        updateHeroParallax();
    }


    // =================================================
    // ACTIVE NAVIGATION SECTION
    // =================================================

    if (
        "IntersectionObserver" in window &&
        sections.length > 0
    ) {

        const sectionObserver =
            new IntersectionObserver(

                (entries) => {

                    const visibleSections =
                        entries
                            .filter(
                                (entry) =>
                                    entry.isIntersecting
                            )
                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            );


                    if (
                        visibleSections.length === 0
                    ) {
                        return;
                    }


                    const activeSection =
                        visibleSections[0]
                            .target.id;


                    navLinks.forEach(
                        (link) => {

                            const isActive =
                                link.getAttribute(
                                    "href"
                                ) ===
                                `#${activeSection}`;


                            link.classList.toggle(
                                "active-link",
                                isActive
                            );


                            if (isActive) {

                                link.setAttribute(
                                    "aria-current",
                                    "page"
                                );

                            } else {

                                link.removeAttribute(
                                    "aria-current"
                                );
                            }

                        }
                    );

                },

                {
                    rootMargin:
                        "-30% 0px -55% 0px",

                    threshold: [
                        0,
                        0.1,
                        0.25,
                        0.5
                    ]
                }
            );


        sections.forEach(
            (section) => {

                sectionObserver.observe(
                    section
                );

            }
        );
    }


    // =================================================
    // IMAGE LOAD EFFECT
    // =================================================

    allImages.forEach((image) => {

        /*
            If image is already loaded, do not briefly
            hide it and create a flash.
        */

        if (
            image.complete &&
            image.naturalWidth > 0
        ) {

            image.classList.add(
                "image-loaded"
            );

            return;
        }


        image.classList.add(
            "image-loading"
        );


        function imageLoaded() {

            image.classList.remove(
                "image-loading"
            );

            image.classList.add(
                "image-loaded"
            );
        }


        function imageFailed() {

            /*
                Remove loading opacity even if an image
                fails, otherwise it could remain hidden.
            */

            image.classList.remove(
                "image-loading"
            );
        }


        image.addEventListener(
            "load",
            imageLoaded,
            {
                once: true
            }
        );


        image.addEventListener(
            "error",
            imageFailed,
            {
                once: true
            }
        );

    });


    // =================================================
    // VIDEO CARD POINTER EFFECT
    // =================================================

    const finePointer =
        window.matchMedia(
            "(pointer: fine)"
        ).matches;


    if (
        finePointer &&
        !prefersReducedMotion
    ) {

        videoCards.forEach(
            (card) => {

                card.addEventListener(
                    "pointermove",
                    (event) => {

                        const rect =
                            card.getBoundingClientRect();

                        if (!rect.width) {
                            return;
                        }


                        const mouseX =
                            event.clientX -
                            rect.left;


                        const percentage =
                            Math.max(
                                0,
                                Math.min(
                                    1,
                                    mouseX /
                                    rect.width
                                )
                            );


                        card.style.setProperty(
                            "--mouse-x",
                            `${percentage * 100}%`
                        );

                    }
                );


                card.addEventListener(
                    "pointerleave",
                    () => {

                        card.style.setProperty(
                            "--mouse-x",
                            "50%"
                        );

                    }
                );

            }
        );
    }


    // =================================================
    // EXTERNAL LINKS
    // =================================================

    /*
        Automatically protect links that open
        in a new tab.
    */

    const externalBlankLinks =
        document.querySelectorAll(
            'a[target="_blank"]'
        );


    externalBlankLinks.forEach((link) => {

        const relValues =
            new Set(
                (
                    link.getAttribute("rel") ||
                    ""
                )
                    .split(/\s+/)
                    .filter(Boolean)
            );


        relValues.add("noopener");
        relValues.add("noreferrer");


        link.setAttribute(
            "rel",
            [...relValues].join(" ")
        );

    });


    // =================================================
    // PAGE RESTORE
    // =================================================

    /*
        Browsers can restore a page from their
        back/forward cache.

        Make sure the page doesn't return with
        the mobile menu still locked open.
    */

    window.addEventListener(
        "pageshow",
        () => {

            if (
                window.innerWidth > 900 &&
                nav?.classList.contains("open")
            ) {
                closeMenu();
            }

            updateHeader();

        }
    );

});