export const operationsMockData = {
  fieldTeams: {
    total: 12,
    active: 8,
    standby: 4,
    performance: [
      { week: "Week 1", completed: 45 },
      { week: "Week 2", completed: 52 },
      { week: "Week 3", completed: 58 },
      { week: "Week 4", completed: 65 },
    ],
  },
  volunteers: {
    total: 245,
    active: 180,
    newThisWeek: 28,
    byDepartment: {
      canvassing: 85,
      events: 65,
      phoneBank: 45,
      dataEntry: 50,
    },
  },
  territories: {
    total: 20,
    covered: 17,
    inProgress: 3,
    coverage: [
      { district: "North", percentage: 92 },
      { district: "South", percentage: 88 },
      { district: "East", percentage: 76 },
      { district: "West", percentage: 85 },
    ],
  },
  recentActivities: [
    {
      team: "Team Alpha",
      activity: "Door-to-door campaign in District 5",
      timestamp: "2 hours ago",
      status: "completed",
      impact: "150 households reached",
    },
    {
      team: "Team Beta",
      activity: "Voter registration drive at Community Center",
      timestamp: "4 hours ago",
      status: "in-progress",
      impact: "85 new registrations",
    },
  ],
}; 