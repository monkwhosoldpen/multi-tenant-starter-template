export const analyticsMockData = {
  voterInsights: {
    totalRegistered: 125000,
    newRegistrations: 2500,
    demographics: {
      age: [
        { group: "18-24", percentage: 15 },
        { group: "25-34", percentage: 25 },
        { group: "35-44", percentage: 22 },
        { group: "45-54", percentage: 18 },
        { group: "55+", percentage: 20 },
      ],
      gender: {
        male: 48,
        female: 51,
        other: 1,
      },
    },
  },
  issueTracking: {
    top: [
      { issue: "Economy", support: 75 },
      { issue: "Healthcare", support: 68 },
      { issue: "Education", support: 65 },
      { issue: "Environment", support: 58 },
    ],
    trending: [
      { issue: "Housing", change: +5 },
      { issue: "Transportation", change: +3 },
      { issue: "Public Safety", change: -2 },
    ],
  },
  campaignMetrics: {
    eventAttendance: [
      { month: "Jan", attendees: 1200 },
      { month: "Feb", attendees: 1500 },
      { month: "Mar", attendees: 1800 },
      { month: "Apr", attendees: 2200 },
    ],
    volunteerGrowth: [
      { month: "Jan", total: 150 },
      { month: "Feb", total: 200 },
      { month: "Mar", total: 280 },
      { month: "Apr", total: 350 },
    ],
  },
}; 