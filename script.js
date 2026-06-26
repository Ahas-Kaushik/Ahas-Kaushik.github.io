/* ============================================================
   PARTICLE NETWORK
   ============================================================ */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];
let mouse = { x: -9999, y: -9999 };

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() { this.reset(true); }

    reset(randomY = false) {
        this.x  = Math.random() * canvas.width;
        this.y  = randomY ? Math.random() * canvas.height : canvas.height + 10;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.r  = Math.random() * 1.8 + 0.4;
        this.alpha  = Math.random() * 0.45 + 0.08;
        this.color  = Math.random() > 0.55 ? '139,92,246' : '34,211,238';
    }

    update() {
        const dx   = mouse.x - this.x;
        const dy   = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
            const force = (100 - dist) / 100;
            this.x -= dx * force * 0.025;
            this.y -= dy * force * 0.025;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 13000), 110);
    particles = Array.from({ length: count }, () => new Particle());
}

function connectParticles() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
                const alpha = (1 - dist / maxDist) * 0.13;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
                ctx.lineWidth   = 0.7;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}

/* ============================================================
   TYPEWRITER
   ============================================================ */
const phrases   = ['intelligent systems', 'NLP pipelines', 'computer vision apps', 'ML solutions', 'real-world AI'];
let pIdx = 0, cIdx = 0, deleting = false;
const typingEl  = document.getElementById('typingEl');

function type() {
    const current = phrases[pIdx];
    if (!deleting) {
        typingEl.textContent = current.slice(0, ++cIdx);
        if (cIdx === current.length) {
            deleting = true;
            setTimeout(type, 1900);
            return;
        }
    } else {
        typingEl.textContent = current.slice(0, --cIdx);
        if (cIdx === 0) {
            deleting = false;
            pIdx = (pIdx + 1) % phrases.length;
        }
    }
    setTimeout(type, deleting ? 55 : 95);
}

/* ============================================================
   HERO ANIMATE-IN (staggered)
   ============================================================ */
function heroAnimateIn() {
    document.querySelectorAll('.animate-in').forEach(el => {
        const delay = (parseInt(el.dataset.delay) || 0) * 130;
        setTimeout(() => el.classList.add('visible'), delay + 300);
    });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function setupReveal() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 90);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ============================================================
   SKILL BARS
   ============================================================ */
function setupSkillBars() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
                    setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 200 + i * 80);
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    document.querySelectorAll('.skill-category').forEach(el => obs.observe(el));
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCount(el) {
    const target  = parseFloat(el.dataset.target);
    const decimal = el.dataset.decimal === 'true';
    const dur     = 1600;
    const start   = performance.now();

    function step(now) {
        const p   = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = decimal
            ? (target * eased).toFixed(2)
            : Math.floor(target * eased);
        if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function setupCounters() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-num').forEach(animateCount);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.about-stats').forEach(el => obs.observe(el));
}

/* ============================================================
   NAVBAR
   ============================================================ */
function setupNavbar() {
    const navbar    = document.getElementById('navbar');
    const links     = document.querySelectorAll('.nav-link');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    const sections  = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);

        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 110) current = s.id;
        });
        links.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }, { passive: true });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });
}

/* ============================================================
   CURSOR GLOW
   ============================================================ */
function setupCursor() {
    const glow = document.getElementById('cursorGlow');
    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
    }, { passive: true });
}

/* ============================================================
   PROFILE IMAGE FALLBACK
   ============================================================ */
function setupProfile() {
    const img      = document.getElementById('profileImg');
    const fallback = document.getElementById('profileFallback');

    const showFallback = () => {
        img.style.display      = 'none';
        fallback.style.display = 'flex';
    };

    img.addEventListener('error', showFallback);
    if (img.complete && img.naturalWidth === 0) showFallback();
}

/* ============================================================
   CARD TILT EFFECT
   ============================================================ */
function setupTilt() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x    = (e.clientX - rect.left) / rect.width  - 0.5;
            const y    = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `translateY(-6px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ============================================================
   PRELOADER
   ============================================================ */
function hidePreloader() {
    const pl = document.getElementById('preloader');
    setTimeout(() => pl.classList.add('hide'), 1300);
}

/* ============================================================
   UTILITY
   ============================================================ */
function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/* ============================================================
   ACTIVE NAV HIGHLIGHT ON LOAD
   ============================================================ */
function highlightNav() {
    const hash = location.hash || '#home';
    document.querySelectorAll('.nav-link').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === hash);
    });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    initParticles();
    animateParticles();

    type();
    heroAnimateIn();
    setupReveal();
    setupSkillBars();
    setupCounters();
    setupNavbar();
    setupCursor();
    setupProfile();
    setupTilt();
    hidePreloader();
    highlightNav();
});

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
}, { passive: true });
