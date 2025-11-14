// Review Management System
class ReviewManager {
    constructor() {
        this.googleReviews = [];
        this.manualTestimonials = JSON.parse(localStorage.getItem('manualTestimonials')) || [];
        this.settings = JSON.parse(localStorage.getItem('reviewSettings')) || {
            maxDisplay: 6,
            autoSync: 'disabled',
            showGoogle: true,
            showManual: true
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadGoogleReviews();
        this.loadManualTestimonials();
        this.updateStats();
        this.loadSettings();
    }
    
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
        
        // Google API connection
        document.getElementById('connect-google').addEventListener('click', () => {
            this.connectGoogleAPI();
        });
        
        // Sync reviews
        document.getElementById('sync-reviews').addEventListener('click', () => {
            this.syncGoogleReviews();
        });
        
        // Manual testimonial form
        document.getElementById('manual-testimonial-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addManualTestimonial();
        });
        
        // Settings
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });

         // Business search
    document.getElementById('search-business').addEventListener('click', () => {
        this.findPlaceId();
    });
    
    // Test connection
    document.getElementById('test-connection').addEventListener('click', () => {
        const placeId = document.getElementById('google-place-id').value;
        const apiKey = document.getElementById('google-api-key').value;
        if (placeId && apiKey) {
            this.testGoogleConnection(placeId, apiKey);
        } else {
            alert('Please enter both Place ID and API Key');
        }
    });
    
    // Auto-fill from stored credentials on page load
    this.loadStoredCredentials();
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
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?` +
            `place_id=${placeId}&` +
            `fields=name,formatted_address,rating,user_ratings_total&` +
            `key=${apiKey}`
        );
        
        const data = await response.json();
        
        if (data.result) {
            alert(`✅ Connection Successful!\n\nBusiness: ${data.result.name}\nAddress: ${data.result.formatted_address}\nRating: ${data.result.rating}/5\nTotal Reviews: ${data.result.user_ratings_total}`);
            return true;
        } else {
            alert('❌ Connection failed. Please check your Place ID and API Key.');
            return false;
        }
    } catch (error) {
        console.error('Connection test failed:', error);
        alert('❌ Connection test failed. Check your API key and try again.');
        return false;
    }
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
        syncBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing Reviews...';
        syncBtn.disabled = true;
        
        // Get place details including reviews
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?` +
            `place_id=${credentials.placeId}&` +
            `fields=name,rating,user_ratings_total,reviews&` +
            `key=${credentials.apiKey}`
        );
        
        const data = await response.json();
        
        if (data.result && data.result.reviews) {
            this.googleReviews = data.result.reviews.map(review => ({
                id: `google_${review.time}`,
                author_name: review.author_name,
                rating: review.rating,
                text: review.text,
                time: review.time * 1000, // Convert to milliseconds
                source: 'google',
                profile_photo_url: review.profile_photo_url,
                relative_time_description: review.relative_time_description
            }));
            
            localStorage.setItem('googleReviews', JSON.stringify(this.googleReviews));
            localStorage.setItem('lastSync', new Date().toISOString());
            
            this.loadGoogleReviews();
            this.updateStats();
            
            alert(`✅ Successfully synced ${this.googleReviews.length} Google reviews!`);
        } else {
            alert('No reviews found or unable to fetch reviews. The business might not have reviews or the API might not have access.');
        }
        
        // Reset button
        syncBtn.innerHTML = originalText;
        syncBtn.disabled = false;
        
    } catch (error) {
        console.error('Error syncing Google reviews:', error);
        alert('Error syncing reviews. Please check your API key and try again.');
        
        // Reset button
        const syncBtn = document.getElementById('sync-reviews');
        syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Sync Reviews Now';
        syncBtn.disabled = false;
    }
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

// Enhanced Google reviews display
loadGoogleReviews() {
    const stored = localStorage.getItem('googleReviews');
    if (stored) {
        this.googleReviews = JSON.parse(stored);
    }
    
    const container = document.getElementById('google-reviews-container');
    const lastSync = localStorage.getItem('lastSync');
    
    if (this.googleReviews.length === 0) {
        container.innerHTML = `
            <div class="no-reviews" style="text-align: center; padding: 40px;">
                <i class="fas fa-comments fa-3x" style="color: var(--light-gray); margin-bottom: 15px;"></i>
                <h3 style="color: var(--dark); margin-bottom: 10px;">No Google Reviews Synced</h3>
                <p style="color: var(--text-gray); margin-bottom: 20px;">Connect to Google API and sync your reviews to display them here.</p>
                ${lastSync ? `<small>Last sync: ${new Date(lastSync).toLocaleString()}</small>` : ''}
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <h4>${this.googleReviews.length} Google Reviews</h4>
            ${lastSync ? `<small>Last synced: ${new Date(lastSync).toLocaleString()}</small>` : ''}
        </div>
        ${this.googleReviews.map(review => `
            <div class="testimonial-item">
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
                        </div>
                        <small>${review.relative_time_description || new Date(review.time).toLocaleDateString()} • Google Review</small>
                    </div>
                </div>
                <p>${review.text}</p>
            </div>
        `).join('')}
    `;
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
    
    loadManualTestimonials() {
        const container = document.getElementById('manual-testimonials-container');
        
        if (this.manualTestimonials.length === 0) {
            container.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-comment-alt fa-3x"></i>
                    <h3>No Manual Testimonials</h3>
                    <p>Add your first manual testimonial using the form above.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.manualTestimonials.map(testimonial => `
            <div class="testimonial-item">
                <div class="testimonial-header">
                    <div class="testimonial-meta">
                        <strong>${testimonial.name}</strong>
                        ${testimonial.profession ? `<div class="review-profession">${testimonial.profession}</div>` : ''}
                        <div class="review-stars">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5-testimonial.rating)}</div>
                        <small>${new Date(testimonial.date).toLocaleDateString()} • Manual Testimonial</small>
                    </div>
                    <div class="testimonial-actions">
                        <button class="btn btn-sm btn-danger" onclick="reviewManager.deleteTestimonial('${testimonial.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p>${testimonial.text}</p>
            </div>
        `).join('');
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
        document.getElementById('max-reviews-display').value = this.settings.maxDisplay;
        document.getElementById('auto-sync').value = this.settings.autoSync;
        document.getElementById('show-google-reviews').checked = this.settings.showGoogle;
        document.getElementById('show-manual-testimonials').checked = this.settings.showManual;
    }
    
    saveSettings() {
        this.settings = {
            maxDisplay: parseInt(document.getElementById('max-reviews-display').value),
            autoSync: document.getElementById('auto-sync').value,
            showGoogle: document.getElementById('show-google-reviews').checked,
            showManual: document.getElementById('show-manual-testimonials').checked
        };
        
        localStorage.setItem('reviewSettings', JSON.stringify(this.settings));
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
}

// Initialize review manager
const reviewManager = new ReviewManager();