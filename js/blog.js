// Blog Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileNavOverlay.classList.add('active');
            mobileNavMenu.classList.add('active');
            document.body.classList.add('menu-open');
        });
    }
    
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileNav);
    }
    
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileNav);
    }
    
    function closeMobileNav() {
        mobileNavOverlay.classList.remove('active');
        mobileNavMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    // Close mobile nav when clicking links
    document.querySelectorAll('.mobile-nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });
    
    // Blog Search Functionality
    const searchInput = document.getElementById('blog-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const postCards = document.querySelectorAll('.post-card');
    
    if (searchInput && clearSearchBtn) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            // Show/hide clear button
            clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
            
            if (searchTerm.length < 2) {
                // Show all posts if search term is too short
                postCards.forEach(card => {
                    card.style.display = 'flex';
                    card.classList.remove('search-match');
                });
                return;
            }
            
            // Search through posts
            postCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const excerpt = card.querySelector('.post-excerpt').textContent.toLowerCase();
                const tags = card.querySelectorAll('.tag');
                let tagText = '';
                tags.forEach(tag => {
                    tagText += tag.textContent.toLowerCase() + ' ';
                });
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm) || tagText.includes(searchTerm)) {
                    card.style.display = 'flex';
                    card.classList.add('search-match');
                    
                    // Highlight matching text
                    highlightText(card, searchTerm);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('search-match');
                }
            });
        });
        
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            
            // Reset all posts
            postCards.forEach(card => {
                card.style.display = 'flex';
                card.classList.remove('search-match');
                removeHighlights(card);
            });
            
            searchInput.focus();
        });
        
        // Hide clear button initially
        clearSearchBtn.style.display = 'none';
    }
    
    function highlightText(element, searchTerm) {
        // Remove previous highlights
        removeHighlights(element);
        
        // Highlight in title
        const title = element.querySelector('h3');
        const titleText = title.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        title.innerHTML = titleText.replace(regex, '<span class="highlight">$1</span>');
        
        // Highlight in excerpt
        const excerpt = element.querySelector('.post-excerpt');
        const excerptText = excerpt.textContent;
        excerpt.innerHTML = excerptText.replace(regex, '<span class="highlight">$1</span>');
    }
    
    function removeHighlights(element) {
        const highlights = element.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }
    
    // Sort Posts
    const sortSelect = document.getElementById('sort-posts');
    const postsGrid = document.querySelector('.posts-grid');
    
    if (sortSelect && postsGrid) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const posts = Array.from(postCards);
            
            posts.sort((a, b) => {
                switch (sortValue) {
                    case 'newest':
                        return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
                    case 'oldest':
                        return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
                    case 'popular':
                        return parseInt(b.getAttribute('data-popular')) - parseInt(a.getAttribute('data-popular'));
                    case 'read-time':
                        return parseInt(a.getAttribute('data-read-time')) - parseInt(b.getAttribute('data-read-time'));
                    default:
                        return 0;
                }
            });
            
            // Reorder posts in grid
            posts.forEach(post => {
                postsGrid.appendChild(post);
            });
        });
    }
    
    // Load More Posts
    const loadMoreBtn = document.getElementById('loadMorePosts');
    let postsLoaded = 8; // Start with 8 posts visible
    
    // Initially hide posts beyond the first 8
    postCards.forEach((card, index) => {
        if (index >= postsLoaded) {
            card.style.display = 'none';
        }
    });
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Calculate how many posts to show
            const postsToShow = Math.min(postsLoaded + 4, postCards.length);
            
            // Show next batch of posts
            for (let i = postsLoaded; i < postsToShow; i++) {
                if (postCards[i]) {
                    postCards[i].style.display = 'flex';
                    setTimeout(() => {
                        postCards[i].style.opacity = '1';
                        postCards[i].style.transform = 'translateY(0)';
                    }, 10 * (i - postsLoaded));
                }
            }
            
            postsLoaded = postsToShow;
            
            // Hide button if all posts are shown
            if (postsLoaded >= postCards.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }
    
    // Newsletter Form Submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('subscriber-name').value,
                email: document.getElementById('subscriber-email').value,
                role: document.getElementById('subscriber-role').value
            };
            
            // Validation
            if (!formData.email) {
                alert('Please enter your email address.');
                return;
            }
            
            // Check terms agreement
            const agreeTerms = document.getElementById('newsletter-terms').checked;
            if (!agreeTerms) {
                alert('Please agree to receive email updates.');
                return;
            }
            
            // Show success message
            alert('Thank you for subscribing! You\'ll receive our next Buffalo Living newsletter soon.');
            
            // Reset form
            newsletterForm.reset();
        });
    }
    
    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile nav if open
                closeMobileNav();
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Category card navigation
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                // Scroll to category section
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Apply visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });
    });
    
    // Simple chat functionality for this page
    const chatButton = document.querySelector('.chat-button');
    const chatBox = document.querySelector('.chat-box');
    const chatClose = document.querySelector('.chat-close');
    const chatSend = document.querySelector('.chat-send');
    const chatInput = document.querySelector('.chat-input input');
    
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    if (chatClose) {
        chatClose.addEventListener('click', function() {
            chatBox.style.display = 'none';
        });
    }
    
    if (chatSend && chatInput) {
        chatSend.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendChatMessage();
        });
    }
    
    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'chat-message user-message';
            userMessage.innerHTML = `
                <div class="message-content">${message}</div>
                <div class="chat-time">Just now</div>
            `;
            document.querySelector('.chat-body').appendChild(userMessage);
            
            // Clear input
            chatInput.value = '';
            
            // Scroll to bottom
            const chatBody = document.querySelector('.chat-body');
            chatBody.scrollTop = chatBody.scrollHeight;
            
            // Simulate blog bot response
            setTimeout(() => {
                const blogKeywords = {
                    'nurse': 'Check our "Travel Nurse Guides" category for articles specifically for healthcare professionals.',
                    'restaurant': 'We have articles about restaurants near hospitals and local dining guides.',
                    'winter': 'Read our "Winter in Buffalo" guide for essential survival tips.',
                    'housing': 'Compare corporate housing vs hotels in our detailed article.',
                    'weekend': 'Check our weekend getaway guide for destinations near Buffalo.',
                    'furnished': 'We have a checklist for what to bring to furnished apartments.',
                    'neighborhood': 'Explore our neighborhood guides to find the perfect area for you.',
                    'buffalo': 'Welcome to Buffalo! Check our local guides for tips on living here.',
                    'blog': 'Browse our latest articles for tips on living in Buffalo as a travel professional.'
                };
                
                let response = "I can help you find blog articles about travel nursing, Buffalo neighborhoods, local dining, or seasonal living tips. What are you interested in?";
                
                // Check for keywords in the message
                const lowerMessage = message.toLowerCase();
                for (const [keyword, answer] of Object.entries(blogKeywords)) {
                    if (lowerMessage.includes(keyword)) {
                        response = answer + " Use our search bar or category filters to find more articles!";
                        break;
                    }
                }
                
                const botMessage = document.createElement('div');
                botMessage.className = 'chat-message bot-message';
                botMessage.innerHTML = `
                    <div class="message-content">${response}</div>
                    <div class="chat-time">Just now</div>
                `;
                document.querySelector('.chat-body').appendChild(botMessage);
                
                // Scroll to bottom
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 1000);
        }
    }
});