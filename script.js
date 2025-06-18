// ===== MAIN APPLICATION ===== //
class IESWebsite {
    constructor() {
        this.parallaxElements = [];
        this.particles = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.initAnimations();
        this.initParallax();
        this.initCounters();
        this.initNavigation();
        this.initScrollEffects();
        this.initImageOptimization();
    }

    // ===== EVENT BINDINGS ===== //
    bindEvents() {
        window.addEventListener('load', () => this.onPageLoad());
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        window.addEventListener('resize', () => this.onResize(), { passive: true });
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    }

    onPageLoad() {
        document.body.classList.add('loaded');
        this.triggerEnterAnimations();
    }

    onDOMReady() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic'
            });
        }
    }

    onScroll() {
        this.handleNavbarScroll();
        this.handleParallax();
        this.handleScrollProgress();
    }

    onResize() {
        this.handleResponsiveElements();
    }

    // ===== NAVIGATION ===== //
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);

                    const navbarCollapse = document.getElementById('navbarNav');
                    if (navbarCollapse?.classList.contains('show')) {
                        bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
                    }
                }
            });
        });

        this.initSectionObserver();
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerOffset = 80;
            const offsetPosition = element.offsetTop - headerOffset;

            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    }

    initSectionObserver() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    activeLink?.classList.add('active');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -70% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    handleNavbarScroll() {
        const navbar = document.getElementById('navbar');
        navbar?.classList.toggle('scrolled', window.pageYOffset > 50);
    }

    // ===== PARALLAX ===== //
    initParallax() {
        this.parallaxElements = document.querySelectorAll('.hero-bg-layer');
        this.particles = document.querySelectorAll('.particle');
    }

    handleParallax() {
        const scrolled = window.pageYOffset;

        this.parallaxElements.forEach((el, i) => {
            const speed = (i + 1) * 0.3;
            el.style.transform = `translate3d(0, ${-(scrolled * speed)}px, 0)`;
        });

        this.particles.forEach((el, i) => {
            const speed = 0.2 + i * 0.1;
            const rotation = scrolled * 0.1;
            el.style.transform = `translate3d(0, ${-(scrolled * speed)}px, 0) rotate(${rotation}deg)`;
        });

        document.querySelectorAll('.floating-card').forEach((card, i) => {
            const speed = 0.1 + i * 0.05;
            card.style.transform = `translateY(${-(scrolled * speed)}px)`;
        });
    }

    // ===== COUNTERS ===== //
    initCounters() {
        const counterElements = document.querySelectorAll('.stat-number');
        const heroSection = document.querySelector('.hero-section');

        if (heroSection && counterElements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounters(counterElements);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(heroSection);
        }
    }

    animateCounters(elements) {
        elements.forEach((el, i) => {
            const target = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
            setTimeout(() => {
                this.animateValue(el, 0, target, 2000);
            }, i * 200);
        });
    }

    animateValue(el, start, end, duration) {
        let startTime = null;
        const suffix = end === 0 ? '' : '+';

        const step = (ts) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * (end - start) + start) + suffix;

            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }

    // ===== SCROLL PROGRESS ===== //
    handleScrollProgress() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const percent = (scrollTop / height) * 100;
        // Example: document.getElementById('progressBar').style.width = `${percent}%`;
    }

    // ===== ENTRANCE ANIMATIONS ===== //
    initAnimations() {
        this.initHeroAnimations();
        this.initFloatingCards();
        this.initButtonEffects();
    }

    initHeroAnimations() {
        const elements = [
            '.hero-badge', '.hero-title', '.hero-description',
            '.hero-stats', '.hero-actions', '.hero-visual'
        ];

        elements.forEach((selector, i) => {
            const el = document.querySelector(selector);
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, i * 200);
            }
        });
    }

    initFloatingCards() {
        document.querySelectorAll('.floating-card').forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8) translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1) translateY(0)';
            }, 1000 + i * 300);

            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05) translateY(-5px)';
                card.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1) translateY(0)';
                card.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
            });
        });
    }

    initButtonEffects() {
        const buttons = document.querySelectorAll('.btn-primary-custom, .btn-outline-custom');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', (e) => this.createRipple(e, btn));
        });
    }

    createRipple(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // ===== SCROLL EFFECTS ===== //
    initScrollEffects() {
        const indicator = document.querySelector('.scroll-indicator');

        if (indicator) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                indicator.style.opacity = Math.max(0, 1 - scrolled / 300);
            });

            indicator.addEventListener('click', () => {
                const next = document.querySelector('#about') || document.querySelector('section:nth-of-type(2)');
                if (next) this.smoothScrollTo('#' + next.id);
            });
        }
    }

    // ===== RESPONSIVE ===== //
    handleResponsiveElements() {
        const cards = document.querySelectorAll('.floating-card');
        const show = window.innerWidth > 575;
        cards.forEach(card => {
            card.style.display = show ? 'flex' : 'none';
        });
    }

    // ===== IMAGE OPTIMIZATION ===== //
    initImageOptimization() {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('load', () => img.classList.add('loaded'));
            img.addEventListener('error', () => img.classList.add('error'));
        });
    }

    // ===== MANUAL TRIGGER ===== //
    triggerEnterAnimations() {
        document.querySelectorAll('[data-animate="fade-in"]').forEach((el, i) => {
            setTimeout(() => el.classList.add('animate-in'), i * 100);
        });
    }
}

// ===== INJECT CSS KEYFRAMES ===== //
const css = `
<style>
@keyframes ripple {
    to { transform: scale(4); opacity: 0; }
}
.animate-in { opacity: 1 !important; transform: translateY(0) !important; }
.loaded { opacity: 1; }
.hero-main-image.loaded {
    animation: imageReveal 1s ease-out;
}
@keyframes imageReveal {
    from { opacity: 0; transform: scale(1.1); }
    to { opacity: 1; transform: scale(1); }
}
.hero-bg-layer, .particle, .floating-card {
    backface-visibility: hidden;
    perspective: 1000px;
}
</style>`;
document.head.insertAdjacentHTML('beforeend', css);

// ===== INIT ===== //
document.addEventListener('DOMContentLoaded', () => {
    window.iesWebsite = new IESWebsite();
});

// ===== PERFORMANCE MONITORING ===== //
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const nav = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', Math.round(nav.loadEventEnd - nav.loadEventStart), 'ms');
        }, 0);
    });
}
