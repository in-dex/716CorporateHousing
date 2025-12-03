// Reviews and testimonials functionality
export function initializeReviews() {
    loadReviewsFromManager();
    updateMainPageMetrics();
    setupPublicReviewForm();
    setupReviewAutoRefresh();
}

// Static reviews data
const staticReviews = [
    {
        name: "Sarah J.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        rating: 5,
        text: "Perfect accommodation for my 3-month assignment in Buffalo. Everything was clean, modern, and exactly as pictured. The location was convenient and the management was responsive to all my requests.",
        date: "2 weeks ago",
        source: "airbnb",
        profession: "Travel Nurse"
    },
    // ... include all your static reviews
];

// Load Reviews from Review Manager
export function loadReviewsFromManager() {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;
    
    // Get settings and reviews from localStorage
    const settings = JSON.parse(localStorage.getItem('reviewSettings')) || {
        curation: { enabled: false, approvedReviews: [] },
        maxDisplay: 6,
        showGoogle: true,
        showManual: true
    };
    
    const googleReviews = JSON.parse(localStorage.getItem('googleReviews')) || [];
    const manualTestimonials = JSON.parse(localStorage.getItem('manualTestimonials')) || [];
    
    let displayReviews = [];
    
    if (settings.curation && settings.curation.enabled) {
        // CURATION MODE: Only show approved reviews
        console.log('Curation mode: Showing only approved reviews');
        const approvedIds = settings.curation.approvedReviews || [];
        
        // Combine all reviews and filter by approved IDs
        const allReviews = [...googleReviews, ...manualTestimonials];
        displayReviews = allReviews
            .filter(review => approvedIds.includes(review.id))
            .sort((a, b) => {
                const dateA = a.time || new Date(a.date).getTime();
                const dateB = b.time || new Date(b.date).getTime();
                return dateB - dateA;
            })
            .slice(0, settings.maxDisplay || 6);
            
        console.log(`Found ${approvedIds.length} approved reviews, ${displayReviews.length} after filtering`);
        
    } else {
        // NORMAL MODE: Show all reviews based on settings
        console.log('Normal mode: Showing all reviews based on settings');
        
        if (settings.showGoogle) {
            displayReviews.push(...googleReviews);
        }
        
        if (settings.showManual) {
            displayReviews.push(...manualTestimonials);
        }
        
        // Sort by date (newest first) and limit
        displayReviews = displayReviews
            .sort((a, b) => {
                const dateA = a.time || new Date(a.date).getTime();
                const dateB = b.time || new Date(b.date).getTime();
                return dateB - dateA;
            })
            .slice(0, settings.maxDisplay || 6);
    }

    // If no reviews, show placeholder
    if (displayReviews.length === 0) {
        reviewsContainer.innerHTML = `
            <div class="no-reviews-message" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 4rem; color: var(--light-gray); margin-bottom: 20px;">
                    <i class="fas fa-comments"></i>
                </div>
                <h3 style="color: var(--dark); margin-bottom: 15px; font-size: 1.5rem;">
                    ${settings.curation && settings.curation.enabled ? 'No Approved Reviews Yet' : 'No Reviews Yet'}
                </h3>
                <p style="color: var(--text-gray); margin-bottom: 25px; font-size: 1.1rem;">
                    ${settings.curation && settings.curation.enabled 
                        ? 'No reviews have been approved for display yet. Go to Review Management to approve some reviews!' 
                        : 'Be the first to share your experience with 716 Corporate Housing!'}
                </p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <a href="review-management.html" class="btn btn-accent" style="font-size: 1.1rem; padding: 12px 30px;">
                        <i class="fas fa-cog"></i> Manage Reviews
                    </a>
                    ${!(settings.curation && settings.curation.enabled) ? `
                    <a href="review-management.html" class="btn" style="font-size: 1.1rem; padding: 12px 30px;">
                        <i class="fas fa-star"></i> Share Your Experience
                    </a>
                    ` : ''}
                </div>
            </div>
        `;
        return;
    }

    // Create review cards
    reviewsContainer.innerHTML = displayReviews.map((review, index) => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const sourceIcon = review.source === 'google' ? 'fab fa-google' : 'fas fa-user';
        const reviewDate = review.relative_time_description || 
                          new Date(review.time || review.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                          });
        
        const avatarUrl = review.profile_photo_url || 
                         review.avatar || 
                         `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name || review.name)}&background=daa520&color=fff&size=100`;

        return `
            <div class="review-card fade-in" style="animation-delay: ${index * 0.1}s">
                <div class="review-header">
                    <div class="review-avatar">
                        <img src="${avatarUrl}" alt="${review.author_name || review.name}" loading="lazy">
                    </div>
                    <div class="review-info">
                        <div class="review-name">${review.author_name || review.name}</div>
                        ${review.profession ? `<div class="review-profession">${review.profession}</div>` : ''}
                        <div class="review-date">${reviewDate}</div>
                    </div>
                </div>
                <div class="review-stars">${stars}</div>
                <p>${review.text}</p>
                <div class="review-source">
                    <i class="${sourceIcon}"></i>
                    <span class="source-text">${review.source === 'google' ? 'Google Review' : 'Testimonial'}</span>
                    ${settings.curation && settings.curation.enabled ? '<span class="approved-badge">✓ Approved</span>' : ''}
                </div>
            </div>
        `;
    }).join('');

    // Trigger animations
    setTimeout(() => {
        document.querySelectorAll('.review-card').forEach((card, index) => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }, 100);
}

// Update metrics on main page
export function updateMainPageMetrics() {
    const settings = JSON.parse(localStorage.getItem('reviewSettings')) || {
        curation: { enabled: false, approvedReviews: [] }
    };
    
    const googleReviews = JSON.parse(localStorage.getItem('googleReviews')) || [];
    const manualTestimonials = JSON.parse(localStorage.getItem('manualTestimonials')) || [];
    
    let allReviews = [];
    let totalReviews = 0;
    let averageRating = '4.9'; // Fallback
    
    if (settings.curation && settings.curation.enabled) {
        // In curation mode, only count approved reviews
        const approvedIds = settings.curation.approvedReviews || [];
        allReviews = [...googleReviews, ...manualTestimonials]
            .filter(review => approvedIds.includes(review.id));
    } else {
        // In normal mode, count all reviews based on settings
        if (settings.showGoogle !== false) {
            allReviews.push(...googleReviews);
        }
        if (settings.showManual !== false) {
            allReviews.push(...manualTestimonials);
        }
    }
    
    totalReviews = allReviews.length;
    
    // Calculate average rating
    if (totalReviews > 0) {
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = (totalRating / totalReviews).toFixed(1);
    }
    
    // Update metrics section
    const metricsSection = document.querySelector('.metrics');
    if (metricsSection) {
        const ratingElement = metricsSection.querySelector('.metric-item:nth-child(3) .metric-value');
        const reviewsElement = metricsSection.querySelector('.metric-item:first-child .metric-value');
        
        if (ratingElement) {
            ratingElement.textContent = averageRating + '★';
            // Add tooltip for curation mode
            if (settings.curation && settings.curation.enabled) {
                ratingElement.title = `Based on ${totalReviews} approved reviews`;
            }
        }
        if (reviewsElement) {
            reviewsElement.textContent = totalReviews + '+';
            // Add tooltip for curation mode
            if (settings.curation && settings.curation.enabled) {
                reviewsElement.title = `${totalReviews} approved reviews`;
            }
        }
    }
    
    console.log(`Metrics updated: ${totalReviews} reviews, ${averageRating} avg rating`);
}

// Setup public review form
export function setupPublicReviewForm() {
    const reviewFormContainer = document.getElementById('public-review-form');
    if (!reviewFormContainer) return;
    
    reviewFormContainer.innerHTML = `
        <div class="review-submission-form">
            <h3>Share Your Experience</h3>
            <form id="public-testimonial-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="public-name">Your Name *</label>
                        <input type="text" id="public-name" required>
                    </div>
                    <div class="form-group">
                        <label for="public-profession">Your Profession</label>
                        <input type="text" id="public-profession" placeholder="e.g., Travel Nurse, Business Consultant">
                    </div>
                </div>
                <div class="form-group">
                    <label>Your Rating *</label>
                    <div class="star-rating">
                        ${[5,4,3,2,1].map(rating => `
                            <input type="radio" id="public-rating-${rating}" name="public-rating" value="${rating}" ${rating === 5 ? 'checked' : ''}>
                            <label for="public-rating-${rating}" title="${rating} stars">★</label>
                        `).join('')}
                    </div>
                </div>
                <div class="form-group">
                    <label for="public-text">Your Review *</label>
                    <textarea id="public-text" placeholder="Tell us about your experience..." required></textarea>
                </div>
                <button type="submit" class="btn">Submit Review</button>
            </form>
        </div>
    `;
    
    // Add form submission handler
    document.getElementById('public-testimonial-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitPublicReview();
    });
}

// Auto-refresh reviews when page becomes visible
export function setupReviewAutoRefresh() {
    // Refresh reviews when page becomes visible (user returns to tab)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // Page is visible again, refresh reviews
            loadReviewsFromManager();
            updateMainPageMetrics();
        }
    });
    
    // Also refresh every 5 minutes while page is open
    setInterval(() => {
        loadReviewsFromManager();
        updateMainPageMetrics();
    }, 5 * 60 * 1000); // 5 minutes
}

// Submit Public Review
function submitPublicReview() {
    const name = document.getElementById('public-name').value;
    const profession = document.getElementById('public-profession').value;
    const rating = parseInt(document.querySelector('input[name="public-rating"]:checked').value);
    const text = document.getElementById('public-text').value;
    
    // Generate avatar based on name
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=daa520&color=fff&size=100`;
    
    // Use the testimonial manager to save
    if (window.testimonialManager) {
        window.testimonialManager.saveTestimonial(name, profession, rating, text, avatarUrl);
    }
    
    // Show success message
    alert('Thank you for your review! It has been submitted successfully.');
}