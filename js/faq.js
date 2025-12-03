// FAQ Page JavaScript
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
    
    // FAQ Accordion Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current item
            faqItem.classList.toggle('active', !isActive);
            
            // If opening, scroll to question for better UX
            if (!isActive) {
                setTimeout(() => {
                    faqItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        });
    });
    
    // FAQ Search Functionality
    const searchInput = document.getElementById('faq-search');
    const clearSearchBtn = document.getElementById('clear-search');
    
    if (searchInput && clearSearchBtn) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            // Show/hide clear button
            clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
            
            if (searchTerm.length < 2) {
                // Show all FAQ items if search term is too short
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.style.display = 'block';
                    item.classList.remove('search-match');
                });
                document.querySelectorAll('.faq-section').forEach(section => {
                    section.style.display = 'block';
                });
                return;
            }
            
            let foundMatches = false;
            
            // Search through FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.classList.add('search-match');
                    foundMatches = true;
                    
                    // Ensure parent section is visible
                    const section = item.closest('.faq-section');
                    if (section) {
                        section.style.display = 'block';
                    }
                } else {
                    item.style.display = 'none';
                    item.classList.remove('search-match');
                }
            });
            
            // Hide sections with no matching items
            document.querySelectorAll('.faq-section').forEach(section => {
                const hasVisibleItems = section.querySelectorAll('.faq-item[style="display: block"]').length > 0;
                section.style.display = hasVisibleItems ? 'block' : 'none';
            });
            
            // Open matching FAQ items
            document.querySelectorAll('.faq-item.search-match').forEach(item => {
                item.classList.add('active');
            });
        });
        
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            
            // Reset all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.style.display = 'block';
                item.classList.remove('search-match', 'active');
            });
            
            document.querySelectorAll('.faq-section').forEach(section => {
                section.style.display = 'block';
            });
            
            searchInput.focus();
        });
        
        // Hide clear button initially
        clearSearchBtn.style.display = 'none';
    }
    
    // Smooth scrolling for category links
    document.querySelectorAll('.category-card[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile nav if open
                closeMobileNav();
                
                // Scroll to section
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Highlight the section briefly
                targetElement.style.boxShadow = '0 0 0 3px rgba(255, 140, 0, 0.3)';
                setTimeout(() => {
                    targetElement.style.boxShadow = '';
                }, 1500);
            }
        });
    });
    
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
    
    // Open FAQ items from URL hash
    function openFaqFromHash() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement && targetElement.classList.contains('faq-item')) {
                // Close all other FAQ items
                document.querySelectorAll('.faq-item.active').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Open the target FAQ item
                targetElement.classList.add('active');
                
                // Scroll to it
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }
    
    // Check for hash on page load
    openFaqFromHash();
    
    // Update URL hash when FAQ items are opened
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            if (faqItem.classList.contains('active')) {
                // Create a unique ID if needed
                if (!faqItem.id) {
                    const questionText = this.querySelector('h3').textContent;
                    const id = 'faq-' + questionText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    faqItem.id = id;
                }
                
                // Update URL without page reload
                history.pushState(null, null, '#' + faqItem.id);
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
            
            // Simulate FAQ bot response
            setTimeout(() => {
                const faqKeywords = {
                    'book': 'Check our "How to book?" section under Booking & Reservations.',
                    'minimum': 'Our minimum stay is 31 days. See the "What is the minimum lease duration required?" question.',
                    'utilities': 'Yes! All utilities are included. See the "Are utilities included in the rent?" section.',
                    'fees': 'No hidden fees! Everything is transparent. Check "Are there any extra fees or hidden costs?"',
                    'furnished': 'All units are fully furnished. See "Are the units fully furnished?" for details.',
                    'renew': 'Flexible renewal options available. Check "What are my renewal options?"',
                    'pet': 'Many properties are pet-friendly! See "Are pets allowed in your properties?"',
                    'clean': 'Cleaning services available. Check "Is housekeeping included during my stay?"',
                    'maintenance': '24/7 maintenance support. See "What if I have maintenance issues?"',
                    'extend': 'Easy extension process. Check the Extensions & Changes section.'
                };
                
                let response = "I can help answer questions about booking, utilities, fees, furnishings, or renewals. What specifically would you like to know?";
                
                // Check for keywords in the message
                const lowerMessage = message.toLowerCase();
                for (const [keyword, answer] of Object.entries(faqKeywords)) {
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