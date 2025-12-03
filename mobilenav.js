// Fixed Navigation with Proper Highlighting
class FixedNavigation {
    constructor() {
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.mobileNavClose = document.getElementById('mobile-nav-close');
        this.mobileNav = document.getElementById('mobile-nav');
        this.mobileOverlay = document.getElementById('mobile-overlay');
        this.body = document.body;
        
        // Get all section links
        this.desktopSectionLinks = document.querySelectorAll('.desktop-nav.section-nav a[data-section]');
        this.mobileSectionLinks = document.querySelectorAll('.mobile-nav-links.section-nav-links a[data-section]');
        this.allSectionLinks = document.querySelectorAll('a[href^="#"]');
        
        // Sections on the page
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupScrollSpy();
        this.fixMobileNavLayout();
        console.log('Fixed Navigation initialized');
    }
    
    fixMobileNavLayout() {
        // Force mobile nav to have proper vertical layout
        const style = document.createElement('style');
        style.textContent = `
            /* Override any horizontal layout */
            .mobile-nav-links {
                flex-direction: column !important;
                display: flex !important;
            }
            
            .mobile-nav-links li {
                width: 100% !important;
                display: block !important;
                margin-bottom: 0.5rem !important;
            }
            
            .mobile-nav-links a {
                display: block !important;
                width: 100% !important;
                text-align: left !important;
                box-sizing: border-box !important;
            }
            
            /* Fix mobile nav content */
            .mobile-nav-content {
                display: flex;
                flex-direction: column;
                flex: 1;
                overflow-y: auto;
                width: 100%;
            }
            
            .mobile-nav-section {
                width: 100% !important;
                margin-bottom: 2rem !important;
                display: block !important;
            }
            
            .mobile-nav-section:last-child {
                margin-bottom: 0 !important;
            }
            
            /* Ensure mobile menu button is always visible */
            .mobile-menu {
                display: flex !important;
            }
            
            /* Hide desktop nav on mobile */
            @media (max-width: 1024px) {
                .desktop-nav.section-nav {
                    display: none !important;
                }
            }
            
            /* Show both on desktop */
            @media (min-width: 1025px) {
                .desktop-nav.section-nav {
                    display: flex !important;
                }
                .mobile-menu {
                    display: flex !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    bindEvents() {
        // Mobile Menu Toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openMobileMenu();
            });
        }
        
        // Close Mobile Menu
        if (this.mobileNavClose) {
            this.mobileNavClose.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
        
        // Close menu when clicking overlay
        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
        
        // Handle mobile navigation link clicks
        const mobileLinks = this.mobileNav ? this.mobileNav.querySelectorAll('a') : [];
        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Close mobile menu
                this.closeMobileMenu();
                
                // Handle anchor links with smooth scrolling
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    setTimeout(() => {
                        this.scrollToSection(href);
                    }, 400);
                }
            });
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileNav && this.mobileNav.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
        
        // Smooth scrolling for all anchor links
        this.allSectionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });
        
        // Handle review buttons separately
        document.querySelectorAll('.review-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Open testimonial modal
                const testimonialModal = document.getElementById('testimonial-modal');
                if (testimonialModal) {
                    testimonialModal.style.display = 'block';
                }
                this.closeMobileMenu();
            });
        });
    }
    
    openMobileMenu() {
        if (this.mobileNav && this.mobileOverlay) {
            this.mobileNav.classList.add('active');
            this.mobileOverlay.classList.add('active');
            this.body.classList.add('menu-open');
            
            // Prevent background scrolling
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeMobileMenu() {
        if (this.mobileNav && this.mobileOverlay) {
            this.mobileNav.classList.remove('active');
            this.mobileOverlay.classList.remove('active');
            this.body.classList.remove('menu-open');
            
            // Restore scrolling
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }
    }
    
    scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    setupScrollSpy() {
        // Set initial active state
        this.updateActiveNavLinks();
        
        // Update on scroll with debounce for better performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.updateActiveNavLinks();
            }, 100);
        });
    }
    
    updateActiveNavLinks() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        
        // Find current section
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        console.log('Current section:', currentSection); // Debug log
        
        // Update desktop section links
        this.desktopSectionLinks.forEach(link => {
            const section = link.getAttribute('data-section');
            const href = link.getAttribute('href');
            
            // Remove active class from all
            link.classList.remove('active');
            
            // Add active class if it's the current section
            if (href === `#${currentSection}`) {
                link.classList.add('active');
                console.log('Activating desktop link:', section); // Debug log
            }
        });
        
        // Update mobile section links
        this.mobileSectionLinks.forEach(link => {
            const section = link.getAttribute('data-section');
            const href = link.getAttribute('href');
            
            // Remove active class from all
            link.classList.remove('active');
            
            // Add active class if it's the current section
            if (href === `#${currentSection}`) {
                link.classList.add('active');
                console.log('Activating mobile link:', section); // Debug log
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const fixedNav = new FixedNavigation();
    
    // Override any existing mobile menu toggle in script.js
    const oldMobileMenu = document.querySelector('.mobile-menu');
    if (oldMobileMenu) {
        oldMobileMenu.onclick = null; // Remove old handler
    }
    
    // Make sure review buttons work
    document.querySelectorAll('.review-btn').forEach(btn => {
        btn.onclick = null; // Remove any old handlers
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const testimonialModal = document.getElementById('testimonial-modal');
            if (testimonialModal) {
                testimonialModal.style.display = 'block';
            }
        });
    });
});