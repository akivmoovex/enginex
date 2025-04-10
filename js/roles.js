const UserRoles = {
    SITE_OPERATOR: {
        name: 'Site Operator',
        permissions: {
            viewDashboard: true,
            viewVehicles: true,
            viewBasicReports: true,
            editVehicleStatus: true,
            viewCustomerInfo: false,
            manageUsers: false,
            viewFinancialData: false,
            manageCallCenter: false
        }
    },
    CALL_CENTER_OPERATOR: {
        name: 'Call Center Operator',
        permissions: {
            viewDashboard: true,
            viewVehicles: true,
            viewBasicReports: true,
            editVehicleStatus: false,
            viewCustomerInfo: true,
            manageUsers: false,
            viewFinancialData: false,
            manageCallCenter: false
        }
    },
    CALL_CENTER_MANAGER: {
        name: 'Call Center Manager',
        permissions: {
            viewDashboard: true,
            viewVehicles: true,
            viewBasicReports: true,
            editVehicleStatus: true,
            viewCustomerInfo: true,
            manageUsers: true,
            viewFinancialData: true,
            manageCallCenter: true
        }
    },
    COUNTRY_MANAGER: {
        name: 'Country Manager',
        permissions: {
            viewDashboard: true,
            viewVehicles: true,
            viewBasicReports: true,
            editVehicleStatus: true,
            viewCustomerInfo: true,
            manageUsers: true,
            viewFinancialData: true,
            manageCallCenter: true
        }
    }
};

// Role-specific dashboard items
const DashboardItems = {
    VEHICLES: {
        id: 'vehicles',
        title: 'Vehicles',
        icon: 'fa-car',
        roles: ['SITE_OPERATOR', 'CALL_CENTER_OPERATOR', 'CALL_CENTER_MANAGER', 'COUNTRY_MANAGER']
    },
    CUSTOMERS: {
        id: 'customers',
        title: 'Customers',
        icon: 'fa-users',
        roles: ['CALL_CENTER_OPERATOR', 'CALL_CENTER_MANAGER', 'COUNTRY_MANAGER']
    },
    FINANCIAL: {
        id: 'financial',
        title: 'Financial Overview',
        icon: 'fa-chart-line',
        roles: ['CALL_CENTER_MANAGER', 'COUNTRY_MANAGER']
    },
    CALL_CENTER: {
        id: 'call-center',
        title: 'Call Center Management',
        icon: 'fa-headset',
        roles: ['CALL_CENTER_MANAGER', 'COUNTRY_MANAGER']
    },
    REPORTS: {
        id: 'reports',
        title: 'Reports',
        icon: 'fa-file-alt',
        roles: ['SITE_OPERATOR', 'CALL_CENTER_OPERATOR', 'CALL_CENTER_MANAGER', 'COUNTRY_MANAGER']
    }
};

// Function to check if a role has permission for a specific action
function hasPermission(role, permission) {
    return UserRoles[role]?.permissions[permission] || false;
}

// Function to get available dashboard items for a role
function getAvailableDashboardItems(role) {
    return Object.values(DashboardItems).filter(item => 
        item.roles.includes(role)
    );
}

// Function to get role name
function getRoleName(role) {
    return UserRoles[role]?.name || 'Unknown Role';
} 