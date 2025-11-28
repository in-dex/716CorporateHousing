class PropertyListings {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.currentView = 'table';
        this.currentFilters = {
            status: 'all',
            bedrooms: 'all',
            price: 'all',
            search: ''
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
            
            // If no properties found, use some sample data based on the Monday.com layout
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
        
        document.getElementById('search-filter').addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });
        
        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });
        
        // Refresh button
        document.getElementById('refresh-listings').addEventListener('click', () => {
            this.refreshProperties();
        });
    }
    
    setupViewToggle() {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.closest('.toggle-btn').dataset.view;
                this.switchView(view);
            });
        });
    }
    
    switchView(view) {
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Show/hide views
        if (view === 'table') {
            document.getElementById('table-view').style.display = 'block';
            document.getElementById('card-view').style.display = 'none';
            this.loadTableView();
        } else {
            document.getElementById('table-view').style.display = 'none';
            document.getElementById('card-view').style.display = 'block';
            this.loadCardView();
        }
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
            search: ''
        };
        
        document.getElementById('status-filter').value = 'all';
        document.getElementById('bedroom-filter').value = 'all';
        document.getElementById('price-filter').value = 'all';
        document.getElementById('search-filter').value = '';
        
        this.applyFilters();
    }
    
  updateStats() {
    const total = this.properties.length;
    const filtered = this.filteredProperties.length;
    
    // Update results count
    document.getElementById('results-count').textContent = filtered;
    
    }
    
    updateActiveFilters() {
        const activeFilters = document.getElementById('active-filters');
        const filterTags = document.getElementById('filter-tags');
        
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
            }
        };
        
        return labels[type][value] || value;
    }
    
    loadTableView() {
        const tbody = document.getElementById('table-body');
        const noResults = document.getElementById('table-no-results');
        
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
                    <div class="availability-date">${property.availability}</div>
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
                        <span>${property.availability}</span>
                    </div>
                    <div class="card-actions">
                        ${property.listing ? `
                            <button class="action-btn" onclick="propertyListings.viewListing(${property.id})">
                                <i class="fas fa-file-alt"></i> Listing
                            </button>
                        ` : ''}
                        ${property.video ? `
                            <button class="action-btn video" onclick="propertyListings.playVideo('${property.video})">
                                <i class="fas fa-play"></i> Video Tour
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
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
        const property = this.properties.find(p => p.id === propertyId);
        if (property) {
            // Open property modal or redirect to detailed view
            alert(`Opening detailed listing for ${property.title}`);
            // In real implementation, you would open a modal or navigate to property details
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
        const originalText = refreshBtn.innerHTML;
        
        refreshBtn.innerHTML = '<i class="fas fa-check"></i> Updated!';
        refreshBtn.disabled = true;
        
        setTimeout(() => {
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
        }, 2000);
    }
}

// Initialize when DOM is loaded
let propertyListings;

document.addEventListener('DOMContentLoaded', function() {
    propertyListings = new PropertyListings();
    window.propertyListings = propertyListings;
    
    // Mobile menu functionality
    document.querySelector('.mobile-menu')?.addEventListener('click', function() {
        document.querySelector('.nav-links').classList.toggle('active');
    });
});