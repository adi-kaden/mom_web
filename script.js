/**
 * ANTIQUA GALLERY - Interactive Features
 * Luxury Ancient Art E-Commerce Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initFilterSystem();
    initProductModal();
    initContactForm();
    initSmoothScroll();
});

/**
 * Navigation Module
 * Handles mobile menu toggle and scroll behavior
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Scroll Effects Module
 * Intersection Observer for scroll animations
 */
function initScrollEffects() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.product-card, .feature, .stat').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Filter System Module
 * Category filtering for product grid
 */
function initFilterSystem() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Get filter value
            const filter = this.dataset.filter;

            // Filter products with animation
            products.forEach((product, index) => {
                const category = product.dataset.category;

                if (filter === 'all' || category === filter) {
                    product.style.opacity = '0';
                    product.style.transform = 'scale(0.95)';
                    product.classList.remove('hidden');

                    setTimeout(() => {
                        product.style.opacity = '1';
                        product.style.transform = 'scale(1)';
                    }, index * 50);
                } else {
                    product.style.opacity = '0';
                    product.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        product.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

/**
 * Product Modal Module
 * Quick view functionality for products
 */
function initProductModal() {
    const modal = document.getElementById('productModal');
    const modalClose = modal.querySelector('.modal-close');
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const viewButton = card.querySelector('.btn-secondary');

        viewButton.addEventListener('click', function(e) {
            e.preventDefault();

            // Get product data
            const image = card.querySelector('.product-image img');
            const category = card.querySelector('.product-category');
            const name = card.querySelector('.product-name');
            const origin = card.querySelector('.product-origin');

            // Populate modal
            document.getElementById('modalImage').src = image.src;
            document.getElementById('modalImage').alt = image.alt;
            document.getElementById('modalCategory').textContent = category.textContent;
            document.getElementById('modalName').textContent = name.textContent;
            document.getElementById('modalOrigin').textContent = origin.textContent;

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Modal button handlers
    const modalButtons = modal.querySelectorAll('.modal-actions .btn');
    modalButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Scroll to contact section
            closeModal();
            setTimeout(() => {
                document.getElementById('contact').scrollIntoView({
                    behavior: 'smooth'
                });
            }, 300);
        });
    });
}

/**
 * Contact Form Module
 * Form validation and submission handling
 */
function initContactForm() {
    const form = document.querySelector('.contact-form');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Basic validation
        let isValid = true;
        const required = ['name', 'email', 'message'];

        required.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (!data[field] || data[field].trim() === '') {
                isValid = false;
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '';
            }
        });

        // Email validation
        const emailInput = form.querySelector('[name="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            isValid = false;
            emailInput.style.borderColor = '#e74c3c';
        }

        if (isValid) {
            // Show success message (in a real app, this would submit to a server)
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.backgroundColor = '#27ae60';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
                form.reset();
            }, 3000);
        }
    });

    // Clear error styling on input
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    });
}

/**
 * Smooth Scroll Module
 * Enhanced smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Utility: Debounce function
 * Limits how often a function can fire
 */
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Image lazy loading enhancement
 * Uses native lazy loading with fallback
 */
document.querySelectorAll('.product-image img').forEach(img => {
    img.loading = 'lazy';
});

/**
 * Keyboard accessibility enhancements
 */
document.querySelectorAll('.product-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');

    card.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const viewButton = this.querySelector('.btn-secondary');
            if (viewButton) viewButton.click();
        }
    });
});

/**
 * Touch device detection
 * Adjusts hover effects for touch devices
 */
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');

    // Add touch-specific styles
    const style = document.createElement('style');
    style.textContent = `
        .touch-device .product-overlay {
            opacity: 0;
        }
        .touch-device .product-card:active .product-overlay {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}
