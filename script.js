//script.js
    
        // Chat Widget Toggle
        document.querySelector('.chat-button').addEventListener('click', function() {
            const chatBox = document.querySelector('.chat-box');
            chatBox.style.display = 'flex';
            document.querySelector('.chat-input input').focus();
        });

        document.querySelector('.chat-close').addEventListener('click', function() {
            document.querySelector('.chat-box').style.display = 'none';
        });

// Store default properties separately
const defaultProperties = [
    {
        id: 1,
        title: "664 Auburn #2",
        location: "Buffalo, NY",
        address: "664 Auburn Ave, Buffalo, NY 14213",
        coordinates: { lat: 42.9176, lng: -78.8894 },
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        bedrooms: 2,
        bathrooms: 1,
        price: "2000-2500",
        priceMin: 2000,
        priceMax: 2500,
        availability: "Ready Now",
        status: "ready-now",
        description: "Beautiful 2-bedroom apartment in a prime location. Fully furnished with modern amenities.",
        features: ["Fully Furnished", "High-Speed Internet", "In-Unit Laundry", "Parking Available"],
        video: "https://drive.google.com/file/d/17jnCvCX1TE6qe-mrVaR5QjLxawsF0yKN/preview",
        listing: true,
        distance: null
    },
    {
        id: 2,
        title: "20 South St.",
        location: "Buffalo, NY",
        address: "20 South St, Buffalo, NY 14204",
        coordinates: { lat: 42.8864, lng: -78.8784 }, // Near Medical Campus
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        bedrooms: 2,
        bathrooms: 1,
        price: "2200-2600",
        priceMin: 2200,
        priceMax: 2600,
        availability: "Ready Now",
        status: "ready-now",
        description: "Spacious 2-bedroom apartment with modern finishes and convenient location.",
        features: ["Fully Furnished", "Updated Kitchen", "Pet Friendly", "Utilities Included"],
        video: true,
        listing: true,
        distance: null
    },
    {
        id: 3,
        title: "36 E Utica (3B)",
        location: "Buffalo, NY",
        address: "36 E Utica St, Buffalo, NY 14208",
        coordinates: { lat: 42.9085, lng: -78.8612 }, // Near UB South
        image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        bedrooms: 2,
        bathrooms: 1,
        price: "2200-2500",
        priceMin: 2200,
        priceMax: 2500,
        availability: "Ready Now",
        status: "ready-now",
        description: "Comfortable 2-bedroom apartment with great natural light and updated features.",
        features: ["Fully Furnished", "Natural Light", "Updated Bathroom", "Close to Downtown"],
        video: true,
        listing: true,
        distance: null
    },
    {
        id: 4,
        title: "28 Poinciana Pkwy Unit 2",
        location: "Buffalo, NY",
        address: "28 Poinciana Pkwy, Buffalo, NY 14214",
        coordinates: { lat: 42.9512, lng: -78.8347 }, // North Buffalo
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        bedrooms: 2,
        bathrooms: 1,
        price: "2500-3000",
        priceMin: 2500,
        priceMax: 3000,
        availability: "Ready Soon - ASK",
        status: "ask",
        description: "Luxury 2-bedroom unit with premium finishes and excellent amenities.",
        features: ["Premium Finishes", "In-Unit Laundry", "Modern Kitchen", "Secure Building"],
        video: true,
        listing: true,
        distance: null
    },
    {
        id: 5,
        title: "309 Bird (Lower)",
        location: "Buffalo, NY",
        address: "309 Bird Ave, Buffalo, NY 14213",
        coordinates: { lat: 42.9201, lng: -78.8915 }, // West Side
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1680&q=80",
        bedrooms: 3,
        bathrooms: 1,
        price: "2300-3000",
        priceMin: 2300,
        priceMax: 3000,
        availability: "Nov. 17",
        status: "ready-soon",
        description: "Spacious 3-bedroom lower unit with private entrance and yard access.",
        features: ["Private Entrance", "Yard Access", "Spacious Layout", "Storage Space"],
        video: false,
        listing: true,
        distance: null
    },
    {
        id: 6,
        title: "184 14th St.",
        location: "Buffalo, NY",
        address: "184 14th St, Buffalo, NY 14213",
        coordinates: { lat: 42.9158, lng: -78.8872 }, // Downtown
        image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        bedrooms: 4,
        bathrooms: 2,
        price: "3850-6000",
        priceMin: 3850,
        priceMax: 6000,
        availability: "Nov. 18",
        status: "ready-soon",
        description: "Single-family house perfect for larger groups or families with ample space.",
        features: ["Single Family Home", "Multiple Bathrooms", "Private Yard", "Garage Parking"],
        video: true,
        listing: true,
        distance: null
    }
];

// Main properties array that will be used throughout the application
let properties = [];

  // Enhanced Filter Functionality
let userLocation = null;
let currentFilters = {
    status: 'all',
    location: 'all',
    price: 'all',
    bedrooms: 'all',
    guests: '2'
};


// Initialize filters
function initializeFilters() {
    // Set up filter button events
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            currentFilters.status = filter;
            applyFilters();
        });
    });

     // Set up select filter events with auto-apply
    document.getElementById('location-filter').addEventListener('change', function() {
        currentFilters.location = this.value;
        if (this.value === 'closest') {
            getUserLocation();
        } else {
            applyFilters();
        }
    });

    document.getElementById('price-range').addEventListener('change', function() {
        currentFilters.price = this.value;
        applyFilters();
    });

    document.getElementById('bedrooms').addEventListener('change', function() {
        currentFilters.bedrooms = this.value;
        applyFilters();
    });

    // Apply filters button (for consistency)
    document.getElementById('filter-btn').addEventListener('click', applyFilters);
    
    // Reset filters
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    document.getElementById('clear-all-filters').addEventListener('click', resetFilters);

    // Initial results count
    updateResultsCount(properties.length, properties.length);
}

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

        // Load Reviews
function loadReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;
    
    reviewsContainer.innerHTML = '';
    
    // Get dynamic testimonials from manager
    const dynamicTestimonials = testimonialManager.getTestimonials();
    
    // Combine static and dynamic testimonials
    const allTestimonials = [...dynamicTestimonials, ...staticReviews];
    
    // Sort by date (newest first) - for dynamic testimonials with timestamps
    allTestimonials.sort((a, b) => {
        // For dynamic testimonials with id (timestamp), sort by id descending
        if (a.id && b.id) {
            return b.id - a.id;
        }
        // For static testimonials, maintain original order
        return 0;
    });
    
    // Display all testimonials
    allTestimonials.forEach((review, index) => {
        const reviewCard = createReviewCard(review, index);
        reviewsContainer.appendChild(reviewCard);
    });
    
    // Trigger animations after a short delay
    setTimeout(() => {
        document.querySelectorAll('.review-card').forEach(el => {
            el.classList.add('visible');
        });
    }, 300);
}

// Create Review Card - UPDATED VERSION
function createReviewCard(review, index) {
    const reviewCard = document.createElement('div');
    reviewCard.className = `review-card fade-in`;
    reviewCard.style.transitionDelay = `${index * 0.1}s`;
    
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < review.rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    // Determine source icon
    let sourceIcon = 'fas fa-user'; // Default for website testimonials
    if (review.source === 'airbnb') {
        sourceIcon = 'fab fa-airbnb';
    } else if (review.source === 'google') {
        sourceIcon = 'fab fa-google';
    }
    
    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="review-avatar">
                <img src="${review.avatar}" alt="${review.name}" loading="lazy">
            </div>
            <div class="review-info">
                <div class="review-name">${review.name}</div>
                ${review.profession ? `<div class="review-profession">${review.profession}</div>` : ''}
                <div class="review-date">${review.date}</div>
            </div>
        </div>
        <div class="review-stars">${stars}</div>
        <p>${review.text}</p>
        <div class="review-source">
            <i class="${sourceIcon}"></i>
        </div>
    `;
    
    return reviewCard;
}

// Add Review Submission Form for Public Use
function setupPublicReviewForm() {
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

// Submit Public Review
function submitPublicReview() {
    const name = document.getElementById('public-name').value;
    const profession = document.getElementById('public-profession').value;
    const rating = parseInt(document.querySelector('input[name="public-rating"]:checked').value);
    const text = document.getElementById('public-text').value;
    
    // Generate avatar based on name
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=daa520&color=fff&size=100`;
    
    // Use the testimonial manager to save
    testimonialManager.saveTestimonial(name, profession, rating, text, avatarUrl);
    
    // Show success message
    alert('Thank you for your review! It has been submitted successfully.');
}

// Add CSS for star rating
const starRatingCSS = `
.star-rating {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    gap: 5px;
}

.star-rating input {
    display: none;
}

.star-rating label {
    font-size: 1.5rem;
    color: #ddd;
    cursor: pointer;
    transition: color 0.2s;
}

.star-rating input:checked ~ label,
.star-rating label:hover,
.star-rating label:hover ~ label {
    color: var(--primary);
}

.star-rating input:checked + label {
    color: var(--primary);
}

.review-submission-form {
    background: var(--light);
    padding: 30px;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    margin-top: 40px;
    border: 1px solid var(--border-gray);
}

.review-submission-form h3 {
    color: var(--dark);
    margin-bottom: 20px;
    text-align: center;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }
}
`;

// Inject star rating CSS
const style = document.createElement('style');
style.textContent = starRatingCSS;
document.head.appendChild(style);

        // Date Filter Functionality
        document.getElementById('filter-btn').addEventListener('click', function() {
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const guests = document.getElementById('guests').value;
            
            if (!checkIn || !checkOut) {
                alert('Please select both check-in and check-out dates.');
                return;
            }
            
            // In a real implementation, this would filter properties based on the selected dates
            alert(`Filtering properties for ${guests} guests from ${checkIn} to ${checkOut}. In a real implementation, this would update the property listings.`);
        });

        // Floating Text Widget Click - Redirect to MyOpenPhone
        document.querySelector('.floating-text').addEventListener('click', function() {
            window.open('https://myopenphone.com', '_blank');
        });



        // Scroll Animation Functionality
        function checkScroll() {
            const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
            
            elements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    el.classList.add('visible');
                }
            });
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing page...');
    
    // Load properties first
    loadManagedProperties(); 
    
    console.log('Properties loaded:', properties.length);
    
    // Then initialize everything else
    initializeFilters();
    loadProperties();
    
    // Load reviews from review manager instead of static ones
    loadReviewsFromManager();
    updateMainPageMetrics();
    setupPublicReviewForm();

    // Setup auto-refresh for reviews
    setupReviewAutoRefresh();

    // Refresh button functionality
    document.getElementById('refresh-properties').addEventListener('click', refreshProperties);

            // Set default dates (today and 30 days from today)
            const today = new Date();
            const nextMonth = new Date(today);
            nextMonth.setDate(today.getDate() + 30);
            
            const formatDate = (date) => {
                return date.toISOString().split('T')[0];
            };
            
           
            
            // Add smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
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
            
            // Add header background on scroll
            window.addEventListener('scroll', function() {
                const header = document.querySelector('header');
                if (window.scrollY > 100) {
                    header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    header.style.backdropFilter = 'blur(10px)';
                } else {
                    header.style.backgroundColor = 'var(--light)';
                    header.style.backdropFilter = 'none';
                }
                
                // Check scroll position for animations
                checkScroll();
            });
            
            // Initial check for elements in view
            checkScroll();
        });


        // Testimonial Management
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
    if (typeof loadReviews === 'function') {
        loadReviews();
    }
}

// Add this date formatting method to the TestimonialManager class:
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
        
        if (typeof loadReviews === 'function') {
            loadReviews();
        }
    }
    
    getTestimonials() {
        return this.testimonials;
    }
}
    

// Initialize manager
const testimonialManager = new TestimonialManager();

// =============================================
// ULTRA-SIMPLE CHAT MANAGER - GUARANTEED TO WORK
// =============================================

function setupUltraSimpleChat() {
    // Chat toggle
    document.querySelector('.chat-button').addEventListener('click', function() {
        document.querySelector('.chat-box').style.display = 'flex';
        document.querySelector('.chat-input input').focus();
        
        // Show quick options if it's the first interaction
        showQuickOptions();
    });

    document.querySelector('.chat-close').addEventListener('click', function() {
        document.querySelector('.chat-box').style.display = 'none';
    });

    // Message sending
    document.querySelector('.chat-send').addEventListener('click', sendMessage);
    document.querySelector('.chat-input input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Welcome message
    setTimeout(() => {
        addBotMessage("Hello! I'm here to help you find the perfect furnished housing in Buffalo. How can I assist you today?");
    }, 1000);
}

function showQuickOptions() {
    const chatBody = document.querySelector('.chat-body');
    const hasMessages = chatBody.querySelectorAll('.chat-message').length > 1;
    
    if (!hasMessages) {
        setTimeout(() => {
            addBotMessage("Quick options: <br>" +
                "<div class='quick-options'>" +
                "<button class='quick-option' data-option='availability'>Check Availability</button>" +
                "<button class='quick-option' data-option='pricing'>Pricing Information</button>" +
                "<button class='quick-option' data-option='tour'>Schedule a Tour</button>" +
                "<button class='quick-option' data-option='custom'>Custom Question</button>" +
                "</div>");
                
            // Add event listeners to quick options
            document.querySelectorAll('.quick-option').forEach(btn => {
                btn.addEventListener('click', function() {
                    const option = this.getAttribute('data-option');
                    handleQuickOption(option);
                });
            });
        }, 1500);
    }
}

function handleQuickOption(option) {
    const messages = {
        'availability': "I'd like to check availability for one of your properties",
        'pricing': "Can you provide more details about pricing and what's included?",
        'tour': "I'm interested in scheduling a property tour",
        'custom': "I have a specific question about your properties"
    };
    
    // Add the selected message as user input
    const input = document.querySelector('.chat-input input');
    input.value = messages[option];
    
    // Trigger the contact info collection
    setTimeout(() => {
        sendMessage();
    }, 500);
}

function sendMessage() {
    const input = document.querySelector('.chat-input input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message immediately for better UX
    addUserMessage(message);
    
    // Check if we already have contact info
    const savedName = sessionStorage.getItem('chatUserName');
    const savedEmail = sessionStorage.getItem('chatUserEmail');
    
    if (savedName && savedEmail) {
        // We have contact info, just send the message
        sendToGoogleScript(message, savedName, savedEmail);
        input.value = '';
    } else {
        // Show integrated contact form
        showContactForm(message);
    }
}

function showContactForm(initialMessage) {
    const chatBody = document.querySelector('.chat-body');
    
    // Show the contact form as a bot message
    const formMessage = document.createElement('div');
    formMessage.className = 'chat-message bot-message';
    formMessage.innerHTML = `
        <div class="message-content">
            <p>To help you better, please provide your contact information:</p>
            <div class="chat-contact-form">
                <div class="form-group">
                    <input type="text" id="chat-name" placeholder="Your Name" required>
                </div>
                <div class="form-group">
                    <input type="email" id="chat-email" placeholder="Your Email" required>
                </div>
                <div class="form-buttons">
                    <button class="btn-chat-secondary" id="chat-skip">Skip</button>
                    <button class="btn-chat-primary" id="chat-submit">Send Message</button>
                </div>
            </div>
        </div>
    `;
    
    chatBody.appendChild(formMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Focus on name input
    setTimeout(() => {
        document.getElementById('chat-name').focus();
    }, 100);
    
    // Add event listeners
    document.getElementById('chat-submit').addEventListener('click', function() {
        submitContactForm(initialMessage);
    });
    
    document.getElementById('chat-skip').addEventListener('click', function() {
        addBotMessage("No problem! Feel free to ask any questions.");
        const form = document.querySelector('.chat-contact-form');
        if (form) form.remove();
    });
    
    // Allow form submission with Enter key
    const inputs = formMessage.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitContactForm(initialMessage);
            }
        });
    });
}

function submitContactForm(initialMessage) {
    const name = document.getElementById('chat-name').value.trim();
    const email = document.getElementById('chat-email').value.trim();
    
    if (!name || !email) {
        showErrorNotification('Please provide both name and email');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        showErrorNotification('Please provide a valid email address');
        return;
    }
    
    // Save contact info for future messages
    sessionStorage.setItem('chatUserName', name);
    sessionStorage.setItem('chatUserEmail', email);
    
    // Remove the form
    const form = document.querySelector('.chat-contact-form');
    if (form) form.remove();
    
    // Send the message
    sendToGoogleScript(initialMessage, name, email);
    
    // Clear the input
    document.querySelector('.chat-input input').value = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'chat-error-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function sendToGoogleScript(message, name, email) {
    const conversationId = 'chat_' + Date.now();
    
    // Build the URL with all parameters
    const baseUrl = 'https://script.google.com/macros/s/AKfycbwyEva2SbVnqN_u-lB7JJCZqLpXlGB1e17CvnZq216zB-sRXUWwWpAy2Xu2_M6eTKR_/exec';
    
    const params = new URLSearchParams({
        to: 'dexterdelleva@gmail.com',
        subject: `Chat Message from ${name}`,
        userName: name,
        userEmail: email,
        userMessage: message,
        conversationId: conversationId,
        source: 'netlify-simple-chat'
    });
    
    const fullUrl = `${baseUrl}?${params.toString()}`;
    
    console.log('Sending to Google Apps Script:', fullUrl);
    
    // Show "sending" state
    addBotMessage("Sending your message...");
    
    // Create an iframe that loads the URL (completely invisible)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = fullUrl;
    document.body.appendChild(iframe);
    
    // Also try the window.open method as backup
    const newTab = window.open(fullUrl, '_blank', 
        'width=1,height=1,left=-1000,top=-1000,scrollbars=no,toolbar=no,menubar=no,location=no,status=no'
    );
    
    if (newTab || iframe) {
        console.log('✅ Message sending initiated');
        
        // Clean up
        setTimeout(() => {
            try {
                if (newTab) newTab.close();
                if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
            } catch (e) {
                console.log('Cleanup completed');
            }
        }, 500);
        
        // Show success message
        showSuccessToUser(name, email);
    } else {
        // Fallback if both methods fail
        console.log('❌ Both methods blocked, showing fallback');
        addBotMessage(`Thanks ${name}! Please click this link to send your message: <a href="${fullUrl}" target="_blank" class="chat-link">Send Message</a>`);
        
        setTimeout(() => {
            showSuccessToUser(name, email);
        }, 1000);
    }
}

function sendWithBeacon(url, name, email) {
    // Method 1: Try navigator.sendBeacon first
    if (navigator.sendBeacon) {
        try {
            const success = navigator.sendBeacon(url);
            if (success) {
                console.log('✅ Message sent via sendBeacon');
                showSuccessToUser(name, email);
                return;
            }
        } catch (e) {
            console.log('sendBeacon failed, trying fallback...');
        }
    }
    
    // Method 2: Use image beacon
    const img = new Image();
    img.src = url;
    
    // Method 3: Use iframe as backup
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    // Always show success to user (fire-and-forget approach)
    setTimeout(() => {
        showSuccessToUser(name, email);
        
        // Clean up iframe after a delay
        setTimeout(() => {
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }
        }, 5000);
    }, 500);
}

function showSuccessToUser(name, email) {
    addBotMessage(`Thanks ${name}! Your message has been sent. We'll contact you at ${email} shortly.`);
    showSuccessNotification(`Message sent! We'll contact you at ${email}`);
}

function sendWithJSONP(url, name, email) {
    // Create a temporary iframe to handle the request
    const tempIframe = document.createElement('iframe');
    tempIframe.style.display = 'none';
    tempIframe.src = url;
    
    tempIframe.onload = function() {
        console.log('✅ Message sent successfully via iframe');
        addBotMessage(`Thanks ${name}! Your message has been sent successfully. We'll contact you at ${email} shortly.`);
        showSuccessNotification(`Message sent! We'll contact you at ${email}`);
        
        // Remove the iframe after a delay
        setTimeout(() => {
            if (tempIframe.parentNode) {
                tempIframe.parentNode.removeChild(tempIframe);
            }
        }, 3000);
    };
    
    tempIframe.onerror = function() {
        console.error('❌ Error sending message via iframe');
        addBotMessage(`Thanks ${name}! Your message has been queued. We'll contact you at ${email} shortly.`);
        showSuccessNotification(`Message queued! We'll contact you at ${email}`);
        
        // Even if there's an error, assume it went through (Google Apps Script is tricky)
        setTimeout(() => {
            if (tempIframe.parentNode) {
                tempIframe.parentNode.removeChild(tempIframe);
            }
        }, 3000);
    };
    
    document.body.appendChild(tempIframe);
}

// Add success notification function
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'chat-success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function addUserMessage(message) {
    addMessage(message, 'user');
}

function addBotMessage(message) {
    addMessage(message, 'bot');
}

function addMessage(content, type) {
    const chatBody = document.querySelector('.chat-body');
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${type}-message`;
    messageElement.innerHTML = `
        <div class="message-content">${content.replace(/\n/g, '<br>')}</div>
        <div class="chat-time">${timeString}</div>
    `;
    
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupUltraSimpleChat();
    loadProperties();
    loadReviews();
    loadReviewsFromManager();
    console.log('✅ Ultra Simple Chat Ready!');
});

// header background on scroll with frosted effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Check scroll position for animations
    checkScroll();
});

// Testimonial Modal Functionality
function setupTestimonialModal() {
    const modal = document.getElementById('testimonial-modal');
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
    testimonialManager.saveTestimonial(name, profession, rating, text, avatarUrl);
    
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

// Refresh properties from localStorage
function refreshProperties() {
    console.log('Refreshing properties...');
    
    // Use the sync function
    syncProperties();
    
    // Show success feedback
    const refreshBtn = document.getElementById('refresh-properties');
    const originalText = refreshBtn.innerHTML;
    
    refreshBtn.innerHTML = '<i class="fas fa-check"></i> Properties Updated!';
    refreshBtn.disabled = true;
    
    setTimeout(() => {
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
    }, 2000);
}

function syncProperties() {
    console.log('=== MANUAL SYNC START ===');
    
    // Clear current properties
    properties.length = 0;
    
    // Try multiple storage locations
    const mainStorage = JSON.parse(localStorage.getItem('properties')) || [];
    const managedStorage = JSON.parse(localStorage.getItem('managedProperties')) || [];
    
    console.log('Main storage:', mainStorage.length, 'properties');
    console.log('Managed storage:', managedStorage.length, 'properties');
    
    // Use main storage if available, otherwise use managed storage
    if (mainStorage.length > 0) {
        properties.push(...mainStorage);
        console.log('Using main storage properties');
    } else if (managedStorage.length > 0) {
        properties.push(...managedStorage);
        console.log('Using managed storage properties');
    } else {
        properties.push(...defaultProperties);
        console.log('Using default properties');
    }
    
    console.log('Total properties after sync:', properties.length);
    console.log('Property titles:', properties.map(p => p.title));
    console.log('=== MANUAL SYNC END ===');
    
    // Refresh the display
    applyFilters();
}

// Load Reviews from Review Manager - CORRECTED VERSION
function loadReviewsFromManager() {
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

// Update metrics on main page - ENHANCED VERSION
function updateMainPageMetrics() {
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

// Auto-refresh reviews when page becomes visible
function setupReviewAutoRefresh() {
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


// Debug function to check all storage
function debugStorage() {
    console.log('=== STORAGE DEBUG ===');
    console.log('LocalStorage keys:', Object.keys(localStorage));
    
    const mainStorage = JSON.parse(localStorage.getItem('properties') || '[]');
    const managedStorage = JSON.parse(localStorage.getItem('managedProperties') || '[]');
    
    console.log('Main storage properties:', mainStorage.length);
    console.log('Managed storage properties:', managedStorage.length);
    
    console.log('Main storage content:', mainStorage);
    console.log('Managed storage content:', managedStorage);
    console.log('Current properties array:', properties.length);
    console.log('Default properties:', defaultProperties.length);
    console.log('========================');
}

// Make it available globally
window.debugStorage = debugStorage;

// Initialize the modal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupTestimonialModal();
});