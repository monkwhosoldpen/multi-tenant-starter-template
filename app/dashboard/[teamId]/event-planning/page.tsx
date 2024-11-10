"use client";

import { Calendar, Users, DollarSign, MapPin } from "lucide-react";
import { MetricCard, MetricsGrid } from "../(overview)/metrics-cards";
import { Graph } from "../(overview)/graph";
import { RecentActivities, Activity } from "../(overview)/recent-activities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentActivities: Activity[] = [
  {
    id: "1",
    user: {
      name: "Emily Chen",
      initials: "EC",
      avatar: "/avatars/04.png",
    },
    action: "Confirmed venue for Town Hall Meeting",
    timestamp: "1 hour ago",
    status: "completed",
  },
  {
    id: "2",
    user: {
      name: "David Wilson",
      initials: "DW",
      avatar: "/avatars/05.png",
    },
    action: "Updated budget for Community Rally",
    timestamp: "3 hours ago",
    status: "in-progress",
  },
  {
    id: "3",
    user: {
      name: "Lisa Anderson",
      initials: "LA",
      avatar: "/avatars/06.png",
    },
    action: "Scheduled volunteer briefing",
    timestamp: "5 hours ago",
    status: "pending",
  },
];

export default function EventPlanningDashboard() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Event Planning Dashboard</h2>
        </div>
        
        <MetricsGrid>
          <MetricCard
            title="Upcoming Events"
            value="12"
            description="Next 30 days"
            icon={Calendar}
          />
          <MetricCard
            title="Expected Attendance"
            value="2,500"
            description="Across all events"
            icon={Users}
          />
          <MetricCard
            title="Budget Utilized"
            value="$15,234"
            description="75% of allocation"
            icon={DollarSign}
          />
          <MetricCard
            title="Venues Booked"
            value="8"
            description="4 pending confirmation"
            icon={MapPin}
          />
        </MetricsGrid>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Event Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Graph />
            </CardContent>
          </Card>
          
          <div className="col-span-3">
            <RecentActivities 
              title="Event Planning Activities"
              activities={recentActivities} 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 