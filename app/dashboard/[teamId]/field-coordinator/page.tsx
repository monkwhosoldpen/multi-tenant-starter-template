"use client";

import { BarChart4, Users, Calendar, Flag } from "lucide-react";
import { MetricCard, MetricsGrid } from "../(overview)/metrics-cards";
import { Graph } from "../(overview)/graph";
import { RecentActivities, Activity } from "../(overview)/recent-activities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentActivities: Activity[] = [
  {
    id: "1",
    user: {
      name: "John Smith",
      initials: "JS",
      avatar: "/avatars/01.png",
    },
    action: "Completed door-to-door campaign in District 5",
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: "2",
    user: {
      name: "Sarah Johnson",
      initials: "SJ",
      avatar: "/avatars/02.png",
    },
    action: "Started new voter registration drive",
    timestamp: "3 hours ago",
    status: "in-progress",
  },
  {
    id: "3",
    user: {
      name: "Michael Brown",
      initials: "MB",
      avatar: "/avatars/03.png",
    },
    action: "Updated campaign strategy for Zone B",
    timestamp: "5 hours ago",
    status: "completed",
  },
];

export default function FieldCoordinatorDashboard() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Field Operations Overview</h2>
        </div>
        
        <MetricsGrid>
          <MetricCard
            title="Active Field Staff"
            value="24"
            description="+2 from last week"
            icon={Users}
          />
          <MetricCard
            title="Ongoing Campaigns"
            value="12"
            description="3 completing this week"
            icon={Flag}
          />
          <MetricCard
            title="Upcoming Events"
            value="8"
            description="Next 7 days"
            icon={Calendar}
          />
          <MetricCard
            title="Engagement Rate"
            value="24.3%"
            description="+5.2% from last month"
            icon={BarChart4}
          />
        </MetricsGrid>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Graph />
            </CardContent>
          </Card>
          
          <div className="col-span-3">
            <RecentActivities 
              title="Field Operations Activity"
              activities={recentActivities} 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 