// Navigation and mobile menu functionality
export function initializeNavigation() {
    setupMobileNavigation();
    setupSmoothScrolling();
}

function setupMobileNavigation() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    
    if (!mobileMenu || !mobileNavClose) return;
    
    // Open mobile menu
    mobileMenu.addEventListener('click', () => {
        console.log('Opening mobile menu');
        openMobileMenu();
    });
    
    // Close mobile menu
    mobileNavClose.addEventListener('click', () => {
        console.log('Closing mobile menu');
        closeMobileMenu();
    });
    
    // Close menu when clicking overlay
    mobileNavOverlay.addEventListener('click', () => {
        console.log('Overlay clicked - closing menu');
        closeMobileMenu();
    });
    
    // Close menu when clicking on mobile navigation links
    const mobileNavLinks = mobileNavMenu?.querySelectorAll('a');
    mobileNavLinks?.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('Mobile nav link clicked');
            closeMobileMenu();
            
            // Handle smooth scrolling for anchor links
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                setTimeout(() => {
                    smoothScrollTo(href);
                }, 400);
            }
        });
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavMenu?.classList.contains('active')) {
            console.log('Escape key pressed - closing menu');
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && mobileNavMenu?.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    
    mobileNavMenu?.classList.add('active');
    mobileNavOverlay?.classList.add('active');
    document.body.classList.add('menu-open');
    
    // Prevent background scrolling
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    
    mobileNavMenu?.classList.remove('active');
    mobileNavOverlay?.classList.remove('active');
    document.body.classList.remove('menu-open');
    
    // Restore scrolling
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
}

function smoothScrollTo(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}