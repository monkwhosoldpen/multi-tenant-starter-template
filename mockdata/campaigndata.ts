export const campaignMockData = {
  overview: {
    timeline: {
      startDate: "2024-01-15",
      electionDay: "2024-11-05",
      daysRemaining: 235,
      phases: [
        {
          name: "Voter Registration Drive",
          status: "completed",
          progress: 100,
          startDate: "2024-01-15",
          endDate: "2024-03-15",
          metrics: {
            targetReached: "115%",
            newVoters: 12500,
          },
        },
        {
          name: "Community Outreach",
          status: "in-progress",
          progress: 65,
          startDate: "2024-03-16",
          endDate: "2024-06-30",
          metrics: {
            eventsPlanned: 45,
            eventsCompleted: 28,
            attendance: 4500,
          },
        },
        // ... more phases
      ],
    },
    budgetAllocation: {
      total: 1500000,
      allocated: {
        advertising: { amount: 450000, spent: 225000, committed: 125000 },
        events: { amount: 300000, spent: 145000, committed: 75000 },
        staffing: { amount: 400000, spent: 180000, committed: 150000 },
        technology: { amount: 150000, spent: 85000, committed: 25000 },
        operations: { amount: 200000, spent: 95000, committed: 45000 },
      },
      trends: [
        { month: "Jan", planned: 125000, actual: 118000 },
        { month: "Feb", planned: 135000, actual: 142000 },
        { month: "Mar", planned: 145000, actual: 138000 },
      ],
    },
  },
  metrics: {
    keyIndicators: {
      voterEngagement: {
        score: 7.8,
        trend: "+0.5",
        breakdown: {
          awareness: 8.2,
          participation: 7.5,
          sentiment: 7.6,
        },
      },
      campaignEffectiveness: {
        score: 82,
        trend: "+3",
        components: {
          messageReach: 85,
          resourceUtilization: 78,
          volunteerEfficiency: 83,
        },
      },
    },
    performance: [
      {
        period: "Week 12",
        metrics: {
          eventAttendance: { actual: 2500, target: 2000 },
          volunteerHours: { actual: 850, target: 1000 },
          voterContacts: { actual: 12500, target: 10000 },
        },
      },
      // ... more periods
    ],
  },
  risks: {
    active: [
      {
        id: "R1",
        category: "Resource",
        description: "Volunteer shortage in North District",
        impact: "high",
        probability: "medium",
        mitigation: "Launching recruitment drive",
        status: "monitoring",
      },
      // ... more risks
    ],
    mitigated: [
      {
        id: "R5",
        category: "Budget",
        description: "Event venue cost overrun",
        impact: "medium",
        resolution: "Negotiated bulk booking discount",
        dateResolved: "2024-03-10",
      },
    ],
  },
}; 