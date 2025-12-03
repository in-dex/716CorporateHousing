// Properties data and filtering functionality
import { defaultProperties } from './data/properties-data.js';

export function initializeProperties() {
    loadManagedProperties();
    initializeFilters();
    loadProperties();
    setupPropertyModal();
    setupVideoModal();
    
    // Make refresh function globally available
    window.refreshPropertiesModule = refreshProperties;
}

// Load managed properties from localStorage
export function loadManagedProperties() {
    try {
        // Clear existing properties array
        window.properties.length = 0;
        
        // Try to load from main properties storage first
        const mainProperties = JSON.parse(localStorage.getItem('properties')) || [];
        
        console.log('Main properties from storage:', mainProperties.length);
        
        if (mainProperties.length > 0) {
            // Use properties from storage
            window.properties.push(...mainProperties);
            console.log('Loaded properties from storage:', window.properties.length);
        } else {
            // Fallback to default properties
            window.properties.push(...defaultProperties);
            console.log('Using default properties:', window.properties.length);
        }
        
        // Log all property titles for debugging
        console.log('Property titles:', window.properties.map(p => p.title));
        
    } catch (e) {
        console.error('Error loading properties:', e);
        // Fallback to default properties
        window.properties.length = 0;
        window.properties.push(...defaultProperties);
    }
}

// Initialize filters
export function initializeFilters() {
    // Set up filter button events
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            window.currentFilters.status = filter;
            applyFilters();
        });
    });

    // Set up select filter events with auto-apply
    const locationFilter = document.getElementById('location-filter');
    const priceFilter = document.getElementById('price-range');
    const bedroomsFilter = document.getElementById('bedrooms');
    const filterBtn = document.getElementById('filter-btn');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const clearAllFiltersBtn = document.getElementById('clear-all-filters');

    locationFilter?.addEventListener('change', function() {
        window.currentFilters.location = this.value;
        if (this.value === 'closest') {
            getUserLocation();
        } else {
            applyFilters();
        }
    });

    priceFilter?.addEventListener('change', function() {
        window.currentFilters.price = this.value;
        applyFilters();
    });

    bedroomsFilter?.addEventListener('change', function() {
        window.currentFilters.bedrooms = this.value;
        applyFilters();
    });

    // Apply filters button (for consistency)
    filterBtn?.addEventListener('click', applyFilters);
    
    // Reset filters
    resetFiltersBtn?.addEventListener('click', resetFilters);
    clearAllFiltersBtn?.addEventListener('click', resetFilters);
}

// Main filter function
export function applyFilters() {
    let filteredProperties = [...window.properties];
    const totalProperties = filteredProperties.length;

    // Status filter
    if (window.currentFilters.status !== 'all') {
        filteredProperties = filteredProperties.filter(property => 
            property.status === window.currentFilters.status
        );
    }

    // Location filter
    if (window.currentFilters.location !== 'all') {
        switch (window.currentFilters.location) {
            case 'closest':
                if (window.userLocation) {
                    filteredProperties = filteredProperties
                        .filter(p => p.distance !== null)
                        .sort((a, b) => a.distance - b.distance);
                }
                break;
            case 'downtown':
                filteredProperties = filteredProperties.filter(property => 
                    property.coordinates.lng < -78.87
                );
                break;
            case 'university':
                filteredProperties = filteredProperties.filter(property => 
                    property.coordinates.lat > 42.90
                );
                break;
            case 'medical':
                filteredProperties = filteredProperties.filter(property => 
                    property.coordinates.lat < 42.90 && property.coordinates.lng > -78.88
                );
                break;
        }
    }

    // Price filter
    if (window.currentFilters.price !== 'all') {
        filteredProperties = filteredProperties.filter(property => {
            const [min, max] = window.currentFilters.price.split('-').map(Number);
            return property.priceMin >= min && property.priceMax <= max;
        });
    }

    // Bedrooms filter
    if (window.currentFilters.bedrooms !== 'all') {
        const beds = parseInt(window.currentFilters.bedrooms);
        filteredProperties = filteredProperties.filter(property => 
            property.bedrooms === beds || (beds === 4 && property.bedrooms >= 4)
        );
    }

    // Update results count
    updateResultsCount(filteredProperties.length, totalProperties);
    
    // Update active filters display
    updateActiveFiltersDisplay();
    
    // Load filtered properties
    loadFilteredProperties(filteredProperties);
    
    // Only scroll if it's NOT the initial page load AND we have active filters
    const hasActiveFilters = window.currentFilters.status !== 'all' || 
                           window.currentFilters.location !== 'all' || 
                           window.currentFilters.price !== 'all' || 
                           window.currentFilters.bedrooms !== 'all';
    
    if (!window.isInitialLoad && hasActiveFilters) {
        // Smooth scroll to properties section after a short delay
        setTimeout(() => {
            const propertiesSection = document.getElementById('properties');
            if (propertiesSection) {
                propertiesSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start'
                });
            }
        }, 400);
    }
}

// Load properties to display
export function loadProperties() {
    window.isInitialLoad = true;
    
    // Just call applyFilters to load all properties initially
    applyFilters();
    
    // Remove the flag after a short delay
    setTimeout(() => {
        window.isInitialLoad = false;
    }, 1000);
}

// Refresh properties from localStorage
export function refreshProperties() {
    console.log('Refreshing properties...');
    
    // Use the sync function
    syncProperties();
    
    // Show success feedback
    const refreshBtn = document.getElementById('refresh-properties');
    if (refreshBtn) {
        const originalText = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fas fa-check"></i> Properties Updated!';
        refreshBtn.disabled = true;
        
        setTimeout(() => {
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
        }, 2000);
    }
}

// Sync properties from localStorage
export function syncProperties() {
    console.log('=== MANUAL SYNC START ===');
    
    // Clear current properties
    window.properties.length = 0;
    
    // Try multiple storage locations
    const mainStorage = JSON.parse(localStorage.getItem('properties')) || [];
    const managedStorage = JSON.parse(localStorage.getItem('managedProperties')) || [];
    
    console.log('Main storage:', mainStorage.length, 'properties');
    console.log('Managed storage:', managedStorage.length, 'properties');
    
    // Use main storage if available, otherwise use managed storage
    if (mainStorage.length > 0) {
        window.properties.push(...mainStorage);
        console.log('Using main storage properties');
    } else if (managedStorage.length > 0) {
        window.properties.push(...managedStorage);
        console.log('Using managed storage properties');
    } else {
        window.properties.push(...defaultProperties);
        console.log('Using default properties');
    }
    
    console.log('Total properties after sync:', window.properties.length);
    console.log('Property titles:', window.properties.map(p => p.title));
    console.log('=== MANUAL SYNC END ===');
    
    // Refresh the display
    applyFilters();
}

// Setup property modal
function setupPropertyModal() {
    const modalClose = document.getElementById('modal-close');
    const modal = document.getElementById('property-modal');
    
    if (!modalClose || !modal) return;
    
    // Close Property Modal
    modalClose.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Setup video modal
function setupVideoModal() {
    // Video modal functionality will be handled by individual video buttons


}

updateResultsCount(properties.length, properties.length);

// Update results count
function updateResultsCount(shown, total) {
    const resultsCount = document.getElementById('results-count');
    const propertiesCount = document.getElementById('properties-count');
    
    propertiesCount.textContent = shown;
    
    if (shown === total) {
        resultsCount.innerHTML = `Showing <span id="properties-count">${shown}</span> of ${total} properties`;
    } else {
        resultsCount.innerHTML = `Showing <span id="properties-count">${shown}</span> of ${total} properties <span style="color: var(--primary);">(${total - shown} hidden)</span>`;
    }
}

// Get user location for distance calculation
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                calculateDistances();
                applyFilters();
            },
            function(error) {
                console.log('Geolocation error:', error);
                alert('Unable to get your location. Showing all properties.');
                currentFilters.location = 'all';
                applyFilters();
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
        currentFilters.location = 'all';
        applyFilters();
    }
}

// Calculate distances from user location
function calculateDistances() {
    if (!userLocation) return;

    properties.forEach(property => {
        if (property.coordinates) {
            property.distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                property.coordinates.lat,
                property.coordinates.lng
            );
        }
    });
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;
    const distanceMiles = distanceKm * 0.621371;
    
    return Math.round(distanceMiles * 10) / 10; // Round to 1 decimal
}

// Load managed properties from localStorage and merge with default properties
// Load properties from localStorage
function loadManagedProperties() {
    try {
        // Clear existing properties array
        properties.length = 0;
        
        // Try to load from main properties storage first
        const mainProperties = JSON.parse(localStorage.getItem('properties')) || [];
        
        console.log('Main properties from storage:', mainProperties.length);
        
        if (mainProperties.length > 0) {
            // Use properties from storage
            properties.push(...mainProperties);
            console.log('Loaded properties from storage:', properties.length);
        } else {
            // Fallback to default properties
            properties.push(...defaultProperties);
            console.log('Using default properties:', properties.length);
        }
        
        // Log all property titles for debugging
        console.log('Property titles:', properties.map(p => p.title));
        
    } catch (e) {
        console.error('Error loading properties:', e);
        // Fallback to default properties
        properties.length = 0;
        properties.push(...defaultProperties);
    }
}


// Main filter function
function applyFilters() {
    let filteredProperties = [...properties];
    const totalProperties = filteredProperties.length;

    // Status filter
    if (currentFilters.status !== 'all') {
        filteredProperties = filteredProperties.filter(property => 
            property.status === currentFilters.status
        );
    }

    // Location filter
    if (currentFilters.location !== 'all') {
        switch (currentFilters.location) {
            case 'closest':
                if (userLocation) {
                    filteredProperties = filteredProperties
                        .filter(p => p.distance !== null)
                        .sort((a, b) => a.distance - b.distance);
                }
                break;
            case 'downtown':
                filteredProperties = filteredProperties.filter(property => 
                    property.coordinates.lng < -78.87
                );
                break;
            case 'university':
                filteredProperties = filteredProperties.filter(property => 
                    property.coordinates.lat > 42.90
                );
                break;
            case 'medical':
                filteredProperties = filteredProperties.filter(property => 
                    property.coordinates.lat < 42.90 && property.coordinates.lng > -78.88
                );
                break;
        }
    }

    // Price filter
    if (currentFilters.price !== 'all') {
        filteredProperties = filteredProperties.filter(property => {
            const [min, max] = currentFilters.price.split('-').map(Number);
            return property.priceMin >= min && property.priceMax <= max;
        });
    }

    // Bedrooms filter
    if (currentFilters.bedrooms !== 'all') {
        const beds = parseInt(currentFilters.bedrooms);
        filteredProperties = filteredProperties.filter(property => 
            property.bedrooms === beds || (beds === 4 && property.bedrooms >= 4)
        );
    }

    // Update results count
    updateResultsCount(filteredProperties.length, totalProperties);
    
    // Update active filters display
    updateActiveFiltersDisplay();
    
    // Load filtered properties
    loadFilteredProperties(filteredProperties);
    
    // Only scroll if it's NOT the initial page load AND we have active filters
    const hasActiveFilters = currentFilters.status !== 'all' || 
                           currentFilters.location !== 'all' || 
                           currentFilters.price !== 'all' || 
                           currentFilters.bedrooms !== 'all';
    
    if (!window.isInitialLoad && hasActiveFilters) {
        // Smooth scroll to properties section after a short delay
        setTimeout(() => {
            const propertiesSection = document.getElementById('properties');
            if (propertiesSection) {
                propertiesSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start'
                });
            }
        }, 400);
    }
}


// Load filtered properties with smooth animations
function loadFilteredProperties(filteredProperties) {
    const propertiesContainer = document.getElementById('properties-container');
    const allPropertyCards = propertiesContainer.querySelectorAll('.property-card');
    
    // First, fade out all cards
    allPropertyCards.forEach(card => {
        card.classList.add('filtered-out');
    });
    
    // Wait for fade out, then update content
    setTimeout(() => {
        propertiesContainer.innerHTML = '';
        
        if (filteredProperties.length === 0) {
            propertiesContainer.innerHTML = `
                <div class="no-results fade-in">
                    <i class="fas fa-search fa-3x"></i>
                    <h3>No properties match your filters</h3>
                    <p>Try adjusting your criteria or resetting the filters to see all available properties.</p>
                    <button class="btn" onclick="resetFilters()">
                        <i class="fas fa-refresh"></i> Reset All Filters
                    </button>
                </div>
            `;
            return;
        }
        
        filteredProperties.forEach((property, index) => {
            const propertyCard = createPropertyCard(property, index);
            propertiesContainer.appendChild(propertyCard);
        });
        
        // Trigger animations
        setTimeout(() => {
            document.querySelectorAll('.scale-in').forEach(el => {
                el.classList.add('visible');
            });
        }, 100);
        
    }, 300);
}

// Enhanced property card creation
function createPropertyCard(property, index) {
    const propertyCard = document.createElement('div');
    propertyCard.className = `property-card scale-in`;
    propertyCard.style.transitionDelay = `${index * 0.1}s`;
    propertyCard.setAttribute('data-id', property.id);
    
    let distanceInfo = '';
    if (property.distance !== null && currentFilters.location === 'closest') {
        distanceInfo = `
            <div class="property-distance">
                <i class="fas fa-location-arrow"></i> 
                ${property.distance} miles away
                ${property.distance < 2 ? '<span class="distance-badge">Very Close!</span>' : ''}
            </div>`;
    }
    
    // Status badge
    let statusBadge = '';
    if (property.status === 'ask') {
        statusBadge = '<div class="property-badge">Contact for Availability</div>';
    } else if (property.status === 'ready-now') {
        statusBadge = '<div class="property-badge ready-now">Ready Now!</div>';
    } else if (property.status === 'ready-soon') {
        statusBadge = '<div class="property-badge ready-soon">Coming Soon</div>';
    }
    
    propertyCard.innerHTML = `
        ${statusBadge}
        <div class="property-img-container">
            <img src="${property.image}" alt="${property.title}" class="property-img" loading="lazy">
            ${property.video ? `
                <div class="video-indicator" onclick="event.stopPropagation(); playVideo('${property.video}')">
                    <i class="fas fa-play"></i>
                    Video Tour
                </div>
            ` : ''}
        </div>
        <div class="property-info">
            <h3 class="property-title">${property.title}</h3>
            <div class="property-location">
                <i class="fas fa-map-marker-alt"></i> ${property.location}
            </div>
            ${distanceInfo}
            <div class="property-features">
                <div class="property-feature">
                    <i class="fas fa-bed"></i> ${property.bedrooms} Bed
                </div>
                <div class="property-feature">
                    <i class="fas fa-bath"></i> ${property.bathrooms} Bath
                </div>
                <div class="property-feature">
                    <i class="fas fa-ruler-combined"></i> ${property.bedrooms * 500 + 300} sq ft
                </div>
            </div>
            <div class="property-price">$${property.price}<span>/month</span></div>
            <div class="property-availability">
                <i class="fas fa-calendar-check"></i> ${property.availability}
            </div>
            <button class="btn view-details-btn">
                <i class="fas fa-eye"></i> View Details
            </button>
        </div>
    `;
    
    // Add event listeners
    const viewBtn = propertyCard.querySelector('.view-details-btn');
    viewBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        openPropertyModal(property.id);
    });
    
    propertyCard.addEventListener('click', function() {
        openPropertyModal(property.id);
    });
    
    return propertyCard;
}

// Update active filters display
function updateActiveFiltersDisplay() {
    const activeFiltersContainer = document.getElementById('active-filters');
    const activeFilterTags = document.getElementById('active-filter-tags');
    
    const activeFilters = [];
    
    if (currentFilters.status !== 'all') {
        activeFilters.push({
            type: 'status',
            label: getFilterLabel('status', currentFilters.status),
            value: currentFilters.status
        });
    }
    
    if (currentFilters.location !== 'all') {
        activeFilters.push({
            type: 'location',
            label: getFilterLabel('location', currentFilters.location),
            value: currentFilters.location
        });
    }
    
    if (currentFilters.price !== 'all') {
        activeFilters.push({
            type: 'price',
            label: getFilterLabel('price', currentFilters.price),
            value: currentFilters.price
        });
    }
    
    if (currentFilters.bedrooms !== 'all') {
        activeFilters.push({
            type: 'bedrooms',
            label: getFilterLabel('bedrooms', currentFilters.bedrooms),
            value: currentFilters.bedrooms
        });
    }
    
    if (activeFilters.length > 0) {
        activeFiltersContainer.style.display = 'block';
        activeFilterTags.innerHTML = activeFilters.map(filter => `
            <span class="active-filter-tag" data-type="${filter.type}" data-value="${filter.value}">
                ${filter.label}
                <button class="remove-filter" onclick="removeFilter('${filter.type}')">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `).join('');
    } else {
        activeFiltersContainer.style.display = 'none';
    }
}

// Get filter label for display
function getFilterLabel(type, value) {
    const labels = {
        status: {
            'all': 'All Properties',
            'ready-now': 'Ready Now',
            'ready-soon': 'Ready Soon',
            'ask': 'Contact for Availability'
        },
        location: {
            'all': 'All Locations',
            'closest': 'Closest to Me',
            'downtown': 'Near Downtown',
            'university': 'Near Universities',
            'medical': 'Near Medical Centers'
        },
        price: {
            'all': 'All Prices',
            '2000-2500': '$2,000 - $2,500',
            '2500-3000': '$2,500 - $3,000',
            '3000-4000': '$3,000 - $4,000',
            '4000-plus': '$4,000+'
        },
        bedrooms: {
            'all': 'Any Bedrooms',
            '2': '2 Bedrooms',
            '3': '3 Bedrooms',
            '4': '4+ Bedrooms'
        }
    };
    
    return labels[type][value] || value;
}

// Remove individual filter
function removeFilter(type) {
    switch (type) {
        case 'status':
            currentFilters.status = 'all';
            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
            document.querySelectorAll('.filter-btn:not([data-filter="all"])').forEach(btn => {
                btn.classList.remove('active');
            });
            break;
        case 'location':
            currentFilters.location = 'all';
            document.getElementById('location-filter').value = 'all';
            break;
        case 'price':
            currentFilters.price = 'all';
            document.getElementById('price-range').value = 'all';
            break;
        case 'bedrooms':
            currentFilters.bedrooms = 'all';
            document.getElementById('bedrooms').value = 'all';
            break;
    }
    applyFilters();
}

// Reset all filters
function resetFilters() {
    currentFilters = {
        status: 'all',
        location: 'all',
        price: 'all',
        bedrooms: 'all'
    };
    
    // Reset UI
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    document.getElementById('location-filter').value = 'all';
    document.getElementById('price-range').value = 'all';
    document.getElementById('bedrooms').value = 'all';
    
    applyFilters();
}



        // Sample Reviews Data with Profile Pictures
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
    {
        name: "Michael T.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        rating: 5,
        text: "Great location and responsive management. The apartment had all the amenities I needed for my extended stay. Would definitely book again for my next project in Buffalo.",
        date: "1 month ago",
        source: "google",
        profession: "Business Consultant"
    },
    {
        name: "Jennifer L.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        rating: 5,
        text: "716 Corporate Housing made my relocation so much easier. The process was seamless and the property was beautiful. The fully equipped kitchen saved me so much money on eating out!",
        date: "2 months ago",
        source: "airbnb",
        profession: "Research Scientist"
    },
    {
        name: "Robert C.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        rating: 5,
        text: "Outstanding service and beautiful property. The attention to detail was impressive - from the quality linens to the well-stocked kitchen. Made my 4-month assignment feel like home.",
        date: "3 months ago",
        source: "google",
        profession: "Healthcare Professional"
    }
];


        // Load Properties
        function loadProperties() {

              window.isInitialLoad = true;
    
            // Just call applyFilters to load all properties initially
            applyFilters();
            
            // Remove the flag after a short delay
            setTimeout(() => {
                window.isInitialLoad = false;
            }, 1000);

            const propertiesContainer = document.getElementById('properties-container');
            propertiesContainer.innerHTML = '';
            
            properties.forEach((property, index) => {
                const propertyCard = document.createElement('div');
                propertyCard.className = `property-card scale-in`;
                propertyCard.style.transitionDelay = `${index * 0.1}s`;
                propertyCard.setAttribute('data-id', property.id);
                
                // In loadProperties() function - update the propertyCard.innerHTML:
propertyCard.innerHTML = `
    ${property.availability.includes('ASK') ? '<div class="property-badge">Contact for Availability</div>' : ''}
    <div class="property-img-container">
        <img src="${property.image}" alt="${property.title}" class="property-img">
        ${property.video ? `
            <div class="video-indicator" onclick="event.stopPropagation(); playVideo('${property.video}')">
                <i class="fas fa-play"></i>
                Video Tour
            </div>
        ` : ''}
    </div>
    <div class="property-info">
        <h3 class="property-title">${property.title}</h3>
        <div class="property-location">
            <i class="fas fa-map-marker-alt"></i> ${property.location}
        </div>
        <div class="property-features">
            <div class="property-feature">
                <i class="fas fa-bed"></i> ${property.bedrooms} Bedrooms
            </div>
            <div class="property-feature">
                <i class="fas fa-bath"></i> ${property.bathrooms} Bathroom${property.bathrooms > 1 ? 's' : ''}
            </div>
        </div>
        <div class="property-price">$${property.price}<span>/month</span></div>
        <div class="property-availability">
            <i class="fas fa-calendar-check"></i> ${property.availability}
        </div>
        <button class="btn view-details-btn">
            View Details
        </button>
    </div>
`;
                
                propertiesContainer.appendChild(propertyCard);
            });
            
            // Add event listeners to view details buttons
            document.querySelectorAll('.view-details-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const propertyId = this.closest('.property-card').getAttribute('data-id');
                    openPropertyModal(propertyId);
                });
            });
            
            // Add event listeners to property cards
            document.querySelectorAll('.property-card').forEach(card => {
                card.addEventListener('click', function() {
                    const propertyId = this.getAttribute('data-id');
                    openPropertyModal(propertyId);
                });
            });
            
            // Trigger animations after a short delay
            setTimeout(() => {
                document.querySelectorAll('.scale-in').forEach(el => {
                    el.classList.add('visible');
                });
            }, 300);
        }

        // Open Property Modal with Video Support
function openPropertyModal(propertyId) {
    const property = properties.find(p => p.id == propertyId);
    const modal = document.getElementById('property-modal');
    const modalHeader = document.getElementById('modal-header');
    
    // Create placeholder for video
    const videoSection = property.video ? `
        <div class="property-video-section">
            <h3>Property Video Tour</h3>
            <div class="video-container">
                <div class="video-placeholder" data-video-src="${property.video}">
                    <div class="video-loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading video...</p>
                    </div>
                </div>
            </div>
        </div>
    ` : '';
    
    // In openPropertyModal() function - update the modalHeader.innerHTML:
modalHeader.innerHTML = `
    <div class="modal-image">
        <img src="${property.image}" alt="${property.title}">
        ${property.video ? `
            <div class="video-indicator" onclick="playVideo('${property.video}')">
                <i class="fas fa-play"></i>
                Watch Video Tour
            </div>
        ` : ''}
    </div>
    <div class="modal-details">
        <h2>${property.title}</h2>
        <div class="property-location">
            <i class="fas fa-map-marker-alt"></i> ${property.location}
        </div>
        <div class="property-price">$${property.price}/month</div>
        <div class="property-availability">
            <i class="fas fa-calendar-check"></i> ${property.availability}
        </div>
        <p>${property.description}</p>
        <div class="modal-features">
            <div class="modal-feature">
                <i class="fas fa-bed"></i> ${property.bedrooms} Bedrooms
            </div>
            <div class="modal-feature">
                <i class="fas fa-bath"></i> ${property.bathrooms} Bathroom${property.bathrooms > 1 ? 's' : ''}
            </div>
            ${property.features.map(feature => `
                <div class="modal-feature">
                    <i class="fas fa-check"></i> ${feature}
                </div>
            `).join('')}
        </div>
        <div class="modal-badges">
            ${property.video ? '<span class="modal-badge"><i class="fas fa-video"></i> Video Tour</span>' : ''}
            ${property.listing ? '<span class="modal-badge"><i class="fas fa-file-alt"></i> Full Listing</span>' : ''}
        </div>
    </div>
    ${property.video ? `
        <div class="property-video-section">
            <h3>Property Video Tour</h3>
            <div class="video-container">
                <iframe 
                    src="${property.video}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    loading="lazy">
                </iframe>
            </div>
        </div>
    ` : ''}
`;
    
    // Set up modal buttons
    document.getElementById('modal-book-btn').onclick = function() {
        alert(`Booking inquiry sent for ${property.title}. We'll contact you shortly!`);
        modal.style.display = 'none';
    };
    
    document.getElementById('modal-contact-btn').onclick = function() {
        document.querySelector('.floating-text').click();
        modal.style.display = 'none';
    };
    
    modal.style.display = 'block';

    // Load video after modal is displayed
    setTimeout(() => {
        loadVideo(property.video);
    }, 500);
}

// Video Player Function

function loadVideo(videoUrl) {
    const placeholder = document.querySelector('.video-placeholder');
    if (placeholder && videoUrl) {
        placeholder.innerHTML = `
            <iframe 
                src="${videoUrl}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                loading="lazy">
            </iframe>
        `;
    }
}

// Video Player Function for Property Management
function playVideo(videoUrl) {
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('video-iframe');
    
    if (!videoModal) {
        // Create video modal if it doesn't exist
        const modalHTML = `
            <div class="video-modal" id="video-modal">
                <div class="video-modal-content">
                    <span class="video-modal-close" onclick="closeVideoModal()">&times;</span>
                    <div class="video-player-container">
                        <iframe 
                            id="video-iframe"
                            src="" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    
    iframe.src = videoUrl;
    modal.style.display = 'block';
}

function closeVideoModal() {
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('video-iframe');
    
    if (videoIframe) videoIframe.src = ''; // Stop video playback
    if (videoModal) videoModal.style.display = 'none';
}

function closeVideoModal() {
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('video-iframe');
    
    videoIframe.src = ''; // Stop video playback
    videoModal.style.display = 'none';
}

        // Close Property Modal
        document.getElementById('modal-close').addEventListener('click', function() {
            document.getElementById('property-modal').style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('property-modal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

// Make other property functions available globally
window.openPropertyModal = openPropertyModal;
window.playVideo = playVideo;
window.closeVideoModal = closeVideoModal;

function removeFilter(type) {
    switch (type) {
        case 'status':
            window.currentFilters.status = 'all';
            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
            document.querySelectorAll('.filter-btn:not([data-filter="all"])').forEach(btn => {
                btn.classList.remove('active');
            });
            break;
        case 'location':
            window.currentFilters.location = 'all';
            document.getElementById('location-filter').value = 'all';
            break;
        case 'price':
            window.currentFilters.price = 'all';
            document.getElementById('price-range').value = 'all';
            break;
        case 'bedrooms':
            window.currentFilters.bedrooms = 'all';
            document.getElementById('bedrooms').value = 'all';
            break;
    }
    applyFilters();
}

function resetFilters() {
    window.currentFilters = {
        status: 'all',
        location: 'all',
        price: 'all',
        bedrooms: 'all'
    };
    
    // Reset UI
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    document.getElementById('location-filter').value = 'all';
    document.getElementById('price-range').value = 'all';
    document.getElementById('bedrooms').value = 'all';
    
    applyFilters();
}

// Make functions available globally
window.removeFilter = removeFilter;
window.resetFilters = resetFilters;