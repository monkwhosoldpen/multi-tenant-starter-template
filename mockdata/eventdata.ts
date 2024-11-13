export const eventMockData = {
  upcoming: [
    {
      id: "E001",
      title: "Town Hall Meeting",
      type: "community",
      date: "2024-03-20",
      time: "18:00-20:00",
      location: {
        venue: "City Community Center",
        address: "123 Main St",
        capacity: 500,
        accessibility: true,
      },
      registration: {
        registered: 385,
        capacity: 500,
        waitlist: 25,
        trend: "increasing",
      },
      resources: {
        staff: { required: 12, confirmed: 10 },
        volunteers: { required: 25, confirmed: 20 },
        equipment: [
          { item: "Microphones", required: 4, confirmed: 4 },
          { item: "Chairs", required: 500, confirmed: 500 },
        ],
      },
      status: "confirmed",
      budget: {
        allocated: 5000,
        spent: 3200,
        committed: 1500,
      },
    },
    // ... more events
  ],
  metrics: {
    monthly: {
      eventsPlanned: 45,
      eventsCompleted: 38,
      totalAttendance: 12500,
      averageAttendance: 329,
      satisfactionScore: 4.5,
      trends: [
        {
          month: "January",
          events: 12,
          attendance: 3800,
          satisfaction: 4.3,
        },
        // ... more months
      ],
    },
    byType: {
      community: {
        count: 15,
        averageAttendance: 350,
        satisfaction: 4.6,
      },
      fundraising: {
        count: 8,
        averageAttendance: 200,
        satisfaction: 4.4,
      },
      volunteer: {
        count: 12,
        averageAttendance: 150,
        satisfaction: 4.7,
      },
    },
  },
  venues: [
    {
      id: "V001",
      name: "City Community Center",
      capacity: 500,
      cost: 1500,
      availability: [
        { date: "2024-03-20", slots: ["morning", "afternoon"] },
        { date: "2024-03-21", slots: ["evening"] },
      ],
      amenities: ["parking", "accessibility", "av-equipment"],
      rating: 4.5,
      previousEvents: 8,
    },
    // ... more venues
  ],
  feedback: {
    recent: [
      {
        eventId: "E001",
        rating: 4.5,
        attendance: 450,
        highlights: ["Speaker engagement", "Q&A session"],
        improvements: ["Parking arrangement", "Audio quality"],
        sentiment: "positive",
      },
      // ... more feedback
    ],
    aggregated: {
      lastMonth: {
        averageRating: 4.4,
        topStrengths: ["Organization", "Content", "Engagement"],
        areasForImprovement: ["Venue accessibility", "Time management"],
      },
    },
  },
}; 