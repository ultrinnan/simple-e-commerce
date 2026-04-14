export const ROUTES = {
  home: '/',
  supplierLogin: '/supplier/login',
  supplierRegister: '/supplier/register',
  supplierDashboard: '/supplier/dashboard',
  customerLogin: '/customer/login',
  customerRegister: '/customer/register',
  customerDashboard: '/customer/dashboard',
}

export function dashboardByRole(role) {
  return role === 'supplier' ? ROUTES.supplierDashboard : ROUTES.customerDashboard
}

export function loginByRole(role) {
  return role === 'supplier' ? ROUTES.supplierLogin : ROUTES.customerLogin
}
