'use strict';

/* ── THEME TOGGLE ── */
const themeToggle = document.getElementById('themeToggle');

function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

themeToggle.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
});

// Sync aria-label on page load
themeToggle.setAttribute('aria-label', getTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

/* ── NAV SCROLL STATE ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── ACTIVE NAV LINK ── */
const navLinks = document.querySelectorAll('.nav-link[data-section]');
function updateActive() {
    const links = Array.from(navLinks);
    const hashLink = links.find(link => link.hash && link.hash === window.location.hash);
    const currentPageLink = links.find(link => link.getAttribute('aria-current') === 'page');
    const activeLink = hashLink || currentPageLink;
    links.forEach(link => link.classList.toggle('active', link === activeLink));
}

window.addEventListener('hashchange', updateActive);
updateActive();

/* ── MOBILE NAV TOGGLE ── */
const toggle = document.getElementById('navToggle');
const menu   = document.getElementById('navMenu');
let menuOpen = false;

if (toggle && menu) {
    function openMenu()  { menuOpen = true;  toggle.classList.add('active'); menu.classList.add('open'); toggle.setAttribute('aria-expanded','true');  document.body.classList.add('nav-open'); }
    function closeMenu() { menuOpen = false; toggle.classList.remove('active'); menu.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); document.body.classList.remove('nav-open'); }

    toggle.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
    document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });
}

/* ── PROJECT FILTER TABS ── */
const projectTabs = Array.from(document.querySelectorAll('[data-project-filter]'));
const projectList = document.getElementById('project-list');
const projectItems = projectList ? Array.from(projectList.querySelectorAll('.project-item')) : [];

function activateProjectTab(tab, moveFocus) {
    const filter = tab.dataset.projectFilter;
    projectTabs.forEach(item => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
    });
    if (projectList) projectList.setAttribute('aria-labelledby', tab.id);
    projectItems.forEach(item => {
        item.hidden = filter !== 'all' && item.dataset.projectKind !== filter;
    });
    if (moveFocus) tab.focus();
}

projectTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateProjectTab(tab, false));
    tab.addEventListener('keydown', event => {
        let nextIndex;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % projectTabs.length;
        else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + projectTabs.length) % projectTabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = projectTabs.length - 1;
        else return;
        event.preventDefault();
        activateProjectTab(projectTabs[nextIndex], true);
    });
});

/* ── CERTIFICATE LIBRARY ── */
const certificateDialog = document.getElementById('certificateDialog');
if (certificateDialog) {
    if (!window.portfolioCertificates) {
        throw new Error('Certificate data could not be loaded.');
    }
    const certificateViewer = document.getElementById('certificateViewer');
    const certificateDialogTitle = document.getElementById('certificateDialogTitle');
    const certificateDialogOpen = document.getElementById('certificateDialogOpen');
    const certificateLists = [
        {
            certificates: window.portfolioCertificates.technical,
            count: document.getElementById('technicalCertificateCount'),
            list: document.getElementById('technicalCertificateList')
        },
        {
            certificates: window.portfolioCertificates.nontechnical,
            count: document.getElementById('nontechnicalCertificateCount'),
            list: document.getElementById('nontechnicalCertificateList')
        }
    ];

    function openCertificate(certificate) {
        if (!certificate.file.startsWith('cert/technical/') && !certificate.file.startsWith('cert/nontechnical/')) {
            throw new Error('Certificate file is outside the expected certificate folders.');
        }
        if (!certificate.file.toLowerCase().endsWith('.pdf')) {
            throw new Error('Certificate preview only supports PDF files.');
        }
        certificateDialogTitle.textContent = certificate.title;
        const fileUrl = encodeURI(certificate.file);
        certificateViewer.src = fileUrl;
        certificateDialogOpen.href = fileUrl;
        certificateDialog.showModal();
    }

    certificateLists.forEach(({ certificates, count, list }) => {
        if (!Array.isArray(certificates) || !list || !count) {
            throw new Error('Certificate list is missing or invalid.');
        }
        count.textContent = String(certificates.length);
        certificates.forEach(certificate => {
            const item = document.createElement('li');
            const button = document.createElement('button');
            button.className = 'certificate-link';
            button.type = 'button';
            button.setAttribute('aria-haspopup', 'dialog');
            button.textContent = certificate.title;
            button.addEventListener('click', () => openCertificate(certificate));
            item.appendChild(button);
            list.appendChild(item);
        });
    });

    function closeCertificateDialog() {
        certificateViewer.removeAttribute('src');
        certificateDialogOpen.removeAttribute('href');
        certificateDialog.close();
    }

    document.getElementById('certificateDialogBack').addEventListener('click', closeCertificateDialog);
    document.getElementById('certificateDialogClose').addEventListener('click', closeCertificateDialog);
    certificateDialog.addEventListener('click', event => {
        if (event.target === certificateDialog) closeCertificateDialog();
    });
    certificateDialog.addEventListener('close', () => {
        certificateViewer.removeAttribute('src');
    });
}

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