// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const userRole = localStorage.getItem('userRole');
    const currentPage = window.location.pathname.split('/').pop();

    // If not on login page and no user role, redirect to login
    if (currentPage !== 'login.html' && !userRole) {
        window.location.href = 'login.html';
        return;
    }

    // If on login page and user is already logged in, redirect to appropriate dashboard
    if (currentPage === 'login.html' && userRole) {
        window.location.href = getRoleDashboardUrl(userRole);
        return;
    }

    // Add smooth scrolling to navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add a simple animation to the main heading
    const mainHeading = document.querySelector('h1');
    if (mainHeading) {
        mainHeading.style.opacity = '0';
        mainHeading.style.transition = 'opacity 1s ease-in';
        
        setTimeout(() => {
            mainHeading.style.opacity = '1';
        }, 500);
    }

    // Add current year to the copyright notice
    const copyrightElement = document.querySelector('footer p');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.textContent = `© ${currentYear} MotorEx. All rights reserved.`;
    }

    // Menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const navMenu = document.querySelector('nav ul');

    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.add('active');
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.remove('active');
        });
    }

    const menuItems = document.querySelectorAll('nav ul li a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', function(event) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Role-based functionality
    const roleSelect = document.getElementById('roleSelect');
    const dashboardGrid = document.getElementById('dashboardGrid');

    if (roleSelect) {
        // Set the current role in the selector
        roleSelect.value = userRole;

        // Handle role changes
        roleSelect.addEventListener('change', function() {
            const newRole = this.value;
            localStorage.setItem('userRole', newRole);
            window.location.href = getRoleDashboardUrl(newRole);
        });
    }

    // Function to get role-specific dashboard URL
    function getRoleDashboardUrl(role) {
        switch(role) {
            case 'SITE_OPERATOR':
                return 'dashboard-site-operator.html';
            case 'SITE_TEAM_LEADER':
                return 'dashboard-site-team-leader.html';
            case 'CALL_CENTER_TEAM_LEADER':
                return 'dashboard-call-center-team-leader.html';
            case 'FINANCIAL_MANAGER':
                return 'dashboard-financial-manager.html';
            case 'CALL_CENTER_AGENT':
                return 'dashboard-call-center.html';
            case 'REPORT_VIEWER':
                return 'dashboard-report-viewer.html';
            case 'OPERATIONS_DIRECTOR':
                return 'dashboard-operations-director.html';
            default:
                return 'index.html';
        }
    }

    // Update dashboard content if on a dashboard page
    if (dashboardGrid) {
        updateDashboard(userRole);
    }

    function updateDashboard(role) {
        // Clear existing content
        dashboardGrid.innerHTML = '';
        
        // Get available items for the role
        const availableItems = getAvailableDashboardItems(role);
        
        // Create KPI cards for available items
        availableItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'kpi-card';
            card.innerHTML = `
                <div class="kpi-icon"><i class="fas ${item.icon}"></i></div>
                <div class="kpi-content">
                    <h3>${item.title}</h3>
                    <p class="kpi-value">Loading...</p>
                    <p class="kpi-change">Updating...</p>
                </div>
            `;
            dashboardGrid.appendChild(card);
        });

        // Update navigation based on permissions
        updateNavigation(role);
    }

    function updateNavigation(role) {
        const navLinks = document.querySelectorAll('nav ul li a');
        const menuItems = {
            SITE_OPERATOR: ['dashboard', 'vehicles', 'customers', 'reports'],
            SITE_TEAM_LEADER: ['dashboard', 'vehicles', 'customers', 'financial', 'reports'],
            CALL_CENTER_TEAM_LEADER: ['dashboard', 'customers', 'call-center', 'reports'],
            FINANCIAL_MANAGER: ['dashboard', 'financial', 'reports'],
            CALL_CENTER_AGENT: ['dashboard', 'customers', 'call-center'],
            REPORT_VIEWER: ['dashboard', 'reports'],
            OPERATIONS_DIRECTOR: ['dashboard', 'vehicles', 'customers', 'financial', 'call-center', 'reports']
        };

        navLinks.forEach(link => {
            const section = link.getAttribute('href').substring(1);
            if (menuItems[role] && menuItems[role].includes(section)) {
                link.parentElement.style.display = 'block';
            } else {
                link.parentElement.style.display = 'none';
            }
        });
    }

    // Sample data for demonstration
    const sampleData = {
        vehicles: {
            value: '1,234',
            change: '+12%',
            trend: 'positive'
        },
        customers: {
            value: '789',
            change: '+5%',
            trend: 'positive'
        },
        financial: {
            value: '$456,789',
            change: '+8%',
            trend: 'positive'
        },
        'call-center': {
            value: '45',
            change: '-2%',
            trend: 'negative'
        },
        reports: {
            value: '12',
            change: '+3%',
            trend: 'positive'
        }
    };

    // Function to update KPI values
    function updateKPIValues() {
        const cards = document.querySelectorAll('.kpi-card');
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const data = sampleData[title.replace(' ', '-')];
            if (data) {
                card.querySelector('.kpi-value').textContent = data.value;
                const changeElement = card.querySelector('.kpi-change');
                changeElement.textContent = data.change;
                changeElement.className = `kpi-change ${data.trend}`;
            }
        });
    }

    // Update KPI values every 5 seconds (simulating real-time updates)
    if (dashboardGrid) {
        updateKPIValues();
        setInterval(updateKPIValues, 5000);
    }
}); 