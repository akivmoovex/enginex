document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');

    if (mobileMenuBtn && mobileMenu && closeMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    // User dropdown functionality
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (userDropdownBtn && userDropdown) {
        userDropdownBtn.addEventListener('click', () => {
            userDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userDropdownBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear session/local storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Redirect to login page
            window.location.href = 'index.html';
        });
    }

    // Load dashboard data
    loadDashboardData();
});

function loadDashboardData() {
    // Example data - replace with actual API calls
    const dashboardData = {
        activeSites: 12,
        totalOperators: 45,
        activeVehicles: 78,
        systemStatus: 'Operational'
    };

    // Update KPI cards with data
    updateKPICard('activeSites', dashboardData.activeSites);
    updateKPICard('totalOperators', dashboardData.totalOperators);
    updateKPICard('activeVehicles', dashboardData.activeVehicles);
    updateKPICard('systemStatus', dashboardData.systemStatus);
}

function updateKPICard(id, value) {
    const card = document.getElementById(id);
    if (card) {
        const valueElement = card.querySelector('.kpi-value');
        if (valueElement) {
            valueElement.textContent = value;
        }
    }
} 