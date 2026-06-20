'use strict';

/* ── NAV SCROLL STATE ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── ACTIVE NAV LINK ── */
const navLinks = document.querySelectorAll('.nav__link[data-section]');
const sections = document.querySelectorAll('section[id]');

function updateActive() {
    const pos = window.scrollY + 100;
    let current = '';
    sections.forEach(s => {
        if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) current = s.id;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
}

window.addEventListener('scroll', updateActive, { passive: true });
updateActive();

/* ── MOBILE NAV TOGGLE ── */
const toggle = document.getElementById('navToggle');
const menu   = document.getElementById('navMenu');
let menuOpen = false;

function openMenu()  { menuOpen = true;  toggle.classList.add('active'); menu.classList.add('open'); toggle.setAttribute('aria-expanded','true');  document.body.classList.add('nav-open'); }
function closeMenu() { menuOpen = false; toggle.classList.remove('active'); menu.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); document.body.classList.remove('nav-open'); }

toggle.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
document.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });

/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = Array.from(entry.target.parentElement?.children || []);
        const idx = siblings.filter(el => el.classList.contains('reveal')).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('revealed'), Math.min(idx * 90, 350));
        revealObs.unobserve(entry.target);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

reveals.forEach(el => revealObs.observe(el));

/* ── STAT COUNTER ── */
function animateNum(el, target, duration) {
    const start = performance.now();
    function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * ease);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target + (target >= 10 ? '+' : '');
    }
    requestAnimationFrame(step);
}

const statObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.dataset.animated) return;
        el.dataset.animated = 'true';
        animateNum(el, +el.dataset.target, 1000);
        statObs.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.about__stat-num').forEach(el => statObs.observe(el));

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH + 1, behavior: 'smooth' });
    });
});

/* ── BACK TO TOP ── */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 500), { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

console.log('%c⚡ Rey Laurence Nedruda — Portfolio', 'color:#fff;font-weight:bold;background:#000;padding:4px 8px;');