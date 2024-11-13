"use client";

import { MetricCard } from "../_components/metric-card";
import { Users, MapPin, ClipboardCheck, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FieldCoordinatorPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Teams"
          value="8"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Currently in field"
        />
        <MetricCard
          title="Areas Covered"
          value="12/15"
          icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
          description="Districts"
        />
        <MetricCard
          title="Daily Tasks"
          value="24"
          icon={<ClipboardCheck className="h-4 w-4 text-muted-foreground" />}
          description="15 completed"
        />
        <MetricCard
          title="Week's Events"
          value="6"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          description="2 pending approval"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Team Assignments</h3>
          {/* Add team assignment table component */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Coverage Map</h3>
          {/* Add map component */}
        </Card>
      </div>
    </div>
  );
} 