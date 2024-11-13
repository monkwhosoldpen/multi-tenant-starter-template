"use client";

import { MetricCard } from "../_components/metric-card";
import { Users, MapPin, ClipboardCheck, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FieldOrganizerPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Today's Contacts"
          value="45"
          icon={<Phone className="h-4 w-4 text-muted-foreground" />}
          description="15 pending follow-up"
        />
        <MetricCard
          title="Area Coverage"
          value="75%"
          icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
          description="Of assigned territory"
        />
        <MetricCard
          title="Active Volunteers"
          value="12"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="In your team"
        />
        <MetricCard
          title="Tasks Completed"
          value="8/10"
          icon={<ClipboardCheck className="h-4 w-4 text-muted-foreground" />}
          description="Today's assignments"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Territory Map</h3>
          {/* Add map component */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Schedule</h3>
          {/* Add schedule component */}
        </Card>
      </div>
    </div>
  );
} 