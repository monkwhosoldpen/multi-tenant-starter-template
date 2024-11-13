"use client";

import { Avatar } from "@/components/ui/avatar";

const recentCampaigns = [
  {
    name: "Summer Outreach",
    status: "Active",
    reach: "45.2K",
    engagement: "12%",
    image: "S",
  },
  {
    name: "Youth Vote Drive",
    status: "Scheduled",
    reach: "32.1K",
    engagement: "8%",
    image: "Y",
  },
  {
    name: "Local Business",
    status: "Completed",
    reach: "28.6K",
    engagement: "15%",
    image: "L",
  },
];

export function RecentCampaigns() {
  return (
    <div className="space-y-8">
      {recentCampaigns.map((campaign, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
              {campaign.image}
            </div>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{campaign.name}</p>
            <p className="text-sm text-muted-foreground">
              Status: <span className="font-medium">{campaign.status}</span>
            </p>
            <div className="flex space-x-4 text-xs text-muted-foreground">
              <span>Reach: {campaign.reach}</span>
              <span>Engagement: {campaign.engagement}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 