// src/constants/roles.js
export const ROLES = {
    SUPER_ADMIN: 'super_admin',  // 👑 Full power
    ADMIN: 'admin',              // 🔧 Admin power
    USER: 'user'                 // 👤 Normal user
};

export const ROLE_LEVELS = {
    super_admin: 3,
    admin: 2,
    user: 1
};

export const ROLE_PERMISSIONS = {
    super_admin: [
        'view_dashboard', 'view_products', 'add_product', 'edit_product', 'delete_product',
        'view_orders', 'update_order_status', 'delete_order',
        'view_users', 'add_user', 'edit_user', 'delete_user',
        'view_content', 'edit_content', 'delete_content',
        'view_coupons', 'add_coupon', 'edit_coupon', 'delete_coupon',
        'manage_admins', 'view_reports', 'export_data'
    ],
    admin: [
        'view_dashboard', 'view_products', 'add_product', 'edit_product', 'delete_product',
        'view_orders', 'update_order_status',
        'view_users', 'edit_user',
        'view_content', 'edit_content',
        'view_coupons', 'add_coupon', 'edit_coupon', 'delete_coupon',
        'view_reports', 'export_data'
    ],
    user: [
        'view_products'  // Normal users can only view products (if they access admin panel)
    ]
};

export const ROLE_BADGES = {
    super_admin: { color: 'bg-yellow-500', text: 'Super Admin', icon: '👑' },
    admin: { color: 'bg-[#8B1E2D]', text: 'Admin', icon: '🔧' },
    user: { color: 'bg-gray-500', text: 'User', icon: '👤' }
};