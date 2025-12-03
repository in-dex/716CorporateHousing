// Utility functions used across the application
export function checkScroll() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            el.classList.add('visible');
        }
    });
}

export function setupSmoothScrolling() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form submission handler
export function setupFormSubmission() {
    const form = document.getElementById('relocation-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real implementation, this would send the form data to your backend/email
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        console.log('Relocation form submitted:', formObject);
        alert('Thank you for your relocation request! We will contact you shortly to discuss housing options.');
        this.reset();
    });
}

// Floating text widget
export function setupFloatingText() {
    const floatingText = document.querySelector('.floating-text');
    if (floatingText) {
        floatingText.addEventListener('click', function() {
            window.open('https://myopenphone.com', '_blank');
        });
    }
}