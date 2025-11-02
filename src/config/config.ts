// src/config/navbarConfig.ts

export type NavbarMenuItem = {
  label: string;
  icon: string;
  url: string;
  roles: string[];
};

export const navbarConfig: NavbarMenuItem[] = [
  {
    label: 'Users',
    icon: 'pi pi-users',
    url: '/users',
    roles: ['ADMIN']
  },
 /*  {
    label: 'Canvases',
    icon: 'pi pi-palette',
    url: '/canvases',
    roles: ['TEMPLATECREATOR', 'ADMIN', 'USER','DESIGNER']
  }, */
  {
    label: 'Templates',
    icon: 'pi pi-image',
    url: '/templates',
    roles: ['TEMPLATECREATOR', 'USER', 'ADMIN','DESIGNER']
  },
  {
    label: 'Downloads',
    icon: 'pi pi-download',
    url: '/downloads',
    roles: ['ADMIN']
  },
  {
    label: 'Payments',
    icon: 'pi pi-credit-card',
    url: '/payments',
    roles: ['ADMIN']
  },
  {
    label: 'Reviews',
    icon: 'pi pi-comment',
    url: '/reviews',
    roles: ['ADMIN']
  }
];

export const navbarConfigLower: NavbarMenuItem[] = [
/*   {
    label: 'Settings',
    icon: 'pi pi-cog',
    url: '/settings',
    roles: [ 'ADMIN', ]
  }, */
  {
    label: 'Performance',
    icon: 'pi pi-chart-bar',
    url: '/',
    roles: ['TEMPLATECREATOR', 'ADMIN']
  }
];

// Helper function to filter navbar items by user role
export const getNavbarItemsByRole = (role: string, config: NavbarMenuItem[]): NavbarMenuItem[] => {
  return config.filter(item => item.roles.includes(role));
};

// Helper function to format items for PrimeReact PanelMenu
export const getPanelMenuItems = (role: string, config: NavbarMenuItem[]) => {
  return getNavbarItemsByRole(role, config).map(item => ({
    label: item.label,
    icon: item.icon,
    url: item.url
  }));
};
