/**
 * Portfolio - William Murcia Costa
 * Main interactions and responsive helpers
 */

const getNavbarOffset = () => {
    const navbar = document.querySelector('.navbar');
    return (navbar ? navbar.offsetHeight : 0) + 12;
};

const initFadeInAnimations = () => {
    const fadeItems = document.querySelectorAll('.fade-in');

    if (!('IntersectionObserver' in window)) {
        fadeItems.forEach((item) => item.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -80px 0px'
    });

    fadeItems.forEach((item) => observer.observe(item));
};

const initVideoPlayback = () => {
    document.querySelectorAll('video').forEach((video) => {
        video.playbackRate = 0.9;
    });
};

const initMobileNavigation = () => {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.links');

    if (!toggle || !links) {
        return;
    }

    const setOpenState = (isOpen) => {
        links.classList.toggle('is-open', isOpen);
        toggle.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('nav-open', isOpen);
    };

    toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        setOpenState(!links.classList.contains('is-open'));
    });

    links.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setOpenState(false));
    });

    document.addEventListener('click', (event) => {
        if (window.innerWidth > 860) {
            return;
        }

        if (!links.contains(event.target) && !toggle.contains(event.target)) {
            setOpenState(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setOpenState(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) {
            setOpenState(false);
        }
    });
};

const initSmoothNavigation = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');

            if (!targetId || targetId === '#') {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const targetPosition = target.getBoundingClientRect().top + window.scrollY - getNavbarOffset();
            window.scrollTo({
                top: Math.max(targetPosition, 0),
                behavior: 'smooth'
            });
        });
    });
};

const initActiveNavigation = () => {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.links a');

    if (!sections.length || !navLinks.length) {
        return;
    }

    const updateActiveLink = () => {
        const currentPosition = window.scrollY + getNavbarOffset() + 24;
        let currentSection = sections[0].getAttribute('id');

        sections.forEach((section) => {
            if (currentPosition >= section.offsetTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${currentSection}`;
            link.classList.toggle('active', isActive);
        });
    };

    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('resize', updateActiveLink);
};

const initLazyLoadingVideos = () => {
    const videos = document.querySelectorAll('video');

    if (!('IntersectionObserver' in window)) {
        videos.forEach((video) => video.play().catch(() => {}));
        return;
    }

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target;

            if (entry.isIntersecting) {
                video.play().catch(() => {});
                return;
            }

            video.pause();
        });
    }, { threshold: 0.35 });

    videos.forEach((video) => videoObserver.observe(video));
};

const detectThemePreference = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
};

const init = () => {
    initFadeInAnimations();
    initVideoPlayback();
    initMobileNavigation();
    initSmoothNavigation();
    initActiveNavigation();
    initLazyLoadingVideos();
    detectThemePreference();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
