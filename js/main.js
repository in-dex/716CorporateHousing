// Main initialization file
import { initializeNavigation } from './navigation.js';
import { initializeProperties, loadManagedProperties, applyFilters, syncProperties } from './properties.js';
import { initializeReviews, loadReviewsFromManager, updateMainPageMetrics } from './reviews.js';
import { initializeChat } from './chat.js';
import { initializeTestimonials } from './testimonials.js';
import { checkScroll, setupSmoothScrolling } from './utils.js';

// Global variables - PROPERLY INITIALIZE
window.properties = [];
window.currentFilters = {
    status: 'all',
    location: 'all',
    price: 'all',
    bedrooms: 'all',
    guests: '2'
};
window.userLocation = null;
window.isInitialLoad = true;

// Make functions available globally
window.refreshProperties = syncProperties;
window.debugStorage = debugStorage;
window.openPropertyModal = openPropertyModal;
window.playVideo = playVideo;
window.closeVideoModal = closeVideoModal;
window.removeFilter = removeFilter;
window.resetFilters = resetFilters;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing 716 Corporate Housing...');
    
    // Initialize all modules
    initializeNavigation();
    initializeProperties();
    initializeReviews();
    initializeChat();
    initializeTestimonials();
    setupSmoothScrolling();
    
    // Set up scroll animations
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check
    
    // Set up header background on scroll
    setupHeaderScroll();
    
    console.log('✅ All systems initialized!');
});

// Header scroll effect
function setupHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Global debug function
function debugStorage() {
    console.log('=== STORAGE DEBUG ===');
    console.log('LocalStorage keys:', Object.keys(localStorage));
    
    const mainStorage = JSON.parse(localStorage.getItem('properties') || '[]');
    const managedStorage = JSON.parse(localStorage.getItem('managedProperties') || '[]');
    
    console.log('Main storage properties:', mainStorage.length);
    console.log('Managed storage properties:', managedStorage.length);
    console.log('Current properties array:', window.properties.length);
    console.log('========================');
}