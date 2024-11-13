export const voterMockData = {
  demographics: {
    ageGroups: [
      { group: "18-24", count: 15234, percentage: 15, trend: "+2.5%" },
      { group: "25-34", count: 25456, percentage: 25, trend: "+1.8%" },
      { group: "35-44", count: 22567, percentage: 22, trend: "+0.5%" },
      { group: "45-54", count: 18234, percentage: 18, trend: "-0.3%" },
      { group: "55+", count: 20123, percentage: 20, trend: "+0.7%" },
    ],
    locations: [
      {
        district: "North",
        registered: 28456,
        active: 24567,
        newRegistrations: 1234,
        turnoutLast: "72%",
      },
      // ... more districts
    ],
  },
  engagement: {
    contactMethods: {
      doorToDoor: { attempts: 12500, successful: 8750, response: "70%" },
      phone: { attempts: 25000, successful: 15000, response: "60%" },
      email: { sent: 50000, opened: 22500, clicked: 7500 },
      sms: { sent: 35000, delivered: 33250, responded: 4500 },
    },
    issues: [
      {
        topic: "Healthcare",
        importance: 85,
        sentiment: "positive",
        mentions: 12500,
        trend: "increasing",
      },
      // ... more issues
    ],
  },
  registration: {
    daily: [
      {
        date: "2024-03-15",
        new: 125,
        updated: 45,
        verified: 115,
        pending: 10,
      },
      // ... more days
    ],
    methods: {
      online: { count: 12500, percentage: 45, success: "92%" },
      inPerson: { count: 8500, percentage: 30, success: "98%" },
      mail: { count: 7000, percentage: 25, success: "85%" },
    },
    status: {
      active: 85000,
      inactive: 12000,
      pending: 3500,
      flagged: 250,
    },
  },
}; 