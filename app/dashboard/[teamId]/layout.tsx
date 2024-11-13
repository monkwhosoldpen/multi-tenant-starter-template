'use client';

import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import { SelectedTeamSwitcher, useUser } from "@stackframe/stack";
import { 
  BarChart4, CalendarDays, Globe, MessageSquare, Users,
  ClipboardCheck, FileText, Database, Truck, LayoutDashboard,
  FileEdit, Users2, CalendarRange, MapPin, Phone, Settings,
  UserCog, Target, LineChart, Mail, Megaphone, UserPlus,
  Building2, Vote, HandshakeIcon, PieChart
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import useTenant, { TenantProvider } from "@/lib/usetenant";
import { ContactAdminMessage } from "@/components/contact-admin-message";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { roles } from "@/lib/roles";

const baseNavigationItems: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    type: "item",
  },
];

// Campaign Director Navigation
const campaignDirectorItems: SidebarItem[] = [
  ...baseNavigationItems,
  {
    type: 'label',
    name: 'Campaign Overview'
  },
  {
    name: "Strategy",
    href: "/strategy",
    icon: Target,
    type: "item",
  },
  {
    name: "Performance",
    href: "/performance",
    icon: LineChart,
    type: "item",
  },
  {
    type: 'label',
    name: 'Departments'
  },
  {
    name: "Operations",
    href: "/operations",
    icon: Building2,
    type: "item",
  },
  {
    name: "Communications",
    href: "/communications",
    icon: Megaphone,
    type: "item",
  },
  {
    name: "Data & Analytics",
    href: "/analytics",
    icon: PieChart,
    type: "item",
  },
  {
    name: "Event Planning",
    href: "/events",
    icon: CalendarRange,
    type: "item",
  },
  {
    type: 'label',
    name: 'Administration'
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    type: "item",
  },
];

// Operations Department
const operationsDirectorItems: SidebarItem[] = [
  ...baseNavigationItems,
  {
    type: 'label',
    name: 'Operations'
  },
  {
    name: "Field Teams",
    href: "/field-teams",
    icon: Users2,
    type: "item",
  },
  {
    name: "Logistics",
    href: "/logistics",
    icon: Truck,
    type: "item",
  },
  {
    name: "Volunteer Management",
    href: "/volunteers",
    icon: UserPlus,
    type: "item",
  },
  {
    type: 'label',
    name: 'Analytics'
  },
  {
    name: "Operations Analytics",
    href: "/operations-analytics",
    icon: BarChart4,
    type: "item",
  },
];

const fieldCoordinatorItems: SidebarItem[] = [
  ...baseNavigationItems,
  {
    type: 'label',
    name: 'Field Operations'
  },
  {
    name: "Team Management",
    href: "/team-management",
    icon: UserCog,
    type: "item",
  },
  {
    name: "Voter Registration",
    href: "/voter-registration",
    icon: Vote,
    type: "item",
  },
  {
    name: "Daily Reports",
    href: "/daily-reports",
    icon: FileText,
    type: "item",
  },
];

const fieldOrganizerItems: SidebarItem[] = [
  ...baseNavigationItems,
  {
    type: 'label',
    name: 'Field Work'
  },
  {
    name: "Assignments",
    href: "/assignments",
    icon: ClipboardCheck,
    type: "item",
  },
  {
    name: "Territory",
    href: "/territory",
    icon: MapPin,
    type: "item",
  },
  {
    name: "Voter Contact",
    href: "/voter-contact",
    icon: HandshakeIcon,
    type: "item",
  },
];

// Communications Department
const communicationsDirectorItems: SidebarItem[] = [
  ...baseNavigationItems,
  {
    type: 'label',
    name: 'Communications'
  },
  {
    name: "Media Relations",
    href: "/media-relations",
    icon: MessageSquare,
    type: "item",
  },
  {
    name: "Content Strategy",
    href: "/content-strategy",
    icon: FileEdit,
    type: "item",
  },
  {
    name: "Email Campaigns",
    href: "/email-campaigns",
    icon: Mail,
    type: "item",
  },
  {
    type: 'label',
    name: 'Analytics'
  },
  {
    name: "Communications Analytics",
    href: "/communications-analytics",
    icon: BarChart4,
    type: "item",
  },
];

const socialMediaManagerItems: SidebarItem[] = [
  ...baseNavigationItems,
  {
    type: 'label',
    name: 'Social Media'
  },
  {
    name: "Content Calendar",
    href: "/content-calendar",
    icon: CalendarDays,
    type: "item",
  },
  {
    name: "Social Analytics",
    href: "/social-analytics",
    icon: LineChart,
    type: "item",
  },
];

// Data & Analytics Department
const dataAnalysisDirectorItems: SidebarItem[] = [
  ...baseNavigationItems,
  {
    type: 'label',
    name: 'Data & Analytics'
  },
  {
    name: "Voter Database",
    href: "/voter-database",
    icon: Database,
    type: "item",
  },
  {
    name: "Campaign Metrics",
    href: "/campaign-metrics",
    icon: BarChart4,
    type: "item",
  },
  {
    name: "Predictive Models",
    href: "/predictive-models",
    icon: LineChart,
    type: "item",
  },
];

const dataAnalystItems: SidebarItem[] = [
  ...baseNavigationItems,
  {
    type: 'label',
    name: 'Analysis'
  },
  {
    name: "Data Collection",
    href: "/data-collection",
    icon: ClipboardCheck,
    type: "item",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
    type: "item",
  },
];

// Event Planning
const eventPlanningDirectorItems: SidebarItem[] = [
  ...baseNavigationItems,
  {
    type: 'label',
    name: 'Events'
  },
  {
    name: "Event Calendar",
    href: "/event-calendar",
    icon: CalendarRange,
    type: "item",
  },
  {
    name: "Venue Management",
    href: "/venues",
    icon: Building2,
    type: "item",
  },
  {
    name: "Event Analytics",
    href: "/event-analytics",
    icon: BarChart4,
    type: "item",
  },
];

type UserRole = 
  | 'campaign-director'
  | 'operations-director'
  | 'field-coordinator'
  | 'field-organizer'
  | 'communications-director'
  | 'social-media-manager'
  | 'data-and-analysis-director'
  | 'data-analysis-specialist'
  | 'volunteer-coordinator'
  | 'event-planning-director'
  | 'polling-team-lead'
  | 'guest';

const getNavigationItemsByRole = (role: UserRole): SidebarItem[] => {
  switch (role) {
    case 'campaign-director':
      return campaignDirectorItems;
    
    case 'operations-director':
      return operationsDirectorItems;
    
    case 'field-coordinator':
      return fieldCoordinatorItems;
    
    case 'field-organizer':
      return fieldOrganizerItems;
    
    case 'communications-director':
      return communicationsDirectorItems;
    
    case 'social-media-manager':
      return socialMediaManagerItems;
    
    case 'data-and-analysis-director':
      return dataAnalysisDirectorItems;
    
    case 'data-analysis-specialist':
      return dataAnalystItems;
    
    case 'event-planning-director':
      return eventPlanningDirectorItems;
    
    case 'volunteer-coordinator':
      return [
        ...baseNavigationItems,
        {
          type: 'label',
          name: 'Volunteer Management'
        },
        {
          name: "Volunteers",
          href: "/volunteers",
          icon: Users,
          type: "item",
        },
        {
          name: "Schedules",
          href: "/schedules",
          icon: CalendarDays,
          type: "item",
        },
      ];
    
    case 'polling-team-lead':
      return [
        ...baseNavigationItems,
        {
          type: 'label',
          name: 'Polling Operations'
        },
        {
          name: "Polling Stations",
          href: "/polling-stations",
          icon: MapPin,
          type: "item",
        },
        {
          name: "Team Assignments",
          href: "/assignments",
          icon: Users,
          type: "item",
        },
      ];
    
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

