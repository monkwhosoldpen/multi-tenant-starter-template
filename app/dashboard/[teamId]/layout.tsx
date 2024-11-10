'use client';

import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import { SelectedTeamSwitcher, useUser } from "@stackframe/stack";
import { BarChart4, CalendarDays, Globe, MessageSquare, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import useTenant, { TenantProvider, } from "@/lib/usetenant";
import { ContactAdminMessage } from "@/components/contact-admin-message";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const baseNavigationItems: SidebarItem[] = [
  {
    name: "Overview",
    href: "/",
    icon: Globe,
    type: "item",
  },
];

const fieldStaffNavigationItems: SidebarItem[] = [
  ...baseNavigationItems,
  {
    type: 'label',
    name: 'Field Operations',
  },
  {
    name: "Voter Registration",
    href: "/voter-registration",
    icon: Users,
    type: "item",
  },
  {
    name: "Event Planning",
    href: "/event-planning",
    icon: CalendarDays,
    type: "item",
  },
];

const coordinatorNavigationItems: SidebarItem[] = [
  ...fieldStaffNavigationItems,
  {
    type: 'label',
    name: 'Coordination',
  },
  {
    name: "Communications",
    href: "/communications",
    icon: MessageSquare,
    type: "item",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart4,
    type: "item",
  },
];

const adminNavigationItems: SidebarItem[] = [
  ...coordinatorNavigationItems,
  {
    type: 'label',
    name: 'Administration',
  },
  {
    name: "Field Coordinator",
    href: "/field-coordinator",
    icon: Users,
    type: "item",
  },
];

// All navigation items combined for superadmin
const superAdminNavigationItems: SidebarItem[] = [
  ...baseNavigationItems,
  {
    type: 'label',
    name: 'Field Operations',
  },
  {
    name: "Voter Registration",
    href: "/voter-registration",
    icon: Users,
    type: "item",
  },
  {
    name: "Event Planning",
    href: "/event-planning",
    icon: CalendarDays,
    type: "item",
  },
  {
    type: 'label',
    name: 'Coordination',
  },
  {
    name: "Communications",
    href: "/communications",
    icon: MessageSquare,
    type: "item",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart4,
    type: "item",
  },
  {
    type: 'label',
    name: 'Administration',
  },
  {
    name: "Field Coordinator",
    href: "/field-coordinator",
    icon: Users,
    type: "item",
  },
];

type UserRole = 
  | 'superadmin'
  | 'field-coordinator'
  | 'field-organizer'
  | 'canvassing-team'
  | 'voter-registration-team'
  | 'event-planning-team'
  | 'communications-team'
  | 'data-collection-and-analysis-team'
  | 'transportation-and-logistics-team'
  | 'volunteer-team'
  | 'polling-team-election-day-team'
  | 'media-outreach-and-social-media-team'
  | 'guest';

const getNavigationItemsByRole = (role: UserRole): SidebarItem[] => {
  // switch (role) {
  //   case 'superadmin':
  //     return superAdminNavigationItems;
  //   case 'field-coordinator':
  //     return adminNavigationItems;
  //   case 'field-organizer':
  //   case 'data-collection-and-analysis-team':
  //     return coordinatorNavigationItems;
  //   case 'communications-team':
  //   case 'media-outreach-and-social-media-team':
  //     return [
  //       ...baseNavigationItems,
  //       {
  //         type: 'label',
  //         name: 'Communications',
  //       },
  //       {
  //         name: "Communications",
  //         href: "/communications",
  //         icon: MessageSquare,
  //         type: "item",
  //       },
  //     ];
  //   case 'event-planning-team':
  //     return [
  //       ...baseNavigationItems,
  //       {
  //         type: 'label',
  //         name: 'Events',
  //       },
  //       {
  //         name: "Event Planning",
  //         href: "/event-planning",
  //         icon: CalendarDays,
  //         type: "item",
  //       },
  //     ];
  //   case 'voter-registration-team':
  //     return [
  //       ...baseNavigationItems,
  //       {
  //         type: 'label',
  //         name: 'Registration',
  //       },
  //       {
  //         name: "Voter Registration",
  //         href: "/voter-registration",
  //         icon: Users,
  //         type: "item",
  //       },
  //     ];
  //   case 'canvassing-team':
  //   case 'transportation-and-logistics-team':
  //   case 'volunteer-team':
  //   case 'polling-team-election-day-team':
  //     return fieldStaffNavigationItems;
  //   case 'guest':
  //     return baseNavigationItems;
  //   default:
  //     return baseNavigationItems;
  // }
  return superAdminNavigationItems;
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

function LayoutContent({ children, team }: { children: React.ReactNode, team: any }) {
  const { userRole, isMaintenanceMode, tenantConfig } = useTenant();
  
  if (!tenantConfig) {
    return (
      <SidebarLayout
        items={getNavigationItemsByRole(userRole as UserRole)}
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
      items={getNavigationItemsByRole(userRole as UserRole)}
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
      {isMaintenanceMode ? <ContactAdminMessage /> : children}
    </SidebarLayout>
  );
}

