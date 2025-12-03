// Partnerships Page JavaScript
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
    
    // Property Registration Form
    const propertyForm = document.getElementById('property-registration-form');
    if (propertyForm) {
        propertyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                owner_name: document.getElementById('owner-name').value,
                owner_phone: document.getElementById('owner-phone').value,
                owner_email: document.getElementById('owner-email').value,
                property_address: document.getElementById('property-address').value,
                property_type: document.getElementById('property-type').value,
                bedrooms: document.getElementById('bedrooms').value,
                bathrooms: document.getElementById('bathrooms').value,
                property_status: document.getElementById('property-status').value,
                availability: document.getElementById('availability').value,
                additional_info: document.getElementById('additional-info').value
            };
            
            // Simple validation
            if (!formData.owner_name || !formData.owner_phone || !formData.owner_email || 
                !formData.property_address || !formData.property_type || !formData.property_status) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Check terms agreement
            const agreeTerms = document.getElementById('agree-terms').checked;
            if (!agreeTerms) {
                alert('Please agree to be contacted about partnership opportunities.');
                return;
            }
            
            // Show success message
            alert('Thank you! Your property has been registered. We will contact you within 24 hours for next steps.');
            propertyForm.reset();
            
            // Scroll to top of form
            propertyForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Organization Contact Form
    const organizationForm = document.getElementById('organization-form');
    if (organizationForm) {
        organizationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                org_name: document.getElementById('org-name').value,
                org_type: document.getElementById('org-type').value,
                contact_name: document.getElementById('contact-name').value,
                contact_title: document.getElementById('contact-title').value,
                contact_phone: document.getElementById('contact-phone').value,
                contact_email: document.getElementById('contact-email').value,
                housing_needs: document.getElementById('housing-needs').value,
                stay_length: document.getElementById('stay-length').value,
                org_message: document.getElementById('org-message').value
            };
            
            // Simple validation
            if (!formData.org_name || !formData.org_type || !formData.contact_name || 
                !formData.contact_phone || !formData.contact_email) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Check terms agreement
            const agreeTerms = document.getElementById('org-terms').checked;
            if (!agreeTerms) {
                alert('Please agree to be contacted about partnership opportunities.');
                return;
            }
            
            // Show success message
            alert('Thank you for your partnership inquiry! We will contact you within 24 hours to discuss opportunities.');
            organizationForm.reset();
            
            // Scroll to top of form
            organizationForm.scrollIntoView({ behavior: 'smooth' });
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
            
            // Simulate partnership bot response
            setTimeout(() => {
                const partnershipKeywords = {
                    'property': 'Interested in co-hosting? Register your property using our form or call 716-271-6555.',
                    'owner': 'Property owners can earn premium rates with our co-hosting program. Check the "Property Owners" section.',
                    'healthcare': 'We specialize in housing for healthcare professionals. Ask about our hospital partnerships.',
                    'corporate': 'Corporate partnerships include dedicated account management and volume discounts.',
                    'university': 'We work with universities for visiting faculty and researchers. Academic rates available.',
                    'register': 'Use our Property Registration Form to submit your property details.',
                    'partner': 'Partnership opportunities include healthcare, corporate, academic, and property owner programs.',
                    'co-host': 'Co-hosting lets property owners earn passive income while we handle all management.',
                    'network': 'Join our network of trusted property owners to receive qualified leads.'
                };
                
                let response = "I can help with property registration, co-hosting information, healthcare partnerships, corporate accounts, or university housing. What would you like to know more about?";
                
                // Check for keywords in the message
                const lowerMessage = message.toLowerCase();
                for (const [keyword, answer] of Object.entries(partnershipKeywords)) {
                    if (lowerMessage.includes(keyword)) {
                        response = answer + " Need more details? Call us at 716-271-6555!";
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