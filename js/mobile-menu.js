// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile menu script loaded');
    
    // Get all mobile menu elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;
    const desktopLogoutBtn = document.getElementById('desktopLogoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

    console.log('Mobile menu elements:', {
        button: mobileMenuBtn ? 'Found' : 'Not found',
        close: mobileMenuClose ? 'Found' : 'Not found',
        menu: mobileMenu ? 'Found' : 'Not found',
        desktopLogout: desktopLogoutBtn ? 'Found' : 'Not found',
        mobileLogout: mobileLogoutBtn ? 'Found' : 'Not found'
    });

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
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
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

    // Function to open the mobile menu
    function openMenu() {
        console.log('Opening mobile menu');
        if (mobileMenu) {
            mobileMenu.classList.add('active');
            body.style.overflow = 'hidden';
        }
    }

    // Function to close the mobile menu
    function closeMenu() {
        console.log('Closing mobile menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        }
    }

    // Function to perform secure logout
    function performLogout() {
        console.log('Performing secure logout');
        
        try {
            // Show goodbye message for admin
            const userRole = localStorage.getItem('userRole');
            if (userRole === 'SITE_ADMIN') {
                showBubbleMessage('Bye Admin!', 'success');
            }
            
            // Clear all stored data
            localStorage.clear();
            sessionStorage.clear();
            
            // Clear any cookies
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            
            // Close mobile menu if open
            closeMenu();
            
            // Wait for the message to show before redirecting
            setTimeout(() => {
                // Force a hard redirect to login page
                console.log('Redirecting to login page');
                window.location.href = 'login.html';
            }, 1500);
        } catch (error) {
            console.error('Error during logout:', error);
            showBubbleMessage('Error during logout. Please try again.', 'error');
        }
    }

    // Add click event to the menu button
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            console.log('Menu button clicked');
            e.stopPropagation();
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    // Add click event to the close button
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function(e) {
            console.log('Close button clicked');
            e.stopPropagation();
            closeMenu();
        });
    }

    // Add click event to the document to close the menu when clicking outside
    if (mobileMenu) {
        document.addEventListener('click', function(e) {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                console.log('Clicked outside menu');
                closeMenu();
            }
        });

        // Add click events to all menu links
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                console.log('Menu link clicked:', link.textContent);
                e.stopPropagation();
                closeMenu();
            });
        });
    }

    // Add keyboard event to close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            console.log('Escape key pressed');
            closeMenu();
        }
    });

    // Setup logout buttons
    function setupLogoutButton(button) {
        if (button) {
            button.addEventListener('click', function(e) {
                console.log('Logout button clicked');
                e.preventDefault();
                e.stopPropagation();
                performLogout();
            });
        }
    }

    // Setup both logout buttons
    setupLogoutButton(desktopLogoutBtn);
    setupLogoutButton(mobileLogoutBtn);
}); 