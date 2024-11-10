"use client";

import { Users, CheckCircle, AlertCircle, MapPin } from "lucide-react";
import { MetricCard, MetricsGrid } from "../(overview)/metrics-cards";
import { Graph } from "../(overview)/graph";
import { RecentActivities, Activity } from "../(overview)/recent-activities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentActivities: Activity[] = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      initials: "SJ",
      avatar: "/avatars/02.png",
    },
    action: "Verified 25 new registrations in District 3",
    timestamp: "1 hour ago",
    status: "completed",
  },
  {
    id: "2",
    user: {
      name: "Mike Peters",
      initials: "MP",
      avatar: "/avatars/03.png",
    },
    action: "Added 30 new voter registrations",
    timestamp: "3 hours ago",
    status: "completed",
  },
  {
    id: "3",
    user: {
      name: "Rachel Kim",
      initials: "RK",
      avatar: "/avatars/04.png",
    },
    action: "Started registration drive in Ward 7",
    timestamp: "4 hours ago",
    status: "in-progress",
  },
];

export default function VoterRegistrationDashboard() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Voter Registration Dashboard</h2>
        </div>
        
        <MetricsGrid>
          <MetricCard
            title="Total Registrations"
            value="1,234"
            description="+123 this week"
            icon={Users}
          />
          <MetricCard
            title="Verified Registrations"
            value="1,089"
            description="88% verification rate"
            icon={CheckCircle}
          />
          <MetricCard
            title="Pending Verification"
            value="145"
            description="12% of total"
            icon={AlertCircle}
          />
          <MetricCard
            title="Active Areas"
            value="8"
            description="3 high priority"
            icon={MapPin}
          />
        </MetricsGrid>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Registration Trends</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Graph />
            </CardContent>
          </Card>
          
          <div className="col-span-3">
            <RecentActivities 
              title="Registration Activities"
              activities={recentActivities} 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 