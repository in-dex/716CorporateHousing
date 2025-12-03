// Testimonials Page JavaScript
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
    
    // Testimonial Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter testimonials
            testimonialCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === cardCategory) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Load More Testimonials
    const loadMoreBtn = document.getElementById('loadMore');
    let testimonialsLoaded = 6; // Start with 6 testimonials visible
    
    // Initially hide testimonials beyond the first 6
    document.querySelectorAll('.testimonial-card').forEach((card, index) => {
        if (index >= testimonialsLoaded) {
            card.style.display = 'none';
        }
    });
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Calculate how many testimonials to show
            const allTestimonials = document.querySelectorAll('.testimonial-card');
            const testimonialsToShow = Math.min(testimonialsLoaded + 3, allTestimonials.length);
            
            // Show next batch of testimonials
            for (let i = testimonialsLoaded; i < testimonialsToShow; i++) {
                if (allTestimonials[i]) {
                    allTestimonials[i].style.display = 'block';
                    setTimeout(() => {
                        allTestimonials[i].style.opacity = '1';
                        allTestimonials[i].style.transform = 'translateY(0)';
                    }, 10 * (i - testimonialsLoaded));
                }
            }
            
            testimonialsLoaded = testimonialsToShow;
            
            // Hide button if all testimonials are shown
            if (testimonialsLoaded >= allTestimonials.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }
    
    // Review Form Submission
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('reviewer-name').value,
                profession: document.getElementById('reviewer-profession').value,
                rating: document.querySelector('input[name="rating"]:checked')?.value,
                review: document.getElementById('review-text').value,
                tags: Array.from(document.querySelectorAll('input[name="tags[]"]:checked')).map(cb => cb.value),
                featuredConsent: document.getElementById('featured-consent').checked
            };
            
            // Validation
            if (!formData.name || !formData.rating || !formData.review) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (formData.tags.length > 3) {
                alert('Please select no more than 3 tags.');
                return;
            }
            
            // Show success message
            alert('Thank you for your review! Your feedback is valuable to us and helps other travel professionals.');
            
            // Reset form
            reviewForm.reset();
            
            // Scroll to top of form
            reviewForm.scrollIntoView({ behavior: 'smooth' });
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
            
            // Simulate testimonials bot response
            setTimeout(() => {
                const responses = [
                    "Thanks for your interest in our reviews! Our guests love our fully furnished apartments and excellent service. Want to read specific healthcare or corporate testimonials?",
                    "Our average rating is 4.9 stars from over 500 guests. Many healthcare professionals and corporate travelers have shared their positive experiences.",
                    "Have questions about a specific review or want to share your own experience? You can submit a review using our form or call us at 716-271-6555.",
                    "Looking for reviews from people in your profession? Use our filter buttons to see testimonials from healthcare, corporate, or academic professionals."
                ];
                
                const botMessage = document.createElement('div');
                botMessage.className = 'chat-message bot-message';
                botMessage.innerHTML = `
                    <div class="message-content">${responses[Math.floor(Math.random() * responses.length)]}</div>
                    <div class="chat-time">Just now</div>
                `;
                document.querySelector('.chat-body').appendChild(botMessage);
                
                // Scroll to bottom
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 1000);
        }
    }
});