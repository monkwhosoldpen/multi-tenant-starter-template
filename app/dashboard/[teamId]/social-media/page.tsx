"use client";

import { MetricCard } from "../_components/metric-card";
import { Share2, MessageSquare, TrendingUp, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function SocialMediaPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Engagement Rate"
          value="4.8%"
          icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
          description="+0.6% from last week"
        />
        <MetricCard
          title="Scheduled Posts"
          value="15"
          icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
          description="Next 7 days"
        />
        <MetricCard
          title="Trending Topics"
          value="3"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="Campaign related"
        />
        <MetricCard
          title="Platform Reach"
          value="25.4K"
          icon={<Globe className="h-4 w-4 text-muted-foreground" />}
          description="Last 30 days"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Content Calendar</h3>
          {/* Add calendar component */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>
          {/* Add analytics component */}
        </Card>
      </div>
    </div>
  );
} 