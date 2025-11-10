document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');

    // Form submission handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const remember = rememberCheckbox.checked;

        // Basic validation
        if (!email || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Simulate login process
        showMessage('Signing in...', 'info');
        
        // Simulate API call delay
        setTimeout(() => {
            // This is where you'd normally make an API call to your backend
            console.log('Login attempt:', { email, password, remember });
            showMessage('Welcome to WoodCraft Community!', 'success');
            
            // In a real app, you'd redirect to the dashboard
            // window.location.href = '/dashboard';
        }, 1500);
    });

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Message display function
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Add styles for the message
        messageDiv.style.cssText = `
            padding: 12px 16px;
            margin-bottom: 20px;
            border-radius: 6px;
            font-size: 14px;
            text-align: center;
            ${type === 'error' ? 'background: #fee; color: #c33; border: 1px solid #fcc;' : ''}
            ${type === 'success' ? 'background: #efe; color: #363; border: 1px solid #cfc;' : ''}
            ${type === 'info' ? 'background: #eef; color: #336; border: 1px solid #ccf;' : ''}
        `;

        // Insert message at the top of the form
        loginForm.insertBefore(messageDiv, loginForm.firstChild);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Input focus effects
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.style.transform = 'translateY(-2px)';
        });

        input.addEventListener('blur', function() {
            this.parentNode.style.transform = 'translateY(0)';
        });
    });
});