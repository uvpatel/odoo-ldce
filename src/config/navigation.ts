export interface NavItemConfig {
  title: string;
  href: string;
  icon?: string;
  disabled?: boolean;
  external?: boolean;
  roles?: string[];
  permission?: string;
  children?: NavItemConfig[];
}

export const dashboardNav: NavItemConfig[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "My Trips",
    href: "/dashboard/trips",
    icon: "Plane",
    children: [
      {
        title: "All Trips",
        href: "/dashboard/trips",
      },
      {
        title: "Create Trip",
        href: "/dashboard/trips/new",
      },
    ],
  },
  {
    title: "Discover",
    href: "/dashboard/discover",
    icon: "Compass",
    children: [
      {
        title: "Overview",
        href: "/dashboard/discover",
      },
      {
        title: "Cities",
        href: "/dashboard/discover/cities",
      },
      {
        title: "Activities",
        href: "/dashboard/discover/activities",
      },
    ],
  },
  {
    title: "Saved Places",
    href: "/dashboard/saved",
    icon: "Bookmark",
  },
  {
    title: "User Management",
    href: "/dashboard/users",
    icon: "Users",
    permission: "user.role.manage",
  },
];

export const adminNav: NavItemConfig[] = [
  {
    title: "Overview",
    href: "/admin",
    icon: "Shield",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: "BarChart3",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: "Users",
  },
  {
    title: "Trips",
    href: "/admin/trips",
    icon: "Plane",
  },
  {
    title: "Cities",
    href: "/admin/cities",
    icon: "Building2",
  },
  {
    title: "Activities",
    href: "/admin/activities",
    icon: "Sparkles",
  },
];

export const settingsNav: NavItemConfig[] = [
  {
    title: "Profile",
    href: "/settings/profile",
    icon: "User",
  },
  {
    title: "Preferences",
    href: "/settings/preferences",
    icon: "Sliders",
  },
  {
    title: "Privacy",
    href: "/settings/privacy",
    icon: "Lock",
  },
  {
    title: "Account",
    href: "/settings/account",
    icon: "ShieldAlert",
  },
];

export const marketingNav: NavItemConfig[] = [
  {
    title: "Explore",
    href: "/explore",
  },
  {
    title: "Features",
    href: "/#features",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
  },
];
