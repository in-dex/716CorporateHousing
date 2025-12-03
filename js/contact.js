// Contact Us Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize form submission
    initContactForm();
    
    // Initialize FAQ accordion
    initFAQ();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize chat widget
    initChatWidget();
});

// Animation initialization
function initAnimations() {
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

    // Observe all animated elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Contact Form Submission
function initContactForm() {
    const form = document.getElementById('contact-form-main');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const formObject = Object.fromEntries(formData);
            
            // Basic validation
            if (!formObject.name || !formObject.email || !formObject.subject || !formObject.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formObject.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Here you would typically send the data to your server
            // For now, we'll simulate API call with a timeout
            showNotification('Sending message...', 'info');
            
            setTimeout(() => {
                // Reset form
                form.reset();
                
                // Show success modal
                successModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Hide info notification
                hideNotification();
            }, 1500);
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Chat Widget
function initChatWidget() {
    const chatButton = document.querySelector('.chat-button');
    const chatBox = document.querySelector('.chat-box');
    const chatClose = document.querySelector('.chat-close');
    const chatInput = document.querySelector('.chat-input input');
    const chatSend = document.querySelector('.chat-send');
    
    if (chatButton && chatBox) {
        // Toggle chat box
        chatButton.addEventListener('click', () => {
            chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
            if (chatBox.style.display === 'flex') {
                chatInput.focus();
            }
        });
        
        // Close chat
        if (chatClose) {
            chatClose.addEventListener('click', () => {
                chatBox.style.display = 'none';
            });
        }
        
        // Send message
        if (chatSend && chatInput) {
            chatSend.addEventListener('click', sendChatMessage);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendChatMessage();
                }
            });
        }
    }
}

function sendChatMessage() {
    const chatInput = document.querySelector('.chat-input input');
    const chatBody = document.querySelector('.chat-body');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message';
    userMessage.innerHTML = `
        ${message}
        <div class="chat-time">Just now</div>
    `;
    chatBody.appendChild(userMessage);
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Auto-reply after delay
    setTimeout(() => {
        const responses = [
            "Thanks for your message! A member of our team will respond shortly.",
            "For immediate assistance with housing needs, please call us at (716) 271-6555.",
            "Would you like information about our available properties or furnishing services?",
            "We can help you find the perfect corporate housing solution in Buffalo. What's your timeline?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot-message';
        botMessage.innerHTML = `
            ${randomResponse}
            <div class="chat-time">Just now</div>
        `;
        chatBody.appendChild(botMessage);
        
        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    hideNotification();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `contact-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    const styles = `
        .contact-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 350px;
        }
        
        .contact-notification.info {
            background: linear-gradient(135deg, var(--primary-light), var(--primary));
            color: white;
        }
        
        .contact-notification.success {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
        }
        
        .contact-notification.error {
            background: linear-gradient(135deg, #dc3545, #c82333);
            color: white;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    const notification = document.querySelector('.contact-notification');
    if (notification) {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// Phone number click tracking
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        // You can add analytics tracking here
        console.log('Phone number clicked:', this.href);
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Focus on form field if it's a form
            if (targetId === '#contact-form') {
                setTimeout(() => {
                    const nameField = document.getElementById('contact-name');
                    if (nameField) nameField.focus();
                }, 500);
            }
        }
    });
});

// Add animation for quick action cards on hover
document.querySelectorAll('.quick-action-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = 'var(--shadow)';
    });
});

// Auto-populate phone field with better format
const phoneInput = document.getElementById('contact-phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            value = '(' + value;
            
            if (value.length > 4) {
                value = value.slice(0, 4) + ') ' + value.slice(4);
            }
            if (value.length > 9) {
                value = value.slice(0, 9) + '-' + value.slice(9);
            }
            if (value.length > 14) {
                value = value.slice(0, 14);
            }
        }
        
        e.target.value = value;
    });
}

// Form auto-save (optional feature)
function initFormAutoSave() {
    const form = document.getElementById('contact-form-main');
    const storageKey = '716contact_form_draft';
    
    if (form) {
        // Load saved data
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field) {
                        field.value = data[key];
                    }
                });
                
                // Show notification
                showNotification('Previous form data restored.', 'info');
            } catch (e) {
                console.log('No saved form data');
            }
        }
        
        // Save on input
        form.addEventListener('input', function() {
            const formData = new FormData(form);
            const formObject = Object.fromEntries(formData);
            localStorage.setItem(storageKey, JSON.stringify(formObject));
        });
        
        // Clear on successful submit
        form.addEventListener('submit', function() {
            localStorage.removeItem(storageKey);
        });
    }
}

// Initialize form auto-save (optional)
// initFormAutoSave();