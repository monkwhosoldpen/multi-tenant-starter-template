export const overviewMockData = {
  summary: {
    totalVoters: {
      count: 2145678,
      trend: "+2.5%",
      breakdown: {
        registered: 1845678,
        pending: 185000,
        inactive: 115000,
      },
      byDistrict: [
        { name: "Secunderabad", count: 425678, coverage: "92%" },
        { name: "Malkajgiri", count: 385234, coverage: "88%" },
        { name: "Kapra", count: 356789, coverage: "85%" },
        { name: "Alwal", count: 312456, coverage: "82%" },
        { name: "Uppal", count: 298765, coverage: "80%" },
      ],
    },
    campaignProgress: {
      overall: "68%",
      phases: [
        {
          name: "Voter Registration",
          progress: 92,
          status: "completed",
          metrics: {
            target: 250000,
            achieved: 230000,
          },
        },
        {
          name: "Door-to-Door",
          progress: 75,
          status: "in-progress",
          metrics: {
            households: 450000,
            covered: 337500,
            pending: 112500,
          },
        },
        {
          name: "Public Meetings",
          progress: 60,
          status: "in-progress",
          metrics: {
            planned: 45,
            completed: 27,
            attendance: 125000,
          },
        },
      ],
    },
    resources: {
      volunteers: {
        total: 12500,
        active: 9500,
        inactive: 2000,
        pending: 1000,
        byRole: [
          { role: "Field Worker", count: 5000 },
          { role: "Booth Agent", count: 3500 },
          { role: "Social Media", count: 2000 },
          { role: "Event Support", count: 2000 },
        ],
      },
      budget: {
        total: 15000000,
        spent: 8500000,
        committed: 4000000,
        available: 2500000,
        byCategory: [
          { category: "Field Operations", amount: 4500000, percentage: 30 },
          { category: "Advertising", amount: 3000000, percentage: 20 },
          { category: "Events", amount: 2250000, percentage: 15 },
          { category: "Technology", amount: 1500000, percentage: 10 },
          { category: "Others", amount: 3750000, percentage: 25 },
        ],
      },
    },
  },
  keyMetrics: {
    voterEngagement: {
      score: 7.8,
      trend: "+0.5",
      components: {
        awareness: 8.2,
        participation: 7.5,
        sentiment: 7.6,
      },
      byArea: [
        { area: "Urban", score: 8.1, trend: "+0.6" },
        { area: "Semi-Urban", score: 7.8, trend: "+0.4" },
        { area: "Rural", score: 7.5, trend: "+0.5" },
      ],
    },
    fieldOperations: {
      coverage: "85%",
      efficiency: "78%",
      metrics: {
        daily_visits: 12500,
        conversion_rate: "65%",
        feedback_score: 4.2,
      },
      trends: [
        { date: "2024-03-01", visits: 11500, conversions: 7475 },
        { date: "2024-03-02", visits: 12000, conversions: 7800 },
        // ... more dates
      ],
    },
    communications: {
      reach: {
        total: 1500000,
        organic: 900000,
        paid: 600000,
      },
      engagement: {
        rate: "4.8%",
        shares: 25000,
        comments: 45000,
      },
      sentiment: {
        positive: 65,
        neutral: 25,
        negative: 10,
      },
    },
  },
  recentActivities: [
    {
      type: "field_operation",
      description: "Door-to-door campaign in Secunderabad",
      created_at: "2024-03-15T14:30:00Z",
      metrics: {
        households: 1500,
        registrations: 250,
        feedback: "positive",
      },
    },
    {
      type: "event",
      description: "Town Hall Meeting at Community Center",
      created_at: "2024-03-15T16:00:00Z",
      metrics: {
        attendance: 500,
        questions: 25,
        satisfaction: 4.5,
      },
    },
    // ... more activities
  ],
  alerts: [
    {
      type: "critical",
      message: "Low volunteer turnout in Kapra district",
      created_at: "2024-03-15T10:00:00Z",
      status: "unresolved",
    },
    {
      type: "warning",
      message: "Weather alert for tomorrow's outdoor event",
      created_at: "2024-03-15T11:30:00Z",
      status: "monitoring",
    },
    // ... more alerts
  ],
}; 