// Testimonials management functionality
export function initializeTestimonials() {
    setupTestimonialModal();
    
    // Initialize testimonial manager
    window.testimonialManager = new TestimonialManager();
}

// Testimonial Management Class
class TestimonialManager {
    constructor() {
        this.testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
        this.init();
    }
    
    init() {
        this.setupForm();
        this.loadAdminTestimonials();
    }
    
    setupForm() {
        const form = document.getElementById('testimonial-form');
        if (!form) return; // Only setup if form exists
        
        const photoInput = document.getElementById('testimonial-photo');
        const photoPreview = document.getElementById('photo-preview');
        
        if (photoInput) {
            photoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTestimonial();
        });
    }
    
    addTestimonial() {
        const name = document.getElementById('testimonial-name').value;
        const profession = document.getElementById('testimonial-profession').value;
        const rating = parseInt(document.getElementById('testimonial-rating').value);
        const text = document.getElementById('testimonial-text').value;
        const photoInput = document.getElementById('testimonial-photo');
        
        let photoUrl = '';
        if (photoInput && photoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoUrl = e.target.result;
                this.saveTestimonial(name, profession, rating, text, photoUrl);
            };
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            photoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=daa520&color=fff`;
            this.saveTestimonial(name, profession, rating, text, photoUrl);
        }
    }
    
    saveTestimonial(name, profession, rating, text, photoUrl) {
        const testimonial = {
            id: Date.now(),
            name,
            profession,
            rating,
            text,
            avatar: photoUrl,
            date: this.formatDate(new Date()), // Use formatted date
            source: 'website'
        };
        
        this.testimonials.unshift(testimonial);
        localStorage.setItem('testimonials', JSON.stringify(this.testimonials));
        this.loadAdminTestimonials();
        
        // Reset form if it exists
        const form = document.getElementById('testimonial-form');
        if (form) {
            form.reset();
            const photoPreview = document.getElementById('photo-preview');
            if (photoPreview) photoPreview.innerHTML = '';
        }
        
        // Reload public testimonials
        if (typeof loadReviewsFromManager === 'function') {
            loadReviewsFromManager();
        }
    }

    // Date formatting method
    formatDate(date) {
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays/7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays/30)} months ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
        });
    }
    
    loadAdminTestimonials() {
        const container = document.getElementById('admin-testimonials-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.testimonials.forEach(testimonial => {
            const card = document.createElement('div');
            card.className = 'admin-testimonial-card';
            card.innerHTML = `
                <h4>${testimonial.name} ${testimonial.profession ? `- ${testimonial.profession}` : ''}</h4>
                <div class="review-stars">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5-testimonial.rating)}</div>
                <p>${testimonial.text}</p>
                <div class="admin-actions">
                    <button onclick="testimonialManager.deleteTestimonial(${testimonial.id})" class="btn-danger">
                        Delete
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }
    
    deleteTestimonial(id) {
        this.testimonials = this.testimonials.filter(t => t.id !== id);
        localStorage.setItem('testimonials', JSON.stringify(this.testimonials));
        this.loadAdminTestimonials();
        
        if (typeof loadReviewsFromManager === 'function') {
            loadReviewsFromManager();
        }
    }
    
    getTestimonials() {
        return this.testimonials;
    }
}

// Testimonial Modal Functionality
function setupTestimonialModal() {
    const modal = document.getElementById('testimonial-modal');
    if (!modal) return;
    
    const modalBody = document.querySelector('.modal-body');
    const openButtons = document.querySelectorAll('.review-btn');
    const closeButton = document.getElementById('testimonial-modal-close');
    
    // Move the existing testimonial form into the modal
    const existingForm = document.getElementById('testimonial-form');
    if (existingForm && modalBody) {
        // Clone the form to keep the original for admin use
        const formClone = existingForm.cloneNode(true);
        formClone.id = 'modal-testimonial-form';
        modalBody.appendChild(formClone);
        
        // Remove file upload for public use (optional)
        const fileInput = formClone.querySelector('#testimonial-photo');
        if (fileInput) {
            fileInput.remove();
            const fileLabel = formClone.querySelector('label[for="testimonial-photo"]');
            if (fileLabel) fileLabel.remove();
        }
        
        // Update button text
        const submitBtn = formClone.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Submit Review';
            submitBtn.className = 'btn btn-primary';
        }
        
        // Add cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.marginRight = '10px';
        submitBtn.parentNode.insertBefore(cancelBtn, submitBtn);
    }
    
    // Open modal
    openButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
    }
    
    closeButton.addEventListener('click', closeModal);
    
    // Cancel button
    const cancelBtn = document.querySelector('.btn-secondary');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Form submission
    const modalForm = document.getElementById('modal-testimonial-form');
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitModalTestimonial();
        });
    }
}

// Submit testimonial from modal
function submitModalTestimonial() {
    const form = document.getElementById('modal-testimonial-form');
    const name = form.querySelector('#testimonial-name').value.trim();
    const profession = form.querySelector('#testimonial-profession').value.trim();
    const rating = parseInt(form.querySelector('#testimonial-rating').value);
    const text = form.querySelector('#testimonial-text').value.trim();
    
    if (!name || !text) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Generate avatar based on name
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=daa520&color=fff&size=100`;
    
    // Use the existing testimonial manager to save
    window.testimonialManager.saveTestimonial(name, profession, rating, text, avatarUrl);
    
    // Show success message
    showTestimonialSuccess();
}

// Show success message
function showTestimonialSuccess() {
    const form = document.getElementById('modal-testimonial-form');
    const modalBody = document.querySelector('.modal-body');
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'testimonial-success';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Thank You for Your Review!</h3>
        <p>Your feedback has been submitted successfully. We appreciate you taking the time to share your experience with us.</p>
        <button class="btn btn-primary" id="close-success">Close</button>
    `;
    
    // Hide form and show success
    form.style.display = 'none';
    modalBody.appendChild(successDiv);
    
    // Add event listener to close button
    document.getElementById('close-success').addEventListener('click', function() {
        document.getElementById('testimonial-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset for next time
        form.style.display = 'block';
        successDiv.remove();
        resetForm();
    });
}

// Reset form
function resetForm() {
    const form = document.getElementById('modal-testimonial-form');
    if (form) {
        form.reset();
        // Reset rating to 5 stars
        const ratingSelect = form.querySelector('#testimonial-rating');
        if (ratingSelect) ratingSelect.value = '5';
    }
}

// Make functions available globally for HTML onclick attributes
window.submitModalTestimonial = submitModalTestimonial;
window.showTestimonialSuccess = showTestimonialSuccess;
window.resetForm = resetForm;

