"use client";

import { MetricCard } from "../_components/metric-card";
import { Calendar, Users, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function EventPlanningPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Upcoming Events"
          value="12"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          description="Next 30 days"
        />
        <MetricCard
          title="Expected Attendance"
          value="2.5K"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Total for all events"
        />
        <MetricCard
          title="Venues Booked"
          value="8"
          icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
          description="3 pending confirmation"
        />
        <MetricCard
          title="Planning Hours"
          value="124"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          description="This month"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Event Calendar</h3>
          {/* Add calendar component */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Resource Allocation</h3>
          {/* Add resource management component */}
        </Card>
      </div>
    </div>
  );
} 