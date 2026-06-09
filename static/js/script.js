// main.js — Portfolio functionality (fixed)

document.addEventListener('DOMContentLoaded', function () {

    // ========== 1. HAMBURGER MENU ==========
    // FIX: Added hamburger toggle so mobile nav opens/closes smoothly.
    // The JS form interception has been removed so Django can process the POST.
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when any nav link is clicked (smooth mobile UX)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ========== 2. NAVBAR SCROLL EFFECT ==========
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.4)';
            } else {
                navbar.style.boxShadow = '';
            }
        });
    }

    // ========== 3. ACTIVE NAV LINK HIGHLIGHTING ==========
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.right-bar li a');

    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop    = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === current) link.classList.add('active');
        });
    }

    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();
    }

    // ========== 4. SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ========== 5. TYPING ANIMATION FOR NAME ==========
    const typingElement = document.querySelector('.whoami');
    if (typingElement && !typingElement.hasAttribute('data-typed')) {
        const originalText = typingElement.innerText;
        typingElement.innerText = '';
        typingElement.setAttribute('data-typed', 'true');
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                typingElement.innerText += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            }
        }
        typeWriter();
    }

    // ========== 6. SCROLL TO TOP BUTTON ==========
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.id = 'scrollToTop';
    scrollBtn.title = 'Back to top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6c63ff, #4a42d4);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 24px;
        display: none;
        z-index: 999;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(108, 99, 255, 0.3);
    `;
    document.body.appendChild(scrollBtn);

    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollBtn.addEventListener('mouseenter', () => scrollBtn.style.transform = 'scale(1.1)');
    scrollBtn.addEventListener('mouseleave', () => scrollBtn.style.transform = 'scale(1)');

    window.addEventListener('scroll', () => {
        scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    // ========== 7. PROJECT CARD HOVER ==========
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function () { this.style.transform = 'translateY(-8px)'; });
        card.addEventListener('mouseleave', function () { this.style.transform = 'translateY(0)'; });
    });

    // ========== 8. IMAGE ERROR HANDLER ==========
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            this.src = 'https://via.placeholder.com/400x400/1a1f2e/6c63ff?text=Image';
        });
    });

    // ========== 9. ACTIVE NAV LINK STYLE ==========
    const style = document.createElement('style');
    style.textContent = `
        .right-bar li a.active { color: #6c63ff !important; }
    `;
    document.head.appendChild(style);

    // ========== 10. CONSOLE WELCOME ==========
    console.log('%c🚀 Portfolio Loaded!', 'color: #6c63ff; font-size: 16px; font-weight: bold;');
});

// ========== CSRF HELPER (for future AJAX) ==========
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(cookie => {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            }
        });
    }
    return cookieValue;
}