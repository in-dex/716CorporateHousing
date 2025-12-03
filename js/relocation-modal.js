// Relocation Form Modal Functionality
const relocationModal = document.getElementById('relocation-modal');
const relocationModalClose = document.getElementById('relocation-modal-close');
const requestHomeButtons = document.querySelectorAll('a[href="#intake-form"], .request-home-btn');

// Function to open relocation modal
function openRelocationModal() {
    if (relocationModal) {
        relocationModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        document.documentElement.style.overflow = 'hidden';
        
        // Add keyboard escape listener
        document.addEventListener('keydown', handleEscapeKey);
        
        // Focus on close button for accessibility
        setTimeout(() => {
            relocationModalClose.focus();
        }, 100);
    }
}

// Function to close relocation modal
function closeRelocationModal() {
    if (relocationModal) {
        relocationModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        document.documentElement.style.overflow = 'auto';
        
        // Remove keyboard escape listener
        document.removeEventListener('keydown', handleEscapeKey);
    }
}

// Handle escape key press
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        closeRelocationModal();
    }
}

// Add click event listeners to all "Request a Home" buttons
requestHomeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor behavior
        e.stopPropagation(); // Stop event bubbling
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-nav');
        const mobileOverlay = document.getElementById('mobile-overlay');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (mobileOverlay) {
                mobileOverlay.classList.remove('active');
            }
        }
        
        openRelocationModal();
    });
});

// Close modal when close button is clicked
if (relocationModalClose) {
    relocationModalClose.addEventListener('click', closeRelocationModal);
}

// Close modal when clicking outside the modal content
if (relocationModal) {
    relocationModal.addEventListener('click', function(e) {
        if (e.target === relocationModal) {
            closeRelocationModal();
        }
    });
}