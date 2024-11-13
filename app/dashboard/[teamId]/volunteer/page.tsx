"use client";

import { MetricCard } from "../_components/metric-card";
import { Users, Calendar, Clock, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function VolunteerPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Volunteers"
          value="234"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="+12 this week"
        />
        <MetricCard
          title="Upcoming Shifts"
          value="45"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          description="Next 7 days"
        />
        <MetricCard
          title="Hours Logged"
          value="1,234"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          description="This month"
        />
        <MetricCard
          title="Coverage"
          value="85%"
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
          description="Of required positions"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Volunteer Schedule</h3>
          {/* Add schedule component */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Team Distribution</h3>
          {/* Add distribution chart */}
        </Card>
      </div>
    </div>
  );
} 