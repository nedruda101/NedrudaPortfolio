/* ============================================================
   PORTFOLIO SCRIPT
   Rey Laurence Nedruda — Personal Portfolio
   ============================================================ */

'use strict';

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
const TypeWriter = (() => {
    const phrases = [
        'web applications.',
        'mobile apps.',
        'full-stack solutions.',
        'GIS platforms.',
        'Flutter apps.',
        'clean, maintainable code.',
    ];

    let phraseIndex  = 0;
    let charIndex    = 0;
    let isDeleting   = false;
    let isPaused     = false;

    const el = document.getElementById('typewriter');

    const TYPING_SPEED   = 70;
    const DELETING_SPEED = 40;
    const PAUSE_AFTER    = 1800;
    const PAUSE_BEFORE   = 400;

    function tick() {
        if (!el) return;

        const currentPhrase = phrases[phraseIndex];

        if (isPaused) {
            isPaused = false;
            setTimeout(tick, isDeleting ? PAUSE_BEFORE : PAUSE_AFTER);
            return;
        }

        if (!isDeleting) {
            // Typing forward
            el.textContent = currentPhrase.slice(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                // Finished typing — pause then start deleting
                isDeleting = true;
                isPaused   = true;
                setTimeout(tick, PAUSE_AFTER);
                return;
            }
        } else {
            // Deleting
            el.textContent = currentPhrase.slice(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                // Finished deleting — move to next phrase
                isDeleting   = false;
                phraseIndex  = (phraseIndex + 1) % phrases.length;
                isPaused     = true;
                setTimeout(tick, PAUSE_BEFORE);
                return;
            }
        }

        const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
        setTimeout(tick, speed);
    }

    function init() {
        if (el) setTimeout(tick, 1000);
    }

    return { init };
})();


/* ============================================================
   STICKY NAVIGATION
   ============================================================ */
const NavHandler = (() => {
    const header    = document.querySelector('.nav-header');
    const navLinks  = document.querySelectorAll('.nav-link[data-section]');
    const sections  = document.querySelectorAll('section[id]');

    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrolled();
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    }

    function updateScrolled() {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    function updateActiveLink() {
        const scrollPos = window.scrollY + 120; // offset for nav height

        let currentSection = '';
        sections.forEach(section => {
            const top    = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === currentSection) {
                link.classList.add('active');
            }
        });
    }

    function init() {
        window.addEventListener('scroll', onScroll, { passive: true });
        updateScrolled();
        updateActiveLink();
    }

    return { init };
})();


/* ============================================================
   MOBILE NAVIGATION TOGGLE
   ============================================================ */
const MobileNav = (() => {
    const toggle  = document.getElementById('navToggle');
    const menu    = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    let isOpen = false;

    function open() {
        isOpen = true;
        toggle.classList.add('active');
        menu.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('nav-open');
    }

    function close() {
        isOpen = false;
        toggle.classList.remove('active');
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
    }

    function init() {
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            isOpen ? close() : open();
        });

        // Close on nav link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isOpen) close();
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && isOpen) close();
        });
    }

    return { init };
})();


/* ============================================================
   SCROLL REVEAL ANIMATIONS
   ============================================================ */
const ScrollReveal = (() => {
    const revealEls = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Small stagger based on position among siblings
                    const siblings = Array.from(entry.target.parentElement?.children || []);
                    const index    = siblings.filter(el => el.classList.contains('reveal')).indexOf(entry.target);
                    const delay    = Math.min(index * 80, 400); // cap at 400ms

                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px',
        }
    );

    function init() {
        revealEls.forEach(el => observer.observe(el));
    }

    return { init };
})();


/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
const BackToTop = (() => {
    const btn = document.getElementById('backToTop');

    function init() {
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    return { init };
})();


/* ============================================================
   PARALLAX / BACKGROUND EFFECT
   Moves hero orbs subtly on mouse move
   ============================================================ */
const ParallaxHero = (() => {
    const orb1 = document.querySelector('.hero__orb--1');
    const orb2 = document.querySelector('.hero__orb--2');

    let rafId   = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function animate() {
        currentX = lerp(currentX, targetX, 0.06);
        currentY = lerp(currentY, targetY, 0.06);

        if (orb1) {
            orb1.style.transform = `translate(${currentX * 0.03}px, ${currentY * 0.03}px)`;
        }
        if (orb2) {
            orb2.style.transform = `translate(${currentX * -0.02}px, ${currentY * -0.02}px)`;
        }

        rafId = requestAnimationFrame(animate);
    }

    function onMouseMove(e) {
        targetX = e.clientX - window.innerWidth  / 2;
        targetY = e.clientY - window.innerHeight / 2;
    }

    function init() {
        // Only on non-touch, non-reduced-motion devices
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isTouch        = window.matchMedia('(hover: none)').matches;

        if (prefersReduced || isTouch) return;

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        animate();
    }

    return { init };
})();


/* ============================================================
   SKILL TAG HOVER RIPPLE
   Adds a subtle scale pop on skill tag hover via JS for
   devices where CSS :hover alone may not trigger well
   ============================================================ */
const SkillTagEffects = (() => {
    function init() {
        const tags = document.querySelectorAll('.skill-tag');
        tags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.setProperty('--scale', '1.05');
            });
            tag.addEventListener('mouseleave', () => {
                tag.style.setProperty('--scale', '1');
            });
        });
    }

    return { init };
})();


/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   Handles hash links not covered by CSS scroll-behavior
   ============================================================ */
const SmoothScroll = (() => {
    function init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (!target) return;

                e.preventDefault();

                const navHeight = parseInt(
                    getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
                    10
                ) || 72;

                const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;

                window.scrollTo({ top: targetTop, behavior: 'smooth' });
            });
        });
    }

    return { init };
})();


/* ============================================================
   STAT COUNTER ANIMATION
   Animates the numbers in About section on reveal
   ============================================================ */
const StatCounter = (() => {
    const statCards = document.querySelectorAll('.stat-card');

    function animateValue(el, start, end, suffix, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed  = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const eased    = 1 - Math.pow(1 - progress, 3);
            const value    = Math.round(start + (end - start) * eased);
            el.textContent = value + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function parseNumber(text) {
        const num    = parseFloat(text.replace(/[^0-9.]/g, ''));
        const suffix = text.replace(/[0-9.]/g, '');
        return { num, suffix };
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const numEl = entry.target.querySelector('.stat-number');
                    if (!numEl || numEl.dataset.animated) return;

                    numEl.dataset.animated = 'true';
                    const { num, suffix } = parseNumber(numEl.textContent);
                    animateValue(numEl, 0, num, suffix, 1200);

                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    function init() {
        statCards.forEach(card => observer.observe(card));
    }

    return { init };
})();


/* ============================================================
   KEYBOARD NAVIGATION TRAP FOR MOBILE MENU
   ============================================================ */
const FocusTrap = (() => {
    const menu = document.getElementById('navMenu');

    function getFocusableElements() {
        return Array.from(
            menu?.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])') || []
        ).filter(el => !el.disabled);
    }

    function init() {
        document.addEventListener('keydown', (e) => {
            if (!menu?.classList.contains('open')) return;
            if (e.key !== 'Tab') return;

            const focusable = getFocusableElements();
            if (!focusable.length) return;

            const first = focusable[0];
            const last  = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }

    return { init };
})();


/* ============================================================
   INIT ALL MODULES
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    TypeWriter.init();
    NavHandler.init();
    MobileNav.init();
    ScrollReveal.init();
    BackToTop.init();
    ParallaxHero.init();
    SkillTagEffects.init();
    SmoothScroll.init();
    StatCounter.init();
    FocusTrap.init();

    // Log for dev confirmation
    console.log('%c⚡ Portfolio loaded — Rey Laurence Nedruda', 'color: #64ffda; font-weight: bold;');
});