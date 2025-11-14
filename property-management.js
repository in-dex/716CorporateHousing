// property-management.js
class PropertyManager {
    constructor() {
        this.properties = JSON.parse(localStorage.getItem('managedProperties')) || [];
        this.filteredProperties = [...this.properties];
        this.currentFilters = {
            search: '',
            status: 'all',
            beds: 'all'
        };
        this.currentView = 'grid';
        this.propertyImages = [];
        this.currentGalleryIndex = 0;
        // this.init();
    }
    
    init() {
        this.setupForm();
        this.setupQuickActions();
        this.setupFilters();
        this.setupDisplayToggle();
        this.setupModal();
        this.setupFloatingButton();
        this.setupImageGallery(); 
        this.loadPropertiesDisplay();
    }

   viewProperty(id) {
    console.log('View property called with ID:', id);
    const property = this.properties.find(p => p.id == id);
    if (!property) {
        alert('Property not found!');
        return;
    }
    
    console.log('Property found:', property.title);
    this.openViewModal(property);
}

openViewModal(property) {
    console.log('Opening view modal for:', property.title);
    
    const viewModal = document.getElementById('view-property-modal');
    const viewModalHeader = document.getElementById('view-modal-header');
    
    if (!viewModal || !viewModalHeader) {
        console.error('View modal elements not found');
        return;
    }
    
    // Get images array (support both old single image and new multiple images)
    const propertyImages = property.images || [{ url: property.image, isPrimary: true }];
    const primaryImage = propertyImages.find(img => img.isPrimary) || propertyImages[0];
    
    // Enhanced modal with gallery functionality
    viewModalHeader.innerHTML = `
        <div class="modal-gallery">
            <div class="gallery-main">
                <img src="${primaryImage.url}" alt="${property.title}" id="view-main-img" loading="lazy">
                ${propertyImages.length > 1 ? `
                    <button class="gallery-nav gallery-prev" id="view-gallery-prev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="gallery-nav gallery-next" id="view-gallery-next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="gallery-counter" id="view-gallery-counter">
                        1 / ${propertyImages.length}
                    </div>
                ` : ''}
                ${property.video ? `
                    <div class="video-indicator" onclick="playVideo('${property.video}')">
                        <i class="fas fa-play"></i>
                        Watch Video Tour
                    </div>
                ` : ''}
            </div>
            
            ${propertyImages.length > 1 ? `
                <div class="gallery-thumbnails">
                    ${propertyImages.map((image, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <img src="${image.url}" alt="Thumbnail ${index + 1}" loading="lazy">
                        </div>
                    `).join('')}
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
                ${propertyImages.length > 1 ? `<span class="modal-badge"><i class="fas fa-images"></i> ${propertyImages.length} Photos</span>` : ''}
                ${property.video ? '<span class="modal-badge"><i class="fas fa-video"></i> Video Tour</span>' : ''}
                <span class="modal-badge"><i class="fas fa-file-alt"></i> Full Listing</span>
            </div>
        </div>
    `;
    
    // Show modal
    viewModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Setup event listeners including gallery navigation
    this.setupViewModalEvents(property, propertyImages);
}

setupViewModalEvents(property, propertyImages) {
    const viewModal = document.getElementById('view-property-modal');
    const closeBtn = document.getElementById('view-modal-close');
    const closeBtn2 = document.getElementById('view-modal-close-btn');
    const editBtn = document.getElementById('view-modal-edit');
    
    // Close modal function
    const closeModal = () => {
        viewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    // Event listeners for close buttons
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeBtn2) closeBtn2.addEventListener('click', closeModal);
    
    // Edit button
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            closeModal();
            this.editProperty(property.id);
        });
    }
    
    // Close when clicking outside
    viewModal.addEventListener('click', (e) => {
        if (e.target === viewModal) {
            closeModal();
        }
    });
    
    // Setup gallery navigation if multiple images
    if (propertyImages.length > 1) {
        this.setupGalleryNavigation(propertyImages);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (viewModal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (propertyImages.length > 1) {
                if (e.key === 'ArrowLeft') {
                    this.navigateGallery(-1, propertyImages);
                } else if (e.key === 'ArrowRight') {
                    this.navigateGallery(1, propertyImages);
                }
            }
        }
    });
}

setupGalleryNavigation(propertyImages) {
    let currentImageIndex = 0;
    const mainImg = document.getElementById('view-main-img');
    const prevBtn = document.getElementById('view-gallery-prev');
    const nextBtn = document.getElementById('view-gallery-next');
    const counter = document.getElementById('view-gallery-counter');
    const thumbnails = document.querySelectorAll('.thumbnail');

    console.log('Setting up gallery navigation with', propertyImages.length, 'images');

    const updateGallery = (index) => {
        currentImageIndex = index;
        if (mainImg && propertyImages[index]) {
            mainImg.src = propertyImages[index].url;
        }
        if (counter) {
            counter.textContent = `${index + 1} / ${propertyImages.length}`;
        }
        
        // Update active thumbnail
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    };

    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            let newIndex = currentImageIndex - 1;
            if (newIndex < 0) newIndex = propertyImages.length - 1;
            updateGallery(newIndex);
        });
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            let newIndex = currentImageIndex + 1;
            if (newIndex >= propertyImages.length) newIndex = 0;
            updateGallery(newIndex);
        });
    }

    // Thumbnail clicks
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            updateGallery(index);
        });
    });

    // Store for keyboard navigation
    this.currentGalleryUpdate = updateGallery;
    this.currentGalleryIndex = 0;
    this.currentGalleryImages = propertyImages;

    // Initialize gallery
    updateGallery(0);
}

navigateGallery(direction, propertyImages) {
    if (!this.currentGalleryUpdate) return;
    
    let newIndex = this.currentGalleryIndex + direction;
    
    if (newIndex < 0) {
        newIndex = propertyImages.length - 1;
    } else if (newIndex >= propertyImages.length) {
        newIndex = 0;
    }
    
    this.currentGalleryIndex = newIndex;
    this.currentGalleryUpdate(newIndex);
}

setupViewGalleryNavigation(propertyImages) {
    let currentImageIndex = 0;
    const mainImg = document.getElementById('view-main-img');
    const prevBtn = document.getElementById('view-gallery-prev');
    const nextBtn = document.getElementById('view-gallery-next');
    const counter = document.getElementById('view-gallery-counter');
    const thumbnails = document.querySelectorAll('.view-thumbnail');
    
    const updateGallery = (index) => {
        currentImageIndex = index;
        mainImg.src = propertyImages[index].url;
        counter.textContent = `${index + 1} / ${propertyImages.length}`;
        
        // Update active thumbnail
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    };
    
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let newIndex = currentImageIndex - 1;
        if (newIndex < 0) newIndex = propertyImages.length - 1;
        updateGallery(newIndex);
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let newIndex = currentImageIndex + 1;
        if (newIndex >= propertyImages.length) newIndex = 0;
        updateGallery(newIndex);
    });
    
    // Thumbnail clicks
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            updateGallery(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('view-property-modal').style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                let newIndex = currentImageIndex - 1;
                if (newIndex < 0) newIndex = propertyImages.length - 1;
                updateGallery(newIndex);
            } else if (e.key === 'ArrowRight') {
                let newIndex = currentImageIndex + 1;
                if (newIndex >= propertyImages.length) newIndex = 0;
                updateGallery(newIndex);
            } else if (e.key === 'Escape') {
                document.getElementById('view-modal-close').click();
            }
        }
    });
}

     setupImageGallery() {
    this.propertyImages = [];
    this.currentGalleryIndex = 0;

    // Safe element checking
    const addImageBtn = document.getElementById('add-image-btn');
    const urlInput = document.getElementById('image-url-input');
    
    if (!addImageBtn || !urlInput) {
        console.warn('Image gallery elements not found, retrying in 100ms');
        setTimeout(() => this.setupImageGallery(), 100);
        return;
    }

    addImageBtn.addEventListener('click', () => {
        this.addImageFromUrl();
    });

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            this.addImageFromUrl();
        }
    });

    this.setupGalleryModal();
    this.updateImagesGallery();
}

    addImageFromUrl() {
        const urlInput = document.getElementById('image-url-input');
        const url = urlInput.value.trim();

        if (!url) {
            this.showImageError('Please enter an image URL');
            return;
        }

        // Basic URL validation
        if (!this.isValidImageUrl(url)) {
            this.showImageError('Please enter a valid image URL (jpg, png, webp, etc.)');
            return;
        }

        // Create image object
        const image = {
            id: Date.now(),
            url: url,
            isPrimary: this.propertyImages.length === 0
        };

        // Add to array
        this.propertyImages.push(image);
        this.updateImagesGallery();
        urlInput.value = '';
        urlInput.focus();
    }

    showImageError(message) {
        // Remove any existing error
        this.clearImageErrors();
        
        const imageUploadArea = document.querySelector('.image-upload-area');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'image-error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.marginTop = '10px';
        errorDiv.style.fontSize = '14px';
        
        imageUploadArea.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.clearImageErrors();
        }, 5000);
    }

    clearImageErrors() {
        const existingErrors = document.querySelectorAll('.image-error-message');
        existingErrors.forEach(error => error.remove());
    }

    isValidImageUrl(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.svg'];
        const urlLower = url.toLowerCase();
        return imageExtensions.some(ext => urlLower.includes(ext)) || 
               urlLower.startsWith('data:image/') ||
               urlLower.includes('unsplash') ||
               urlLower.includes('cloudinary');
    }

    updateImagesGallery() {
        const gallery = document.getElementById('images-gallery');
        const noImages = document.getElementById('no-images');
        const previewLarge = document.getElementById('image-preview-large');
        const largePreviewImg = document.getElementById('large-preview-img');

        // Check if elements exist before accessing them
        if (!gallery || !noImages || !previewLarge || !largePreviewImg) {
            console.error('Gallery elements not found - DOM not ready?');
            return;
        }

        // Hide no images message if we have images
        if (this.propertyImages.length > 0) {
            noImages.style.display = 'none';
            previewLarge.style.display = 'block';
        } else {
            noImages.style.display = 'block';
            previewLarge.style.display = 'none';
            return;
        }

        // Generate gallery HTML
        gallery.innerHTML = this.propertyImages.map((image, index) => `
            <div class="image-item ${image.isPrimary ? 'primary' : ''}" data-index="${index}">
                <img src="${image.url}" alt="Property image ${index + 1}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=Image+Error'">
                ${image.isPrimary ? '<div class="primary-badge">Primary</div>' : ''}
                <div class="image-item-actions">
                    <button class="image-item-action set-primary-btn" title="Set as primary">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="image-item-action delete-image-btn" title="Delete image">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Update large preview with primary image
        const primaryImage = this.propertyImages.find(img => img.isPrimary);
        if (primaryImage) {
            largePreviewImg.src = primaryImage.url;
            largePreviewImg.onerror = function() {
                this.src = 'https://via.placeholder.com/400x300?text=Image+Error';
            };
        }

        this.attachImageGalleryEvents();
    }

    attachImageGalleryEvents() {
    // Set primary image
    document.querySelectorAll('.set-primary-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const index = parseInt(e.target.closest('.image-item').dataset.index);
            this.setPrimaryImage(index);
        });
    });

    // Delete image
    document.querySelectorAll('.delete-image-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const index = parseInt(e.target.closest('.image-item').dataset.index);
            this.deleteImage(index);
        });
    });

    // Open image in gallery modal - FIXED: prevent default and stop propagation
    document.querySelectorAll('.image-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Only open gallery if clicking directly on the image item (not buttons)
            if (!e.target.classList.contains('image-item-action') && 
                !e.target.closest('.image-item-action')) {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(item.dataset.index);
                this.openGalleryModal(index);
            }
        });
    });
}

    setPrimaryImage(index) {
        this.propertyImages.forEach(img => img.isPrimary = false);
        this.propertyImages[index].isPrimary = true;
        this.updateImagesGallery();
    }

    deleteImage(index) {
        if (confirm('Are you sure you want to delete this image?')) {
            const wasPrimary = this.propertyImages[index].isPrimary;
            this.propertyImages.splice(index, 1);
            
            if (wasPrimary && this.propertyImages.length > 0) {
                this.propertyImages[0].isPrimary = true;
            }
            
            this.updateImagesGallery();
        }
    }

    setupGalleryModal() {
    const galleryModal = document.getElementById('gallery-modal');
    const closeBtn = document.getElementById('gallery-modal-close');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');

    if (!galleryModal || !closeBtn || !prevBtn || !nextBtn) {
        console.error('Gallery modal elements not found');
        return;
    }

    // Close modal
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeGalleryModal();
    });

    // Previous button
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.navigateGallery(-1);
    });

    // Next button
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.navigateGallery(1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!galleryModal.classList.contains('active')) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        if (e.key === 'Escape') {
            this.closeGalleryModal();
        } else if (e.key === 'ArrowLeft') {
            this.navigateGallery(-1);
        } else if (e.key === 'ArrowRight') {
            this.navigateGallery(1);
        }
    });

    // Close when clicking outside
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            this.closeGalleryModal();
        }
    });

    // Prevent clicks inside gallery from bubbling
    galleryModal.querySelector('.gallery-modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

openGalleryModal(index) {
    const galleryModal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('gallery-modal-img');
    const counter = document.getElementById('gallery-counter');

    if (!galleryModal || !modalImg || !counter) {
        console.error('Gallery modal elements not found');
        return;
    }

    this.currentGalleryIndex = index;
    modalImg.src = this.propertyImages[index].url;
    counter.textContent = `${index + 1} / ${this.propertyImages.length}`;
    galleryModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus the modal for keyboard navigation
    galleryModal.focus();
    galleryModal.setAttribute('tabindex', '-1');
}

closeGalleryModal() {
    const galleryModal = document.getElementById('gallery-modal');
    if (galleryModal) {
        galleryModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Remove focus from modal
        galleryModal.blur();
        galleryModal.removeAttribute('tabindex');
    }
}

navigateGallery(direction) {
    this.currentGalleryIndex += direction;
    
    if (this.currentGalleryIndex < 0) {
        this.currentGalleryIndex = this.propertyImages.length - 1;
    } else if (this.currentGalleryIndex >= this.propertyImages.length) {
        this.currentGalleryIndex = 0;
    }
    
    this.openGalleryModal(this.currentGalleryIndex);
}

    setupModal() {
        const modal = document.getElementById('property-form-modal');
        const closeBtn = document.getElementById('close-form-btn');
        
        closeBtn.addEventListener('click', () => {
            this.hideForm();
        });
    }
    
    setupFloatingButton() {
        const floatingBtn = document.getElementById('floating-add-btn');
        const header = document.querySelector('.management-header');
        
        if (!floatingBtn || !header) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > header.offsetHeight) {
                floatingBtn.style.display = 'flex';
            } else {
                floatingBtn.style.display = 'none';
            }
        });
        
        floatingBtn.addEventListener('click', () => {
            this.showForm();
        });
    }
    
    loadPropertiesDisplay() {
        if (this.currentView === 'grid') {
            this.loadPropertiesGrid();
        } else {
            this.loadTableView();
        }
        this.updatePropertiesCount();
    }
    
    loadTableView() {
    const tbody = document.getElementById('properties-table-body');
    const noProperties = document.getElementById('no-properties');
    const tableContainer = document.getElementById('properties-table');
    
    if (this.filteredProperties.length === 0) {
        tableContainer.style.display = 'none';
        noProperties.style.display = 'block';
        return;
    }
    
    tableContainer.style.display = 'block';
    noProperties.style.display = 'none';
    
    tbody.innerHTML = this.filteredProperties.map(property => `
        <tr>
            <td>
                <div class="table-property-info">
                    <img src="${property.image}" alt="${property.title}" class="table-property-image">
                    <div class="table-property-details">
                        <h4>${property.title}</h4>
                        <p>${property.address}</p>
                    </div>
                </div>
            </td>
            <td class="hide-on-mobile">${property.location}</td>
            <td class="hide-on-mobile">${property.bedrooms} BD / ${property.bathrooms} BA</td>
            <td>$${property.price}/month</td>
            <td>
                <span class="table-badge">${this.getStatusBadge(property.status)}</span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm" onclick="propertyManager.viewProperty(${property.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit btn-sm" onclick="propertyManager.editProperty(${property.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-danger btn-sm" onclick="propertyManager.deleteProperty(${property.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

    setupDisplayToggle() {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.closest('.toggle-btn').dataset.view;
                this.switchView(view);
            });
        });
    }
    
    switchView(view) {
        this.currentView = view;
        
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.toggle-btn[data-view="${view}"]`).classList.add('active');
        
        if (view === 'grid') {
            document.getElementById('properties-grid').style.display = 'grid';
            document.getElementById('properties-table').style.display = 'none';
        } else {
            document.getElementById('properties-grid').style.display = 'none';
            document.getElementById('properties-table').style.display = 'block';
            this.loadTableView();
        }
    }
    
    setupQuickActions() {
        document.getElementById('add-property-btn').addEventListener('click', () => {
            this.showForm();
        });
        
        document.getElementById('cancel-edit').addEventListener('click', () => {
            this.cancelEdit();
        });
    }
    
    showForm() {
        const modal = document.getElementById('property-form-modal');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden';
    }
    
    hideForm() {
        const modal = document.getElementById('property-form-modal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
        this.cancelEdit();
    }

    validateForm() {
        let isValid = true;
        this.clearFormValidation();
        
        const requiredFields = [
            'property-title',
            'property-location', 
            'property-address',
            'property-description'
        ];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const formGroup = field.closest('.form-group');
            
            if (!field.value.trim()) {
                formGroup.classList.add('error');
                this.showFieldError(formGroup, 'This field is required');
                isValid = false;
            }
        });
        
        // Validate that at least one image is added
        if (this.propertyImages.length === 0) {
            const imageSection = document.querySelector('.multiple-images-section');
            this.showFieldError(imageSection, 'Please add at least one property image');
            isValid = false;
        }
        
        // Validate price range
        const priceMin = parseInt(document.getElementById('property-price-min').value);
        const priceMax = parseInt(document.getElementById('property-price-max').value);
        if (priceMin >= priceMax) {
            const priceGroup = document.getElementById('property-price-min').closest('.form-group');
            priceGroup.classList.add('error');
            this.showFieldError(priceGroup, 'Maximum price must be greater than minimum price');
            isValid = false;
        }
        
        return isValid;
    }

    clearFormValidation() {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.remove();
        });
    }

    showFieldError(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        element.appendChild(errorDiv);
    }

    setupForm() {
        const form = document.getElementById('property-form');
        const resetBtn = document.getElementById('reset-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProperty();
        });
        
        resetBtn.addEventListener('click', () => {
            this.resetForm();
        });
    }

    resetForm() {
        document.getElementById('property-form').reset();
        this.propertyImages = [];
        this.updateImagesGallery();
    }
    
    setupFilters() {
        document.getElementById('property-search').addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });
        
        document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilters.status = e.target.dataset.filter;
                this.applyFilters();
            });
        });
        
        document.querySelectorAll('.filter-btn[data-beds]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn[data-beds]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilters.beds = e.target.dataset.beds;
                this.applyFilters();
            });
        });
        
        document.getElementById('clear-filters').addEventListener('click', () => {
            this.clearFilters();
        });
    }
    
    applyFilters() {
        this.filteredProperties = this.properties.filter(property => {
            const searchMatch = !this.currentFilters.search || 
                property.title.toLowerCase().includes(this.currentFilters.search) ||
                property.location.toLowerCase().includes(this.currentFilters.search) ||
                property.features.some(feature => feature.toLowerCase().includes(this.currentFilters.search));
            
            const statusMatch = this.currentFilters.status === 'all' || property.status === this.currentFilters.status;
            
            let bedsMatch = true;
            if (this.currentFilters.beds !== 'all') {
                const beds = parseInt(this.currentFilters.beds);
                bedsMatch = this.currentFilters.beds === '4' ? property.bedrooms >= 4 : property.bedrooms === beds;
            }
            
            return searchMatch && statusMatch && bedsMatch;
        });
        
        this.updateActiveFilters();
        this.loadPropertiesDisplay();
    }

    updatePropertiesCount() {
        document.getElementById('properties-count').textContent = this.filteredProperties.length;
    }
    
    updateActiveFilters() {
        const activeFilters = document.getElementById('active-filters');
        const filterTags = document.getElementById('filter-tags');
        const activeFiltersList = [];
        
        if (this.currentFilters.search) {
            activeFiltersList.push({
                type: 'search',
                label: `Search: "${this.currentFilters.search}"`,
                value: this.currentFilters.search
            });
        }
        
        if (this.currentFilters.status !== 'all') {
            const statusLabels = {
                'ready-now': 'Ready Now',
                'ready-soon': 'Ready Soon',
                'ask': 'Contact for Availability'
            };
            activeFiltersList.push({
                type: 'status',
                label: statusLabels[this.currentFilters.status],
                value: this.currentFilters.status
            });
        }
        
        if (this.currentFilters.beds !== 'all') {
            activeFiltersList.push({
                type: 'beds',
                label: `${this.currentFilters.beds === '4' ? '4+' : this.currentFilters.beds} Bedrooms`,
                value: this.currentFilters.beds
            });
        }
        
        if (activeFiltersList.length > 0) {
            activeFilters.style.display = 'flex';
            filterTags.innerHTML = activeFiltersList.map(filter => `
                <span class="filter-tag">
                    ${filter.label}
                    <button class="remove" onclick="propertyManager.removeFilter('${filter.type}')">
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
            case 'search':
                this.currentFilters.search = '';
                document.getElementById('property-search').value = '';
                break;
            case 'status':
                this.currentFilters.status = 'all';
                document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
                document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
                break;
            case 'beds':
                this.currentFilters.beds = 'all';
                document.querySelectorAll('.filter-btn[data-beds]').forEach(b => b.classList.remove('active'));
                document.querySelector('.filter-btn[data-beds="all"]').classList.add('active');
                break;
        }
        this.applyFilters();
    }
    
    clearFilters() {
        this.currentFilters = {
            search: '',
            status: 'all',
            beds: 'all'
        };
        
        document.getElementById('property-search').value = '';
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        document.querySelector('.filter-btn[data-beds="all"]').classList.add('active');
        
        this.applyFilters();
    }
    
    loadPropertiesGrid() {
    const grid = document.getElementById('properties-grid');
    const noProperties = document.getElementById('no-properties');
    const countElement = document.getElementById('properties-count');
    
    countElement.textContent = this.filteredProperties.length;
    
    if (this.filteredProperties.length === 0) {
        grid.style.display = 'none';
        noProperties.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noProperties.style.display = 'none';
    
    grid.innerHTML = this.filteredProperties.map(property => `
        <div class="property-card" data-id="${property.id}">
            <div class="property-card-header">
                <img src="${property.image}" alt="${property.title}" class="property-card-image" loading="lazy">
                <div class="property-card-badge">
                    ${this.getStatusBadge(property.status)}
                </div>
                <div class="property-card-actions">
                    <button class="btn btn-sm" onclick="propertyManager.viewProperty(${property.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit btn-sm" onclick="propertyManager.editProperty(${property.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-danger btn-sm" onclick="propertyManager.deleteProperty(${property.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="property-card-content">
                <h3 class="property-card-title">${property.title}</h3>
                <div class="property-card-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.location}
                </div>
                <div class="property-card-features">
                    <div class="property-card-feature">
                        <i class="fas fa-bed"></i>
                        ${property.bedrooms} Bed
                    </div>
                    <div class="property-card-feature">
                        <i class="fas fa-bath"></i>
                        ${property.bathrooms} Bath
                    </div>
                    <div class="property-card-feature">
                        <i class="fas fa-ruler-combined"></i>
                        ${property.bedrooms * 500 + 300} sq ft
                    </div>
                    <div class="property-card-feature">
                        <i class="fas fa-wifi"></i>
                        WiFi
                    </div>
                </div>
                <div class="property-card-price">
                    $${property.price}<span>/month</span>
                </div>
                <div class="property-card-availability">
                    <i class="fas fa-calendar-check"></i>
                    ${property.availability}
                </div>
            </div>
            <div class="property-card-footer">
                <button class="btn" onclick="propertyManager.viewProperty(${property.id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
                <button class="btn-edit" onclick="propertyManager.editProperty(${property.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-danger" onclick="propertyManager.deleteProperty(${property.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
    
    // Add click event to entire property card for viewing
    document.querySelectorAll('.property-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on buttons
            if (!e.target.closest('.property-card-actions') && 
                !e.target.closest('.property-card-footer')) {
                const propertyId = card.getAttribute('data-id');
                this.viewProperty(propertyId);
            }
        });
    });
}
    
    getStatusBadge(status) {
        const badges = {
            'ready-now': 'Ready Now',
            'ready-soon': 'Coming Soon',
            'ask': 'Contact for Availability'
        };
        return badges[status] || 'Available';
    }
    
    deleteProperty(id) {
        if (confirm('Are you sure you want to delete this property?')) {
            this.properties = this.properties.filter(p => p.id !== id);
            this.saveProperties();
            this.applyFilters();
            this.showSuccess('Property Deleted Successfully!');
        }
    }
    
    createProperty(propertyData) {
        this.properties.unshift(propertyData);
        this.saveProperties();
        this.hideForm();
        this.applyFilters();
        this.showSuccess('Property Added Successfully!');
    }
    
    updateProperty(propertyData) {
        const index = this.properties.findIndex(p => p.id === propertyData.id);
        if (index !== -1) {
            this.properties[index] = propertyData;
            this.saveProperties();
            this.hideForm();
            this.applyFilters();
            this.showSuccess('Property Updated Successfully!');
        } else {
            alert('Property not found for updating!');
        }
    }

    editProperty(id) {
        const property = this.properties.find(p => p.id === id);
        if (!property) {
            alert('Property not found!');
            return;
        }
        
        this.populateForm(property);
        this.setFormMode('edit', id);
        this.showForm();
    }
    
    populateForm(property) {
        document.getElementById('property-title').value = property.title;
        document.getElementById('property-location').value = property.location;
        document.getElementById('property-address').value = property.address;
        document.getElementById('property-bedrooms').value = property.bedrooms;
        document.getElementById('property-bathrooms').value = property.bathrooms;
        document.getElementById('property-price-min').value = property.priceMin;
        document.getElementById('property-price-max').value = property.priceMax;
        document.getElementById('property-status').value = property.status;
        document.getElementById('property-availability').value = property.availability;
        document.getElementById('property-video').value = property.video || '';
        document.getElementById('property-description').value = property.description;
        
        if (property.coordinates) {
            document.getElementById('property-coordinates').value = 
                `lat: ${property.coordinates.lat}, lng: ${property.coordinates.lng}`;
        }
        
        this.populateFeatures(property.features);
        
        // Populate images if they exist
        if (property.images && property.images.length > 0) {
            this.propertyImages = property.images;
        } else {
            // Fallback to single image for backward compatibility
            this.propertyImages = [{
                id: Date.now(),
                url: property.image,
                isPrimary: true
            }];
        }
        this.updateImagesGallery();
    }
    
    populateFeatures(propertyFeatures) {
        document.querySelectorAll('input[name="features"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        propertyFeatures.forEach(feature => {
            const checkbox = document.querySelector(`input[name="features"][value="${feature}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
    
    setFormMode(mode, propertyId = null) {
        const form = document.getElementById('property-form');
        const formTitle = document.getElementById('form-title');
        const submitBtn = document.getElementById('submit-form');
        const cancelBtn = document.getElementById('cancel-edit');
        
        if (mode === 'edit') {
            form.dataset.mode = 'edit';
            form.dataset.editingId = propertyId;
            formTitle.textContent = 'Edit Property';
            submitBtn.textContent = 'Update Property';
            cancelBtn.style.display = 'inline-flex';
        } else {
            form.dataset.mode = 'add';
            delete form.dataset.editingId;
            formTitle.textContent = 'Add New Property';
            submitBtn.textContent = 'Add Property';
            cancelBtn.style.display = 'none';
        }
    }
    
    cancelEdit() {
        this.resetForm();
        this.setFormMode('add');
    }

    addProperty() {
        if (!this.validateForm()) {
            const firstError = document.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        const form = document.getElementById('property-form');
        const mode = form.dataset.mode || 'add';
        const editingId = form.dataset.editingId;
        
        const title = document.getElementById('property-title').value.trim();
        const location = document.getElementById('property-location').value.trim();
        const address = document.getElementById('property-address').value.trim();
        const bedrooms = parseInt(document.getElementById('property-bedrooms').value);
        const bathrooms = parseInt(document.getElementById('property-bathrooms').value);
        const priceMin = parseInt(document.getElementById('property-price-min').value);
        const priceMax = parseInt(document.getElementById('property-price-max').value);
        const status = document.getElementById('property-status').value;
        const availability = document.getElementById('property-availability').value.trim();
        const video = document.getElementById('property-video').value.trim();
        const description = document.getElementById('property-description').value.trim();
        
        const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
        const features = Array.from(featureCheckboxes).map(cb => cb.value);
        
        // Get primary image (first image in the array)
        const primaryImage = this.propertyImages.length > 0 ? this.propertyImages[0].url : '';
        
        let coordinates = null;
        const coordsInput = document.getElementById('property-coordinates').value.trim();
        if (coordsInput) {
            const match = coordsInput.match(/lat:\s*([\d.-]+),\s*lng:\s*([\d.-]+)/);
            if (match) {
                coordinates = {
                    lat: parseFloat(match[1]),
                    lng: parseFloat(match[2])
                };
            }
        }
        
        const propertyData = {
            id: mode === 'edit' ? parseInt(editingId) : Date.now(),
            title,
            location,
            address,
            coordinates,
            image: primaryImage,
            images: this.propertyImages,
            bedrooms,
            bathrooms,
            price: `${priceMin}-${priceMax}`,
            priceMin,
            priceMax,
            availability,
            status,
            description,
            features,
            video: video || false,
            listing: true,
            distance: null
        };
        
        if (mode === 'edit') {
            this.updateProperty(propertyData);
        } else {
            this.createProperty(propertyData);
        }
    }
    
    saveProperties() {
        localStorage.setItem('managedProperties', JSON.stringify(this.properties));
        
        try {
            const defaultProperties = [
                // Your default properties array here
            ];
            
            const filteredDefaultProperties = defaultProperties.filter(defaultProp => 
                !this.properties.find(managedProp => managedProp.id === defaultProp.id)
            );
            
            const allProperties = [...this.properties, ...filteredDefaultProperties];
            localStorage.setItem('properties', JSON.stringify(allProperties));
            
        } catch (e) {
            console.error('Could not update main properties list:', e);
        }
    }
    
    showSuccess(message) {
        const successMsg = document.getElementById('success-message');
        
        successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>${message}</h3>
            <p>The property has been saved and will appear on the main page.</p>
            <div style="margin-top: 15px;">
                <a href="../index.html#properties" class="btn" style="margin: 5px;">
                    <i class="fas fa-eye"></i> View on Main Page
                </a>
                <button class="btn btn-outline" onclick="propertyManager.addAnother()" style="margin: 5px;">
                    <i class="fas fa-plus"></i> Add Another Property
                </button>
            </div>
        `;
        
        successMsg.style.display = 'block';
        
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 10000);
    }
    
    addAnother() {
        document.getElementById('success-message').style.display = 'none';
        this.cancelEdit();
        this.showForm();
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

// Initialize after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    propertyManager.init();
});

const propertyManager = new PropertyManager();

// Mobile menu functionality
document.querySelector('.mobile-menu')?.addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});