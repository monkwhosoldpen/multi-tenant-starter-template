"use client";

import { MessageSquare, Share2, TrendingUp, Bell } from "lucide-react";
import { MetricCard, MetricsGrid } from "../(overview)/metrics-cards";
import { Graph } from "../(overview)/graph";
import { RecentActivities, Activity } from "../(overview)/recent-activities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentActivities: Activity[] = [
  {
    id: "1",
    user: {
      name: "Alex Turner",
      initials: "AT",
      avatar: "/avatars/06.png",
    },
    action: "Published new press release about campaign launch",
    timestamp: "30 minutes ago",
    status: "completed",
  },
  {
    id: "2",
    user: {
      name: "Maria Garcia",
      initials: "MG",
      avatar: "/avatars/07.png",
    },
    action: "Updated social media content calendar",
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: "3",
    user: {
      name: "James Wilson",
      initials: "JW",
      avatar: "/avatars/08.png",
    },
    action: "Scheduled media interview with local news",
    timestamp: "4 hours ago",
    status: "pending",
  },
];

export default function CommunicationsDashboard() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Communications Dashboard</h2>
        </div>
        
        <MetricsGrid>
          <MetricCard
            title="Social Engagement"
            value="45.2K"
            description="+22% from last week"
            icon={MessageSquare}
          />
          <MetricCard
            title="Media Mentions"
            value="234"
            description="12 in last 24 hours"
            icon={Share2}
          />
          <MetricCard
            title="Reach Growth"
            value="+28%"
            description="Compared to last month"
            icon={TrendingUp}
          />
          <MetricCard
            title="Active Campaigns"
            value="15"
            description="4 launching soon"
            icon={Bell}
          />
        </MetricsGrid>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Engagement Analytics</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Graph />
            </CardContent>
          </Card>
          
          <div className="col-span-3">
            <RecentActivities 
              title="Communication Activities"
              activities={recentActivities} 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 