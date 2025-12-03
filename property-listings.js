// Property Listings Class - FIXED VERSION
class PropertyListings {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.currentView = 'table';
        this.currentFilters = {
            status: 'all',
            bedrooms: 'all',
            price: 'all',
            search: '',
            date: 'all',
            startDate: null,
            endDate: null
        };
        
        this.init();
    }
    
    init() {
        this.loadProperties();
        this.setupEventListeners();
        this.setupViewToggle();
        this.applyFilters();
    }
    
    loadProperties() {
        // Load from localStorage or use default properties
        try {
            const storedProperties = JSON.parse(localStorage.getItem('properties')) || [];
            const managedProperties = JSON.parse(localStorage.getItem('managedProperties')) || [];
            
            // Combine properties from different sources
            this.properties = [...storedProperties, ...managedProperties];
            
            // If no properties found, use some sample data with dates
            if (this.properties.length === 0) {
                this.properties = this.getSampleProperties();
            }
            
            console.log('Loaded properties:', this.properties.length);
        } catch (e) {
            console.error('Error loading properties:', e);
            this.properties = this.getSampleProperties();
        }
    }
    
    getSampleProperties() {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        const twoWeeks = new Date(today);
        twoWeeks.setDate(today.getDate() + 14);
        
        const nextMonth = new Date(today);
        nextMonth.setDate(today.getDate() + 30);
        
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 60);
        
        return [
            {
                id: 1,
                title: "140 Commonwealth Ave",
                address: "140 Commonwealth Ave, Buffalo, NY",
                bedrooms: 3,
                bathrooms: 1,
                price: "2600-4000",
                priceMin: 2600,
                priceMax: 4000,
                availability: "Ready Soon",
                status: "ready-soon",
                availableDate: twoWeeks.toISOString().split('T')[0],
                image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                video: true,
                listing: true
            },
            {
                id: 2,
                title: "20 South St.",
                address: "20 South St, Buffalo, NY",
                bedrooms: 2,
                bathrooms: 1,
                price: "2000-2600",
                priceMin: 2000,
                priceMax: 2600,
                availability: "Ready Now",
                status: "ready-now",
                availableDate: today.toISOString().split('T')[0],
                image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                video: true,
                listing: true
            },
            {
                id: 3,
                title: "36 E Utica (3B)",
                address: "36 E Utica St, Buffalo, NY",
                bedrooms: 2,
                bathrooms: 1,
                price: "2000-2500",
                priceMin: 2000,
                priceMax: 2500,
                availability: "Ready Now",
                status: "ready-now",
                availableDate: today.toISOString().split('T')[0],
                image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                video: true,
                listing: true
            },
            {
                id: 4,
                title: "664 Auburn #2",
                address: "664 Auburn Ave, Buffalo, NY",
                bedrooms: 2,
                bathrooms: 1,
                price: "2200-2500",
                priceMin: 2200,
                priceMax: 2500,
                availability: "Dec. 20",
                status: "ready-soon",
                availableDate: nextWeek.toISOString().split('T')[0],
                image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                video: true,
                listing: true
            },
            {
                id: 5,
                title: "28 Poinciana Pkwy Unit 2",
                address: "28 Poinciana Pkwy, Buffalo, NY",
                bedrooms: 2,
                bathrooms: 1,
                price: "2300-3000",
                priceMin: 2300,
                priceMax: 3000,
                availability: "Ready Soon ASK",
                status: "ask",
                availableDate: futureDate.toISOString().split('T')[0],
                image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                video: true,
                listing: true
            }
        ];
    }
    
    setupEventListeners() {
        // Filter event listeners
        document.getElementById('status-filter').addEventListener('change', (e) => {
            this.currentFilters.status = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('bedroom-filter').addEventListener('change', (e) => {
            this.currentFilters.bedrooms = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('price-filter').addEventListener('change', (e) => {
            this.currentFilters.price = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('date-filter').addEventListener('change', (e) => {
            this.currentFilters.date = e.target.value;
            
            // Show/hide custom date range
            const customDateRange = document.getElementById('custom-date-range');
            if (e.target.value === 'custom') {
                customDateRange.style.display = 'block';
            } else {
                customDateRange.style.display = 'none';
                this.applyFilters();
            }
        });
        
        document.getElementById('search-filter').addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });
        
        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });
        
        // Custom date range apply button
        document.getElementById('apply-custom-date').addEventListener('click', () => {
            this.applyCustomDateFilter();
        });
        
        // Refresh button
        const refreshBtn = document.getElementById('refresh-listings');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshProperties();
            });
        }
    }
    
    setupViewToggle() {
        const toggleButtons = document.querySelectorAll('.toggle-btn');
        
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent any default behavior
                e.stopPropagation(); // Stop event bubbling
                
                const view = btn.dataset.view;
                console.log('Toggle button clicked, switching to view:', view);
                this.switchView(view);
            });
        });
        
        console.log('View toggle setup complete. Found buttons:', toggleButtons.length);
    }
    
    applyCustomDateFilter() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            alert('Start date cannot be after end date');
            return;
        }
        
        this.currentFilters.startDate = startDate;
        this.currentFilters.endDate = endDate;
        this.applyFilters();
    }
    
    switchView(view) {
        console.log('Switching to view:', view);
        
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`[data-view="${view}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Show/hide views
        const tableView = document.getElementById('table-view');
        const cardView = document.getElementById('card-view');
        
        if (view === 'table') {
            if (tableView) tableView.style.display = 'block';
            if (cardView) cardView.style.display = 'none';
            this.loadTableView();
        } else {
            if (tableView) tableView.style.display = 'none';
            if (cardView) cardView.style.display = 'block';
            this.loadCardView();
        }
        
        console.log('View switched successfully to:', view);
    }
    
    applyFilters() {
        this.filteredProperties = this.properties.filter(property => {
            // Status filter
            if (this.currentFilters.status !== 'all' && property.status !== this.currentFilters.status) {
                return false;
            }
            
            // Bedrooms filter
            if (this.currentFilters.bedrooms !== 'all') {
                const beds = parseInt(this.currentFilters.bedrooms);
                if (this.currentFilters.bedrooms === '4') {
                    if (property.bedrooms < 4) return false;
                } else {
                    if (property.bedrooms !== beds) return false;
                }
            }
            
            // Price filter
            if (this.currentFilters.price !== 'all') {
                const [min, max] = this.currentFilters.price === '4000-plus' 
                    ? [4000, 99999] 
                    : this.currentFilters.price.split('-').map(Number);
                
                if (property.priceMin > max || property.priceMax < min) {
                    return false;
                }
            }
            
            // Date filter
            if (this.currentFilters.date !== 'all' && property.availableDate) {
                const availableDate = new Date(property.availableDate);
                const today = new Date();
                
                switch (this.currentFilters.date) {
                    case 'available-now':
                        if (availableDate > today) return false;
                        break;
                    case 'next-7-days':
                        const nextWeek = new Date(today);
                        nextWeek.setDate(today.getDate() + 7);
                        if (availableDate < today || availableDate > nextWeek) return false;
                        break;
                    case 'next-30-days':
                        const nextMonth = new Date(today);
                        nextMonth.setDate(today.getDate() + 30);
                        if (availableDate < today || availableDate > nextMonth) return false;
                        break;
                    case 'next-90-days':
                        const next90Days = new Date(today);
                        next90Days.setDate(today.getDate() + 90);
                        if (availableDate < today || availableDate > next90Days) return false;
                        break;
                    case 'custom':
                        if (this.currentFilters.startDate && this.currentFilters.endDate) {
                            const startDate = new Date(this.currentFilters.startDate);
                            const endDate = new Date(this.currentFilters.endDate);
                            if (availableDate < startDate || availableDate > endDate) return false;
                        }
                        break;
                }
            }
            
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const searchableText = `
                    ${property.title} 
                    ${property.address} 
                    ${property.bedrooms} 
                    ${property.bathrooms}
                `.toLowerCase();
                
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.updateStats();
        this.updateActiveFilters();
        
        // Reload current view
        if (this.currentView === 'table') {
            this.loadTableView();
        } else {
            this.loadCardView();
        }
    }
    
    resetFilters() {
        this.currentFilters = {
            status: 'all',
            bedrooms: 'all',
            price: 'all',
            search: '',
            date: 'all',
            startDate: null,
            endDate: null
        };
        
        document.getElementById('status-filter').value = 'all';
        document.getElementById('bedroom-filter').value = 'all';
        document.getElementById('price-filter').value = 'all';
        document.getElementById('date-filter').value = 'all';
        document.getElementById('search-filter').value = '';
        
        const customDateRange = document.getElementById('custom-date-range');
        if (customDateRange) customDateRange.style.display = 'none';
        
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        if (startDate) startDate.value = '';
        if (endDate) endDate.value = '';
        
        this.applyFilters();
    }
    
    updateStats() {
        const total = this.properties.length;
        const filtered = this.filteredProperties.length;
        
        // Update results count
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = filtered;
        }
    }
    
    updateActiveFilters() {
        const activeFilters = document.getElementById('active-filters');
        const filterTags = document.getElementById('filter-tags');
        
        if (!activeFilters || !filterTags) return;
        
        const activeFiltersList = [];
        
        if (this.currentFilters.status !== 'all') {
            activeFiltersList.push({
                type: 'status',
                label: this.getFilterLabel('status', this.currentFilters.status),
                value: this.currentFilters.status
            });
        }
        
        if (this.currentFilters.bedrooms !== 'all') {
            activeFiltersList.push({
                type: 'bedrooms',
                label: this.getFilterLabel('bedrooms', this.currentFilters.bedrooms),
                value: this.currentFilters.bedrooms
            });
        }
        
        if (this.currentFilters.price !== 'all') {
            activeFiltersList.push({
                type: 'price',
                label: this.getFilterLabel('price', this.currentFilters.price),
                value: this.currentFilters.price
            });
        }
        
        if (this.currentFilters.date !== 'all') {
            activeFiltersList.push({
                type: 'date',
                label: this.getFilterLabel('date', this.currentFilters.date),
                value: this.currentFilters.date
            });
        }
        
        if (this.currentFilters.search) {
            activeFiltersList.push({
                type: 'search',
                label: `Search: "${this.currentFilters.search}"`,
                value: this.currentFilters.search
            });
        }
        
        if (activeFiltersList.length > 0) {
            activeFilters.style.display = 'block';
            filterTags.innerHTML = activeFiltersList.map(filter => `
                <span class="filter-tag">
                    ${filter.label}
                    <button class="remove-filter" onclick="propertyListings.removeFilter('${filter.type}')">
                        <i class="fas fa-times"></i>
                    </button>
                </span>
            `).join('');
        } else {
            activeFilters.style.display = 'none';
        }
    }
    
    removeFilter(type) {
        switch (type) {
            case 'status':
                this.currentFilters.status = 'all';
                document.getElementById('status-filter').value = 'all';
                break;
            case 'bedrooms':
                this.currentFilters.bedrooms = 'all';
                document.getElementById('bedroom-filter').value = 'all';
                break;
            case 'price':
                this.currentFilters.price = 'all';
                document.getElementById('price-filter').value = 'all';
                break;
            case 'date':
                this.currentFilters.date = 'all';
                document.getElementById('date-filter').value = 'all';
                const customDateRange = document.getElementById('custom-date-range');
                if (customDateRange) customDateRange.style.display = 'none';
                break;
            case 'search':
                this.currentFilters.search = '';
                document.getElementById('search-filter').value = '';
                break;
        }
        this.applyFilters();
    }
    
    getFilterLabel(type, value) {
        const labels = {
            status: {
                'all': 'All Properties',
                'ready-now': 'Ready Now',
                'ready-soon': 'Ready Soon',
                'ask': 'Contact for Availability'
            },
            bedrooms: {
                'all': 'Any Bedrooms',
                '1': '1 Bedroom',
                '2': '2 Bedrooms',
                '3': '3 Bedrooms',
                '4': '4+ Bedrooms'
            },
            price: {
                'all': 'Any Price',
                '1500-2000': '$1,500 - $2,000',
                '2000-2500': '$2,000 - $2,500',
                '2500-3000': '$2,500 - $3,000',
                '3000-4000': '$3,000 - $4,000',
                '4000-plus': '$4,000+'
            },
            date: {
                'all': 'Any Date',
                'available-now': 'Available Now',
                'next-7-days': 'Next 7 Days',
                'next-30-days': 'Next 30 Days',
                'next-90-days': 'Next 90 Days',
                'custom': 'Custom Date Range'
            }
        };
        
        return labels[type][value] || value;
    }
    
    loadTableView() {
        const tbody = document.getElementById('table-body');
        const noResults = document.getElementById('table-no-results');
        
        if (!tbody || !noResults) return;
        
        
        if (this.filteredProperties.length === 0) {
            tbody.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        tbody.innerHTML = this.filteredProperties.map(property => `
            <tr>
                <td>
                    <div class="property-info-table">
                        <h4>${property.title}</h4>
                        <div class="bed-bath">${property.bedrooms} Bed ${property.bathrooms} Bath</div>
                    </div>
                </td>
                <td>
                    <div class="price-range">$${property.price}</div>
                </td>
                <td>
                    <div class="availability-badge badge-${property.status}">
                        ${this.getAvailabilityBadge(property.status)}
                    </div>
                    <div class="availability-date">${this.formatAvailabilityDate(property.availableDate)}</div>
                </td>
                <td>
                    <div class="table-actions">
                        ${property.listing ? `
                            <button class="action-btn" onclick="propertyListings.viewListing(${property.id})">
                                <i class="fas fa-file-alt"></i> Listing
                            </button>
                        ` : ''}
                        ${property.video ? `
                            <button class="action-btn video" onclick="propertyListings.playVideo('${property.video}')">
                                <i class="fas fa-play"></i> Video
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    loadCardView() {
        const grid = document.getElementById('properties-grid');
        const noResults = document.getElementById('card-no-results');
        
        if (!grid || !noResults) return;
        
        if (this.filteredProperties.length === 0) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        grid.innerHTML = this.filteredProperties.map(property => `
            <div class="property-card-listings">
                <div class="card-header">
                    <img src="${property.image}" alt="${property.title}" loading="lazy">
                    <div class="card-badge badge-${property.status}">
                        ${this.getAvailabilityBadge(property.status)}
                    </div>
                </div>
                <div class="card-content">
                    <h3>${property.title}</h3>
                    <div class="card-bed-bath">${property.bedrooms} Bed ${property.bathrooms} Bath</div>
                    <div class="card-price">$${property.price}/month</div>
                    <div class="card-availability">
                        <i class="fas fa-calendar-check"></i>
                        <span>${this.formatAvailabilityDate(property.availableDate)}</span>
                    </div>
                    <div class="card-actions">
                        ${property.listing ? `
                            <button class="action-btn" onclick="propertyListings.viewListing(${property.id})">
                                <i class="fas fa-file-alt"></i> Listing
                            </button>
                        ` : ''}
                        ${property.video ? `
                            <button class="action-btn video" onclick="propertyListings.playVideo('${property.video}')">
                                <i class="fas fa-play"></i> Video Tour
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    formatAvailabilityDate(dateString) {
        if (!dateString) return 'Contact for availability';
        
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Available Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Available Tomorrow';
        } else {
            return `Available ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
    }
    
    getAvailabilityBadge(status) {
        const badges = {
            'ready-now': 'Ready Now',
            'ready-soon': 'Ready Soon',
            'ask': 'Contact for Availability'
        };
        return badges[status] || 'Available';
    }
    
viewListing(propertyId) {
    // Open the same link for ALL properties when listing button is clicked
    window.open("https://my.innago.com/l/9183Iw6DXBS", "_blank");
    
    // Optional: You can still get the property info if needed
    const property = this.properties.find(p => p.id === propertyId);
    if (property) {
        console.log(`Opening listing for: ${property.title}`);
    }
}
    
    playVideo(videoUrl) {
        if (videoUrl && videoUrl !== 'true') {
            // Use existing video modal functionality
            if (typeof playVideo === 'function') {
                playVideo(videoUrl);
            } else {
                window.open(videoUrl, '_blank');
            }
        } else {
            alert('Video tour coming soon!');
        }
    }
    
    refreshProperties() {
        this.loadProperties();
        this.applyFilters();
        
        // Show feedback
        const refreshBtn = document.getElementById('refresh-listings');
        if (refreshBtn) {
            const originalText = refreshBtn.innerHTML;
            
            refreshBtn.innerHTML = '<i class="fas fa-check"></i> Updated!';
            refreshBtn.disabled = true;
            
            setTimeout(() => {
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
            }, 2000);
        }
    }
}

// Initialize when DOM is loaded
let propertyListings;

// Replace your current initialization code at the bottom with:
if (!window.propertyListingsInitialized) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Initializing Property Listings...');
        
        // Only initialize once
        if (!window.propertyListings) {
            propertyListings = new PropertyListings();
            window.propertyListings = propertyListings;
            window.propertyListingsInitialized = true;
        }
        
        console.log('Property Listings initialized successfully');
    });
}