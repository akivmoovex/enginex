// Common Dashboard Functionality

document.addEventListener('DOMContentLoaded', () => {
    // Initialize user role display
    initializeUserRole();
    
    // Initialize dropdown functionality
    initializeDropdowns();
});

// Initialize user role display
function initializeUserRole() {
    const userRole = localStorage.getItem('userRole');
    const roleDisplay = document.querySelector('.user-role');
    
    if (roleDisplay && userRole) {
        // Convert role to display format (e.g., 'BASE_ADMIN' to 'Base Admin')
        const displayRole = userRole
            .split('_')
            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ');
            
        roleDisplay.textContent = displayRole;
    }
}

// Initialize dropdown functionality
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.user-dropdown');
    
    dropdowns.forEach(dropdown => {
        const content = dropdown.querySelector('.dropdown-content');
        
        if (content) {
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    content.style.display = 'none';
                }
            });
            
            // Toggle dropdown on click
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                content.style.display = content.style.display === 'block' ? 'none' : 'block';
            });
        }
    });
}

// Handle role change
function handleRoleChange(role) {
    localStorage.setItem('userRole', role);
    const dashboardUrl = getRoleDashboardUrl(role);
    window.location.href = dashboardUrl;
}

// Get dashboard URL based on role
function getRoleDashboardUrl(role) {
    const roleUrls = {
        'BASE_ADMIN': 'dashboard-base-admin.html',
        'SITE_OPERATOR': 'dashboard-site-operator.html',
        'SITE_TEAM_LEADER': 'dashboard-site-team-leader.html',
        'CALL_CENTER_TEAM_LEADER': 'dashboard-call-center-team-leader.html',
        'FINANCIAL_MANAGER': 'dashboard-financial-manager.html',
        'CALL_CENTER_AGENT': 'dashboard-call-center-agent.html',
        'REPORT_VIEWER': 'dashboard-report-viewer.html',
        'OPERATIONS_DIRECTOR': 'dashboard-operations-director.html'
    };
    return roleUrls[role] || 'index.html';
} 