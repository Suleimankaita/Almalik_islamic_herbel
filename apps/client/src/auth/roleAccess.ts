export type AppRole = 'Admin' | 'Manager' | 'Staff';

export const ROLE_ACCESS: Record<AppRole, string[]> = {
  Admin: [
    '/',
    '/inventory',
    '/search',
    '/inventory/view-products/:id',
    '/sales-pos',
    '/sales-history',
    '/Sales (POS)',
    '/add product',
    '/customers',
    '/reports',
    '/notifications',
    '/settings',
    '/expenses',
    '/users-and-roles',
    '/suppliers',
    '/purchase',
    '/messages',
    '/Users & Roles',
    '/Loading',
    '/ma',
  ],
  Manager: [
    '/',
    '/inventory',
    '/search',
    '/inventory/view-products/:id',
    '/sales-pos',
    '/sales-history',
    '/Sales (POS)',
    '/add product',
    '/customers',
    '/reports',
    '/notifications',
    '/settings',
    '/expenses',
    '/suppliers',
    '/purchase',
    '/messages',
  ],
  Staff: ['/', '/search', '/sales-pos', '/sales-history', '/Sales (POS)', '/notifications', '/settings', '/messages'],
};

export const normalizeRole = (role: unknown): AppRole =>
  role === 'Admin' || role === 'Manager' ? role : 'Staff';

export const roleCanAccessPath = (role: unknown, pathname: string): boolean => {
  const normalizedRole = normalizeRole(role);
  let normalizedPathname = pathname;
  try {
    normalizedPathname = decodeURIComponent(pathname);
  } catch {
    normalizedPathname = pathname;
  }
  normalizedPathname = normalizedPathname.toLowerCase();

  return ROLE_ACCESS[normalizedRole].some((path) => {
    if (path.endsWith('/:id')) {
      return normalizedPathname.startsWith(path.slice(0, -':id'.length).toLowerCase());
    }
    return path.toLowerCase() === normalizedPathname;
  });
};
