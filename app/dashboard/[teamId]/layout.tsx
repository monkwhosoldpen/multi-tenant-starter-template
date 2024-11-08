'use client';

import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import { SelectedTeamSwitcher, useUser } from "@stackframe/stack";
import { BadgePercent, BarChart4, Columns3, Globe, Locate, Settings2, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const navigationItems: SidebarItem[] = [
  {
    name: "Overview",
    href: "/",
    icon: Globe,
    type: "item",
  },
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
  {
    name: "Advanced Settings",
    href: "/advanced-settings",
    icon: Users,
    type: "item",
  },
];

export default function Layout(props: { children: React.ReactNode }) {
  const params = useParams<{ teamId: string }>();
  const user: any = useUser({ or: 'redirect' });
  const team = user.useTeam(params.teamId);
  const router = useRouter();

  const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
  const isSuperAdmin = user?.primaryEmail === superAdminEmail;

  const _navigationItems = isSuperAdmin ?
    [...navigationItems, ...superAdminNavigationItems] :
    [...navigationItems];

  if (!team) {
    router.push('/dashboard');
    return null;
  }

  return (
    <SidebarLayout
      items={_navigationItems}
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