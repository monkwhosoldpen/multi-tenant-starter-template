export const teamMockData = {
  members: {
    active: [
      {
        id: "m1",
        name: "Sarah Johnson",
        role: "Field Coordinator",
        email: "sarah.j@campaign.com",
        status: "active",
        teams: ["North District", "Youth Outreach"],
        performance: {
          tasksCompleted: 145,
          voterContacts: 1200,
          eventAttendance: 92,
        },
        recentActivity: {
          type: "event",
          description: "Coordinated youth voter registration drive",
          timestamp: "2024-03-15T14:30:00Z",
          impact: "registered 85 new voters",
        },
      },
      // ... more members
    ],
    assignments: {
      "North District": {
        lead: "Sarah Johnson",
        members: 12,
        activeTasks: 8,
        coverage: "85%",
        nextEvent: "Door-to-door campaign",
      },
      // ... more districts
    },
    schedules: [
      {
        date: "2024-03-16",
        shifts: [
          {
            time: "09:00-17:00",
            team: "North District",
            activity: "Door-to-door campaign",
            assigned: 8,
            required: 10,
            status: "needs-volunteers",
          },
          // ... more shifts
        ],
      },
    ],
  },
  performance: {
    metrics: {
      weeklyGoals: {
        voterContacts: { target: 1000, achieved: 850 },
        newRegistrations: { target: 200, achieved: 185 },
        eventAttendance: { target: 500, achieved: 475 },
      },
      trends: [
        { week: "Week 1", contacts: 750, registrations: 150 },
        { week: "Week 2", contacts: 850, registrations: 185 },
      ],
    },
    territories: [
      {
        name: "North District",
        coverage: 85,
        activeTeams: 3,
        pendingTasks: 12,
        lastUpdated: "2024-03-15T18:30:00Z",
      },
      // ... more territories
    ],
  },
  resources: {
    equipment: [
      {
        type: "Tablets",
        total: 50,
        assigned: 42,
        maintenance: 3,
        available: 5,
      },
      // ... more equipment
    ],
    materials: [
      {
        type: "Voter Registration Forms",
        inStock: 2500,
        distributed: 1800,
        reorderPoint: 1000,
        status: "adequate",
      },
      // ... more materials
    ],
  },
}; 