'use client';

import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import { SelectedTeamSwitcher, useUser } from "@stackframe/stack";
import { BadgePercent, BarChart4, Columns3, Globe, Locate, Settings2, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const baseNavigationItems: SidebarItem[] = [
  {
    name: "Overview",
    href: "/",
    icon: Globe,
    type: "item",
  },
];

const memberNavigationItems: SidebarItem[] = [
  ...baseNavigationItems,
  {
    type: 'label',
    name: 'Management',
  },
  {
    name: "Discounts",
    href: "/discounts",
    icon: BadgePercent,
    type: "item",
  },
];

const adminNavigationItems: SidebarItem[] = [
  ...memberNavigationItems,
  {
    type: 'label',
    name: 'Settings',
  },
  {
    name: "Configuration",
    href: "/configuration",
    icon: Settings2,
    type: "item",
  },
];

const superAdminNavigationItems: SidebarItem[] = [
  ...adminNavigationItems,
  {
    type: 'label',
    name: 'Super Admin',
  },
  {
    name: "Advanced Settings",
    href: "/advanced-settings",
    icon: Users,
    type: "item",
  },
];

type UserRole = 'super_admin' | 'admin' | 'member' | 'guest';

const getNavigationItemsByRole = (role: UserRole): SidebarItem[] => {
  switch (role) {
    case 'super_admin':
      return superAdminNavigationItems;
    case 'admin':
      return adminNavigationItems;
    case 'member':
      return memberNavigationItems;
    case 'guest':
      return baseNavigationItems;
    default:
      return baseNavigationItems;
  }
};

export default function Layout(props: { children: React.ReactNode }) {
  const params = useParams<{ teamId: string }>();
  const user: any = useUser({ or: 'redirect' });
  const team = user.useTeam(params.teamId);
  const router = useRouter();

  // Replace this with your actual role logic
  const userRole: UserRole = user?.primaryEmail === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL 
    ? 'super_admin' 
    : 'member'; // You'll need to implement proper role checking here

  const navigationItems = getNavigationItemsByRole(userRole);

  if (!team) {
    router.push('/dashboard');
    return null;
  }

  return (
    <SidebarLayout
      items={navigationItems}
      basePath={`/dashboard/${team.id}`}
      sidebarTop={<SelectedTeamSwitcher
        selectedTeam={team}
        urlMap={(team) => `/dashboard/${team.id}`}
      />}
      baseBreadcrumb={[{
        title: team.displayName,
        href: `/dashboard/${team.id}`,
      }]}
    >
      {props.children}
    </SidebarLayout>
  );
}