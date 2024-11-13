export const communicationsMockData = {
  socialMedia: {
    reach: 45200,
    engagement: 12.5,
    growth: 2400,
    platforms: {
      facebook: { followers: 25000, engagement: 15.2 },
      twitter: { followers: 18000, engagement: 8.5 },
      instagram: { followers: 12000, engagement: 18.8 },
    },
    trending: [
      { topic: "Youth Employment", mentions: 1250 },
      { topic: "Healthcare Reform", mentions: 980 },
      { topic: "Education Policy", mentions: 756 },
    ],
  },
  emailCampaigns: {
    total: 24,
    openRate: 32,
    clickRate: 8.5,
    recent: [
      {
        name: "Weekly Newsletter",
        sent: 15000,
        opened: 4800,
        clicked: 1200,
      },
      {
        name: "Event Invitation",
        sent: 5000,
        opened: 2100,
        clicked: 850,
      },
    ],
  },
  mediaRelations: {
    mentions: 128,
    sentiment: {
      positive: 65,
      neutral: 28,
      negative: 7,
    },
    topSources: [
      { name: "Local News Daily", mentions: 45 },
      { name: "City Tribune", mentions: 38 },
      { name: "Metro Times", mentions: 25 },
    ],
  },
}; 