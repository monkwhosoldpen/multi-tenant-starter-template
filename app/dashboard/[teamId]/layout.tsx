'use client';

import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import { SelectedTeamSwitcher, useUser } from "@stackframe/stack";
import { BadgePercent, BarChart4, Columns3, Globe, Locate, Settings2, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import useTenant, { TenantProvider } from "@/lib/usetenant";

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

  if (!team) {
    router.push('/dashboard');
    return null;
  }

  return (
    <TenantProvider>
      <LayoutContent team={team}>
        {props.children}
      </LayoutContent>
    </TenantProvider>
  );
}

// Add this new component
function LayoutContent({ children, team }: { children: React.ReactNode, team: any }) {
  const { userRole, isMaintenanceMode, tenantConfig } = useTenant();
  
  if (!tenantConfig) {
    return (
      <SidebarLayout
        items={getNavigationItemsByRole(userRole)}
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
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Card className="w-[420px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⌛ Loading Tenant Configuration
              </CardTitle>
              <CardDescription>
                Please wait while we load your tenant configuration...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout
      items={getNavigationItemsByRole(userRole)}
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
      {isMaintenanceMode ? (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Card className="w-[420px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🛠️ Maintenance in Progress
              </CardTitle>
              <CardDescription>
                We&apos;re currently performing scheduled maintenance to improve our services.
                Please check back later. We apologize for any inconvenience.
                <div className="mt-4 text-sm">
                  <strong>Expected completion:</strong> Within 2 hours
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      ) : (
        children
      )}
    </SidebarLayout>
  );
}

