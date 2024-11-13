"use client";

import { MetricCard } from "../_components/metric-card";
import { MapPin, Users, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function PollingPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Polling Stations"
          value="45"
          icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
          description="All districts"
        />
        <MetricCard
          title="Team Members"
          value="120"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Assigned to stations"
        />
        <MetricCard
          title="Stations Ready"
          value="42"
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          description="93% complete"
        />
        <MetricCard
          title="Issues Reported"
          value="3"
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
          description="Being addressed"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Station Map</h3>
          {/* Add map component */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Team Assignments</h3>
          {/* Add assignment table */}
        </Card>
      </div>
    </div>
  );
} 