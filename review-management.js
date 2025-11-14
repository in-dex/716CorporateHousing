// Review Management System

class ReviewManager {
   constructor() {
    this.googleReviews = [];
    this.manualTestimonials = JSON.parse(localStorage.getItem('manualTestimonials')) || [];
     this.reviewSettings = JSON.parse(localStorage.getItem('reviewSettings')) || {
        maxDisplay: 6,
        autoSync: 'disabled',
        showGoogle: true,
        showManual: true,
        curation: {
            enabled: false,
            minRating: 4,
            maxAgeDays: 365,
            approvedReviews: JSON.parse(localStorage.getItem('approvedReviews')) || [],
            hideApproved: false, // NEW: Hide approved in management
            autoHideAfterApprove: false // NEW: Auto-hide after approval
        }
    };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupIndividualButtonEvents();
        this.loadGoogleReviews();
        this.loadManualTestimonials();
        this.updateStats();
        this.loadSettings();
    }
    
    setupEventListeners() {
    // Safe event listener setup with null checks
    const safeAddListener = (id, event, handler) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, handler);
        } else {
            console.warn(`Element with id '${id}' not found for event listener`);
        }
    };

    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.getAttribute('data-tab');
            this.switchTab(tab);
        });
    });
    
    // Google API connection
    safeAddListener('connect-google', 'click', () => {
        this.connectGoogleAPI();
    });
    
    // Sync reviews
    safeAddListener('sync-reviews', 'click', () => {
        this.syncGoogleReviews();
    });
    
    // Manual testimonial form
    const manualForm = document.getElementById('manual-testimonial-form');
    if (manualForm) {
        manualForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addManualTestimonial();
        });
    }
    
    // Settings
    safeAddListener('save-settings', 'click', () => {
        this.saveSettings();
    });

    // Business search
    safeAddListener('search-business', 'click', () => {
        this.findPlaceId();
    });

    // Open Place ID Finder
    safeAddListener('open-placeid-finder', 'click', () => {
        this.openPlaceIdFinder();
    });
    
    // Auto-update Place ID finder link when business info changes
    const businessName = document.getElementById('business-name');
    const businessLocation = document.getElementById('business-location');
    if (businessName) businessName.addEventListener('input', this.updatePlaceIdLink.bind(this));
    if (businessLocation) businessLocation.addEventListener('input', this.updatePlaceIdLink.bind(this));
    
    // Clear data
    safeAddListener('clear-data', 'click', () => {
        this.clearGoogleData();
    });

    // Curation actions - only add if elements exist
    safeAddListener('auto-approve', 'click', () => {
        this.autoApproveReviews();
    });
    
    safeAddListener('approve-all', 'click', () => {
        const allReviewIds = [...this.googleReviews, ...this.manualTestimonials].map(r => r.id);
        this.bulkApproveReviews(allReviewIds);
    });
    
    safeAddListener('reject-all', 'click', () => {
        const allReviewIds = [...this.googleReviews, ...this.manualTestimonials].map(r => r.id);
        this.bulkRejectReviews(allReviewIds);
    });

    // Add this for the new "Approve New Only" button
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'approve-new-google') {
            const newReviewIds = this.googleReviews
                .filter(review => !this.reviewSettings.curation.approvedReviews.includes(review.id))
                .map(r => r.id);
            this.bulkApproveReviews(newReviewIds);
        }
    });

    // Auto-fill from stored credentials on page load
    this.loadStoredCredentials();
}

    // Toggle review approval
toggleReviewApproval(reviewId) {
    console.log('Toggling approval for:', reviewId); // Debug log
    
    const approvedReviews = this.reviewSettings.curation.approvedReviews;
    const index = approvedReviews.indexOf(reviewId);
    
    if (index > -1) {
        // Remove from approved
        approvedReviews.splice(index, 1);
        console.log('Review unapproved:', reviewId);
    } else {
        // Add to approved
        approvedReviews.push(reviewId);
        console.log('Review approved:', reviewId);
    }
    
    // Save settings
    this.saveSettings();
    
    // Update the UI immediately
    this.updateReviewApprovalUI(reviewId, index === -1);
    
    // Auto-hide if enabled and review was approved
    if (this.reviewSettings.curation.autoHideAfterApprove && index === -1) {
        // Review was just approved, remove it from view after a delay
        setTimeout(() => {
            this.removeReviewFromView(reviewId);
        }, 1000);
    }
    
    // Notify main page
    this.notifyMainPageUpdate();
}

// Helper method to update UI immediately
updateReviewApprovalUI(reviewId, isNowApproved) {
    const reviewElement = document.querySelector(`[data-review-id="${reviewId}"]`);
    if (reviewElement) {
        // Update the button text and class
        const approveBtn = reviewElement.querySelector('.approval-btn');
        if (approveBtn) {
            if (isNowApproved) {
                approveBtn.classList.add('approved');
                approveBtn.innerHTML = '<i class="fas fa-check-circle"></i> Approved';
            } else {
                approveBtn.classList.remove('approved');
                approveBtn.innerHTML = '<i class="fas fa-circle"></i> Approve';
            }
        }
        
        // Update the badge
        const newBadge = reviewElement.querySelector('.new-badge');
        const approvedBadge = reviewElement.querySelector('.approved-badge');
        
        if (isNowApproved) {
            if (newBadge) newBadge.remove();
            if (!approvedBadge) {
                const badge = document.createElement('span');
                badge.className = 'approved-badge';
                badge.textContent = 'APPROVED';
                reviewElement.querySelector('.testimonial-meta').appendChild(badge);
            }
            reviewElement.classList.add('approved');
            reviewElement.classList.remove('new');
        } else {
            if (approvedBadge) approvedBadge.remove();
            if (!newBadge) {
                const badge = document.createElement('span');
                badge.className = 'new-badge';
                badge.textContent = 'NEW';
                reviewElement.querySelector('.testimonial-meta').appendChild(badge);
            }
            reviewElement.classList.add('new');
            reviewElement.classList.remove('approved');
        }
    }
}

// New method to remove review from view
removeReviewFromView(reviewId) {
    // Remove from Google reviews display
    const googleReviewElement = document.querySelector(`[data-review-id="${reviewId}"]`);
    if (googleReviewElement) {
        googleReviewElement.style.opacity = '0';
        googleReviewElement.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            googleReviewElement.remove();
            this.updateReviewCounts();
        }, 300);
    }
    
    // Remove from manual testimonials display
    const manualReviewElement = document.querySelector(`[data-review-id="${reviewId}"]`);
    if (manualReviewElement) {
        manualReviewElement.style.opacity = '0';
        manualReviewElement.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            manualReviewElement.remove();
            this.updateReviewCounts();
        }, 300);
    }
}

// New method to update review counts after hiding
updateReviewCounts() {
    const googleContainer = document.getElementById('google-reviews-container');
    const manualContainer = document.getElementById('manual-testimonials-container');
    
    if (googleContainer) {
        const visibleGoogleReviews = googleContainer.querySelectorAll('.testimonial-item:not(.hidden)').length;
        const googleHeader = googleContainer.querySelector('h4');
        if (googleHeader) {
            googleHeader.textContent = `${visibleGoogleReviews} Google Reviews (Visible)`;
        }
    }
    
    if (manualContainer) {
        const visibleManualReviews = manualContainer.querySelectorAll('.testimonial-item:not(.hidden)').length;
        const manualHeader = manualContainer.querySelector('h3');
        if (manualHeader) {
            manualHeader.textContent = `Manage Testimonials (${visibleManualReviews} Visible)`;
        }
    }
}


// Bulk approve reviews
bulkApproveReviews(reviewIds) {
    const approvedReviews = this.reviewSettings.curation.approvedReviews;
    reviewIds.forEach(id => {
        if (!approvedReviews.includes(id)) {
            approvedReviews.push(id);
        }
    });
    
    this.saveSettings();
    this.loadGoogleReviews();
    this.loadManualTestimonials();
    this.notifyMainPageUpdate();
    
    alert(`Approved ${reviewIds.length} reviews!`);
}

// Bulk reject reviews
bulkRejectReviews(reviewIds) {
    const approvedReviews = this.reviewSettings.curation.approvedReviews;
    this.reviewSettings.curation.approvedReviews = approvedReviews.filter(id => !reviewIds.includes(id));
    
    this.saveSettings();
    this.loadGoogleReviews();
    this.loadManualTestimonials();
    this.notifyMainPageUpdate();
    
    alert(`Rejected ${reviewIds.length} reviews!`);
}

// Get only approved reviews for display
getApprovedReviews() {
    const approvedIds = this.reviewSettings.curation.approvedReviews;
    const allReviews = [...this.googleReviews, ...this.manualTestimonials];
    
    return allReviews.filter(review => approvedIds.includes(review.id));
}

// Auto-approve reviews based on criteria
autoApproveReviews() {
    const criteria = this.reviewSettings.curation;
    const allReviews = [...this.googleReviews, ...this.manualTestimonials];
    const approvedReviews = [...criteria.approvedReviews];
    
    let newlyApproved = 0;
    
    allReviews.forEach(review => {
        const meetsCriteria = 
            review.rating >= criteria.minRating &&
            this.getReviewAge(review) <= criteria.maxAgeDays &&
            !approvedReviews.includes(review.id);
        
        if (meetsCriteria && !approvedReviews.includes(review.id)) {
            approvedReviews.push(review.id);
            newlyApproved++;
        }
    });
    
    this.reviewSettings.curation.approvedReviews = approvedReviews;
    this.saveSettings();
    
    this.loadGoogleReviews();
    this.loadManualTestimonials();
    this.notifyMainPageUpdate();
    
    if (newlyApproved > 0) {
        alert(`Auto-approved ${newlyApproved} reviews based on your criteria!`);
    } else {
        alert('No new reviews met the auto-approval criteria.');
    }
}

// Calculate review age in days
getReviewAge(review) {
    const reviewDate = new Date(review.time || review.date);
    const today = new Date();
    const diffTime = Math.abs(today - reviewDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Update the getAllReviewsForDisplay method to use curation
getAllReviewsForDisplay() {
    if (this.reviewSettings.curation.enabled) {
        // Only show approved reviews
        const approvedReviews = this.getApprovedReviews();
        return approvedReviews
            .sort((a, b) => new Date(b.date || b.time) - new Date(a.date || a.time))
            .slice(0, this.reviewSettings.maxDisplay);
    } else {
        // Show all reviews (original behavior)
        const displayReviews = [];
        
        if (this.reviewSettings.showGoogle) {
            displayReviews.push(...this.googleReviews.slice(0, this.reviewSettings.maxDisplay / 2));
        }
        
        if (this.reviewSettings.showManual) {
            displayReviews.push(...this.manualTestimonials.slice(0, this.reviewSettings.maxDisplay / 2));
        }
        
        return displayReviews
            .sort((a, b) => new Date(b.date || b.time) - new Date(a.date || a.time))
            .slice(0, this.reviewSettings.maxDisplay);
    }
}


    notifyMainPageUpdate() {
    // This will update the main page if it's open
    if (typeof loadReviewsFromManager === 'function') {
        loadReviewsFromManager();
    }
    if (typeof updateMainPageMetrics === 'function') {
        updateMainPageMetrics();
    }
    
    // Also update localStorage timestamp to trigger updates
    localStorage.setItem('lastMainPageUpdate', new Date().toISOString());
}
    
// Clear all Google data
clearGoogleData() {
    if (confirm('Are you sure you want to clear all Google review data? This will remove saved reviews and credentials.')) {
        localStorage.removeItem('googleCredentials');
        localStorage.removeItem('googleReviews');
        localStorage.removeItem('lastSync');
        
        this.googleReviews = [];
        document.getElementById('google-place-id').value = '';
        document.getElementById('google-api-key').value = '';
        document.getElementById('business-preview').style.display = 'none';
        
        this.updateConnectionStatus(false, 'Not Connected to Google Reviews API');
        this.loadGoogleReviews();
        this.updateStats();
        
        alert('Google review data cleared successfully.');
    }
}


    // Open the official Google Place ID Finder
openPlaceIdFinder() {
    const businessName = document.getElementById('business-name').value || '716 Corporate Housing';
    const location = document.getElementById('business-location').value || 'Buffalo, NY';
    
    const searchQuery = encodeURIComponent(`${businessName} ${location}`);
    const placeIdFinderUrl = `https://developers.google.com/maps/documentation/places/web-service/place-id?utm_source=716-corporate-housing&utm_medium=web&utm_campaign=review-system#find-id`;
    
    // Open in new tab
    window.open(placeIdFinderUrl, '_blank');
    
    // Show instructions
    this.showPlaceIdInstructions();
}

// Show detailed instructions for finding Place ID
showPlaceIdInstructions() {
    const instructions = `
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2196f3;">
            <h4 style="margin-top: 0; color: #1976d2;">How to find your Place ID:</h4>
            <ol style="margin-bottom: 0;">
                <li>The Place ID Finder will open in a new tab</li>
                <li>In the search box, type: <strong>"716 Corporate Housing Buffalo NY"</strong></li>
                <li>Select your business from the dropdown</li>
                <li>Copy the <strong>Place ID</strong> (it looks like: <code>ChIJ...</code>)</li>
                <li>Paste the Place ID in the field above</li>
                <li>Click "Connect & Test" to verify</li>
            </ol>
        </div>
        
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #ff9800;">
            <strong>💡 Quick Tip:</strong> Your Place ID should look something like:<br>
            <code style="background: #f5f5f5; padding: 2px 6px; border-radius: 3px;">ChIJD3J8apbEwokRc6RSMabVpC4</code>
        </div>
    `;
    
    // Create or update instructions modal
    let instructionsEl = document.getElementById('placeid-instructions');
    if (!instructionsEl) {
        instructionsEl = document.createElement('div');
        instructionsEl.id = 'placeid-instructions';
        instructionsEl.innerHTML = instructions;
        document.querySelector('.google-setup').appendChild(instructionsEl);
    } else {
        instructionsEl.innerHTML = instructions;
    }
}

// Update the Place ID finder link with current business info
updatePlaceIdLink() {
    const businessName = document.getElementById('business-name').value || '716 Corporate Housing';
    const location = document.getElementById('business-location').value || 'Buffalo, NY';
    const searchQuery = encodeURIComponent(`${businessName} ${location}`);
    
    const link = document.getElementById('place-id-link');
    link.textContent = `Find Place ID for "${businessName}"`;
}



// Test connection with Place ID
async connectGoogleAPI() {
    const placeId = document.getElementById('google-place-id').value.trim();
    const apiKey = document.getElementById('google-api-key').value.trim();
    
    if (!placeId) {
        alert('Please enter your Google Place ID');
        return;
    }
    
    if (!apiKey) {
        alert('Please enter your Google API Key');
        return;
    }
    
    // Validate Place ID format (starts with ChIJ)
    if (!placeId.startsWith('ChIJ') && !placeId.startsWith('ChIJ')) {
        if (!confirm(`This doesn't look like a standard Place ID (should start with "ChIJ"). Continue anyway?`)) {
            return;
        }
    }
    
    // Test the connection
    const isValid = await this.testGoogleConnection(placeId, apiKey);
    
    if (isValid) {
        // Save credentials
        localStorage.setItem('googleCredentials', JSON.stringify({ 
            placeId, 
            apiKey,
            connectedAt: new Date().toISOString(),
            businessName: document.getElementById('business-name').value || '716 Corporate Housing'
        }));
        
        // Update status
        this.updateConnectionStatus(true, 'Connected to Google Reviews API');
    }
}

// Update connection status
updateConnectionStatus(status, message) {
    const statusEl = document.getElementById('google-status');
    
    if (status === true || status === 'connected') {
        statusEl.className = 'api-status status-connected';
        statusEl.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
    } else if (status === 'loading') {
        statusEl.className = 'api-status status-loading';
        statusEl.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span>${message}</span>`;
    } else {
        statusEl.className = 'api-status status-disconnected';
        statusEl.innerHTML = `<i class="fas fa-times-circle"></i><span>${message}</span>`;
    }
}

    
    switchTab(tab) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');
    }

    async findPlaceId() {
    const businessName = "716 Corporate Housing";
    const location = "Buffalo, NY";
    
    const apiKey = document.getElementById('google-api-key').value;
    if (!apiKey) {
        alert('Please enter your Google API Key first');
        return;
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
            `input=${encodeURIComponent(businessName + ' ' + location)}&` +
            `inputtype=textquery&` +
            `fields=place_id,name,formatted_address&` +
            `key=${apiKey}`
        );
        
        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0) {
            const placeId = data.candidates[0].place_id;
            document.getElementById('google-place-id').value = placeId;
            alert(`Found Place ID: ${placeId}\n\nBusiness: ${data.candidates[0].name}\nAddress: ${data.candidates[0].formatted_address}`);
        } else {
            alert('Business not found. Please check the business name and location.');
        }
    } catch (error) {
        console.error('Error finding place:', error);
        alert('Error searching for business. Check your API key and try again.');
    }
}


    
    async connectGoogleAPI() {
    const placeId = document.getElementById('google-place-id').value;
    const apiKey = document.getElementById('google-api-key').value;
    
    if (!placeId || !apiKey) {
        alert('Please search for your business and enter an API Key');
        return;
    }
    
    // Test the connection first
    const isValid = await this.testGoogleConnection(placeId, apiKey);
    
    if (isValid) {
        // Save credentials
        localStorage.setItem('googleCredentials', JSON.stringify({ 
            placeId, 
            apiKey,
            connectedAt: new Date().toISOString()
        }));
        
        // Update status
        const statusEl = document.getElementById('google-status');
        statusEl.className = 'api-status status-connected';
        statusEl.innerHTML = '<i class="fas fa-check-circle"></i><span>Connected to Google Reviews API</span>';
        
        // Auto-sync reviews
        await this.syncGoogleReviews();
    }
}

async testGoogleConnection(placeId, apiKey) {
    try {
        // Show loading
        this.updateConnectionStatus('loading', 'Testing connection...');
        
        // Use CORS proxy to avoid CORS issues
        const response = await fetch(
            `https://corsproxy.io/?` + encodeURIComponent(
                `https://maps.googleapis.com/maps/api/place/details/json?` +
                `place_id=${placeId}&` +
                `fields=name,formatted_address,rating,user_ratings_total,reviews,geometry,website,formatted_phone_number&` +
                `key=${apiKey}`
            )
        );
        
        const data = await response.json();
        
        if (data.status === 'OK' && data.result) {
            const business = data.result;
            
            // Show business preview
            this.showBusinessPreview(business);
            
            // Success message
            const successMessage = `
                ✅ Connection Successful!
                
                Business: ${business.name}
                Address: ${business.formatted_address}
                ${business.rating ? `Rating: ${business.rating}/5 (${business.user_ratings_total} reviews)` : 'No public ratings yet'}
                ${business.website ? `Website: ${business.website}` : ''}
                ${business.formatted_phone_number ? `Phone: ${business.formatted_phone_number}` : ''}
            `;
            
            alert(successMessage);
            return true;
            
        } else if (data.status === 'INVALID_REQUEST') {
            alert('❌ Invalid Place ID. Please check your Place ID and try again.');
            return false;
        } else if (data.status === 'REQUEST_DENIED') {
            alert('❌ API Key rejected. Please check:\n1. API key is correct\n2. Places API is enabled\n3. API key has no restrictions');
            return false;
        } else {
            alert(`❌ API Error: ${data.status}\n${data.error_message || 'Please check your Place ID and API Key'}`);
            return false;
        }
        
    } catch (error) {
        console.error('Connection test failed:', error);
        alert(`❌ Connection failed: ${error.message}\n\nPlease check:\n1. Internet connection\n2. API key is correct\n3. Try a different CORS proxy`);
        this.updateConnectionStatus(false, 'Connection failed');
        return false;
    }
}

// Show business preview
showBusinessPreview(business) {
    const previewEl = document.getElementById('business-preview');
    const contentEl = document.getElementById('preview-content');
    
    contentEl.innerHTML = `
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: start;">
            <div style="font-weight: bold;">Name:</div>
            <div>${business.name}</div>
            
            <div style="font-weight: bold;">Address:</div>
            <div>${business.formatted_address}</div>
            
            ${business.rating ? `
                <div style="font-weight: bold;">Rating:</div>
                <div>${business.rating} ★ (${business.user_ratings_total} reviews)</div>
            ` : ''}
            
            ${business.website ? `
                <div style="font-weight: bold;">Website:</div>
                <div><a href="${business.website}" target="_blank">${business.website}</a></div>
            ` : ''}
            
            ${business.formatted_phone_number ? `
                <div style="font-weight: bold;">Phone:</div>
                <div>${business.formatted_phone_number}</div>
            ` : ''}
        </div>
    `;
    
    previewEl.style.display = 'block';
}


async syncGoogleReviews() {
    const credentials = JSON.parse(localStorage.getItem('googleCredentials'));
    
    if (!credentials) {
        alert('Please connect to Google API first');
        return;
    }
    
    try {
        // Show loading state
        const syncBtn = document.getElementById('sync-reviews');
        const originalText = syncBtn.innerHTML;
        syncBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
        syncBtn.disabled = true;
        
        this.updateConnectionStatus('loading', 'Syncing reviews...');

        // Use CORS proxy
        const response = await fetch(
            `https://corsproxy.io/?` + encodeURIComponent(
                `https://maps.googleapis.com/maps/api/place/details/json?` +
                `place_id=${credentials.placeId}&` +
                `fields=name,rating,user_ratings_total,reviews,formatted_address&` +
                `key=${credentials.apiKey}`
            )
        );
        
        const data = await response.json();
        
        if (data.status === 'OK' && data.result && data.result.reviews) {
            // Get existing approved reviews to preserve curation decisions
            const existingApprovedReviews = this.reviewSettings.curation.approvedReviews || [];
            const existingGoogleReviews = JSON.parse(localStorage.getItem('googleReviews')) || [];
            
            // Create a map of existing reviews by their ID for comparison
            const existingReviewsMap = new Map();
            existingGoogleReviews.forEach(review => {
                existingReviewsMap.set(review.id, review);
            });
            
            // Process new reviews while preserving approval status
            const newGoogleReviews = data.result.reviews.map(review => {
                const reviewId = `google_${review.time}`;
                
                // Check if this review already exists and was approved
                const existingReview = existingReviewsMap.get(reviewId);
                const wasApproved = existingReview ? existingApprovedReviews.includes(reviewId) : false;
                
                return {
                    id: reviewId,
                    author_name: review.author_name,
                    rating: review.rating,
                    text: review.text,
                    time: review.time * 1000,
                    source: 'google',
                    profile_photo_url: review.profile_photo_url,
                    relative_time_description: review.relative_time_description,
                    // Preserve approval status if review already exists
                    _wasApproved: wasApproved
                };
            });
            
            this.googleReviews = newGoogleReviews;
            localStorage.setItem('googleReviews', JSON.stringify(this.googleReviews));
            localStorage.setItem('lastSync', new Date().toISOString());
            
            // If any existing approved reviews were found in the sync, maintain their approval status
            let maintainedApprovals = 0;
            newGoogleReviews.forEach(review => {
                if (review._wasApproved && !existingApprovedReviews.includes(review.id)) {
                    existingApprovedReviews.push(review.id);
                    maintainedApprovals++;
                }
            });
            
            if (maintainedApprovals > 0) {
                this.reviewSettings.curation.approvedReviews = existingApprovedReviews;
                this.saveSettings();
            }
            
            // Show sync summary
            const newReviewsCount = newGoogleReviews.length - existingGoogleReviews.length;
            let summaryMessage = `✅ Successfully synced ${newGoogleReviews.length} Google reviews!`;
            
            if (newReviewsCount > 0) {
                summaryMessage += `\n\n📥 ${newReviewsCount} new review(s) found`;
                summaryMessage += `\n💡 New reviews are unapproved for curation`;
            } else if (newReviewsCount < 0) {
                summaryMessage += `\n\n📤 ${Math.abs(newReviewsCount)} review(s) were removed`;
            } else {
                summaryMessage += `\n\n📊 No new reviews found`;
            }
            
            if (maintainedApprovals > 0) {
                summaryMessage += `\n✅ Maintained approval status for ${maintainedApprovals} existing reviews`;
            }
            
            this.loadGoogleReviews();
            this.updateStats();
            
            this.updateConnectionStatus(true, `Synced ${this.googleReviews.length} reviews`);
            
            alert(summaryMessage);
            
        } else {
            let errorMsg = 'No reviews found. Possible reasons:\n';
            if (data.error_message) {
                errorMsg += `API Error: ${data.error_message}\n`;
            }
            errorMsg += '• The business might not have public reviews\n';
            errorMsg += '• Reviews might be disabled for this business\n';
            errorMsg += '• Try a different Place ID';
            alert(errorMsg);
            this.updateConnectionStatus(true, 'Connected (no reviews found)');
        }
        
        // Reset button
        syncBtn.innerHTML = originalText;
        syncBtn.disabled = false;
        
    } catch (error) {
        console.error('Error syncing Google reviews:', error);
        alert(`Error syncing reviews: ${error.message}`);
        this.updateConnectionStatus(false, 'Sync failed');
        
        // Reset button
        const syncBtn = document.getElementById('sync-reviews');
        syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Sync Reviews Now';
        syncBtn.disabled = false;
    }
}

// Enhanced method to handle individual button clicks
setupIndividualButtonEvents() {
    // Use event delegation for all dynamic buttons
    document.addEventListener('click', (e) => {
        // Handle approve/reject buttons
        const approveBtn = e.target.closest('.approval-btn');
        if (approveBtn) {
            e.preventDefault();
            const reviewItem = approveBtn.closest('[data-review-id]');
            if (reviewItem) {
                const reviewId = reviewItem.getAttribute('data-review-id');
                console.log('Approve button clicked for:', reviewId);
                this.toggleReviewApproval(reviewId);
            }
            return;
        }
        
        // Handle delete buttons
        const deleteBtn = e.target.closest('.btn-danger');
        if (deleteBtn && deleteBtn.closest('.testimonial-item')) {
            e.preventDefault();
            const reviewItem = deleteBtn.closest('[data-review-id]');
            if (reviewItem) {
                const reviewId = reviewItem.getAttribute('data-review-id');
                console.log('Delete button clicked for:', reviewId);
                
                // Check if it's a Google review or manual testimonial
                if (reviewId.startsWith('google_')) {
                    this.deleteGoogleReview(reviewId);
                } else if (reviewId.startsWith('manual_')) {
                    this.deleteManualTestimonial(reviewId);
                }
            }
            return;
        }
        
        // Handle "Delete All Rejected" link
        if (e.target.closest('.btn-link') && e.target.textContent.includes('Delete All Rejected')) {
            e.preventDefault();
            this.deleteAllRejectedReviews();
            return;
        }
    });
}
    
    loadStoredCredentials() {
    const credentials = JSON.parse(localStorage.getItem('googleCredentials'));
    if (credentials) {
        document.getElementById('google-api-key').value = credentials.apiKey || '';
        document.getElementById('google-place-id').value = credentials.placeId || '';
        
        // Update status if we have credentials
        if (credentials.placeId && credentials.apiKey) {
            const statusEl = document.getElementById('google-status');
            statusEl.className = 'api-status status-connected';
            statusEl.innerHTML = '<i class="fas fa-check-circle"></i><span>Connected to Google Reviews API</span>';
        }
    }
    
    // Load existing reviews
    const storedReviews = localStorage.getItem('googleReviews');
    if (storedReviews) {
        this.googleReviews = JSON.parse(storedReviews);
        this.loadGoogleReviews();
    }
}

// Clean up orphaned approvals (approvals for reviews that no longer exist)
cleanupOrphanedApprovals() {
    const allReviews = [...this.googleReviews, ...this.manualTestimonials];
    const reviewIds = allReviews.map(review => review.id);
    const approvedReviews = this.reviewSettings.curation.approvedReviews || [];
    
    // Find approvals for reviews that no longer exist
    const orphanedApprovals = approvedReviews.filter(approvedId => 
        !reviewIds.includes(approvedId)
    );
    
    if (orphanedApprovals.length > 0) {
        // Remove orphaned approvals
        this.reviewSettings.curation.approvedReviews = approvedReviews.filter(approvedId => 
            reviewIds.includes(approvedId)
        );
        
        this.saveSettings();
        console.log(`Cleaned up ${orphanedApprovals.length} orphaned approvals`);
        
        return orphanedApprovals.length;
    }
    
    return 0;
}


// Enhanced Google reviews display with delete functionality
loadGoogleReviews() {
    const stored = localStorage.getItem('googleReviews');
    if (stored) {
        this.googleReviews = JSON.parse(stored);
    }
    
    const container = document.getElementById('google-reviews-container');
    const lastSync = localStorage.getItem('lastSync');
    const approvedReviews = this.reviewSettings.curation.approvedReviews || [];
    const hideApproved = this.reviewSettings.curation.hideApproved || false;
    
    // Filter reviews based on hide approved setting
    const displayReviews = hideApproved 
        ? this.googleReviews.filter(review => !approvedReviews.includes(review.id))
        : this.googleReviews;
    
    const newReviews = displayReviews.filter(review => !approvedReviews.includes(review.id));
    const rejectedReviews = this.googleReviews.filter(review => !approvedReviews.includes(review.id));
    
    if (this.googleReviews.length === 0) {
        container.innerHTML = `
            <div class="no-reviews" style="text-align: center; padding: 40px;">
                <i class="fas fa-comments fa-3x" style="color: var(--light-gray); margin-bottom: 15px;"></i>
                <h3 style="color: var(--dark); margin-bottom: 10px;">No Google Reviews</h3>
                <p style="color: var(--text-gray); margin-bottom: 20px;">Sync Google reviews to get started.</p>
                ${lastSync ? `<small>Last sync: ${new Date(lastSync).toLocaleString()}</small>` : ''}
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="reviews-header">
            <div>
                <h4>${displayReviews.length} Google Reviews (Visible)</h4>
                <small>
                    Total: ${this.googleReviews.length} • 
                    Approved: ${approvedReviews.filter(id => id.startsWith('google_')).length} • 
                    Rejected: ${rejectedReviews.length} •
                    Visible: ${displayReviews.length}
                </small>
                ${rejectedReviews.length > 0 ? `
                    <div class="rejected-reviews-alert">
                        <i class="fas fa-trash"></i>
                        ${rejectedReviews.length} rejected review(s) - 
                        <button class="btn-link" onclick="reviewManager.deleteAllRejectedReviews()">Delete All Rejected</button>
                    </div>
                ` : ''}
                ${newReviews.length > 0 ? `
                    <div class="new-reviews-alert">
                        <i class="fas fa-bell"></i>
                        ${newReviews.length} new review(s) to moderate
                    </div>
                ` : ''}
            </div>
            <div class="bulk-actions">
                <button class="btn btn-sm" id="approve-all-visible">
                    <i class="fas fa-check"></i> Approve All Visible
                </button>
                <button class="btn" id="reject-all-visible">
                    <i class="fas fa-times"></i> Reject All Visible
                </button>
                <button class="btn btn-sm btn-danger" id="delete-all-visible">
                    <i class="fas fa-trash"></i> Delete All Visible
                </button>
                ${hideApproved ? `
                    <button class="btn btn-sm btn-accent" id="show-all-reviews">
                        <i class="fas fa-eye"></i> Show All
                    </button>
                ` : `
                    <button class="btn btn-sm btn-accent" id="hide-approved-reviews-btn">
                        <i class="fas fa-eye-slash"></i> Hide Approved
                    </button>
                `}
            </div>
        </div>
        <div class="reviews-grid">
            ${displayReviews.map(review => {
                const isApproved = approvedReviews.includes(review.id);
                const isNew = !isApproved;
                const reviewAge = this.getReviewAge(review);
                
                return `
                    <div class="testimonial-item ${isApproved ? 'approved' : 'new'}" data-review-id="${review.id}">
                        <div class="testimonial-header">
                            <div class="testimonial-meta">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                                    ${review.profile_photo_url ? `
                                        <img src="${review.profile_photo_url}" 
                                             alt="${review.author_name}" 
                                             style="width: 40px; height: 40px; border-radius: 50%;">
                                    ` : `
                                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                                            ${review.author_name.charAt(0)}
                                        </div>
                                    `}
                                    <div>
                                        <strong>${review.author_name}</strong>
                                        <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                                    </div>
                                    ${isNew ? `<span class="new-badge">NEW</span>` : ''}
                                    ${isApproved ? `<span class="approved-badge">APPROVED</span>` : ''}
                                </div>
                                <small>${review.relative_time_description || new Date(review.time).toLocaleDateString()} • ${reviewAge} days ago</small>
                            </div>
                            <div class="approval-controls">
                               <button class="approval-btn ${isApproved ? 'approved' : ''}" 
                                    data-review-id="${review.id}"
                                    title="${isApproved ? 'Click to reject' : 'Click to approve'}">
                                    <i class="fas fa-${isApproved ? 'check-circle' : 'circle'}"></i>
                                    ${isApproved ? 'Approved' : 'Approve'}
                                </button>
                                <button class="btn btn-sm btn-danger" 
                                        onclick="reviewManager.deleteGoogleReview('${review.id}')"
                                        title="Delete this review">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <p>${review.text}</p>
                        ${review.rating < 4 ? `<div class="rating-warning">Low rating - consider rejecting or deleting</div>` : ''}
                    </div>
                `;
            }).join('')}
        </div>
        
        ${hideApproved && approvedReviews.filter(id => id.startsWith('google_')).length > 0 ? `
            <div class="hidden-reviews-summary">
                <i class="fas fa-eye-slash"></i>
                ${approvedReviews.filter(id => id.startsWith('google_')).length} approved reviews are hidden. 
                <button class="btn-link" onclick="reviewManager.toggleHideApproved()">Show them</button>
            </div>
        ` : ''}
        
        ${displayReviews.length === 0 ? `
            <div class="all-approved-message">
                <i class="fas fa-check-circle"></i>
                <h4>All Google reviews are approved!</h4>
                <p>Great job! You've approved all available Google reviews.</p>
                <button class="btn btn-outline" onclick="reviewManager.toggleHideApproved()">
                    <i class="fas fa-eye"></i> Show Approved Reviews
                </button>
            </div>
        ` : ''}
        
        <!-- Danger Zone -->
        <div class="danger-zone" style="margin-top: 30px; padding: 20px; background: #ffebee; border-radius: 8px; border: 1px solid #f44336;">
            <h5 style="color: #c62828; margin-bottom: 10px;">
                <i class="fas fa-exclamation-triangle"></i> Danger Zone
            </h5>
            <p style="color: #c62828; margin-bottom: 15px; font-size: 0.9rem;">
                These actions are permanent and cannot be undone.
            </p>
            <button class="btn btn-danger btn-sm" onclick="reviewManager.deleteAllReviews()">
                <i class="fas fa-bomb"></i> Delete ALL Reviews
            </button>
        </div>
    `;
    
    // Add event listeners for bulk actions
    this.setupReviewViewEventListeners();
    
    // Add delete all visible event listener
    document.getElementById('delete-all-visible')?.addEventListener('click', () => {
        const visibleReviewIds = Array.from(document.querySelectorAll('.testimonial-item[data-review-id]'))
            .map(el => el.getAttribute('data-review-id'));
        this.bulkDeleteGoogleReviews(visibleReviewIds);
    });
}
   
toggleHideApproved() {
    this.reviewSettings.curation.hideApproved = !this.reviewSettings.curation.hideApproved;
    this.saveSettings();
    this.loadGoogleReviews();
    this.loadManualTestimonials();
}

// New method to setup event listeners for review view controls
setupReviewViewEventListeners() {
    document.getElementById('hide-approved-reviews-btn')?.addEventListener('click', () => {
        this.reviewSettings.curation.hideApproved = true;
        this.saveSettings();
        this.loadGoogleReviews();
        this.loadManualTestimonials();
    });
    
    document.getElementById('show-all-reviews')?.addEventListener('click', () => {
        this.reviewSettings.curation.hideApproved = false;
        this.saveSettings();
        this.loadGoogleReviews();
        this.loadManualTestimonials();
    });
    
    document.getElementById('approve-all-visible')?.addEventListener('click', () => {
        const visibleReviewIds = Array.from(document.querySelectorAll('.testimonial-item[data-review-id]'))
            .map(el => el.getAttribute('data-review-id'));
        this.bulkApproveReviews(visibleReviewIds);
    });
    
    document.getElementById('reject-all-visible')?.addEventListener('click', () => {
        const visibleReviewIds = Array.from(document.querySelectorAll('.testimonial-item[data-review-id]'))
            .map(el => el.getAttribute('data-review-id'));
        this.bulkRejectReviews(visibleReviewIds);
    });
}


    addManualTestimonial() {
        const name = document.getElementById('testimonial-name').value;
        const profession = document.getElementById('testimonial-profession').value;
        const rating = parseInt(document.querySelector('input[name="rating"]:checked').value);
        const text = document.getElementById('testimonial-text').value;
        const date = document.getElementById('testimonial-date').value || new Date().toISOString().split('T')[0];
        
        const testimonial = {
            id: 'manual_' + Date.now(),
            name,
            profession,
            rating,
            text,
            date,
            source: 'manual',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=daa520&color=fff&size=100`
        };
        
        this.manualTestimonials.unshift(testimonial);
        localStorage.setItem('manualTestimonials', JSON.stringify(this.manualTestimonials));
        
        this.loadManualTestimonials();
        this.updateStats();
        document.getElementById('manual-testimonial-form').reset();
    }
    
// Enhanced manual testimonials with hide approved feature
// Enhanced manual testimonials with delete functionality
loadManualTestimonials() {
    const container = document.getElementById('manual-testimonials-container');
    const approvedReviews = this.reviewSettings.curation.approvedReviews || [];
    const hideApproved = this.reviewSettings.curation.hideApproved || false;
    
    // Filter testimonials based on hide approved setting
    const displayTestimonials = hideApproved 
        ? this.manualTestimonials.filter(testimonial => !approvedReviews.includes(testimonial.id))
        : this.manualTestimonials;
    
    if (displayTestimonials.length === 0) {
        const message = hideApproved && this.manualTestimonials.length > 0
            ? `
                <div class="all-approved-message">
                    <i class="fas fa-check-circle"></i>
                    <h4>All manual testimonials are approved!</h4>
                    <p>Great job! You've approved all manual testimonials.</p>
                    <button class="btn btn-outline" onclick="reviewManager.toggleHideApproved()">
                        <i class="fas fa-eye"></i> Show Approved Testimonials
                    </button>
                </div>
            `
            : `
                <div class="no-reviews">
                    <i class="fas fa-comment-alt fa-3x"></i>
                    <h3>No Manual Testimonials</h3>
                    <p>Add your first manual testimonial using the form above.</p>
                </div>
            `;
        
        container.innerHTML = message;
        return;
    }
    
    container.innerHTML = `
        <div class="reviews-header">
            <h3>Manage Testimonials (${displayTestimonials.length} Visible)</h3>
            <div class="bulk-actions">
                <button class="btn btn-sm btn-outline" id="approve-all-manual-visible">
                    <i class="fas fa-check"></i> Approve All Visible
                </button>
                <button class="btn btn-sm btn-danger" id="delete-all-manual-visible">
                    <i class="fas fa-trash"></i> Delete All Visible
                </button>
                ${hideApproved ? `
                    <button class="btn btn-sm btn-accent" id="show-all-manual">
                        <i class="fas fa-eye"></i> Show All
                    </button>
                ` : `
                    <button class="btn btn-sm btn-accent" id="hide-approved-manual">
                        <i class="fas fa-eye-slash"></i> Hide Approved
                    </button>
                `}
            </div>
        </div>
        <div class="testimonials-grid">
            ${displayTestimonials.map(testimonial => {
                const isApproved = approvedReviews.includes(testimonial.id);
                
                return `
                    <div class="testimonial-item ${isApproved ? 'approved' : 'pending'}" data-review-id="${testimonial.id}">
                        <div class="testimonial-header">
                            <div class="testimonial-meta">
                                <strong>${testimonial.name}</strong>
                                ${testimonial.profession ? `<div class="review-profession">${testimonial.profession}</div>` : ''}
                                <div class="review-stars">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5-testimonial.rating)}</div>
                                <small>${new Date(testimonial.date).toLocaleDateString()} • Manual Testimonial</small>
                            </div>
                            <div class="testimonial-actions">
                               <button class="approval-btn ${isApproved ? 'approved' : ''}" 
                                    data-review-id="${review.id}"
                                    title="${isApproved ? 'Click to reject' : 'Click to approve'}">
                                    <i class="fas fa-${isApproved ? 'check-circle' : 'circle'}"></i>
                                    ${isApproved ? 'Approved' : 'Approve'}
                                </button>
                                <button class="btn btn-sm btn-danger" 
                                        onclick="reviewManager.deleteManualTestimonial('${testimonial.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <p>${testimonial.text}</p>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    // Add event listeners for manual testimonials
    document.getElementById('approve-all-manual-visible')?.addEventListener('click', () => {
        const visibleTestimonialIds = Array.from(document.querySelectorAll('#manual-testimonials-container .testimonial-item[data-review-id]'))
            .map(el => el.getAttribute('data-review-id'));
        this.bulkApproveReviews(visibleTestimonialIds);
    });
    
    document.getElementById('delete-all-manual-visible')?.addEventListener('click', () => {
        const visibleTestimonialIds = Array.from(document.querySelectorAll('#manual-testimonials-container .testimonial-item[data-review-id]'))
            .map(el => el.getAttribute('data-review-id'));
        this.bulkDeleteManualTestimonials(visibleTestimonialIds);
    });
}
    
    deleteTestimonial(id) {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            this.manualTestimonials = this.manualTestimonials.filter(t => t.id !== id);
            localStorage.setItem('manualTestimonials', JSON.stringify(this.manualTestimonials));
            this.loadManualTestimonials();
            this.updateStats();
        }
    }
    
    updateStats() {
        const allReviews = [...this.googleReviews, ...this.manualTestimonials];
        const totalReviews = allReviews.length;
        const googleCount = this.googleReviews.length;
        const manualCount = this.manualTestimonials.length;
        
        // Calculate average rating
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : '0.0';
        
        document.getElementById('total-reviews').textContent = totalReviews;
        document.getElementById('average-rating').textContent = averageRating;
        document.getElementById('google-reviews').textContent = googleCount;
        document.getElementById('manual-reviews').textContent = manualCount;
        
        // Update metrics on main page if we're there
        this.updateMainPageMetrics(averageRating, totalReviews);
    }
    
    updateMainPageMetrics(averageRating, totalReviews) {
        // This will update the metrics section on the main page
        const metricsSection = document.querySelector('.metrics');
        if (metricsSection) {
            const ratingElement = metricsSection.querySelector('.metric-value:nth-child(3)');
            const reviewsElement = metricsSection.querySelector('.metric-value:first-child');
            
            if (ratingElement) ratingElement.textContent = averageRating + '★';
            if (reviewsElement) reviewsElement.textContent = totalReviews + '+';
        }
    }
    
  loadSettings() {
    document.getElementById('max-reviews-display').value = this.reviewSettings.maxDisplay;
    document.getElementById('auto-sync').value = this.reviewSettings.autoSync;
    document.getElementById('show-google-reviews').checked = this.reviewSettings.showGoogle;
    document.getElementById('show-manual-testimonials').checked = this.reviewSettings.showManual;
    
    // Curation settings
    document.getElementById('curation-enabled').checked = this.reviewSettings.curation.enabled || false;
    document.getElementById('min-rating').value = this.reviewSettings.curation.minRating || 4;
    document.getElementById('max-age').value = this.reviewSettings.curation.maxAgeDays || 365;
    document.getElementById('hide-approved-reviews').checked = this.reviewSettings.curation.hideApproved || false;
    document.getElementById('auto-hide-after-approval').checked = this.reviewSettings.curation.autoHideAfterApprove || false;
}

saveSettings() {
    this.reviewSettings = {
        maxDisplay: parseInt(document.getElementById('max-reviews-display').value),
        autoSync: document.getElementById('auto-sync').value,
        showGoogle: document.getElementById('show-google-reviews').checked,
        showManual: document.getElementById('show-manual-testimonials').checked,
        curation: {
            enabled: document.getElementById('curation-enabled').checked,
            minRating: parseInt(document.getElementById('min-rating').value),
            maxAgeDays: parseInt(document.getElementById('max-age').value),
            hideApproved: document.getElementById('hide-approved-reviews').checked,
            autoHideAfterApprove: document.getElementById('auto-hide-after-approval').checked,
            approvedReviews: this.reviewSettings.curation.approvedReviews
        }
    };
    
    localStorage.setItem('reviewSettings', JSON.stringify(this.reviewSettings));
    localStorage.setItem('approvedReviews', JSON.stringify(this.reviewSettings.curation.approvedReviews));
    
    this.notifyMainPageUpdate();
    alert('Settings saved successfully!');
}
    
    // Method to get all reviews for display on main page
    getAllReviewsForDisplay() {
        const displayReviews = [];
        
        if (this.settings.showGoogle) {
            displayReviews.push(...this.googleReviews.slice(0, this.settings.maxDisplay / 2));
        }
        
        if (this.settings.showManual) {
            displayReviews.push(...this.manualTestimonials.slice(0, this.settings.maxDisplay / 2));
        }
        
        // Sort by date (newest first) and limit to max display
        return displayReviews
            .sort((a, b) => new Date(b.date || b.time) - new Date(a.date || a.time))
            .slice(0, this.settings.maxDisplay);
    }

// Enhanced delete methods with animations
deleteGoogleReview(reviewId) {
    if (confirm('Are you sure you want to delete this Google review from your local storage? This will not delete it from Google, but it will be removed from your website.')) {
        // Add deleting animation
        const reviewElement = document.querySelector(`[data-review-id="${reviewId}"]`);
        if (reviewElement) {
            reviewElement.classList.add('deleting');
        }
        
        setTimeout(() => {
            // Remove from Google reviews array
            this.googleReviews = this.googleReviews.filter(review => review.id !== reviewId);
            
            // Remove from approved reviews if it was approved
            const approvedIndex = this.reviewSettings.curation.approvedReviews.indexOf(reviewId);
            if (approvedIndex > -1) {
                this.reviewSettings.curation.approvedReviews.splice(approvedIndex, 1);
            }
            
            // Save changes
            localStorage.setItem('googleReviews', JSON.stringify(this.googleReviews));
            this.saveSettings();
            
            // Update display
            this.loadGoogleReviews();
            this.updateStats();
            this.notifyMainPageUpdate();
        }, 300);
    }
}

// Delete a manual testimonial
deleteManualTestimonial(testimonialId) {
    if (confirm('Are you sure you want to delete this manual testimonial?')) {
        // Remove from manual testimonials array
        this.manualTestimonials = this.manualTestimonials.filter(testimonial => testimonial.id !== testimonialId);
        
        // Remove from approved reviews if it was approved
        const approvedIndex = this.reviewSettings.curation.approvedReviews.indexOf(testimonialId);
        if (approvedIndex > -1) {
            this.reviewSettings.curation.approvedReviews.splice(approvedIndex, 1);
        }
        
        // Save changes
        localStorage.setItem('manualTestimonials', JSON.stringify(this.manualTestimonials));
        this.saveSettings();
        
        // Update display
        this.loadManualTestimonials();
        this.updateStats();
        this.notifyMainPageUpdate();
        
        alert('Manual testimonial deleted successfully!');
    }
}

// Bulk delete Google reviews
bulkDeleteGoogleReviews(reviewIds) {
    if (confirm(`Are you sure you want to delete ${reviewIds.length} Google reviews from your local storage? This will not delete them from Google.`)) {
        // Remove from Google reviews array
        this.googleReviews = this.googleReviews.filter(review => !reviewIds.includes(review.id));
        
        // Remove from approved reviews
        this.reviewSettings.curation.approvedReviews = this.reviewSettings.curation.approvedReviews.filter(
            id => !reviewIds.includes(id)
        );
        
        // Save changes
        localStorage.setItem('googleReviews', JSON.stringify(this.googleReviews));
        this.saveSettings();
        
        // Update display
        this.loadGoogleReviews();
        this.updateStats();
        this.notifyMainPageUpdate();
        
        alert(`${reviewIds.length} Google reviews deleted successfully!`);
    }
}

// Bulk delete manual testimonials
bulkDeleteManualTestimonials(testimonialIds) {
    if (confirm(`Are you sure you want to delete ${testimonialIds.length} manual testimonials?`)) {
        // Remove from manual testimonials array
        this.manualTestimonials = this.manualTestimonials.filter(testimonial => !testimonialIds.includes(testimonial.id));
        
        // Remove from approved reviews
        this.reviewSettings.curation.approvedReviews = this.reviewSettings.curation.approvedReviews.filter(
            id => !testimonialIds.includes(id)
        );
        
        // Save changes
        localStorage.setItem('manualTestimonials', JSON.stringify(this.manualTestimonials));
        this.saveSettings();
        
        // Update display
        this.loadManualTestimonials();
        this.updateStats();
        this.notifyMainPageUpdate();
        
        alert(`${testimonialIds.length} manual testimonials deleted successfully!`);
    }
}

// Delete all rejected reviews
deleteAllRejectedReviews() {
    const approvedReviews = this.reviewSettings.curation.approvedReviews || [];
    
    // Find rejected Google reviews
    const rejectedGoogleReviews = this.googleReviews.filter(review => !approvedReviews.includes(review.id));
    const rejectedManualTestimonials = this.manualTestimonials.filter(testimonial => !approvedReviews.includes(testimonial.id));
    
    const totalRejected = rejectedGoogleReviews.length + rejectedManualTestimonials.length;
    
    if (totalRejected === 0) {
        alert('No rejected reviews found to delete.');
        return;
    }
    
    if (confirm(`Are you sure you want to delete all ${totalRejected} rejected reviews? This includes ${rejectedGoogleReviews.length} Google reviews and ${rejectedManualTestimonials.length} manual testimonials.`)) {
        // Delete rejected Google reviews
        this.googleReviews = this.googleReviews.filter(review => approvedReviews.includes(review.id));
        
        // Delete rejected manual testimonials
        this.manualTestimonials = this.manualTestimonials.filter(testimonial => approvedReviews.includes(testimonial.id));
        
        // Save changes
        localStorage.setItem('googleReviews', JSON.stringify(this.googleReviews));
        localStorage.setItem('manualTestimonials', JSON.stringify(this.manualTestimonials));
        
        // Update display
        this.loadGoogleReviews();
        this.loadManualTestimonials();
        this.updateStats();
        this.notifyMainPageUpdate();
        
        alert(`All ${totalRejected} rejected reviews deleted successfully!`);
    }
}

// Delete all rejected reviews
deleteAllRejectedReviews() {
    const approvedReviews = this.reviewSettings.curation.approvedReviews || [];
    
    // Find rejected Google reviews
    const rejectedGoogleReviews = this.googleReviews.filter(review => !approvedReviews.includes(review.id));
    const rejectedManualTestimonials = this.manualTestimonials.filter(testimonial => !approvedReviews.includes(testimonial.id));
    
    const totalRejected = rejectedGoogleReviews.length + rejectedManualTestimonials.length;
    
    if (totalRejected === 0) {
        alert('No rejected reviews found to delete.');
        return;
    }
    
    if (confirm(`Are you sure you want to delete all ${totalRejected} rejected reviews? This includes ${rejectedGoogleReviews.length} Google reviews and ${rejectedManualTestimonials.length} manual testimonials.`)) {
        // Delete rejected Google reviews
        this.googleReviews = this.googleReviews.filter(review => approvedReviews.includes(review.id));
        
        // Delete rejected manual testimonials
        this.manualTestimonials = this.manualTestimonials.filter(testimonial => approvedReviews.includes(testimonial.id));
        
        // Save changes
        localStorage.setItem('googleReviews', JSON.stringify(this.googleReviews));
        localStorage.setItem('manualTestimonials', JSON.stringify(this.manualTestimonials));
        
        // Update display
        this.loadGoogleReviews();
        this.loadManualTestimonials();
        this.updateStats();
        this.notifyMainPageUpdate();
        
        alert(`All ${totalRejected} rejected reviews deleted successfully!`);
    }
}

// Delete all reviews (reset everything)
deleteAllReviews() {
    if (confirm('⚠️ DANGER ZONE! Are you sure you want to delete ALL reviews and testimonials? This will reset everything and cannot be undone!')) {
        if (confirm('❗️ THIS ACTION CANNOT BE UNDONE! All Google reviews and manual testimonials will be permanently deleted. Type "DELETE ALL" to confirm:')) {
            const userInput = prompt('Please type "DELETE ALL" to confirm permanent deletion:');
            
            if (userInput === 'DELETE ALL') {
                // Clear all review data
                this.googleReviews = [];
                this.manualTestimonials = [];
                this.reviewSettings.curation.approvedReviews = [];
                
                // Clear localStorage
                localStorage.removeItem('googleReviews');
                localStorage.removeItem('manualTestimonials');
                localStorage.removeItem('approvedReviews');
                this.saveSettings();
                
                // Update display
                this.loadGoogleReviews();
                this.loadManualTestimonials();
                this.updateStats();
                this.notifyMainPageUpdate();
                
                alert('✅ All reviews have been permanently deleted!');
            } else {
                alert('Deletion cancelled. Reviews are safe.');
            }
        }
    }
}


}


// Initialize review manager after DOM is loaded
let reviewManager;

document.addEventListener('DOMContentLoaded', function() {
    reviewManager = new ReviewManager();
    
    // Make it globally accessible for onclick handlers
    window.reviewManager = reviewManager;
});

// Fallback for older browsers
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (!window.reviewManager) {
            window.reviewManager = new ReviewManager();
        }
    });
} else {
    // DOM already loaded
    window.reviewManager = new ReviewManager();
}