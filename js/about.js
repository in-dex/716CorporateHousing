// About Us Page JavaScript - UPDATED VERSION

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize counter animations
    initCounters();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize team card hover effects
    initTeamCards();
});

// Animation initialization
function initAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Start counters when the numbers section becomes visible
                if (entry.target.classList.contains('numbers-section')) {
                    startCounters();
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .numbers-section').forEach(el => {
        observer.observe(el);
    });
}

// Counter animations - FIXED VERSION
let countersStarted = false;

function initCounters() {
    // Store the startCounters function globally so it can be called from observer
    window.startCounters = function() {
        if (countersStarted) return;
        countersStarted = true;

        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            // Reset to 0 if it's showing 17 (initial value)
            if (counter.textContent === '17') {
                counter.textContent = '0';
            }
            
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100; // Changed to 100 steps for smoother animation
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    // Use Math.ceil to ensure we reach the target exactly
                    if (current + increment >= target) {
                        current = target;
                    }
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 20); // Increased delay for smoother animation
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    };

    // Alternative: Start counters on scroll if they're in view
    window.addEventListener('scroll', function() {
        const numbersSection = document.querySelector('.numbers-section');
        if (numbersSection && !countersStarted) {
            const rect = numbersSection.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (isInView) {
                startCounters();
            }
        }
    });

    // Also start counters after a small delay as fallback
    setTimeout(() => {
        const numbersSection = document.querySelector('.numbers-section');
        if (numbersSection && isElementInViewport(numbersSection) && !countersStarted) {
            startCounters();
        }
    }, 1000);
}

// Check if element is in viewport - IMPROVED VERSION
function isElementInViewport(el) {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    // Check if element is at least 50% visible
    return (
        rect.top <= windowHeight * 0.75 && // Start animation when 75% from top
        rect.bottom >= windowHeight * 0.25 && // And 25% from bottom
        rect.left <= windowWidth &&
        rect.right >= 0
    );
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Team Card Hover Effects
function initTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-soft)';
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add CSS for counter animation
const counterStyles = `
    .counter {
        display: inline-block;
        transition: all 0.3s ease;
    }
    
    .number-value {
        min-height: 3.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    @keyframes counterIncrement {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .counter.animating {
        animation: counterIncrement 0.5s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in.visible {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .slide-in-left.visible {
        animation: slideInLeft 0.6s ease forwards;
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .slide-in-right.visible {
        animation: slideInRight 0.6s ease forwards;
    }
`;

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = counterStyles;
document.head.appendChild(styleSheet);

// Initialize timeline animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                entry.target.style.animationDelay = `${entry.target.dataset.delay || '0s'}`;
            }
        });
    }, { 
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    timelineItems.forEach((item, index) => {
        item.dataset.delay = `${index * 0.2}s`;
        timelineObserver.observe(item);
    });
}

// Call timeline animation initialization
initTimelineAnimation();

// Also initialize counters when DOM is fully loaded as fallback
window.addEventListener('load', function() {
    const numbersSection = document.querySelector('.numbers-section');
    if (numbersSection && isElementInViewport(numbersSection)) {
        setTimeout(() => {
            if (window.startCounters && !countersStarted) {
                window.startCounters();
            }
        }, 500);
    }
});

// Add a manual trigger for testing (optional)
function manualTriggerCounters() {
    if (window.startCounters && !countersStarted) {
        window.startCounters();
    }
}

// Expose for testing if needed
window.manualTriggerCounters = manualTriggerCounters;