document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const countryCodeSelect = document.getElementById('countryCode');
    const inputGroup = phoneNumberInput.closest('.input-group');
    const usernameInput = document.getElementById('username');
    const smsCodeInput = document.getElementById('smsCode');
    const smsVerificationGroup = document.querySelector('.sms-verification');
    const resendSmsBtn = document.getElementById('resendSms');
    const loginMessage = document.getElementById('loginMessage');
    const loginBtn = document.getElementById('loginBtn');

    // Reset form fields
    if (phoneNumberInput) phoneNumberInput.value = '';
    if (usernameInput) usernameInput.value = '';
    if (smsCodeInput) smsCodeInput.value = '';
    if (countryCodeSelect) countryCodeSelect.value = '+260';
    if (smsVerificationGroup) smsVerificationGroup.style.display = 'none';
    if (loginBtn) loginBtn.textContent = 'Login';

    let smsVerificationInProgress = false;
    let smsCode = '';

    // Phone number validation patterns
    const phonePatterns = {
        '+260': /^[0-9]{9}$/, // Zambia: 9 digits
        '+27': /^[0-9]{9}$/, // South Africa: 9 digits
        '+263': /^[0-9]{9}$/, // Zimbabwe: 9 digits
        '+972': /^05[0-9]{8}$/ // Israel: 10 digits starting with 05
    };

    // Format hints for each country
    const formatHints = {
        '+260': {
            validPrefixes: ['09', '07']
        },
        '+27': {
            validPrefixes: ['06', '07', '08']
        },
        '+263': {
            validPrefixes: ['07', '08']
        },
        '+972': {
            validPrefixes: ['05']
        }
    };

    // Format phone number as user types
    phoneNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        const countryCode = countryCodeSelect.value;
        
        if (value.length > 0) {
            if (countryCode === '+972') {
                // Israel format: 05X-XXX-XXXX
                value = value.slice(0, 10); // Limit to 10 digits
                if (value.length > 3) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                }
                if (value.length > 7) {
                    value = value.slice(0, 7) + '-' + value.slice(7);
                }
            } else {
                // Other countries format: XXX-XXX-XXX
                value = value.slice(0, 9); // Limit to 9 digits
                value = value.match(/.{1,3}/g).join('-');
            }
        }
        e.target.value = value;
        validatePhoneNumber(value, countryCode);
    });

    // Validate phone number format
    function validatePhoneNumber(phoneNumber, countryCode) {
        const pattern = phonePatterns[countryCode];
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        const validPrefixes = formatHints[countryCode].validPrefixes;
        
        // Remove any existing validation classes
        inputGroup.classList.remove('valid', 'invalid');
        
        if (cleanNumber.length === 0) {
            return false;
        }
        
        // Check if the number is complete
        const requiredLength = countryCode === '+972' ? 10 : 9;
        if (cleanNumber.length === requiredLength) {
            if (!pattern.test(cleanNumber)) {
                inputGroup.classList.add('invalid');
                return false;
            }

            // Check if the number starts with a valid prefix
            const prefix = cleanNumber.substring(0, 2);
            if (!validPrefixes.includes(prefix)) {
                showMessage(`Phone number must start with ${validPrefixes.join(' or ')}`, 'error');
                inputGroup.classList.add('invalid');
                return false;
            }
            
            inputGroup.classList.add('valid');
            return true;
        }
        
        return false;
    }

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const countryCode = countryCodeSelect.value;
        const phoneNumber = phoneNumberInput.value;
        const fullPhoneNumber = countryCode + phoneNumber.replace(/\D/g, '');
        const username = usernameInput.value.trim();

        // Validate username
        if (username !== 'akivos') {
            showMessage('Invalid username. Please enter "akivos"', 'error');
            return;
        }

        // Validate phone number before proceeding
        if (!validatePhoneNumber(phoneNumber, countryCode)) {
            const requiredLength = countryCode === '+972' ? 10 : 9;
            showMessage(`Phone number must be ${requiredLength} digits`, 'error');
            return;
        }

        if (!smsVerificationInProgress) {
            // First step: Send SMS verification
            try {
                // Set verification code based on country
                smsCode = countryCode === '+972' ? '12345' : generateRandomCode();
                console.log('SMS Code:', smsCode); // For testing purposes
                console.log('Full Phone Number:', fullPhoneNumber); // For testing purposes

                smsVerificationInProgress = true;
                smsVerificationGroup.style.display = 'block';
                loginBtn.textContent = 'Verify Code';
                showMessage('Verification code sent to your phone', 'success');
            } catch (error) {
                showMessage('Failed to send verification code', 'error');
            }
        } else {
            // Second step: Verify SMS code
            const enteredCode = smsCodeInput.value;
            if (enteredCode === smsCode) {
                // Successful verification
                try {
                    // Check for Israeli credentials
                    if (countryCode === '+972' && username === 'akivos') {
                        const role = 'SITE_ADMIN';
                        localStorage.setItem('userRole', role);
                        localStorage.setItem('username', username);
                        localStorage.setItem('phoneNumber', fullPhoneNumber);
                        window.location.href = 'dashboard-site-admin.html';
                        return;
                    }

                    // For other cases, use normal authentication
                    const role = await authenticateUser(username, fullPhoneNumber, countryCode);
                    
                    // Store user session
                    localStorage.setItem('userRole', role);
                    localStorage.setItem('username', username);
                    localStorage.setItem('phoneNumber', fullPhoneNumber);
                    
                    // Redirect to appropriate dashboard
                    handleLoginSuccess(role);
                } catch (error) {
                    showMessage('Invalid credentials', 'error');
                }
            } else {
                showMessage('Invalid verification code', 'error');
            }
        }
    });

    // Handle resend SMS
    resendSmsBtn.addEventListener('click', () => {
        smsCode = generateRandomCode();
        console.log('New SMS Code:', smsCode); // For testing purposes
        showMessage('New verification code sent', 'success');
    });

    // Helper function to generate random 6-digit code
    function generateRandomCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Helper function to show messages
    function showMessage(message, type) {
        loginMessage.textContent = message;
        loginMessage.className = `login-message ${type}`;
        setTimeout(() => {
            loginMessage.textContent = '';
            loginMessage.className = 'login-message';
        }, 3000);
    }

    // Mock authentication function
    async function authenticateUser(username, phoneNumber, country) {
        // For now, we'll use a simple authentication logic
        // In a real application, this would be handled by a backend server
        
        // Check if the username is valid
        if (username !== 'akivos') {
            return { success: false, message: 'Invalid username' };
        }
        
        // Check if the phone number is valid for the selected country
        const phonePattern = getPhonePattern(country);
        if (!phonePattern.test(phoneNumber)) {
            return { success: false, message: 'Invalid phone number format' };
        }
        
        // For Israeli numbers, return SITE_ADMIN role
        if (country === '+972') {
            return 'SITE_ADMIN';
        }
        
        // For other countries, return SITE_OPERATOR role
        return 'SITE_OPERATOR';
    }

    // Handle login success
    function handleLoginSuccess(role) {
        // Store the selected role in localStorage
        localStorage.setItem('userRole', role);
        
        // Show welcome message for admin
        if (role === 'SITE_ADMIN') {
            showBubbleMessage('Hello Admin!', 'success');
            setTimeout(() => {
                // Redirect to the appropriate dashboard
                const dashboardUrl = getRoleDashboardUrl(role);
                window.location.href = dashboardUrl;
            }, 1500);
        } else {
            // Redirect to the appropriate dashboard
            const dashboardUrl = getRoleDashboardUrl(role);
            window.location.href = dashboardUrl;
        }
    }

    // Function to show bubble message
    function showBubbleMessage(message, type) {
        const bubble = document.createElement('div');
        bubble.className = `bubble-message ${type}`;
        bubble.textContent = message;
        document.body.appendChild(bubble);
        
        // Add styles for the bubble message
        const style = document.createElement('style');
        style.textContent = `
            .bubble-message {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 30px;
                color: white;
                font-weight: bold;
                animation: slideIn 0.5s ease-out;
                z-index: 1000;
            }
            .bubble-message.success {
                background-color: #2ecc71;
            }
            .bubble-message.error {
                background-color: #e74c3c;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
            bubble.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                bubble.remove();
                style.remove();
            }, 500);
        }, 3000);
    }

    // Get the appropriate dashboard URL based on role
    function getRoleDashboardUrl(role) {
        switch (role) {
            case 'SITE_ADMIN':
                return 'dashboard-site-admin.html';
            case 'SITE_OPERATOR':
                return 'dashboard-site-operator.html';
            case 'CALL_CENTER_TEAM_LEADER':
                return 'dashboard-call-center-team-leader.html';
            default:
                return 'login.html';
        }
    }

    // Update phone number format hint when country code changes
    countryCodeSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const countryCode = selectedOption.value;
        const flag = selectedOption.textContent;
        
        // Update the format hint based on the selected country
        const formatHint = formatHints[countryCode];
        if (formatHint) {
            phoneNumberInput.placeholder = `Enter ${formatHint.validPrefixes.join(' or ')} number`;
        }
    });

    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    }
}); 