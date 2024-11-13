import { MetricCard } from "./_components/metric-card";
import { BarChart4, Users, CalendarDays, Target } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Volunteers"
          value="2,345"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="+20% from last month"
        />
        <MetricCard
          title="Registered Voters"
          value="12,234"
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
          description="Target: 15,000"
        />
        <MetricCard
          title="Upcoming Events"
          value="8"
          icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
          description="Next 7 days"
        />
        <MetricCard
          title="Engagement Rate"
          value="64%"
          icon={<BarChart4 className="h-4 w-4 text-muted-foreground" />}
          description="+12% from last week"
        />
      </div>
      
      {/* Add more sections as needed */}
    </div>
  );
} 