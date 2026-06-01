// main.js - Complete Portfolio Functionality

// Wait for DOM to fully load
// document.addEventListener('DOMContentLoaded', function() {
    
//     // ========== 1. NAVIGATION BAR SCROLL EFFECT ==========

    document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('navbar');

    if (!navbar) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });


    // ========== 2. ACTIVE NAVIGATION LINK HIGHLIGHTING ==========
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.right-bar li a');
    
    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === current) {
                link.classList.add('active');
            }
        });
    }
    
    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink(); // Call on load
    }
    
    // ========== 3. SMOOTH SCROLLING FOR NAVIGATION ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========== 4. SKILLS SECTION ANIMATION (PROGRESS BARS) ==========
    const progressBars = document.querySelectorAll('.progress-fill, .bar');
    
    if (progressBars.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // For new progress bar structure
                    if (entry.target.classList.contains('progress-fill')) {
                        const width = entry.target.style.width;
                        entry.target.style.width = '0%';
                        setTimeout(() => {
                            entry.target.style.width = width;
                        }, 200);
                    }
                    
                    // For old bar structure
                    if (entry.target.classList.contains('bar')) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    // ========== 5. SKILLS CONTAINER FADE IN ==========
    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer) {
        const containerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    containerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        containerObserver.observe(skillsContainer);
    }
    
    // ========== 6. TYPING ANIMATION FOR HOME SECTION ==========
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
                setTimeout(typeWriter, 100);
            }
        }
        typeWriter();
    }
    
    // ========== 7. FORM SUBMISSION HANDLER ==========
    const contactForm = document.getElementById('contactform');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[name="name"]')?.value;
            const email = this.querySelector('input[placeholder*="Email"]')?.value;
            const phone = this.querySelector('input[placeholder*="Phone"]')?.value;
            const message = this.querySelector('textarea')?.value;
            
            // Basic validation
            if (!name || !email) {
                showNotification('Please fill in all required fields!', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address!', 'error');
                return;
            }
            
            // Show success message
            showNotification('Message sent successfully! I will contact you soon.', 'success');
            this.reset();
            
            // You can add AJAX to send form data to server here
            /*
            fetch('/contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({name, email, phone, message})
            })
            .then(response => response.json())
            .then(data => {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            })
            .catch(error => {
                showNotification('Error sending message. Please try again.', 'error');
            });
            */
        });
    }
    
    // ========== 8. NOTIFICATION SYSTEM ==========
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
        `;
        closeBtn.onclick = () => notification.remove();
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification) notification.remove();
        }, 5000);
    }
    
    // ========== 9. SCROLL TO TOP BUTTON ==========
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.id = 'scrollToTop';
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
    
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'scale(1)';
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // ========== 10. PROJECT CARD HOVER EFFECT ==========
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ========== 11. IMAGE LOADING ERROR HANDLER ==========
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
            this.src = 'https://via.placeholder.com/400x400/1a1f2e/6c63ff?text=Image+Not+Found';
        });
    });
    
    // ========== 12. RESUME BUTTON TRACKING ==========
    const resumeBtn = document.querySelector('.btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function() {
            console.log('Resume downloaded');
            // You can add analytics tracking here
        });
    }
    
    // ========== 13. ADD CSS FOR NOTIFICATION ANIMATION ==========
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .right-bar li a.active {
            color: #6c63ff !important;
        }
        
        .right-bar li a.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
    
    // ========== 14. LAZY LOADING FOR IMAGES ==========
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ========== 15. CONSOLE LOG WELCOME MESSAGE ==========
    console.log('%c🚀 Portfolio Website Loaded Successfully!', 'color: #6c63ff; font-size: 16px; font-weight: bold;');
    console.log('%c👋 Welcome to Kusmanjali Manthale\'s Portfolio', 'color: #a855f7; font-size: 14px;');
    
});

// ========== HELPER FUNCTION: Get CSRF Token for Django ==========
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ========== PREVENT RIGHT CLICK ON IMAGES (Optional) ==========
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
});
