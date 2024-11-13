"use client";

import { Avatar } from "@/components/ui/avatar";
import { operationsMockData } from "@/mockdata/operationsdata";

export function RecentTeamActivity() {
  const activities = operationsMockData.recentActivities.slice(0, 5);

  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
              {activity.team.charAt(0)}
            </div>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.team}</p>
            <p className="text-sm text-muted-foreground">{activity.activity}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{activity.timestamp}</span>
              <span className="mx-2">•</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activity.status === 'completed' ? 'bg-green-100 text-green-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {activity.status}
              </span>
            </div>
            {activity.impact && (
              <p className="text-xs text-muted-foreground mt-1">
                Impact: {activity.impact}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 