// Chat widget functionality
export function initializeChat() {
    setupUltraSimpleChat();
}

export function setupUltraSimpleChat() {
    const chatButton = document.querySelector('.chat-button');
    const chatClose = document.querySelector('.chat-close');
    const chatSend = document.querySelector('.chat-send');
    const chatInput = document.querySelector('.chat-input input');
    
    if (!chatButton || !chatClose) return;
    
    // Chat toggle
    chatButton.addEventListener('click', function() {
        document.querySelector('.chat-box').style.display = 'flex';
        chatInput?.focus();
        
        // Show quick options if it's the first interaction
        showQuickOptions();
    });

    chatClose.addEventListener('click', function() {
        document.querySelector('.chat-box').style.display = 'none';
    });

    // Message sending
    chatSend?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', function(e) {
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

function showSuccessToUser(name, email) {
    addBotMessage(`Thanks ${name}! Your message has been sent. We'll contact you at ${email} shortly.`);
    showSuccessNotification(`Message sent! We'll contact you at ${email}`);
}

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

// Make functions available globally for HTML onclick attributes
window.sendMessage = sendMessage;
window.handleQuickOption = handleQuickOption;